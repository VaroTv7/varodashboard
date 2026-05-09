export function createTelemetryStore() {
	let cpu = $state(0);
	let mem = $state(0);
	let disk = $state<number | null>(null);
	let netTX = $state(0);
	let netRX = $state(0);
	let procs = $state(0);
	let uptime = $state(0);
	let arrStatus = $state({ radarr: 'OFFLINE', sonarr: 'OFFLINE' });
	let time = $state('');
	let customData = $state<Record<string, any>>({});

	let isFetching = $state(false);

	async function fetchStats() {
		if (isFetching) return;
		isFetching = true;
		try {
			const res = await fetch('/api/system');
			if (res.ok) {
				const data = await res.json();
				cpu = data.cpu.usage;
				mem = data.memory.usage;
				uptime = data.uptime;
				disk = data.disk.usage || null;
				customData = data.custom || {};
				arrStatus = data.arr || { radarr: 'OFFLINE', sonarr: 'OFFLINE' };
				
				// Real values from API
				netTX = data.network?.tx || 0;
				netRX = data.network?.rx || 0;
				procs = data.procs || 0;
			}
		} catch (e) {
			console.error('Failed to fetch telemetry:', e);
		} finally {
			isFetching = false;
		}
	}

	function updateClock() {
		const now = new Date();
		time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
	}

	let statsInterval: ReturnType<typeof setInterval>;
	let clockInterval: ReturnType<typeof setInterval>;

	function start() {
		fetchStats();
		updateClock();
		statsInterval = setInterval(fetchStats, 5000); // System stats every 5s
		clockInterval = setInterval(updateClock, 1000); // Clock every 1s
	}

	function stop() {
		if (statsInterval) clearInterval(statsInterval);
		if (clockInterval) clearInterval(clockInterval);
	}

	return {
		get cpu() { return cpu; },
		get mem() { return mem; },
		get disk() { return disk; },
		get netTX() { return netTX; },
		get netRX() { return netRX; },
		get procs() { return procs; },
		get uptime() { return uptime; },
		get customData() { return customData; },
		get arrStatus() { return arrStatus; },
		get time() { return time; },
		get isFetching() { return isFetching; },
		refresh: fetchStats,
		start,
		stop
	};
}

export const telemetry = createTelemetryStore();
