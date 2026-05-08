export function createTelemetryStore() {
	let cpu = $state(0);
	let mem = $state(0);
	let disk = $state(45);
	let netTX = $state(10);
	let netRX = $state(10);
	let procs = $state(150);
	let uptime = $state(0);

	let isFetching = false;

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
				
				// Simulate the rest for visual flair
				disk = Math.min(95, Math.max(40, disk + (Math.random() - 0.5) * 2));
				netTX = Math.min(100, Math.max(1, netTX + (Math.random() - 0.5) * 30));
				netRX = Math.min(100, Math.max(1, netRX + (Math.random() - 0.5) * 30));
				procs = Math.max(100, Math.round(procs + (Math.random() - 0.5) * 4));
			}
		} catch (e) {
			console.error('Failed to fetch telemetry:', e);
		} finally {
			isFetching = false;
		}
	}

	let intervalId: ReturnType<typeof setInterval>;

	function start() {
		fetchStats();
		intervalId = setInterval(fetchStats, 2000); // Fetch every 2 seconds
	}

	function stop() {
		if (intervalId) clearInterval(intervalId);
	}

	return {
		get cpu() { return cpu; },
		get mem() { return mem; },
		get disk() { return disk; },
		get netTX() { return netTX; },
		get netRX() { return netRX; },
		get procs() { return procs; },
		get uptime() { return uptime; },
		start,
		stop
	};
}

export const telemetry = createTelemetryStore();
