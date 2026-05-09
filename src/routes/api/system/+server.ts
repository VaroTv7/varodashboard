import { json } from '@sveltejs/kit';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import type { RequestHandler } from './$types';

const execAsync = promisify(exec);

// Global state for network delta calculation
let lastNetData = {
	rx: 0,
	tx: 0,
	time: Date.now()
};

// Initialize network data to avoid the first-call zero spike
function initNetworkData() {
	try {
		if (os.platform() === 'linux') {
			const data = fs.readFileSync('/proc/net/dev', 'utf8');
			const lines = data.split('\n');
			let totalRx = 0;
			let totalTx = 0;
			for (const line of lines) {
				if (line.includes(':')) {
					const parts = line.trim().split(/\s+/);
					totalRx += parseInt(parts[1], 10) || 0;
					totalTx += parseInt(parts[9], 10) || 0;
				}
			}
			lastNetData = { rx: totalRx, tx: totalTx, time: Date.now() };
		}
	} catch (e) {}
}
initNetworkData();

async function getProcessCount(): Promise<number> {
	try {
		if (os.platform() === 'win32') {
			const { stdout } = await execAsync('tasklist', { timeout: 2000 });
			return stdout.split('\n').length - 5;
		} else {
			const { stdout } = await execAsync('ps aux | wc -l', { timeout: 2000 });
			return parseInt(stdout.trim(), 10) - 1;
		}
	} catch (e) {
		return 0;
	}
}

function getNetworkTraffic() {
	try {
		if (os.platform() === 'linux') {
			const data = fs.readFileSync('/proc/net/dev', 'utf8');
			const lines = data.split('\n');
			let totalRx = 0;
			let totalTx = 0;

			for (const line of lines) {
				if (line.includes(':')) {
					const parts = line.trim().split(/\s+/);
					totalRx += parseInt(parts[1], 10) || 0;
					totalTx += parseInt(parts[9], 10) || 0;
				}
			}

			const now = Date.now();
			const timeDiff = (now - lastNetData.time) / 1000;
			
			if (timeDiff <= 0) return { rx: 0, tx: 0 };

			const rxSpeed = (totalRx - lastNetData.rx) / timeDiff / 1024 / 1024; // MB/s
			const txSpeed = (totalTx - lastNetData.tx) / timeDiff / 1024 / 1024; // MB/s

			lastNetData = { rx: totalRx, tx: totalTx, time: now };

			return { 
				rx: Math.max(0, rxSpeed), 
				tx: Math.max(0, txSpeed) 
			};
		}
	} catch (e) {}
	return { rx: 0, tx: 0 };
}

async function checkArrStatus(url: string, apiKey: string): Promise<string> {
	if (!url || !apiKey) return 'OFFLINE';
	try {
		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), 2000); // 2s timeout
		
		const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
		const res = await fetch(`${baseUrl}/api/v3/system/status?apiKey=${apiKey}`, {
			signal: controller.signal
		});
		clearTimeout(id);
		return res.ok ? 'ONLINE' : 'OFFLINE';
	} catch (e) {
		return 'OFFLINE';
	}
}

export const GET: RequestHandler = async () => {
	try {
		const cpus = os.cpus();
		const loadAvg = os.loadavg()[0];
		const cpuUsage = Math.min(100, Math.max(0, (loadAvg / cpus.length) * 100));
		
		const totalMem = os.totalmem();
		const freeMem = os.freemem();
		const usedMem = totalMem - freeMem;
		const memUsage = (usedMem / totalMem) * 100;
		
		const uptime = os.uptime();

		// Load custom metrics if they exist
		let custom = {};
		try {
			const configPath = path.resolve('config/custom_metrics.json');
			if (fs.existsSync(configPath)) {
				custom = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
			}
		} catch (e) { /* ignore */ }

		// Try to get disk info (Node 18+)
		let disk = { total: 0, free: 0, used: 0, usage: null as number | null };
		try {
			// @ts-ignore - statfsSync is in newer Node versions
			if (fs.statfsSync) {
				// @ts-ignore
				const stats = fs.statfsSync('/');
				disk.total = stats.bsize * stats.blocks;
				disk.free = stats.bsize * stats.bfree;
				disk.used = disk.total - disk.free;
				disk.usage = (disk.used / disk.total) * 100;
			}
		} catch (e) { /* fallback */ }

		// Parallel fetch of dynamic data
		const [procs, netInfo] = await Promise.all([
			getProcessCount(),
			Promise.resolve(getNetworkTraffic())
		]);

		// ARR Integration with real checks
		let arrStatus = { radarr: 'OFFLINE', sonarr: 'OFFLINE' };
		try {
			const apiKeysPath = path.resolve('config/api_keys.json');
			if (fs.existsSync(apiKeysPath)) {
				const keys = JSON.parse(fs.readFileSync(apiKeysPath, 'utf-8'));
				
				const checks = [];
				if (keys.radarr?.enabled) {
					checks.push(checkArrStatus(keys.radarr.url, keys.radarr.apiKey).then(s => arrStatus.radarr = s));
				}
				if (keys.sonarr?.enabled) {
					checks.push(checkArrStatus(keys.sonarr.url, keys.sonarr.apiKey).then(s => arrStatus.sonarr = s));
				}
				await Promise.all(checks);
			}
		} catch (e) { /* ignore */ }

		return json({
			cpu: {
				usage: cpuUsage,
				cores: cpus.length,
				model: cpus[0]?.model || 'Desconocido',
				load: os.loadavg()
			},
			memory: {
				usage: memUsage,
				total: totalMem,
				free: freeMem,
				used: usedMem
			},
			disk,
			network: netInfo,
			procs,
			arr: arrStatus,
			uptime: uptime,
			platform: os.platform(),
			release: os.release(),
			node: process.version,
			arch: os.arch(),
			hostname: os.hostname(),
			custom
		});
	} catch (error) {
		console.error('Failed to get system stats:', error);
		return json({ error: 'Failed to retrieve system stats' }, { status: 500 });
	}
};
