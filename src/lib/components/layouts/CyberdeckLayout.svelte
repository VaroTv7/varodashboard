<script lang="ts">
	import { telemetry } from '$lib/stores/telemetry.svelte';
	import FleetControl from '$lib/components/tiles/FleetControl.svelte';
	import ContainerControl from '$lib/components/tiles/ContainerControl.svelte';
	import { onMount } from 'svelte';
	import { ui } from '$lib/stores/ui.svelte';

	let {
		settings = {} as Record<string, unknown>,
		services = { groups: [] } as { groups: Array<{ name: string; icon: string; services: Array<Record<string, unknown>> }> },
		scripts = { scripts: [] } as { scripts: Array<Record<string, unknown>> },
		statuses = {} as Record<string, string>,
		onOpenSettings = () => {},
	}: {
		settings: Record<string, unknown>;
		services: { groups: Array<{ name: string; icon: string; services: Array<Record<string, unknown>> }> };
		scripts: { scripts: Array<Record<string, unknown>> };
		statuses: Record<string, string>;
		onOpenSettings: () => void;
	} = $props();

	async function batchControl(action: 'start' | 'stop') {
		const containers = allServices.filter(s => s.containerName).map(s => s.containerName as string);
		if (containers.length === 0) return;
		
		ui.addToast(`INICIANDO SECUENCIA ${action.toUpperCase()}...`, 'info');
		
		for (const containerName of containers) {
			fetch('/api/container', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action, containerName })
			}).catch(console.error);
		}
		
		ui.addToast(`ORDEN ${action.toUpperCase()} ENVIADA A LA RED.`, 'success');
	}

	let logs = $state<string[]>([]);
	let bootSequence = $state(true);
	
	const allServices = $derived((services?.groups || []).flatMap(g => g.services.map(s => ({ ...s, group: g.name }))));
	const containerServices = $derived(allServices.filter(s => s.containerName).map(s => s.containerName as string));

	onMount(() => {
		const initialLogs = [
			"> INICIALIZANDO CYBERDECK v4.0.2...",
			"> CONECTANDO CON EL NÚCLEO VAROSERVER N150...",
			"> ESCANEANDO INTERFACES DE RED...",
			"> CARGANDO CONFIGURACIÓN DE SERVICIOS...",
			"> ESTADO DEL SISTEMA: NOMINAL.",
			"> BIENVENIDO, OPERADOR VARO."
		];
		let i = 0;
		const interval = setInterval(() => {
			if (i < initialLogs.length) {
				logs = [...logs, initialLogs[i]];
				i++;
			} else {
				bootSequence = false;
				clearInterval(interval);
			}
		}, 400);
	});

	$effect(() => {
		if (!bootSequence) {
			const id = setInterval(() => {
				const randomEvent = [
					`[TELEMETRÍA] CPU: ${telemetry.cpu.toFixed(1)}% | RAM: ${telemetry.mem.toFixed(1)}% | DISCO: ${telemetry.disk?.toFixed(1) || '--'}%`,
					`[SISTEMA] UPTIME: ${Math.floor(telemetry.uptime/3600)}H ${Math.floor((telemetry.uptime%3600)/60)}M`,
					`[RED] ESCANEANDO TRÁFICO... RX: ${telemetry.netRX.toFixed(1)} Mb/s`,
					`[NÚCLEO] PROCESOS ACTIVOS: ${telemetry.procs}`,
					`[SEGURIDAD] SIN AMENAZAS DETECTADAS EN EL NODO.`
				];
				logs = [...logs.slice(-15), randomEvent[Math.floor(Math.random() * randomEvent.length)]];
			}, 3000);
			return () => clearInterval(id);
		}
	});

	const timeStr = $derived(new Date().toLocaleTimeString('es-ES'));
</script>

<div class="deck">
	<div class="deck__overlay"></div>
	
	<header class="deck__header">
		<div class="deck__title">CYBERDECK_V4 // {(settings.title as string || 'VAROSERVER').toUpperCase()}</div>
		<div class="deck__header-stats">
			<div class="deck__arr-group">
				<span class="deck__arr-item" class:deck__arr-item--ok={telemetry.arrStatus.radarr === 'ONLINE'}>RADR</span>
				<span class="deck__arr-item" class:deck__arr-item--ok={telemetry.arrStatus.sonarr === 'ONLINE'}>SONR</span>
			</div>
			<span>CPU: {telemetry.cpu.toFixed(1)}%</span>
			<span>MEM: {telemetry.mem.toFixed(1)}%</span>
			<span>TIME: {timeStr}</span>
		</div>
	</header>

	<div class="deck__main">
		<div class="deck__col deck__col--left">
			<div class="deck__panel">
				<div class="deck__panel-head">ESTADO_CONSOLA</div>
				<div class="deck__console">
					{#each logs as log}
						<div class="deck__log-line">{log}</div>
					{/each}
					<div class="deck__cursor">_</div>
				</div>
			</div>
			
			<div class="deck__panel deck__panel--small">
				<div class="deck__panel-head">ASCII_CORE</div>
				<pre class="deck__ascii">
     .--------.
    / .------. \
   / /        \ \
   | |  VARO  | |
   \ \        / /
    \ '------' /
     '--------'
    [ NODO_RAÍZ ]
				</pre>
			</div>
		</div>

		<div class="deck__col deck__col--right">
			<div class="deck__panel">
				<div class="deck__panel-head" style="display: flex; justify-content: space-between; align-items: center;">
					<span>SERVICIOS_ACTIVOS</span>
					{#if containerServices.length > 0}
						<div class="deck__batch">
							<FleetControl containers={containerServices} groupName="SERVICES" variant="compact" />
						</div>
					{/if}
				</div>
				<div class="deck__service-list">
					{#each allServices as svc}
						<div class="deck__svc" class:deck__svc--off={statuses[svc.name as string] !== 'online'}>
							<span class="deck__svc-status">[{statuses[svc.name as string] === 'online' ? ' OK ' : 'FAIL'}]</span>
							<span class="deck__svc-name" style="flex: 1;">{svc.name}</span>
							{#if svc.containerName}
								<div style="margin-right: 10px;">
									<ContainerControl containerName={svc.containerName} variant="compact" />
								</div>
							{/if}
							<span class="deck__svc-addr">{svc.url ? new URL(svc.url as string).hostname : 'LOCAL'}</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="deck__panel">
				<div class="deck__panel-head">EJECUCIÓN_DE_SCRIPTS</div>
				<div class="deck__script-grid">
					{#each scripts?.scripts || [] as script}
						<button class="deck__script-btn">
							{script.name.toUpperCase()}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<footer class="deck__footer">
		<div class="deck__status-bar">
			SISTEMA OPERATIVO VARO-OS v7.4 // SEGURIDAD: NIVEL_5 // CONEXIÓN: ESTABLE
		</div>
		<button class="deck__menu-trigger" onclick={onOpenSettings}>[ CAMBIAR TEMA / AJUSTES ]</button>
	</footer>
</div>

<style>
	.deck {
		--deck-red: #ff3e00;
		--deck-orange: #ff9900;
		--deck-bg: #0d0202;
		
		background: var(--deck-bg);
		color: var(--deck-red);
		font-family: 'Courier New', monospace;
		height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: hidden;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.deck__overlay {
		position: absolute; inset: 0;
		background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
					linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
		background-size: 100% 2px, 3px 100%;
		pointer-events: none;
		z-index: 10;
	}

	.deck__header {
		padding: 10px 20px;
		border-bottom: 2px solid var(--deck-red);
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: rgba(255,0,0,0.1);
	}

	.deck__title { font-size: 1.2rem; font-weight: bold; }
	.deck__header-stats { display: flex; align-items: center; gap: 20px; font-size: 0.8rem; }

	.deck__arr-group { display: flex; gap: 10px; margin-right: 10px; border-right: 1px solid rgba(255,0,0,0.3); padding-right: 20px; }
	.deck__arr-item { color: #555; font-weight: bold; }
	.deck__arr-item--ok { color: #00ff00; text-shadow: 0 0 5px #00ff00; }

	.deck__main {
		flex: 1;
		display: flex;
		padding: 20px;
		gap: 20px;
		overflow: hidden;
	}

	.deck__col { display: flex; flex-direction: column; gap: 20px; }
	.deck__col--left { width: 400px; }
	.deck__col--right { flex: 1; }

	.deck__panel {
		border: 1px solid var(--deck-red);
		background: rgba(255,0,0,0.02);
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.deck__panel-head {
		padding: 4px 8px;
		background: rgba(255,0,0,0.1);
		font-size: 0.8rem;
		font-weight: bold;
		border-bottom: 1px solid var(--deck-red);
	}

	.deck__batch { display: flex; gap: 10px; }

	.deck__console {
		flex: 1;
		padding: 10px;
		font-size: 0.8rem;
		overflow-y: auto;
		color: var(--deck-orange);
	}

	.deck__log-line { margin-bottom: 4px; }
	.deck__cursor { display: inline-block; animation: blink 0.5s infinite; }
	@keyframes blink { 50% { opacity: 0; } }

	.deck__ascii {
		padding: 10px;
		font-size: 0.6rem;
		line-height: 1.2;
		color: var(--deck-red);
		text-align: center;
	}

	.deck__service-list {
		padding: 10px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 10px;
		overflow-y: auto;
	}

	.deck__svc {
		font-size: 0.8rem;
		display: flex;
		gap: 10px;
		border: 1px solid rgba(255,0,0,0.1);
		padding: 4px;
		align-items: center;
	}
	.deck__svc--off { color: #555; border-color: #333; }
	.deck__svc-status { font-weight: bold; min-width: 40px; }
	.deck__svc-addr { font-size: 0.7rem; color: var(--deck-orange); opacity: 0.8; }

	.deck__script-grid {
		padding: 10px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 10px;
	}

	.deck__script-btn {
		background: transparent;
		border: 1px solid var(--deck-red);
		color: var(--deck-red);
		padding: 8px;
		font-family: inherit;
		cursor: pointer;
		font-size: 0.7rem;
	}
	.deck__script-btn:hover { background: var(--deck-red); color: #000; }

	.deck__footer {
		padding: 5px 20px;
		border-top: 1px solid var(--deck-red);
		display: flex;
		justify-content: space-between;
		font-size: 0.7rem;
		background: rgba(255,0,0,0.05);
		position: relative;
		z-index: 100;
	}

	.deck__menu-trigger {
		background: none; border: none; color: var(--deck-red); cursor: pointer; font-family: inherit;
	}
</style>
