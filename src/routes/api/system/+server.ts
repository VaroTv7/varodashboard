import { json } from '@sveltejs/kit';
import * as os from 'os';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const cpus = os.cpus();
		const loadAvg = os.loadavg()[0]; // 1 minute load average
		// Convert load average to a rough percentage based on number of cores
		const cpuUsage = Math.min(100, Math.max(0, (loadAvg / cpus.length) * 100));
		
		const totalMem = os.totalmem();
		const freeMem = os.freemem();
		const usedMem = totalMem - freeMem;
		const memUsage = (usedMem / totalMem) * 100;
		
		const uptime = os.uptime();

		return json({
			cpu: {
				usage: cpuUsage,
				cores: cpus.length,
				model: cpus[0]?.model || 'Unknown CPU'
			},
			memory: {
				usage: memUsage,
				total: totalMem,
				free: freeMem,
				used: usedMem
			},
			uptime: uptime,
			platform: os.platform(),
			release: os.release()
		});
	} catch (error) {
		console.error('Failed to get system stats:', error);
		return json({ error: 'Failed to retrieve system stats' }, { status: 500 });
	}
};
