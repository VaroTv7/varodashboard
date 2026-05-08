<script lang="ts">
	import { telemetry } from '$lib/stores/telemetry.svelte';
	import { onMount } from 'svelte';

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
	const onlineCount = $derived(Object.values(statuses).filter(s => s === 'online').length);
	
	let now = $state(new Date());
	$effect(() => {
		const id = setInterval(() => { now = new Date(); }, 1000);
		return () => clearInterval(id);
	});

	const timeStr = $derived(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
</script>

<div class="wc3">
	<!-- TOP BAR (RESOURCES) -->
	<div class="wc3__top-bar">
		<div class="wc3__resource wc3__resource--gold">
			<span class="wc3__res-icon">💰</span>
			<span class="wc3__res-val">{Math.floor(telemetry.netRX * 10)}</span>
			<span class="wc3__res-lbl">TRÁFICO_RX</span>
		</div>
		<div class="wc3__resource wc3__resource--lumber">
			<span class="wc3__res-icon">🌲</span>
			<span class="wc3__res-val">{Math.floor(telemetry.netTX * 10)}</span>
			<span class="wc3__res-lbl">TRÁFICO_TX</span>
		</div>
		<div class="wc3__resource wc3__resource--food">
			<span class="wc3__res-icon">🍖</span>
			<span class="wc3__res-val">{onlineCount}/{allServices.length}</span>
			<span class="wc3__res-lbl">POBLACIÓN</span>
		</div>
		<div class="wc3__time">{timeStr}</div>
	</div>

	<!-- MAIN VIEWPORT -->
	<main class="wc3__viewport">
		<div class="wc3__service-grid">
			{#each allServices as svc}
				{@const isOnline = statuses[svc.name as string] === 'online'}
				<a href={svc.url as string} target="_blank" class="wc3__unit" class:wc3__unit--dead={!isOnline}>
					<div class="wc3__unit-icon">{svc.icon || '🛡️'}</div>
					<div class="wc3__unit-bars">
						<div class="wc3__health-bar">
							<div class="wc3__bar-fill wc3__bar-fill--hp" style="width: {isOnline ? 100 : 0}%"></div>
						</div>
					</div>
					<div class="wc3__unit-name">{svc.name}</div>
				</a>
			{/each}
		</div>
	</main>

	<!-- BOTTOM HUD -->
	<div class="wc3__hud">
		<div class="wc3__minimap">
			<div class="wc3__minimap-inner">
				{#each allServices as svc, i}
					<div class="wc3__map-dot" style="left: {(i * 13) % 90}%; top: {(i * 7) % 90}%; background: {statuses[svc.name as string] === 'online' ? '#00ff00' : '#ff0000'}"></div>
				{/each}
			</div>
			<div class="wc3__minimap-label">MINI_MAPA_VARO</div>
		</div>

		<div class="wc3__portrait">
			<div class="wc3__portrait-frame">
				<div class="wc3__portrait-img">🏰</div>
			</div>
			<div class="wc3__portrait-stats">
				<div class="wc3__hero-name">VAROSERVER_CORE</div>
				<div class="wc3__hero-lvl">NIVEL {Math.floor(telemetry.uptime / 3600)}</div>
				<div class="wc3__vital-bars">
					<div class="wc3__vital">
						<div class="wc3__bar-fill wc3__bar-fill--hp" style="width: {100 - telemetry.cpu}%"></div>
						<span class="wc3__vital-text">VIDA: {Math.floor(100 - telemetry.cpu)}%</span>
					</div>
					<div class="wc3__vital">
						<div class="wc3__bar-fill wc3__bar-fill--mana" style="width: {100 - telemetry.mem}%"></div>
						<span class="wc3__vital-text">MANÁ: {Math.floor(100 - telemetry.mem)}%</span>
					</div>
				</div>
			</div>
		</div>

		<div class="wc3__inventory">
			<div class="wc3__inv-title">MARCADORES</div>
			<div class="wc3__inv-grid">
				{#each Array(6) as _}
					<div class="wc3__inv-slot"></div>
				{/each}
			</div>
		</div>

		<div class="wc3__commands">
			{#each (scripts?.scripts || []).slice(0, 12) as script, i}
				<button class="wc3__cmd-btn">
					<span class="wc3__cmd-icon">⚡</span>
					<span class="wc3__cmd-key">[{'QWERASDFZXCV'[i]}]</span>
				</button>
			{/each}
			{#each Array(Math.max(0, 12 - (scripts?.scripts?.length || 0))) as _}
				<div class="wc3__cmd-btn wc3__cmd-btn--empty"></div>
			{/each}
		</div>
	</div>
	
	<button class="wc3__menu-btn" onclick={onOpenSettings}>MENÚ / CAMBIAR TEMA (F10)</button>
</div>

<style>
	.wc3 {
		--wc3-gold: #fcd312;
		--wc3-lumber: #00ff00;
		--wc3-food: #ffffff;
		--wc3-bg: #08080f;
		--wc3-border: #4a3c28;
		--wc3-panel: #1a1a1a;
		
		background: var(--wc3-bg);
		color: #fff;
		font-family: 'Friz Quadrata', serif;
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		user-select: none;
	}

	.wc3__top-bar {
		height: 30px;
		background: rgba(0,0,0,0.8);
		border-bottom: 2px solid var(--wc3-border);
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 0 20px;
		gap: 20px;
		font-size: 0.8rem;
		font-weight: bold;
	}

	.wc3__resource { display: flex; align-items: center; gap: 5px; }
	.wc3__resource--gold .wc3__res-val { color: var(--wc3-gold); }
	.wc3__resource--lumber .wc3__res-val { color: var(--wc3-lumber); }
	.wc3__res-lbl { font-size: 0.6rem; opacity: 0.6; margin-left: 2px; }

	.wc3__viewport {
		flex: 1;
		padding: 40px;
		overflow-y: auto;
		background: radial-gradient(circle at center, #1a1a2e 0%, #08080f 100%);
	}

	.wc3__service-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 30px;
	}

	.wc3__unit {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-decoration: none;
		color: #fff;
		transition: transform 0.1s;
	}
	.wc3__unit:hover { transform: scale(1.1); }
	.wc3__unit--dead { opacity: 0.4; filter: grayscale(1); }

	.wc3__unit-icon {
		width: 64px;
		height: 64px;
		background: #222;
		border: 2px solid var(--wc3-border);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		margin-bottom: 5px;
		box-shadow: 0 4px 10px rgba(0,0,0,0.5);
	}

	.wc3__unit-bars { width: 64px; }
	.wc3__health-bar {
		height: 4px;
		background: #000;
		border: 1px solid #333;
	}
	.wc3__bar-fill { height: 100%; transition: width 0.3s; }
	.wc3__bar-fill--hp { background: #00ff00; }
	.wc3__bar-fill--mana { background: #0000ff; }
	.wc3__unit-name { font-size: 0.7rem; margin-top: 4px; text-align: center; }

	.wc3__hud {
		height: 200px;
		background: #111;
		border-top: 4px solid var(--wc3-border);
		display: grid;
		grid-template-columns: 200px 1fr 200px 300px;
		padding: 10px;
		gap: 10px;
		background-image: linear-gradient(to bottom, #1a1a1a, #000);
	}

	.wc3__minimap {
		border: 2px solid var(--wc3-border);
		background: #000;
		position: relative;
	}
	.wc3__minimap-inner { width: 100%; height: 100%; position: relative; }
	.wc3__map-dot { position: absolute; width: 4px; height: 4px; border-radius: 1px; }
	.wc3__minimap-label { position: absolute; bottom: 0; width: 100%; text-align: center; font-size: 0.6rem; color: #666; }

	.wc3__portrait {
		display: flex;
		gap: 15px;
		align-items: center;
		padding: 0 20px;
	}
	.wc3__portrait-frame {
		width: 120px;
		height: 120px;
		border: 3px solid var(--wc3-border);
		background: #000;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 4rem;
	}
	.wc3__portrait-stats { flex: 1; }
	.wc3__hero-name { font-size: 1.2rem; color: var(--wc3-gold); }
	.wc3__hero-lvl { font-size: 0.8rem; color: #aaa; margin-bottom: 10px; }
	.wc3__vital {
		height: 18px;
		background: #000;
		border: 1px solid #333;
		margin-bottom: 4px;
		position: relative;
		overflow: hidden;
	}
	.wc3__vital-text {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.7rem;
		text-shadow: 1px 1px #000;
	}

	.wc3__inventory {
		border: 1px solid var(--wc3-border);
		padding: 5px;
		display: flex;
		flex-direction: column;
	}
	.wc3__inv-title { font-size: 0.6rem; text-align: center; color: #666; }
	.wc3__inv-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(3, 1fr);
		gap: 4px;
		flex: 1;
	}
	.wc3__inv-slot { background: #000; border: 1px solid #222; }

	.wc3__commands {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(3, 1fr);
		gap: 4px;
	}
	.wc3__cmd-btn {
		background: #222;
		border: 2px solid var(--wc3-border);
		position: relative;
		cursor: pointer;
	}
	.wc3__cmd-btn:hover { background: #333; border-color: #fff; }
	.wc3__cmd-key { position: absolute; bottom: 2px; right: 2px; font-size: 0.6rem; color: var(--wc3-gold); }
	.wc3__cmd-btn--empty { cursor: default; opacity: 0.5; }

	.wc3__menu-btn {
		position: absolute;
		top: 40px;
		left: 50%;
		transform: translateX(-50%);
		background: #333;
		border: 2px solid var(--wc3-border);
		color: var(--wc3-gold);
		padding: 5px 20px;
		font-family: inherit;
		cursor: pointer;
	}
</style>
