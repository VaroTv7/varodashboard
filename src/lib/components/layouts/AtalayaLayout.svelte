<script lang="ts">
	import ServiceTile from '$lib/components/tiles/ServiceTile.svelte';
	import BookmarkTile from '$lib/components/tiles/BookmarkTile.svelte';
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

	// Derived derived searches
	const q = $derived(searchQuery.toLowerCase());
	const filteredServices = $derived(
		(services?.groups || []).map(g => ({
			...g,
			services: g.services.filter(s => !q || (s.name as string || '').toLowerCase().includes(q) || (s.description as string || '').toLowerCase().includes(q))
		})).filter(g => g.services.length > 0)
	);
	const filteredScripts = $derived(
		(scripts?.scripts || []).filter(s => !q || (s.name as string || '').toLowerCase().includes(q))
	);
	const filteredBookmarks = $derived(
		(bookmarks?.groups || []).map(g => ({
			...g,
			bookmarks: g.bookmarks.filter(b => !q || (b.name as string || '').toLowerCase().includes(q) || (b.url as string || '').toLowerCase().includes(q))
		})).filter(g => g.bookmarks.length > 0)
	);

	const onlineCount = $derived(Object.values(statuses).filter(s => s === 'online').length);
	const offlineCount = $derived(Object.values(statuses).filter(s => s === 'offline').length);

	let now = $state(new Date());
	let randomMatrix = $state<number[]>(Array.from({length: 16}, () => Math.floor(Math.random() * 999)));

	$effect(() => {
		const id = setInterval(() => { 
			now = new Date();
			randomMatrix = Array.from({length: 16}, () => Math.floor(Math.random() * 999));
		}, 1000);
		return () => clearInterval(id);
	});
	
	const timeStr = $derived(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
	
</script>

<div class="ata">
	<!-- OVERLAYS: CRT, Vignette, Grid -->
	<div class="ata__crt-flicker"></div>
	<div class="ata__scan-lines"></div>
	<div class="ata__vignette"></div>

	<!-- MEGA ANIMATION: Spinning 3D Wireframe Plane -->
	<div class="ata__hyper-grid">
		<div class="ata__hyper-plane"></div>
	</div>

	<!-- TOP BAR -->
	<header class="ata__header">
		<div class="ata__brand">
			<span class="ata__logo">▲</span>
			<span class="ata__title">{(settings.title as string || 'VAROSERVER').toUpperCase()} // CENTRO_MANDO</span>
		</div>
		
		<div class="ata__search-wrap">
			<span class="ata__search-prefix">BÚSQUEDA_SISTEMA:</span>
			<input class="ata__search" type="text" value={searchQuery} oninput={(e) => onSearch((e.target as HTMLInputElement).value)} placeholder="INICIE CONSULTA..." spellcheck="false" />
		</div>

		<div class="ata__sys-info">
			<div class="ata__sys-time">{timeStr}</div>
			<div class="ata__sys-nodes">
				<span class="ata__node-stat ata__node-stat--up">ACTIVOS: {onlineCount}</span>
				{#if offlineCount > 0}
					<span class="ata__node-stat ata__node-stat--down">CAÍDOS: {offlineCount}</span>
				{/if}
			</div>
			<button class="ata__btn" onclick={onOpenSettings}>[ CAMBIAR TEMA / AJUSTES ]</button>
		</div>
	</header>

	<!-- TICKER -->
	<div class="ata__ticker">
		<div class="ata__ticker-scroll">
			{#each Array(2) as _}
				{#if telemetry.customData?.mensajes?.length}
					{#each telemetry.customData.mensajes as msg}
						<span>{msg.toUpperCase()}</span>
					{/each}
				{:else}
					<span>SISTEMA VAROSERVER N150: OPERATIVO</span>
					<span>ESTADO DEL NÚCLEO: NOMINAL</span>
				{/if}
				<span>TIEMPO DE ACTIVIDAD: {Math.floor(telemetry.uptime / 3600)}h {Math.floor((telemetry.uptime % 3600) / 60)}m</span>
				<span>PROCESOS EN EJECUCIÓN: {telemetry.procs}</span>
				<span>CARGA DE RED: {telemetry.netRX.toFixed(1)} Mb/s</span>
				<span>ALMACENAMIENTO: {telemetry.disk.toFixed(1)}% EN USO</span>
				<span>TEMPERATURA: {Math.floor(35 + telemetry.cpu * 0.2)}°C</span>
			{/each}
		</div>
	</div>

	<main class="ata__main">
		<div class="ata__grid">
			
			<!-- COL 1: TELEMETRY & SYSTEM -->
			<div class="ata__col ata__col--sidebar">
				
				<div class="ata__panel ata__panel--hero">
					<div class="ata__panel-title">ENLACE_TELEMETRÍA</div>
					<div class="ata__radar-box">
						<div class="ata__radar"></div>
						<div class="ata__radar-text">ESCANEANDO...</div>
					</div>
					
					<div class="ata__stats-grid">
						<div class="ata__stat">
							<div class="ata__stat-lbl">ASIGNACIÓN_MEMORIA</div>
							<div class="ata__stat-val">{telemetry.mem.toFixed(1)}%</div>
							<div class="ata__stat-bar"><div class="ata__stat-fill" style="width:{telemetry.mem}%"></div></div>
						</div>
						<div class="ata__stat">
							<div class="ata__stat-lbl">CICLOS_CPU</div>
							<div class="ata__stat-val">{telemetry.cpu.toFixed(1)}%</div>
							<div class="ata__stat-bar"><div class="ata__stat-fill" style="width:{telemetry.cpu}%"></div></div>
						</div>
						<div class="ata__stat">
							<div class="ata__stat-lbl">E/S_DISCO</div>
							<div class="ata__stat-val">{telemetry.disk.toFixed(1)}%</div>
							<div class="ata__stat-bar"><div class="ata__stat-fill" style="width:{telemetry.disk}%"></div></div>
						</div>
						<div class="ata__stat">
							<div class="ata__stat-lbl">TX_RED</div>
							<div class="ata__stat-val">{telemetry.netTX.toFixed(1)} MB/s</div>
							<div class="ata__stat-bar"><div class="ata__stat-fill" style="width:{telemetry.netTX}%"></div></div>
						</div>
						<div class="ata__stat">
							<div class="ata__stat-lbl">RX_RED</div>
							<div class="ata__stat-val">{telemetry.netRX.toFixed(1)} MB/s</div>
							<div class="ata__stat-bar"><div class="ata__stat-fill" style="width:{telemetry.netRX}%"></div></div>
						</div>
					</div>

					<!-- MATRIX RAW DATA -->
					<div class="ata__matrix-data">
						{#each randomMatrix as m}
							<span>0x{m.toString(16).padStart(4, '0')}</span>
						{/each}
					</div>
				</div>

				<div class="ata__panel">
					<div class="ata__panel-title">RUTINAS</div>
					<div class="ata__list">
						{#each filteredScripts as script}
							<div class="ata__list-item">
								<span class="ata__list-icon">►</span>
								<span class="ata__list-text">{script.name}</span>
							</div>
						{/each}
					</div>
				</div>

			</div>

			<!-- COL 2: SERVICES -->
			<div class="ata__col ata__col--main">
				<div class="ata__panel ata__panel--flex">
					<div class="ata__panel-title">PULSO_NODO</div>
					<div class="ata__services">
						{#each filteredServices as group}
							<div class="ata__group">
								<h3 class="ata__group-title">
									<span class="ata__group-icon">{group.icon}</span> {group.name}
								</h3>
								<div class="ata__group-grid">
									{#each group.services as service}
										<div class="ata__service-wrapper">
											<div class="ata__service-scan"></div>
											<ServiceTile {service} status={statuses[service.name as string]} />
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- COL 3: BOOKMARKS -->
			<div class="ata__col ata__col--sidebar">
				<div class="ata__panel ata__panel--flex">
					<div class="ata__panel-title">MARCADORES</div>
					<div class="ata__bookmarks">
						{#each filteredBookmarks as group}
							<div class="ata__b-group">
								<h4 class="ata__b-title">{group.name}</h4>
								<div class="ata__b-list">
									{#each group.bookmarks as bookmark}
										<BookmarkTile {bookmark} />
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

		</div>
	</main>
</div>

<style>
	.ata {
		background-color: #060d1a;
		color: #00e5c8;
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
		height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: hidden;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	/* CRT EFFECTS */
	.ata__crt-flicker { position: absolute; inset: 0; background: rgba(0,229,200,0.02); z-index: 999; pointer-events: none; animation: crt-flicker 0.15s infinite; }
	.ata__scan-lines { position: absolute; inset: 0; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06)); background-size: 100% 2px, 3px 100%; z-index: 998; pointer-events: none; opacity: 0.3; }
	.ata__vignette { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%); z-index: 997; pointer-events: none; }
	@keyframes crt-flicker { 0% { opacity: 0.8; } 100% { opacity: 1; } }

	/* HYPER GRID BACKGROUND */
	.ata__hyper-grid { position: absolute; inset: -50%; perspective: 1000px; z-index: 0; pointer-events: none; overflow: hidden; display: flex; align-items: center; justify-content: center; opacity: 0.1; }
	.ata__hyper-plane {
		width: 200%; height: 200%;
		background-image: 
			linear-gradient(rgba(0,229,200,0.3) 1px, transparent 1px),
			linear-gradient(90deg, rgba(0,229,200,0.3) 1px, transparent 1px);
		background-size: 40px 40px;
		transform: rotateX(70deg) translateZ(-100px);
		animation: hyper-spin 30s linear infinite;
	}
	@keyframes hyper-spin { 100% { transform: rotateX(70deg) translateZ(-100px) rotateZ(360deg); } }

	/* HEADER */
	.ata__header {
		position: relative; z-index: 10;
		display: flex; align-items: center; justify-content: space-between;
		padding: 15px 30px;
		background: rgba(0,0,0,0.5);
		border-bottom: 1px solid #00e5c8;
		box-shadow: 0 4px 20px rgba(0, 229, 200, 0.1);
	}
	.ata__brand { display: flex; align-items: center; gap: 15px; font-weight: bold; font-size: 1.2rem; }
	.ata__logo { color: #fff; text-shadow: 0 0 10px #00e5c8; }
	
	.ata__search-wrap { display: flex; align-items: center; background: rgba(0,229,200,0.05); border: 1px solid rgba(0,229,200,0.3); padding: 5px 15px; }
	.ata__search-prefix { font-size: 0.8rem; color: #009985; margin-right: 10px; }
	.ata__search { background: transparent; border: none; color: #fff; font-family: inherit; font-size: 1rem; outline: none; width: 300px; }
	.ata__search:focus { box-shadow: inset 0 0 10px rgba(0,229,200,0.2); }

	.ata__sys-info { display: flex; align-items: center; gap: 20px; font-size: 0.8rem; font-weight: bold; }
	.ata__sys-time { color: #fff; text-shadow: 0 0 5px #fff; }
	.ata__sys-nodes { display: flex; gap: 10px; }
	.ata__node-stat--up { color: #00e5c8; }
	.ata__node-stat--down { color: #ff3366; animation: blink 1s infinite; }
	@keyframes blink { 50% { opacity: 0; } }

	.ata__btn { background: transparent; border: 1px solid #00e5c8; color: #00e5c8; padding: 5px 15px; font-family: inherit; cursor: pointer; transition: all 0.2s; }
	.ata__btn:hover { background: #00e5c8; color: #000; box-shadow: 0 0 15px #00e5c8; }

	/* TICKER */
	.ata__ticker { flex-shrink:0; height:clamp(16px,1.6vh,22px); background:#050b14; border-top:1px solid rgba(0,229,200,0.08); border-bottom:1px solid rgba(0,229,200,0.08); overflow:hidden; position:relative; }
	.ata__ticker::before { content:''; position:absolute; left:0; top:0; bottom:0; width:40px; background:linear-gradient(90deg,#050b14,transparent); z-index:1; }
	.ata__ticker::after { content:''; position:absolute; right:0; top:0; bottom:0; width:40px; background:linear-gradient(-90deg,#050b14,transparent); z-index:1; }
	.ata__ticker-scroll { display:flex; align-items:center; height:100%; white-space:nowrap; animation:tickerScroll 40s linear infinite; font-size:0.75em; color:#009985; letter-spacing:0.1em; }
	.ata__ticker-scroll span { padding:0 2em; }
	@keyframes tickerScroll { from{transform:translateX(0%)} to{transform:translateX(-50%)} }

	/* MAIN GRID */
	.ata__main { flex: 1; padding: 1.25rem 2rem; position: relative; z-index: 10; overflow: hidden; }
	.ata__grid { display: grid; grid-template-columns: 22rem 1fr 18rem; gap: 1.25rem; height: 100%; }
	.ata__col { display: flex; flex-direction: column; gap: 1.25rem; min-height: 0; }
	.ata__col--main { flex: 1; overflow-y: auto; }

	/* PANELS */
	.ata__panel {
		background: rgba(6, 13, 26, 0.7);
		border: 1px solid rgba(0, 229, 200, 0.2);
		position: relative;
		padding: 20px;
		box-shadow: inset 0 0 30px rgba(0,229,200,0.05);
		backdrop-filter: blur(4px);
		overflow-y: auto;
	}
	.ata__panel--flex { flex: 1; display: flex; flex-direction: column; min-height: 0; }
	.ata__panel::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: linear-gradient(90deg, #00e5c8, transparent); }
	.ata__panel::after { content: ''; position: absolute; bottom: 0; right: 0; width: 100%; height: 2px; background: linear-gradient(-90deg, #00e5c8, transparent); }
	
	.ata__panel-title { font-size: 0.8rem; font-weight: bold; color: #fff; margin-bottom: 20px; letter-spacing: 2px; display: flex; align-items: center; }
	.ata__panel-title::before { content: '■'; color: #00e5c8; margin-right: 10px; font-size: 1.2rem; }

	/* TELEMETRY RADAR */
	.ata__radar-box { position: relative; width: 100%; height: 120px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; border: 1px solid rgba(0,229,200,0.1); background: rgba(0,0,0,0.5); overflow: hidden; }
	.ata__radar { position: absolute; width: 200px; height: 200px; border-radius: 50%; border: 1px dashed rgba(0,229,200,0.3); animation: spin 4s linear infinite; }
	.ata__radar::after { content: ''; position: absolute; top: 50%; left: 50%; width: 50%; height: 2px; background: linear-gradient(90deg, transparent, #00e5c8); transform-origin: 0% 50%; }
	@keyframes spin { 100% { transform: rotate(360deg); } }
	.ata__radar-text { position: relative; z-index: 2; color: rgba(255,255,255,0.5); font-size: 0.7rem; }

	/* STATS GRID */
	.ata__stats-grid { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
	.ata__stat { display: grid; grid-template-columns: 1fr auto; grid-template-rows: auto auto; gap: 4px; font-size: 0.75rem; }
	.ata__stat-lbl { color: #009985; }
	.ata__stat-val { text-align: right; color: #fff; font-weight: bold; }
	.ata__stat-bar { grid-column: 1 / -1; height: 4px; background: rgba(0,0,0,0.5); border: 1px solid rgba(0,229,200,0.2); }
	.ata__stat-fill { height: 100%; background: #00e5c8; box-shadow: 0 0 5px #00e5c8; transition: width 0.3s; }

	/* MATRIX RAW DATA */
	.ata__matrix-data { font-size: 0.6rem; color: #009985; display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; opacity: 0.5; font-family: monospace; }

	/* LISTS */
	.ata__list { display: flex; flex-direction: column; gap: 8px; }
	.ata__list-item { display: flex; align-items: center; gap: 10px; padding: 8px; border: 1px solid transparent; cursor: pointer; transition: all 0.2s; font-size: 0.8rem; }
	.ata__list-item:hover { border-color: rgba(0,229,200,0.5); background: rgba(0,229,200,0.05); }
	.ata__list-icon { color: #009985; }
	.ata__list-text { color: #fff; }

	/* SERVICES */
	.ata__services { flex: 1; padding-right: 10px; }
	.ata__group { margin-bottom: 30px; }
	.ata__group-title { font-size: 0.9rem; color: #009985; margin-bottom: 15px; border-bottom: 1px solid rgba(0,229,200,0.1); padding-bottom: 5px; }
	.ata__group-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; }
	
	.ata__service-wrapper { position: relative; overflow: hidden; border: 1px solid rgba(0,229,200,0.2); }
	.ata__service-scan { position: absolute; top: -100%; left: 0; width: 100%; height: 2px; background: #00e5c8; box-shadow: 0 0 10px #00e5c8; opacity: 0.5; animation: scan-drop 3s linear infinite; pointer-events: none; z-index: 5; }
	@keyframes scan-drop { 0% { top: -10px; } 100% { top: 100%; } }

	/* BOOKMARKS */
	.ata__bookmarks { display: flex; flex-direction: column; gap: 20px; padding-right: 10px; }
	.ata__b-group { display: flex; flex-direction: column; gap: 10px; }
	.ata__b-title { font-size: 0.75rem; color: #009985; margin: 0; }
	.ata__b-list { display: flex; flex-direction: column; gap: 5px; }

	@media (max-width: 1024px) {
		.ata__grid { grid-template-columns: 1fr; }
		.ata__col--sidebar, .ata__col--right { display: none; }
		.ata__brand .ata__title { font-size: 0.8rem; letter-spacing: 2px; }
		.ata__search-wrap { display: none; }
		.ata__main { padding: 10px; }
		.ata__header { padding: 10px 15px; }
	}

	@media (min-width: 2500px) {
		.ata { font-size: 1.5rem; }
		.ata__grid { grid-template-columns: 500px 1fr 400px; gap: 40px; }
		.ata__header { padding: 30px 60px; }
		.ata__ticker { height: 40px; }
		.ata__group-grid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 30px; }
	}
</style>
