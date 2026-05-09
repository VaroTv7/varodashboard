import { json } from '@sveltejs/kit';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import type { RequestHandler } from './$types';

// Global state for network delta calculation
let lastNetData = {
	rx: 0,
	tx: 0,
	time: Date.now()
};

function getProcessCount(): number {
	try {
		if (os.platform() === 'win32') {
			const output = execSync('tasklist').toString();
			return output.split('\n').length - 5; // Approximate
		} else {
			const output = execSync('ps aux | wc -l').toString();
			return parseInt(output.trim(), 10) - 1; // Exclude header
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
					// Parts: [interface, rx_bytes, rx_packets, ..., tx_bytes, ...]
					totalRx += parseInt(parts[1], 10);
					totalTx += parseInt(parts[9], 10);
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
	} catch (e) {
		// Fallback or ignore
	}
	return { rx: 0, tx: 0 };
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

		// Real Network Traffic
		const netInfo = getNetworkTraffic();

		// Real Process Count
		const procs = getProcessCount();

		// ARR Integration
		let arrStatus = { radarr: 'OFFLINE', sonarr: 'OFFLINE' };
		try {
			const apiKeysPath = path.resolve('config/api_keys.json');
			if (fs.existsSync(apiKeysPath)) {
				const keys = JSON.parse(fs.readFileSync(apiKeysPath, 'utf-8'));
				if (keys.radarr?.enabled) arrStatus.radarr = 'READY';
				if (keys.sonarr?.enabled) arrStatus.sonarr = 'READY';
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
