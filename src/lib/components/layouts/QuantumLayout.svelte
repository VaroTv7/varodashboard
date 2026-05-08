<script lang="ts">
	import { telemetry } from '$lib/stores/telemetry.svelte';

	let {
		settings = {} as Record<string, unknown>,
		services = { groups: [] } as { groups: Array<{ name: string; icon: string; services: Array<Record<string, unknown>> }> },
		scripts = { scripts: [] } as { scripts: Array<Record<string, unknown>> },
		bookmarks = { groups: [] } as { groups: Array<{ name: string; bookmarks: Array<{ name: string; url: string }> }> },
		statuses = {} as Record<string, string>,
		searchQuery = '',
		onOpenSettings = () => {},
		onSearch = (_q: string) => {},
	}: {
		settings: Record<string, unknown>;
		services: { groups: Array<{ name: string; icon: string; services: Array<Record<string, unknown>> }> };
		scripts: { scripts: Array<Record<string, unknown>> };
		bookmarks: { groups: Array<{ name: string; bookmarks: Array<{ name: string; url: string }> }> };
		statuses: Record<string, string>;
		searchQuery: string;
		onOpenSettings: () => void;
		onSearch: (q: string) => void;
	} = $props();

	const q = $derived(searchQuery.toLowerCase());
	const allServices = $derived(
		(services?.groups || []).flatMap(g => g.services.map(s => ({ ...s, group: g.name })))
			.filter(s => !q || (s.name as string || '').toLowerCase().includes(q) || (s.description as string || '').toLowerCase().includes(q))
	);
	
	const onlineCount = $derived(Object.values(statuses).filter(s => s === 'online').length);
	const totalCount = $derived(allServices.length);
	
	let now = $state(new Date());
	let particles = $state<{x:number, y:number, s:number, d:number}[]>([]);
	
	$effect(() => {
		// Generate random background particles (stars/data points)
		particles = Array.from({length: 100}, () => ({
			x: Math.random() * 100, y: Math.random() * 100,
			s: Math.random() * 2 + 1, d: Math.random() * 10
		}));

		const id = setInterval(() => {
			now = new Date();
		}, 1000);
		return () => clearInterval(id);
	});
	
	const timeStr = $derived(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

	// Calculate positions for orbital services
	const orbitRadius = 260; // px
	const numServices = $derived(allServices.length || 1);
</script>

<div class="qtm">
	<!-- HEXAGONAL BACKGROUND & PARTICLES -->
	<div class="qtm__hex-bg"></div>
	<div class="qtm__particles">
		{#each particles as p}
			<div class="qtm__particle" style="left: {p.x}%; top: {p.y}%; width: {p.s}px; height: {p.s}px; animation-delay: -{p.d}s;"></div>
		{/each}
	</div>

	<!-- TOP NAV -->
	<header class="qtm__header">
		<div class="qtm__brand">
			<span class="qtm__logo">⬡</span>
			<span class="qtm__title">{(settings.title as string || 'VAROSERVER').toUpperCase()} // QUANTUM</span>
		</div>
		<div class="qtm__search-box">
			<input class="qtm__search" type="text" value={searchQuery} oninput={(e) => onSearch((e.target as HTMLInputElement).value)} placeholder="INYECTAR COORDENADAS..." spellcheck="false" />
		</div>
		<div class="qtm__controls">
			<span class="qtm__time">{timeStr}</span>
			<button class="qtm__btn" onclick={onOpenSettings}>◆ AJUSTES / CAMBIAR TEMA</button>
		</div>
	</header>

	<main class="qtm__main">
		<!-- ASTROLABE (ORBITAL SYSTEM) -->
		<div class="qtm__astrolabe">
			
			<!-- OUTER RINGS -->
			<div class="qtm__ring qtm__ring--1"></div>
			<div class="qtm__ring qtm__ring--2"></div>
			<div class="qtm__ring qtm__ring--3"></div>
			<div class="qtm__ring qtm__ring--4"></div>
			<div class="qtm__ring qtm__ring--5"></div>

			<!-- CENTER CORE WITH RADAR -->
			<div class="qtm__core">
				<div class="qtm__radar-sweep"></div>
				<div class="qtm__core-inner">
					<div class="qtm__core-val">{onlineCount}</div>
					<div class="qtm__core-lbl">NODOS ACTIVOS</div>
				</div>
				<!-- Vitals surrounding core -->
				<div class="qtm__vital qtm__vital--cpu">
					<svg viewBox="0 0 100 100" class="qtm__vital-svg">
						<circle cx="50" cy="50" r="45" class="qtm__vital-track"></circle>
						<circle cx="50" cy="50" r="45" class="qtm__vital-fill" stroke-dasharray="282" stroke-dashoffset={282 - (282 * telemetry.cpu / 100)}></circle>
					</svg>
					<span class="qtm__vital-text">CPU</span>
				</div>
				<div class="qtm__vital qtm__vital--mem">
					<svg viewBox="0 0 100 100" class="qtm__vital-svg">
						<circle cx="50" cy="50" r="45" class="qtm__vital-track"></circle>
						<circle cx="50" cy="50" r="45" class="qtm__vital-fill" stroke-dasharray="282" stroke-dashoffset={282 - (282 * telemetry.mem / 100)}></circle>
					</svg>
					<span class="qtm__vital-text">RAM</span>
				</div>
				<div class="qtm__vital qtm__vital--net">
					<svg viewBox="0 0 100 100" class="qtm__vital-svg">
						<circle cx="50" cy="50" r="45" class="qtm__vital-track"></circle>
						<circle cx="50" cy="50" r="45" class="qtm__vital-fill" stroke-dasharray="282" stroke-dashoffset={282 - (282 * (onlineCount/totalCount)*100 / 100)}></circle>
					</svg>
					<span class="qtm__vital-text">RED</span>
				</div>
			</div>

			<!-- ORBITING SERVICES -->
			<div class="qtm__orbit-container">
				{#each allServices as svc, i}
					{@const angle = (360 / numServices) * i}
					{@const isOnline = statuses[svc.name as string] === 'online'}
					
					<div class="qtm__node-wrapper" style="--angle: {angle}deg; --radius: {orbitRadius}px;">
						<a href={svc.url as string} target="_blank" rel="noopener" class="qtm__node" class:qtm__node--err={!isOnline}>
							<div class="qtm__node-point"></div>
							<div class="qtm__node-label">{svc.name}</div>
							{#if !isOnline}
								<div class="qtm__node-status">CAÍDO</div>
							{/if}
						</a>
					</div>
				{/each}
			</div>

		</div>
		
		<!-- SCRIPTS / BOOKMARKS OVERLAY (CORNERS) -->
		<div class="qtm__corner qtm__corner--bl">
			<div class="qtm__corner-title">❖ PROTOCOLOS</div>
			<div class="qtm__routines">
				{#each (scripts?.scripts || []).slice(0, 8) as script}
					<div class="qtm__routine">
						<span class="qtm__r-dot"></span> {script.name}
					</div>
				{/each}
			</div>
		</div>

		<div class="qtm__corner qtm__corner--br">
			<div class="qtm__corner-title">❖ TELEMETRÍA_REAL</div>
			<div class="qtm__routines">
				<div class="qtm__routine"><span class="qtm__r-dot"></span> UPTIME: {Math.floor(telemetry.uptime/3600)}H {Math.floor((telemetry.uptime%3600)/60)}M</div>
				<div class="qtm__routine"><span class="qtm__r-dot"></span> CARGA_NÚCLEO: {telemetry.cpu.toFixed(1)}%</div>
				<div class="qtm__routine"><span class="qtm__r-dot"></span> RED_TRÁFICO: {telemetry.netRX.toFixed(1)} Mb/s</div>
				<div class="qtm__routine"><span class="qtm__r-dot"></span> MEM_SISTEMA: {telemetry.mem.toFixed(1)}%</div>
			</div>
		</div>

	</main>
</div>

<style>
	.qtm {
		background-color: #000;
		color: #dfbbff;
		font-family: 'Inter', -apple-system, sans-serif;
		height: 100vh;
		overflow: hidden;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	/* HEX BG & PARTICLES */
	.qtm__hex-bg {
		position: absolute; inset: -50%; z-index: 0;
		background-image: 
			linear-gradient(30deg, #110022 12%, transparent 12.5%, transparent 87%, #110022 87.5%, #110022),
			linear-gradient(150deg, #110022 12%, transparent 12.5%, transparent 87%, #110022 87.5%, #110022),
			linear-gradient(30deg, #110022 12%, transparent 12.5%, transparent 87%, #110022 87.5%, #110022),
			linear-gradient(150deg, #110022 12%, transparent 12.5%, transparent 87%, #110022 87.5%, #110022),
			linear-gradient(60deg, #1a0033 25%, transparent 25.5%, transparent 75%, #1a0033 75%, #1a0033),
			linear-gradient(60deg, #1a0033 25%, transparent 25.5%, transparent 75%, #1a0033 75%, #1a0033);
		background-size: 80px 140px;
		background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
		opacity: 0.3;
		animation: breathe 10s ease-in-out infinite alternate;
		transform: perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px);
		transform-origin: center top;
	}
	@keyframes breathe { 0% { opacity: 0.1; } 100% { opacity: 0.6; } }

	.qtm__particles { position: absolute; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
	.qtm__particle {
		position: absolute; background: #fff; border-radius: 50%; opacity: 0;
		box-shadow: 0 0 10px #dfbbff; animation: float-up 10s linear infinite;
	}
	@keyframes float-up { 0% { transform: translateY(100vh); opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { transform: translateY(-10vh); opacity: 0; } }

	/* HEADER */
	.qtm__header {
		position: relative; z-index: 10;
		display: flex; justify-content: space-between; align-items: center;
		padding: 20px 40px;
		border-bottom: 1px solid rgba(223, 187, 255, 0.2);
		background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
	}
	.qtm__brand { display: flex; align-items: center; gap: 15px; font-weight: 300; letter-spacing: 4px; font-size: 0.9rem; }
	.qtm__logo { font-size: 1.5rem; color: #fff; text-shadow: 0 0 10px #dfbbff; animation: spin 10s linear infinite; display: inline-block; }
	
	.qtm__search {
		background: rgba(255,255,255,0.05); border: 1px solid rgba(223, 187, 255, 0.3);
		color: #fff; font-family: inherit; font-size: 0.8rem; padding: 8px 20px;
		border-radius: 20px; outline: none; width: 300px; text-align: center;
		letter-spacing: 2px; transition: all 0.3s;
	}
	.qtm__search:focus { background: rgba(255,255,255,0.1); border-color: #dfbbff; box-shadow: 0 0 15px rgba(223,187,255,0.3); }

	.qtm__controls { display: flex; align-items: center; gap: 20px; }
	.qtm__time { font-family: monospace; font-size: 0.9rem; letter-spacing: 2px; text-shadow: 0 0 5px #dfbbff; }
	.qtm__btn {
		background: transparent; border: 1px solid rgba(223, 187, 255, 0.5);
		color: #dfbbff; padding: 6px 15px; border-radius: 4px;
		font-family: inherit; font-size: 0.8rem; letter-spacing: 2px; cursor: pointer;
		transition: all 0.3s;
	}
	.qtm__btn:hover { background: #dfbbff; color: #000; box-shadow: 0 0 15px #dfbbff; }

	/* MAIN ASTROLABE */
	.qtm__main { flex: 1; position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; overflow: hidden; }

	.qtm__astrolabe { position: relative; width: 80vmin; height: 80vmin; display: flex; align-items: center; justify-content: center; }

	/* RINGS */
	.qtm__ring { position: absolute; border-radius: 50%; border: 1px solid rgba(223, 187, 255, 0.1); }
	.qtm__ring--1 { width: 75vmin; height: 75vmin; border: 2px dashed rgba(223, 187, 255, 0.2); animation: spin 80s linear infinite; }
	.qtm__ring--2 { width: 60vmin; height: 60vmin; border-width: 2px; border-color: rgba(0, 255, 255, 0.2); animation: spin 50s linear infinite reverse; }
	.qtm__ring--3 { width: 45vmin; height: 45vmin; border: 1px dotted rgba(255, 215, 0, 0.4); animation: spin 30s linear infinite; }
	.qtm__ring--4 { width: 30vmin; height: 30vmin; border: 4px double rgba(223, 187, 255, 0.1); animation: spin 20s linear infinite reverse; }
	.qtm__ring--5 { width: 20vmin; height: 20vmin; border: 1px solid rgba(255, 255, 255, 0.3); animation: spin 10s linear infinite; }

	@keyframes spin { 100% { transform: rotate(360deg); } }

	/* CORE */
	.qtm__core {
		position: absolute; width: 20vmin; height: 20vmin;
		background: radial-gradient(circle, rgba(223,187,255,0.2) 0%, rgba(0,0,0,0.8) 70%);
		border-radius: 50%; border: 2px solid #dfbbff;
		box-shadow: 0 0 30px rgba(223, 187, 255, 0.6), inset 0 0 20px rgba(223, 187, 255, 0.4);
		display: flex; align-items: center; justify-content: center;
		z-index: 20; overflow: hidden;
	}
	.qtm__radar-sweep {
		position: absolute; width: 50%; height: 50%; top: 0; right: 0;
		transform-origin: 0% 100%;
		background: linear-gradient(45deg, rgba(223,187,255,0.8) 0%, transparent 50%);
		animation: spin 3s linear infinite;
	}
	.qtm__core-inner { text-align: center; position: relative; z-index: 2; }
	.qtm__core-val { font-size: 5vmin; font-weight: 200; color: #fff; text-shadow: 0 0 15px #fff; line-height: 1; }
	.qtm__core-lbl { font-size: 1.2vmin; letter-spacing: 4px; margin-top: 5px; color: #dfbbff; text-shadow: 0 0 5px #dfbbff; }

	/* VITALS AROUND CORE */
	.qtm__vital { position: absolute; width: 80px; height: 80px; }
	.qtm__vital--cpu { top: -40px; left: -40px; }
	.qtm__vital--mem { bottom: -40px; right: -40px; }
	.qtm__vital--net { top: -40px; right: -40px; }
	.qtm__vital-svg { width: 100%; height: 100%; transform: rotate(-90deg); }
	.qtm__vital-track { fill: none; stroke: rgba(255,255,255,0.1); stroke-width: 4; }
	.qtm__vital-fill { fill: none; stroke: #ffd700; stroke-width: 4; stroke-linecap: round; transition: stroke-dashoffset 0.5s; filter: drop-shadow(0 0 2px #ffd700); }
	.qtm__vital--mem .qtm__vital-fill { stroke: #00ffff; filter: drop-shadow(0 0 2px #00ffff); }
	.qtm__vital--net .qtm__vital-fill { stroke: #ff00ff; filter: drop-shadow(0 0 2px #ff00ff); }
	.qtm__vital-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 0.55rem; letter-spacing: 2px; text-shadow: 0 0 2px #000; font-weight: bold; }

	/* ORBITING NODES */
	.qtm__orbit-container {
		position: absolute; width: 100%; height: 100%;
		animation: orbit-spin 120s linear infinite;
	}
	@keyframes orbit-spin { 100% { transform: rotate(360deg); } }

	.qtm__node-wrapper {
		position: absolute; top: 50%; left: 50%;
		transform: rotate(var(--angle)) translate(var(--radius));
		z-index: 30;
	}

	.qtm__node {
		position: absolute;
		transform: translate(-50%, -50%) rotate(calc(-1 * var(--angle)));
		display: flex; flex-direction: column; align-items: center; gap: 8px;
		text-decoration: none; color: #fff; cursor: pointer;
	}
	.qtm__node:hover .qtm__node-point { transform: scale(1.5); box-shadow: 0 0 20px #fff; background: #fff; }
	.qtm__node:hover .qtm__node-label { color: #fff; text-shadow: 0 0 10px #fff; font-weight: bold; }

	.qtm__node-point {
		width: 14px; height: 14px; background: #dfbbff; border-radius: 50%;
		box-shadow: 0 0 15px #dfbbff; transition: all 0.3s;
		position: relative;
	}
	.qtm__node-point::after {
		content: ''; position: absolute; inset: -6px; border: 1px solid rgba(223, 187, 255, 0.8); border-radius: 50%; animation: pulse 2s infinite;
	}
	@keyframes pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }

	.qtm__node-label { font-size: 0.75rem; letter-spacing: 2px; white-space: nowrap; color: rgba(255,255,255,0.9); transition: all 0.3s; text-shadow: 0 0 5px rgba(223,187,255,0.5); }
	
	.qtm__node--err .qtm__node-point { background: #ff0055; box-shadow: 0 0 20px #ff0055; }
	.qtm__node--err .qtm__node-point::after { border-color: rgba(255,0,85,0.8); }
	.qtm__node-status { font-size: 0.5rem; color: #ff0055; letter-spacing: 2px; border: 1px solid #ff0055; padding: 2px 4px; border-radius: 2px; background: rgba(255,0,85,0.2); animation: blink 1s infinite; }
	@keyframes blink { 50% { opacity: 0; } }

	/* CORNERS */
	.qtm__corner { position: absolute; z-index: 20; padding: 30px; }
	.qtm__corner--bl { bottom: 0; left: 0; }
	.qtm__corner--br { bottom: 0; right: 0; text-align: right; }
	.qtm__corner-title { font-size: 0.75rem; letter-spacing: 4px; color: #dfbbff; margin-bottom: 15px; opacity: 0.9; text-shadow: 0 0 5px #dfbbff; }
	.qtm__routines { display: flex; flex-direction: column; gap: 10px; }
	.qtm__routine { font-size: 0.75rem; color: #fff; letter-spacing: 2px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s; text-shadow: 0 0 2px #000; }
	.qtm__corner--br .qtm__routine { justify-content: flex-end; flex-direction: row-reverse; }
	.qtm__r-dot { width: 6px; height: 6px; background: rgba(255,255,255,0.5); border-radius: 50%; box-shadow: 0 0 5px #fff; }
	.qtm__routine:hover { color: #ffd700; transform: translateX(5px); }
	.qtm__corner--br .qtm__routine:hover { transform: translateX(-5px); }
	.qtm__routine:hover .qtm__r-dot { background: #ffd700; box-shadow: 0 0 10px #ffd700; }

	@media (max-width: 900px) {
		.qtm__astrolabe { transform: scale(0.6); }
		.qtm__corner { display: none; }
	}
</style>
