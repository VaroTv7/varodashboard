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
	const offlineCount = $derived(Object.values(statuses).filter(s => s === 'offline').length);

	let now = $state(new Date());
	let glitchTrigger = $state(false);
	let breachTrigger = $state(false);
	
	let netTX = $state(Array(40).fill(10));
	let sineWave = $state(Array(50).fill(50));
	let memoryFragments = $state<string[]>([]);
	let hexDump = $state<string[]>([]);
	
	const hexChars = "0123456789ABCDEF";
	const garbleChars = "!@#$%^&*()_+-=[]{}|;':,./<>?~`";
	
	function randomHex(len: number) {
		return Array.from({length: len}, () => hexChars[Math.floor(Math.random() * hexChars.length)]).join('');
	}

	function randomGarble(len: number) {
		return Array.from({length: len}, () => garbleChars[Math.floor(Math.random() * garbleChars.length)]).join('');
	}

	let tick = 0;
	$effect(() => {
		const id = setInterval(() => {
			tick++;
			now = new Date();
			glitchTrigger = Math.random() > 0.80; // 20% chance to glitch
			breachTrigger = Math.random() > 0.95; // 5% chance of breach warning
			
			// Shift network chart based on real telemetry network stat
			netTX = [...netTX.slice(1), telemetry.netTX];
			
			// Shift sine wave (reacting to real CPU)
			const cpuFactor = telemetry.cpu / 100;
			const freq = 0.5 + Math.sin(tick / 10) * (0.2 + cpuFactor);
			sineWave = [...sineWave.slice(1), 50 + Math.sin(tick * freq) * (20 + cpuFactor*30) + (Math.random() * 10 - 5)];
			
			// Add real system events in Spanish for matrix rain
			if (memoryFragments.length > 20) memoryFragments = memoryFragments.slice(1);
			const svc = allServices[Math.floor(Math.random() * allServices.length)];
			const logMsg = svc ? `[${svc.name.toUpperCase()}] ESTADO: ${statuses[svc.name as string] === 'online' ? 'NOMINAL' : 'BRECHA'}` : `[SISTEMA] CPU_LOAD: ${telemetry.cpu.toFixed(1)}%`;
			memoryFragments = [...memoryFragments, logMsg];

			// Fast scrolling hex dump using real-ish address lookups
			if (hexDump.length > 15) hexDump = hexDump.slice(1);
			const numLines = Math.min(2, Math.max(1, Math.floor(telemetry.cpu / 40)));
			for (let i=0; i<numLines; i++) {
				hexDump = [...hexDump, `[0x${randomHex(4)}] ADDR_${randomHex(8)} >> VOLCADO_MEMORIA: ${telemetry.mem.toFixed(1)}% | OK`];
			}
			
		}, 150);
		return () => clearInterval(id);
	});
	
	const timeStr = $derived(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }));
	const sinePath = $derived(`M ${sineWave.map((y, x) => `${x * 2},${y}`).join(' L ')}`);
</script>

<div class="glc" class:glitch-active={glitchTrigger}>
	<!-- GLOBAL OVERLAYS -->
	<div class="glc__crt-scanline"></div>
	<div class="glc__crt-flicker"></div>
	<div class="glc__vignette"></div>

	<!-- BACKGROUND RAIN -->
	<div class="glc__rain">
		{#each memoryFragments as frag, i}
			<div class="glc__rain-line" style="left: {(i * 11) % 100}%; top: {(i * 17) % 100}%; opacity: {0.1 + (i%5)*0.1}; animation-delay: {Math.random()}s;">
				{frag}
			</div>
		{/each}
	</div>

	{#if breachTrigger}
		<div class="glc__breach-warning">
			<div class="glc__breach-text">ADVERTENCIA: INTRUSIÓN DETECTADA</div>
		</div>
	{/if}

	<!-- TOP NAVIGATION -->
	<header class="glc__header">
		<div class="glc__title-area">
			<div class="glc__title" data-text="{(settings.title as string || 'VAROSERVER').toUpperCase()}">
				{(settings.title as string || 'VAROSERVER').toUpperCase()}
			</div>
			<div class="glc__sub-title">NÚCLEO_V7.2.9 // ENLACE_CIFRADO</div>
		</div>
		
		<div class="glc__crypto-ticker">
			<marquee direction="left" scrollamount="15">
				{#each Array(10) as _}
					<span class="glc__ticker-item">HASH_OP: 0x{randomHex(16)}... VERIFICADO </span>
					<span class="glc__ticker-item glc__ticker-item--alt">NIVEL_SEG: ALFA </span>
				{/each}
			</marquee>
		</div>

		<div class="glc__stats">
			<div class="glc__stat-box">
				<span class="glc__stat-lbl">TIEMPO_SIS</span>
				<span class="glc__stat-val">{timeStr}</span>
			</div>
			<div class="glc__stat-box">
				<span class="glc__stat-lbl">NODOS_ON</span>
				<span class="glc__stat-val glc__stat-val--ok">{onlineCount}</span>
			</div>
			<div class="glc__stat-box">
				<span class="glc__stat-lbl">NODOS_OFF</span>
				<span class="glc__stat-val glc__stat-val--err">{offlineCount}</span>
			</div>
			<button class="glc__btn" onclick={onOpenSettings}>[ CAMBIAR TEMA / AJUSTES ]</button>
		</div>
	</header>

	<main class="glc__main">
		<!-- SEARCH (COMMAND LINE) -->
		<div class="glc__search-container">
			<span class="glc__prompt">root@varoserver:~#</span>
			<input class="glc__search" type="text" value={searchQuery} oninput={(e) => onSearch((e.target as HTMLInputElement).value)} placeholder="grep -R carga_util /..." spellcheck="false" />
			<span class="glc__cursor">_</span>
		</div>

		<div class="glc__grid">
			
			<!-- COL 1: 3D WIREFRAME & SPECTRUM -->
			<div class="glc__col glc__col--1">
				<div class="glc__panel glc__panel--cyan glc__cube-panel">
					<div class="glc__panel-corner"></div>
					<div class="glc__panel-title">TOPOLOGÍA_RED</div>
					<div class="glc__scene">
						<div class="glc__cube">
							<div class="glc__face glc__face--front"></div>
							<div class="glc__face glc__face--back"></div>
							<div class="glc__face glc__face--right"></div>
							<div class="glc__face glc__face--left"></div>
							<div class="glc__face glc__face--top"></div>
							<div class="glc__face glc__face--bottom"></div>
						</div>
					</div>
					<div class="glc__coords">X: {randomHex(4)} Y: {randomHex(4)} Z: {randomHex(4)}</div>
				</div>

				<div class="glc__panel glc__panel--magenta">
					<div class="glc__panel-corner"></div>
					<div class="glc__panel-title">ESPECTRO_VARO</div>
					<div class="glc__sine-wrap">
						<svg class="glc__sine-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
							<path d={sinePath} stroke="#ff00ff" stroke-width="2" fill="none" class="glc__sine-path" />
						</svg>
					</div>
					<div class="glc__bars">
						{#each netTX.slice(0, 20) as val}
							<div class="glc__bar" style="height: {val}%;"></div>
						{/each}
					</div>
				</div>
			</div>

			<!-- COL 2: HEX DUMP & ROUTINES -->
			<div class="glc__col glc__col--2">
				<div class="glc__panel glc__panel--red glc__hex-panel">
					<div class="glc__panel-corner"></div>
					<div class="glc__panel-title">VOLCADO_MEMORIA_0x44A</div>
					<div class="glc__hex-content">
						{#each hexDump as line}
							<div class="glc__hex-line">{line}</div>
						{/each}
					</div>
				</div>

				<div class="glc__panel glc__panel--cyan glc__scroll">
					<div class="glc__panel-corner"></div>
					<div class="glc__panel-title">RUTINAS_SISTEMA</div>
					<div class="glc__routines">
						{#each scripts?.scripts || [] as script}
							<div class="glc__routine">
								<span class="glc__routine-icon">chmod +x</span>
								<span class="glc__routine-name">{script.name}</span>
								<span class="glc__routine-dots">...............</span>
								<span class="glc__routine-status">[LISTO]</span>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- COL 3: LIVE NODES & LOGS -->
			<div class="glc__col glc__col--3">
				<div class="glc__panel glc__panel--green glc__scroll glc__nodes-panel">
					<div class="glc__panel-corner"></div>
					<div class="glc__panel-title">ENLACE_NODOS</div>
					<div class="glc__nodes">
						{#each allServices as svc}
							{@const isOnline = statuses[svc.name as string] === 'online'}
							<a href={svc.url as string} target="_blank" rel="noopener" class="glc__node" class:glc__node--err={!isOnline}>
								<div class="glc__node-status-bar" style="height: {isOnline ? Math.random()*80+20 : 10}%"></div>
								<div class="glc__node-info">
									<div class="glc__node-name">{svc.name}</div>
									<div class="glc__node-meta">
										<span>{isOnline ? 'PING: 12ms' : 'CAÍDO'}</span>
										<span>IP: 192.168.{Math.floor(Math.random()*255)}.{Math.floor(Math.random()*255)}</span>
									</div>
								</div>
								<div class="glc__node-target">⌖</div>
							</a>
						{/each}
					</div>
				</div>
			</div>

		</div>
	</main>
</div>

<style>
	.glc {
		background-color: #030008;
		color: #39ff14;
		font-family: 'Courier New', Courier, monospace;
		height: 100vh;
		overflow: hidden;
		position: relative;
		display: flex;
		flex-direction: column;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	/* CRT EFFECTS */
	.glc__crt-scanline {
		position: absolute; inset: 0; pointer-events: none; z-index: 998;
		background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
		background-size: 100% 4px, 6px 100%;
	}
	.glc__crt-flicker {
		position: absolute; inset: 0; pointer-events: none; z-index: 999;
		background: rgba(0,0,0,0.1);
		animation: flicker 0.15s infinite alternate;
	}
	@keyframes flicker { 0% { opacity: 0; } 100% { opacity: 0.1; } }
	
	.glc__vignette {
		position: absolute; inset: 0; pointer-events: none; z-index: 997;
		background: radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.8) 100%);
	}

	.glc__breach-warning {
		position: absolute; top: 30%; left: 0; width: 100%; background: rgba(255,0,0,0.8);
		color: #fff; font-size: 3rem; font-weight: 900; text-align: center; padding: 20px;
		z-index: 1000; box-shadow: 0 0 50px red;
		animation: breach-flash 0.5s infinite;
	}
	@keyframes breach-flash { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

	/* MATRIX RAIN */
	.glc__rain { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; opacity: 0.3; }
	.glc__rain-line { position: absolute; font-size: 0.7rem; color: #39ff14; writing-mode: vertical-rl; text-orientation: mixed; animation: fall 3s linear infinite; text-shadow: 0 0 5px #39ff14; }
	@keyframes fall { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }

	/* HEADER */
	.glc__header {
		display: flex; align-items: center; justify-content: space-between; padding: 10px 20px;
		border-bottom: 2px solid #39ff14;
		position: relative; z-index: 10;
		background: rgba(0,0,0,0.9);
		box-shadow: 0 0 20px rgba(57, 255, 20, 0.2);
	}
	
	.glc__title-area { display: flex; flex-direction: column; }
	.glc__title {
		font-size: 2.5rem; font-weight: 900; color: #fff; text-shadow: 0 0 10px #39ff14;
		position: relative; letter-spacing: -2px; line-height: 1;
	}
	.glc__sub-title { font-size: 0.7rem; color: #00ffff; letter-spacing: 4px; margin-top: 5px; }

	.glitch-active .glc__title::before, .glitch-active .glc__title::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
	.glitch-active .glc__title::before { left: 4px; text-shadow: -4px 0 #ff00ff; clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%); animation: glitch-anim 0.1s linear infinite; }
	.glitch-active .glc__title::after { left: -4px; text-shadow: -4px 0 #00ffff; clip-path: polygon(0 80%, 100% 20%, 100% 100%, 0 100%); animation: glitch-anim 0.1s linear infinite reverse; }
	@keyframes glitch-anim { 0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 2px); } 20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -2px); } 40% { clip-path: inset(40% 0 50% 0); } 60% { clip-path: inset(80% 0 5% 0); } 80% { clip-path: inset(10% 0 70% 0); } 100% { clip-path: inset(30% 0 50% 0); transform: translate(0, 0); } }

	.glc__crypto-ticker { flex: 1; margin: 0 30px; border: 1px solid #333; padding: 4px; background: #000; overflow: hidden; display: flex; align-items: center; }
	.glc__ticker-item { color: #555; font-size: 0.75rem; margin-right: 20px; white-space: nowrap; }
	.glc__ticker-item--alt { color: #ff00ff; opacity: 0.5; }

	.glc__stats { display: flex; gap: 15px; font-size: 0.8rem; }
	.glc__stat-box { display: flex; flex-direction: column; background: #0a0a0a; border: 1px solid #333; padding: 4px 10px; }
	.glc__stat-lbl { font-size: 0.6rem; color: #555; }
	.glc__stat-val { font-weight: bold; font-size: 1rem; color: #00ffff; }
	.glc__stat-val--ok { color: #39ff14; }
	.glc__stat-val--err { color: #ff003c; animation: fast-blink 0.2s infinite; }

	.glc__btn { background: #39ff14; border: none; color: #000; font-family: inherit; font-size: 0.9rem; font-weight: bold; cursor: pointer; padding: 0 15px; transition: all 0.1s; }
	.glc__btn:hover { background: #fff; box-shadow: 0 0 15px #fff; }

	/* MAIN */
	.glc__main { flex: 1; display: flex; flex-direction: column; padding: 15px; position: relative; z-index: 10; gap: 15px; overflow: hidden; }

	.glc__search-container { display: flex; align-items: center; font-size: 1.4rem; font-weight: bold; background: rgba(0,255,0,0.05); padding: 10px; border-left: 4px solid #39ff14; }
	.glc__prompt { color: #39ff14; margin-right: 15px; text-shadow: 0 0 5px #39ff14; }
	.glc__search { flex: 1; background: transparent; border: none; color: #fff; font-family: inherit; font-size: 1.4rem; outline: none; }
	.glc__cursor { color: #39ff14; animation: fast-blink 0.5s infinite; }

	.glc__grid { display: grid; grid-template-columns: 1fr 1.2fr 1fr; gap: 1rem; flex: 1; min-height: 0; }
	.glc__col { display: flex; flex-direction: column; gap: 1rem; min-height: 0; }

	/* PANELS */
	.glc__panel {
		border: 1px solid #333; background: rgba(5, 0, 15, 0.7);
		position: relative; display: flex; flex-direction: column;
		backdrop-filter: blur(2px);
	}
	.glc__panel-corner {
		position: absolute; top: 0; right: 0; width: 20px; height: 20px;
		border-top: 2px solid inherit; border-right: 2px solid inherit;
	}
	.glc__panel--magenta { border-color: #ff00ff; box-shadow: inset 0 0 20px rgba(255,0,255,0.1); }
	.glc__panel--green { border-color: #39ff14; box-shadow: inset 0 0 20px rgba(57,255,20,0.1); flex: 1; }
	.glc__panel--cyan { border-color: #00ffff; box-shadow: inset 0 0 20px rgba(0,255,255,0.1); flex: 1; }
	.glc__panel--red { border-color: #ff003c; box-shadow: inset 0 0 20px rgba(255,0,60,0.1); flex: 1.5; }

	.glc__panel-title {
		background: #333; color: #000; font-size: 0.75rem; font-weight: bold; padding: 2px 10px;
		display: inline-block; width: max-content; border-bottom-right-radius: 5px;
	}
	.glc__panel--magenta .glc__panel-title { background: #ff00ff; }
	.glc__panel--green .glc__panel-title { background: #39ff14; }
	.glc__panel--cyan .glc__panel-title { background: #00ffff; }
	.glc__panel--red .glc__panel-title { background: #ff003c; color: #fff; }

	.glc__scroll { overflow-y: auto; padding: 10px; }

	/* 3D CUBE (CSS) */
	.glc__cube-panel { height: 250px; padding: 10px; overflow: hidden; display: flex; flex-direction: column; }
	.glc__scene { flex: 1; perspective: 600px; display: flex; align-items: center; justify-content: center; }
	.glc__cube { width: 80px; height: 80px; position: relative; transform-style: preserve-3d; animation: rotate-cube 10s infinite linear; }
	.glc__face { position: absolute; width: 80px; height: 80px; border: 2px solid #00ffff; background: rgba(0, 255, 255, 0.1); box-shadow: inset 0 0 10px #00ffff; }
	.glc__face--front  { transform: rotateY(  0deg) translateZ(40px); }
	.glc__face--right  { transform: rotateY( 90deg) translateZ(40px); }
	.glc__face--back   { transform: rotateY(180deg) translateZ(40px); }
	.glc__face--left   { transform: rotateY(-90deg) translateZ(40px); }
	.glc__face--top    { transform: rotateX( 90deg) translateZ(40px); }
	.glc__face--bottom { transform: rotateX(-90deg) translateZ(40px); }
	@keyframes rotate-cube { 0% { transform: rotateX(0deg) rotateY(0deg); } 100% { transform: rotateX(360deg) rotateY(360deg); } }
	.glc__coords { font-size: 0.7rem; color: #00ffff; text-align: center; margin-top: 10px; }

	/* SINE & SPECTRUM BARS */
	.glc__panel--magenta { flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 10px; }
	.glc__sine-wrap { height: 60px; width: 100%; border-bottom: 1px dashed #ff00ff; margin-bottom: 10px; }
	.glc__sine-svg { width: 100%; height: 100%; }
	.glc__sine-path { filter: drop-shadow(0 0 5px #ff00ff); }
	
	.glc__bars { display: flex; align-items: flex-end; gap: 2px; height: 50px; }
	.glc__bar { flex: 1; background: #ff00ff; transition: height 0.1s; box-shadow: 0 0 5px #ff00ff; }

	/* HEX DUMP */
	.glc__hex-panel { padding: 10px; overflow: hidden; display: flex; flex-direction: column; }
	.glc__hex-content { display: flex; flex-direction: column; gap: 2px; }
	.glc__hex-line { font-size: 0.8rem; color: #ff003c; white-space: pre; line-height: 1.2; text-shadow: 0 0 2px #ff003c; }

	/* ROUTINES */
	.glc__routines { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
	.glc__routine { display: flex; align-items: center; font-size: 0.8rem; color: #00ffff; padding: 4px; border: 1px solid transparent; cursor: pointer; transition: all 0.2s; }
	.glc__routine-icon { color: #555; margin-right: 10px; }
	.glc__routine-name { font-weight: bold; white-space: nowrap; }
	.glc__routine-dots { flex: 1; overflow: hidden; color: #333; margin: 0 10px; }
	.glc__routine-status { background: #00ffff; color: #000; padding: 0 4px; font-weight: bold; }
	.glc__routine:hover { border-color: #00ffff; background: rgba(0,255,255,0.1); box-shadow: 0 0 10px rgba(0,255,255,0.3); transform: scale(1.02); }

	/* NODES */
	.glc__nodes-panel { padding: 10px; }
	.glc__nodes { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
	.glc__node { display: flex; align-items: center; gap: 15px; text-decoration: none; color: #39ff14; padding: 10px; border: 1px solid #1a331a; background: rgba(0,20,0,0.5); position: relative; overflow: hidden; }
	.glc__node::before { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(57,255,20,0.2), transparent); transition: left 0.5s; }
	.glc__node:hover::before { left: 100%; }
	.glc__node:hover { border-color: #39ff14; box-shadow: 0 0 15px rgba(57,255,20,0.3); }
	
	.glc__node-status-bar { width: 4px; background: #39ff14; box-shadow: 0 0 5px #39ff14; transition: height 0.2s; }
	.glc__node-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
	.glc__node-name { font-weight: bold; font-size: 1rem; text-shadow: 0 0 5px #39ff14; }
	.glc__node-meta { display: flex; justify-content: space-between; font-size: 0.7rem; color: #558055; }
	.glc__node-target { font-size: 1.5rem; opacity: 0.5; }
	
	.glc__node--err { color: #ff003c; border-color: #33000a; background: rgba(20,0,0,0.5); }
	.glc__node--err .glc__node-status-bar { background: #ff003c; box-shadow: 0 0 5px #ff003c; animation: fast-blink 0.1s infinite; }
	.glc__node--err .glc__node-name { text-shadow: 0 0 5px #ff003c; animation: glitch-anim 0.2s infinite; }
	.glc__node--err .glc__node-meta { color: #ff4d79; }
	.glc__node--err:hover { border-color: #ff003c; box-shadow: 0 0 15px rgba(255,0,60,0.4); }

	@keyframes fast-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

	@media (max-width: 1024px) {
		.glc__grid { grid-template-columns: 1fr; }
		.glc__col--left, .glc__col--right { display: none; }
		.glc__title { font-size: 1.5rem; }
		.glc__sub-title { font-size: 0.6rem; }
		.glc__header { padding: 10px 15px; }
		.glc__stats { gap: 10px; }
		.glc__stat-box { display: none; }
		.glc__stat-box:last-child { display: flex; }
	}

	@media (min-width: 2500px) {
		.glc { font-size: 1.5rem; }
		.glc__grid { grid-template-columns: 500px 1fr 400px; gap: 40px; }
		.glc__header { padding: 30px 60px; height: 120px; }
		.glc__node { padding: 20px; }
		.glc__node-name { font-size: 1.8rem; }
	}
</style>
