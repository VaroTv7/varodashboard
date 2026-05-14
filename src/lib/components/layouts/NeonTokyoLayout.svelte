<script lang="ts">
	import { telemetry } from '$lib/stores/telemetry.svelte';
	import FleetControl from '$lib/components/tiles/FleetControl.svelte';
	import ContainerControl from '$lib/components/tiles/ContainerControl.svelte';

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
	const containerServices = $derived(allServices.filter(s => s.containerName).map(s => s.containerName as string));
</script>

<div class="tokyo">
	<div class="tokyo__bg">
		<div class="tokyo__sun"></div>
		<div class="tokyo__grid"></div>
	</div>

	<header class="tokyo__header">
		<div class="tokyo__logo">V A R O S E R V E R</div>
		<div class="tokyo__telemetry">
			<div class="tokyo__stat">
				<span class="tokyo__stat-lbl">RADR_ST</span>
				<span class="tokyo__stat-val" style="color: {telemetry.arrStatus.radarr === 'ONLINE' ? 'var(--tokyo-cyan)' : '#ff0033'}">{telemetry.arrStatus.radarr}</span>
			</div>
			<div class="tokyo__stat">
				<span class="tokyo__stat-lbl">SONR_ST</span>
				<span class="tokyo__stat-val" style="color: {telemetry.arrStatus.sonarr === 'ONLINE' ? 'var(--tokyo-cyan)' : '#ff0033'}">{telemetry.arrStatus.sonarr}</span>
			</div>
			<div class="tokyo__stat">
				<span class="tokyo__stat-lbl">CPU_LOAD</span>
				<span class="tokyo__stat-val">{telemetry.cpu.toFixed(1)}%</span>
			</div>
			<div class="tokyo__stat">
				<span class="tokyo__stat-lbl">RAM_USE</span>
				<span class="tokyo__stat-val">{telemetry.mem.toFixed(1)}%</span>
			</div>
		</div>
		<button class="tokyo__menu-btn" onclick={onOpenSettings}>AJUSTES / TEMAS</button>
	</header>

	<main class="tokyo__content">
		<div class="tokyo__columns">
			<div class="tokyo__col tokyo__col--services">
				<div class="tokyo__section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
					<h2 class="tokyo__section-title" style="margin: 0;">ACTIVE_SYSTEMS</h2>
					{#if containerServices.length > 0}
						<div class="tokyo__fleet-wrap">
							<FleetControl containers={containerServices} groupName="SYSTEMS" variant="compact" />
						</div>
					{/if}
				</div>
				<div class="tokyo__service-grid">
					{#each allServices as svc}
						{@const isOnline = statuses[svc.name as string] === 'online'}
						<div class="tokyo__node" class:tokyo__node--offline={!isOnline}>
							<div class="tokyo__node-icon">{svc.icon || '💎'}</div>
							<div class="tokyo__node-name">{svc.name}</div>
							{#if svc.containerName}
								<div style="margin-top: 10px; z-index: 10;">
									<ContainerControl containerName={svc.containerName} variant="compact" />
								</div>
							{/if}
							<div class="tokyo__node-glow"></div>
						</div>
					{/each}
				</div>
			</div>

			<div class="tokyo__col tokyo__col--scripts">
				<h2 class="tokyo__section-title">COMMANDS</h2>
				<div class="tokyo__scripts">
					{#each scripts?.scripts || [] as script}
						<button class="tokyo__script-btn">
							<span class="tokyo__script-text">{script.name}</span>
							<div class="tokyo__btn-glow"></div>
						</button>
					{/each}
				</div>
				
				<div class="tokyo__visualizer">
					<div class="tokyo__viz-label">SIGNAL_FLOW</div>
					<div class="tokyo__viz-bars">
						{#each Array(20) as _, i}
							<div class="tokyo__viz-bar" style="height: {20 + Math.random() * telemetry.cpu}%; animation-delay: {i * 0.1}s"></div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</main>

	<footer class="tokyo__footer">
		<div class="tokyo__marquee">
			<div class="tokyo__marquee-content">
				SYSTEM_STATUS: NOMINAL // UPTIME: {telemetry.uptime}S // NEON_TOKYO_V7.4 // WELCOME TO THE GRID...
			</div>
		</div>
	</footer>
</div>

<style>
	.tokyo {
		--tokyo-pink: #ff00ff;
		--tokyo-cyan: #00ffff;
		--tokyo-purple: #7000ff;
		--tokyo-bg: #050510;
		
		background: var(--tokyo-bg);
		color: #fff;
		font-family: 'Outfit', 'Inter', sans-serif;
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
	}

	.tokyo__bg {
		position: absolute; inset: 0;
		overflow: hidden;
		perspective: 500px;
	}

	.tokyo__sun {
		position: absolute;
		top: 10%;
		left: 50%;
		transform: translateX(-50%);
		width: 50vmin;
		height: 50vmin;
		background: linear-gradient(to bottom, #ff00ff, #7000ff);
		border-radius: 50%;
		box-shadow: 0 0 100px #ff00ff;
		mask-image: linear-gradient(to bottom, black 0%, black 50%, transparent 50%, transparent 55%, black 55%, black 65%, transparent 65%, transparent 72%, black 72%, black 82%, transparent 82%, transparent 92%, black 92%);
	}

	.tokyo__grid {
		position: absolute;
		bottom: -200px;
		left: -50%;
		width: 200%;
		height: 600px;
		background-image: 
		linear-gradient(transparent 0%, var(--tokyo-pink) 2%, transparent 3%),
		linear-gradient(90deg, transparent 0%, var(--tokyo-pink) 2%, transparent 3%);
		background-size: 4rem 4rem;
		transform: rotateX(60deg);
		animation: grid-move 2s linear infinite;
		opacity: 0.3;
	}
	@keyframes grid-move { from { background-position: 0 0; } to { background-position: 0 4rem; } }

	.tokyo__header {
		height: 5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 2rem;
		background: rgba(5,5,16,0.8);
		border-bottom: 2px solid var(--tokyo-pink);
		box-shadow: 0 5px 20px rgba(255,0,255,0.2);
		z-index: 10;
		backdrop-filter: blur(10px);
	}
	@media (max-width: 1024px) {
		.tokyo__header { height: auto; flex-direction: column; padding: 1rem; gap: 1rem; }
		.tokyo__telemetry { display: none; }
	}

	.tokyo__logo { font-size: 1.5rem; font-weight: 900; letter-spacing: 10px; color: var(--tokyo-cyan); text-shadow: 0 0 10px var(--tokyo-cyan); }

	.tokyo__telemetry { display: flex; gap: 40px; }
	.tokyo__stat { display: flex; flex-direction: column; align-items: flex-end; }
	.tokyo__stat-lbl { font-size: 0.6rem; color: var(--tokyo-pink); font-weight: bold; }
	.tokyo__stat-val { font-size: 1rem; font-weight: 900; color: #fff; text-shadow: 0 0 5px #fff; }

	.tokyo__menu-btn {
		background: transparent;
		border: 1px solid var(--tokyo-cyan);
		color: var(--tokyo-cyan);
		padding: 5px 20px;
		border-radius: 20px;
		cursor: pointer;
		font-weight: bold;
		transition: all 0.3s;
	}
	.tokyo__menu-btn:hover { background: var(--tokyo-cyan); color: #000; box-shadow: 0 0 20px var(--tokyo-cyan); }

	.tokyo__content { flex: 1; padding: 40px; z-index: 5; overflow-y: auto; }
	.tokyo__columns { display: grid; grid-template-columns: 1fr 400px; gap: 40px; }

	.tokyo__section-title { font-size: 1rem; font-weight: 900; letter-spacing: 5px; color: var(--tokyo-pink); margin-bottom: 30px; border-left: 4px solid var(--tokyo-pink); padding-left: 15px; }

	.tokyo__service-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }

	.tokyo__node {
		background: rgba(255,0,255,0.05);
		border: 1px solid var(--tokyo-pink);
		padding: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		transition: all 0.3s;
		cursor: pointer;
	}
	.tokyo__node:hover { background: rgba(255,0,255,0.1); transform: translateY(-5px); box-shadow: 0 10px 20px rgba(255,0,255,0.2); }
	.tokyo__node--offline { border-color: #333; color: #555; background: transparent; }
	
	.tokyo__node-icon { font-size: 2rem; margin-bottom: 10px; }
	.tokyo__node-name { font-size: 0.8rem; font-weight: bold; text-align: center; }
	
	.tokyo__node-glow { position: absolute; inset: 0; box-shadow: inset 0 0 10px var(--tokyo-pink); opacity: 0; transition: opacity 0.3s; }
	.tokyo__node:hover .tokyo__node-glow { opacity: 1; }

	.tokyo__scripts { display: flex; flex-direction: column; gap: 15px; }
	.tokyo__script-btn {
		background: rgba(0,255,255,0.05);
		border: 1px solid var(--tokyo-cyan);
		color: var(--tokyo-cyan);
		padding: 15px;
		position: relative;
		overflow: hidden;
		cursor: pointer;
		text-align: left;
		font-weight: bold;
	}
	.tokyo__script-btn:hover { background: rgba(0,255,255,0.1); }
	.tokyo__btn-glow { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(0,255,255,0.4), transparent); transition: left 0.5s; }
	.tokyo__script-btn:hover .tokyo__btn-glow { left: 100%; }

	.tokyo__visualizer { margin-top: 40px; background: rgba(0,0,0,0.5); padding: 20px; border: 1px solid #222; }
	.tokyo__viz-label { font-size: 0.6rem; color: #555; margin-bottom: 15px; }
	.tokyo__viz-bars { display: flex; align-items: flex-end; gap: 4px; height: 100px; }
	.tokyo__viz-bar { flex: 1; background: var(--tokyo-cyan); animation: bar-dance 1s infinite alternate; }
	@keyframes bar-dance { from { transform: scaleY(1); } to { transform: scaleY(0.5); } }

	.tokyo__footer { height: 40px; background: #000; border-top: 1px solid var(--tokyo-pink); display: flex; align-items: center; overflow: hidden; }
	.tokyo__marquee { white-space: nowrap; width: 100%; }
	.tokyo__marquee-content { display: inline-block; padding-left: 100%; animation: marquee 30s linear infinite; font-size: 0.7rem; color: var(--tokyo-pink); font-weight: bold; }
	@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-200%); } }
</style>
