<script lang="ts">
	import { telemetry } from '$lib/stores/telemetry.svelte';

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

	const allServices = $derived((services?.groups || []).flatMap(g => g.services.map(s => ({ ...s, group: g.name }))));
</script>

<div class="bio" class:bio--alert={telemetry.cpu > 70}>
	<div class="bio__background"></div>
	
	<div class="bio__siren"></div>

	<header class="bio__header">
		<div class="bio__danger-stripe"></div>
		<div class="bio__header-content">
			<div class="bio__logo">☢️</div>
			<div class="bio__title">PROTOCOLO_CUARENTENA // {(settings.title as string || 'VAROSERVER').toUpperCase()}</div>
			<div class="bio__cpu-danger">
				<span class="bio__cpu-lbl">NIVEL_RADIACIÓN:</span>
				<span class="bio__cpu-val">{telemetry.cpu.toFixed(1)} mSv/h</span>
			</div>
		</div>
		<div class="bio__danger-stripe bio__danger-stripe--rev"></div>
	</header>

	<main class="bio__content">
		<div class="bio__grid">
			<div class="bio__panel bio__panel--center">
				<div class="bio__panel-label">CELDAS_DE_CONTENCIÓN (SERVICIOS)</div>
				<div class="bio__service-grid">
					{#each allServices as svc}
						<div class="bio__cell" class:bio__cell--breach={statuses[svc.name as string] !== 'online'}>
							<div class="bio__cell-head">{svc.name}</div>
							<div class="bio__cell-body">
								<div class="bio__cell-icon">{svc.icon || '🧬'}</div>
								<div class="bio__cell-status">
									{statuses[svc.name as string] === 'online' ? 'CONTENIDO' : '¡BRECHA!'}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="bio__side">
				<div class="bio__panel">
					<div class="bio__panel-label">PROTOCOLOS_DE_EMERGENCIA</div>
					<div class="bio__scripts">
						{#each scripts?.scripts || [] as script}
							<button class="bio__script-btn">
								<span class="bio__script-icon">⚠️</span>
								{script.name}
							</button>
						{/each}
					</div>
				</div>

				<div class="bio__panel bio__panel--stats">
					<div class="bio__panel-label">ESTADO_NÚCLEO</div>
					<div class="bio__stat">
						<div class="bio__stat-name">TEMPERATURA_MEMORIA</div>
						<div class="bio__stat-bar">
							<div class="bio__stat-fill" style="width: {telemetry.mem}%"></div>
						</div>
					</div>
					<div class="bio__stat">
						<div class="bio__stat-name">CARGA_ATMOSFÉRICA</div>
						<div class="bio__stat-bar">
							<div class="bio__stat-fill" style="width: {telemetry.cpu}%"></div>
						</div>
					</div>
					<div class="bio__stat">
						<div class="bio__stat-name">ESTABILIDAD_TIEMPO (UPTIME)</div>
						<div class="bio__stat-val-text">{Math.floor(telemetry.uptime/3600)}H {Math.floor((telemetry.uptime%3600)/60)}M</div>
					</div>
			</div>
		</div>
	</main>

	<footer class="bio__footer">
		<button class="bio__access-btn" onclick={onOpenSettings}>[ CAMBIAR TEMA / AJUSTES ]</button>
		<div class="bio__footer-msg">ADVERTENCIA: CUALQUIER ANOMALÍA DEBE SER REPORTADA INMEDIATAMENTE.</div>
	</footer>
</div>

<style>
	.bio {
		--bio-yellow: #ffcc00;
		--bio-black: #0a0a05;
		--bio-red: #ff3300;
		
		background: var(--bio-black);
		color: var(--bio-yellow);
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
	}

	.bio__background {
		position: absolute; inset: 0;
		background-image: 
			linear-gradient(45deg, #111 25%, transparent 25%), 
			linear-gradient(-45deg, #111 25%, transparent 25%), 
			linear-gradient(45deg, transparent 75%, #111 75%), 
			linear-gradient(-45deg, transparent 75%, #111 75%);
		background-size: 100px 100px;
		background-position: 0 0, 0 50px, 50px 50px, 50px 0;
		opacity: 0.2;
		pointer-events: none;
	}

	.bio__siren {
		position: absolute; inset: 0;
		background: radial-gradient(circle at center, rgba(255,200,0,0.1) 0%, transparent 70%);
		pointer-events: none;
		animation: siren-pulse 4s infinite ease-in-out;
	}
	.bio--alert .bio__siren {
		background: radial-gradient(circle at center, rgba(255,50,0,0.2) 0%, transparent 70%);
		animation: siren-pulse 1s infinite ease-in-out;
	}
	@keyframes siren-pulse { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }

	.bio__danger-stripe {
		height: 20px;
		background: repeating-linear-gradient(
			45deg,
			var(--bio-yellow),
			var(--bio-yellow) 20px,
			var(--bio-black) 20px,
			var(--bio-black) 40px
		);
	}
	.bio__danger-stripe--rev {
		background: repeating-linear-gradient(
			-45deg,
			var(--bio-yellow),
			var(--bio-yellow) 20px,
			var(--bio-black) 20px,
			var(--bio-black) 40px
		);
	}

	.bio__header-content {
		background: rgba(0,0,0,0.8);
		padding: 20px;
		display: flex;
		align-items: center;
		gap: 30px;
		border-bottom: 2px solid var(--bio-yellow);
	}

	.bio__logo { font-size: 3rem; animation: rotate 10s infinite linear; }
	@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

	.bio__title { flex: 1; font-size: 1.5rem; font-weight: 900; letter-spacing: 2px; }

	.bio__cpu-danger { text-align: right; border: 2px solid var(--bio-yellow); padding: 10px; background: rgba(255,204,0,0.1); }
	.bio__cpu-lbl { display: block; font-size: 0.7rem; font-weight: bold; }
	.bio__cpu-val { font-size: 1.5rem; font-weight: 900; }

	.bio__content { flex: 1; padding: 20px; position: relative; z-index: 5; overflow: hidden; }
	.bio__grid { display: grid; grid-template-columns: 1fr 22rem; gap: 1.25rem; height: 100%; }

	@media (max-width: 1024px) {
		.bio__grid { grid-template-columns: 1fr; }
		.bio__side { display: none; }
		.bio__header-content { flex-direction: column; text-align: center; gap: 1rem; }
		.bio__cpu-danger { text-align: center; width: 100%; }
	}

	.bio__panel {
		background: rgba(0,0,0,0.9);
		border: 1px solid var(--bio-yellow);
		display: flex;
		flex-direction: column;
		position: relative;
	}
	.bio__panel-label {
		background: var(--bio-yellow);
		color: var(--bio-black);
		font-size: 0.7rem;
		font-weight: 900;
		padding: 2px 10px;
	}

	.bio__service-grid {
		padding: 10px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
		gap: 0.5rem;
		overflow-y: auto;
	}

	.bio__cell {
		background: rgba(255,204,0,0.05);
		border: 1px solid rgba(255,204,0,0.2);
		display: flex;
		flex-direction: column;
		min-width: 0;
		height: 100px;
	}
	.bio__cell-head { font-size: 0.6rem; padding: 2px 4px; border-bottom: 1px solid rgba(255,204,0,0.2); text-align: center; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.bio__cell-body { padding: 5px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; min-height: 0; }
	.bio__cell-icon { font-size: 1.2rem; margin-bottom: 2px; }
	.bio__cell-status { font-size: 0.5rem; font-weight: bold; letter-spacing: 0.5px; opacity: 0.8; }

	.bio__cell--breach {
		border-color: var(--bio-red);
		color: var(--bio-red);
		background: rgba(255,51,0,0.1);
		animation: breach-pulse 0.5s infinite alternate;
	}
	@keyframes breach-pulse { from { background: rgba(255,51,0,0.1); } to { background: rgba(255,51,0,0.3); } }

	.bio__side { display: flex; flex-direction: column; gap: 20px; }
	
	.bio__scripts { padding: 10px; display: flex; flex-direction: column; gap: 8px; }
	.bio__script-btn {
		background: transparent;
		border: 1px solid var(--bio-yellow);
		color: var(--bio-yellow);
		padding: 8px 12px;
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
		font-weight: bold;
		text-align: left;
		font-size: 0.75rem;
	}
	.bio__script-btn:hover { background: var(--bio-yellow); color: var(--bio-black); }

	.bio__stat { padding: 15px; }
	.bio__stat-name { font-size: 0.65rem; font-weight: bold; margin-bottom: 5px; }
	.bio__stat-bar { height: 10px; background: #222; border: 1px solid #333; }
	.bio__stat-fill { height: 100%; background: var(--bio-yellow); }
	.bio__stat-val-text { font-size: 1.2rem; font-weight: 900; }

	.bio__footer {
		background: var(--bio-yellow);
		color: var(--bio-black);
		padding: 10px 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 4px solid var(--bio-black);
		position: relative;
		z-index: 100;
	}

	.bio__access-btn {
		background: var(--bio-black);
		color: var(--bio-yellow);
		border: 2px solid var(--bio-black);
		padding: 6px 15px;
		font-weight: 900;
		cursor: pointer;
		font-family: inherit;
		text-transform: uppercase;
		font-size: 0.8rem;
		transition: all 0.2s;
	}
	.bio__access-btn:hover {
		background: var(--bio-red);
		color: #fff;
		box-shadow: 0 0 15px var(--bio-red);
	}
	.bio__footer-msg { font-size: 0.65rem; font-weight: 900; letter-spacing: 1px; }
</style>
