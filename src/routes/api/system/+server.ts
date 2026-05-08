import { json } from '@sveltejs/kit';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import type { RequestHandler } from './$types';

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
		let disk = { total: 0, free: 0, used: 0, usage: 0 };
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

		return json({
			cpu: {
				usage: cpuUsage,
				cores: cpus.length,
				model: cpus[0]?.model || 'Unknown CPU',
				load: os.loadavg()
			},
			memory: {
				usage: memUsage,
				total: totalMem,
				free: freeMem,
				used: usedMem
			},
			disk,
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
