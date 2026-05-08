<script lang="ts">
	import AtalayaPanel from './AtalayaPanel.svelte';

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

	// All services flat
	const allServices = $derived(
		(services?.groups || []).flatMap(g => g.services.map(s => ({ ...s, group: g.name })))
			.filter(s => !q || (s.name as string || '').toLowerCase().includes(q) || (s.description as string || '').toLowerCase().includes(q))
	);

	const filteredScripts = $derived(
		(scripts?.scripts || []).filter(s => !q || (s.name as string || '').toLowerCase().includes(q))
	);

	const filteredBookmarks = $derived(
		(bookmarks?.groups || []).flatMap(g => g.bookmarks.map(b => ({ ...b, group: g.name })))
			.filter(b => !q || b.name.toLowerCase().includes(q))
	);

	const onlineCount = $derived(Object.values(statuses).filter(s => s === 'online').length);
	const totalServices = $derived(allServices.length);

	// Clock
	let now = $state(new Date());
	$effect(() => {
		const id = setInterval(() => now = new Date(), 1000);
		return () => clearInterval(id);
	});
	const timeStr = $derived(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
	const dateStr = $derived(now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase());
</script>

<div class="ata">
	<!-- ═══ TOP STATUS BAR ═══ -->
	<header class="ata__topbar">
		<div class="ata__topbar-left">
			<span class="ata__topbar-logo">⟡</span>
			<span class="ata__topbar-brand">{settings.title || 'varodashboard'}</span>
			<span class="ata__topbar-sep">│</span>
			<span class="ata__topbar-status">
				{#if searchQuery}
					<span class="ata__topbar-search">filter: "{searchQuery}"</span>
				{:else}
					<span class="ata__topbar-mode">system.monitor</span>
				{/if}
			</span>
		</div>
		<div class="ata__topbar-center">
			<span class="ata__topbar-prompt">▸</span>
			<input
				class="ata__topbar-search-input"
				type="text"
				value={searchQuery}
				oninput={(e) => onSearch((e.target as HTMLInputElement).value)}
				placeholder="filter..."
				autocomplete="off"
				spellcheck="false"
			/>
		</div>
		<div class="ata__topbar-right">
			<span class="ata__topbar-clock">{timeStr}</span>
			<span class="ata__topbar-sep">│</span>
			<span class="ata__topbar-date">{dateStr}</span>
			<button class="ata__topbar-settings" onclick={onOpenSettings} title="Settings">⚙</button>
		</div>
	</header>

	<!-- ═══ MAIN GRID ═══ -->
	<div class="ata__body">
		<!-- ─── LEFT SIDEBAR: Service Tree ─── -->
		<aside class="ata__sidebar">
			<AtalayaPanel title="services" count={totalServices}>
				<div class="ata__tree">
					{#each services?.groups || [] as group (group.name)}
						<div class="ata__tree-group">
							<span class="ata__tree-folder">▸ {group.name.toLowerCase()}</span>
							{#each group.services as svc (svc.name)}
								{@const name = (svc.name as string)}
								{@const status = statuses[name] || 'unknown'}
								{@const show = !q || name.toLowerCase().includes(q)}
								{#if show}
									<a href={svc.url as string} target="_blank" rel="noopener" class="ata__tree-item" class:ata__tree-item--online={status === 'online'} class:ata__tree-item--offline={status === 'offline'}>
										<span class="ata__tree-dot" class:ata__tree-dot--on={status === 'online'} class:ata__tree-dot--off={status === 'offline'}></span>
										<span class="ata__tree-name">{name.toLowerCase()}</span>
									</a>
								{/if}
							{/each}
						</div>
					{/each}
				</div>
			</AtalayaPanel>

			{#if filteredBookmarks.length > 0}
				<AtalayaPanel title="bookmarks" count={filteredBookmarks.length}>
					<div class="ata__links">
						{#each filteredBookmarks as bm (bm.name)}
							<a href={bm.url} target="_blank" rel="noopener" class="ata__link">
								<span class="ata__link-arrow">›</span>
								<span class="ata__link-name">{bm.name.toLowerCase()}</span>
							</a>
						{/each}
					</div>
				</AtalayaPanel>
			{/if}
		</aside>

		<!-- ─── CENTER: Main Panels ─── -->
		<main class="ata__center">
			<!-- Identity / Hero -->
			<AtalayaPanel title="system.identity">
				<div class="ata__identity">
					<div class="ata__identity-ascii">
						<span class="ata__identity-v">V</span>
					</div>
					<div class="ata__identity-info">
						<div class="ata__identity-name">{(settings.title as string || 'varodashboard').toLowerCase()}</div>
						<div class="ata__identity-sub">{(settings.subtitle as string || '').toLowerCase()}</div>
						<div class="ata__identity-stats">
							<span>services: <b>{totalServices}</b></span>
							<span>online: <b class="ata__g">{onlineCount}</b></span>
							<span>scripts: <b>{filteredScripts.length}</b></span>
						</div>
					</div>
				</div>
			</AtalayaPanel>

			<!-- Service Cards Grid -->
			<AtalayaPanel title="active.services" count={allServices.length}>
				<div class="ata__svc-grid">
					{#each allServices as svc (svc.name)}
						{@const status = statuses[svc.name as string] || 'unknown'}
						<a href={svc.url as string} target="_blank" rel="noopener" class="ata__svc" class:ata__svc--on={status === 'online'} class:ata__svc--off={status === 'offline'}>
							<div class="ata__svc-top">
								<span class="ata__svc-dot" class:ata__svc-dot--on={status === 'online'} class:ata__svc-dot--off={status === 'offline'}></span>
								<span class="ata__svc-name">{(svc.name as string).toLowerCase()}</span>
							</div>
							<div class="ata__svc-desc">{(svc.description as string || '').toLowerCase()}</div>
							<div class="ata__svc-url">{(svc.url as string || '').replace(/https?:\/\//, '')}</div>
						</a>
					{/each}
				</div>
			</AtalayaPanel>

			<!-- Scripts Panel -->
			{#if filteredScripts.length > 0}
				<AtalayaPanel title="exec.scripts" count={filteredScripts.length}>
					<div class="ata__scripts">
						{#each filteredScripts as script (script.id)}
							<div class="ata__script">
								<span class="ata__script-prompt">$</span>
								<span class="ata__script-name">{(script.name as string).toLowerCase()}</span>
								<span class="ata__script-desc">— {(script.description as string || '').toLowerCase()}</span>
							</div>
						{/each}
					</div>
				</AtalayaPanel>
			{/if}
		</main>

		<!-- ─── RIGHT: Status Panel ─── -->
		<aside class="ata__right">
			<AtalayaPanel title="status.monitor">
				<div class="ata__monitor">
					{#each allServices as svc (svc.name)}
						{@const status = statuses[svc.name as string] || 'unknown'}
						<div class="ata__mon-row">
							<span class="ata__mon-dot" class:ata__mon-dot--on={status === 'online'} class:ata__mon-dot--off={status === 'offline'}></span>
							<span class="ata__mon-name">{(svc.name as string).toLowerCase()}</span>
							<div class="ata__mon-bar">
								<div class="ata__mon-bar-fill" class:ata__mon-bar-fill--on={status === 'online'} class:ata__mon-bar-fill--off={status === 'offline'}></div>
							</div>
							<span class="ata__mon-status" class:ata__mon-status--on={status === 'online'} class:ata__mon-status--off={status === 'offline'}>
								{status === 'online' ? 'ON' : status === 'offline' ? 'OFF' : '---'}
							</span>
						</div>
					{/each}
				</div>
			</AtalayaPanel>

			<AtalayaPanel title="system.info">
				<div class="ata__sysinfo">
					<div class="ata__sys-row"><span class="ata__sys-k">theme</span><span class="ata__sys-v">atalaya</span></div>
					<div class="ata__sys-row"><span class="ata__sys-k">services</span><span class="ata__sys-v">{totalServices}</span></div>
					<div class="ata__sys-row"><span class="ata__sys-k">online</span><span class="ata__sys-v ata__g">{onlineCount}</span></div>
					<div class="ata__sys-row"><span class="ata__sys-k">offline</span><span class="ata__sys-v ata__r">{totalServices - onlineCount}</span></div>
					<div class="ata__sys-row"><span class="ata__sys-k">scripts</span><span class="ata__sys-v">{filteredScripts.length}</span></div>
					<div class="ata__sys-row"><span class="ata__sys-k">bookmarks</span><span class="ata__sys-v">{filteredBookmarks.length}</span></div>
				</div>
			</AtalayaPanel>
		</aside>
	</div>

	<!-- ═══ BOTTOM STATUS BAR ═══ -->
	<footer class="ata__bottombar">
		<span>services: {totalServices}</span>
		<span class="ata__bottombar-sep">│</span>
		<span>online: <span class="ata__g">{onlineCount}</span></span>
		<span class="ata__bottombar-sep">│</span>
		<span>scripts: {filteredScripts.length}</span>
		<span class="ata__bottombar-sep">│</span>
		<span>bookmarks: {filteredBookmarks.length}</span>
		<span class="ata__bottombar-sep">│</span>
		<span class="ata__bottombar-ver">varodashboard v1.0</span>
	</footer>
</div>

<style>
	.ata {
		height: 100vh;
		display: flex;
		flex-direction: column;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		background: #060d1a;
		color: #b8dce8;
		font-size: clamp(0.6rem, 0.5vw + 0.3rem, 0.85rem);
		overflow: hidden;
		background-image:
			radial-gradient(circle, rgba(0,230,200,0.03) 1px, transparent 1px),
			radial-gradient(ellipse at 20% 80%, rgba(0,230,200,0.04) 0%, transparent 50%),
			radial-gradient(ellipse at 80% 20%, rgba(0,255,136,0.02) 0%, transparent 40%);
		background-size: 20px 20px, 100% 100%, 100% 100%;
	}

	/* ═══ TOP BAR ═══ */
	.ata__topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 12px;
		height: 32px;
		background: #050b14;
		border-bottom: 1px solid rgba(0, 230, 200, 0.15);
		flex-shrink: 0;
		position: sticky;
		top: 0;
		z-index: 200;
	}

	.ata__topbar-left, .ata__topbar-right {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.ata__topbar-logo { color: #00e5c8; font-size: 0.8rem; }
	.ata__topbar-brand { color: #00e5c8; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; font-size: 0.6rem; }
	.ata__topbar-sep { color: #1a3545; }
	.ata__topbar-mode { color: #6a98a8; font-size: 0.55rem; letter-spacing: 0.1em; }
	.ata__topbar-search { color: #ffaa00; font-size: 0.55rem; }
	.ata__topbar-clock { color: #00e5c8; font-weight: 700; font-variant-numeric: tabular-nums; letter-spacing: 0.1em; font-size: 0.6rem; }
	.ata__topbar-date { color: #2d5568; font-size: 0.5rem; letter-spacing: 0.08em; }

	.ata__topbar-settings {
		color: #6a98a8;
		font-size: 0.7rem;
		padding: 2px 6px;
		border-radius: 2px;
		transition: all 100ms ease;
	}
	.ata__topbar-settings:hover { color: #00e5c8; background: rgba(0, 230, 200, 0.08); }

	.ata__topbar-center {
		display: flex; align-items: center; gap: 4px;
		flex: 1; max-width: 280px; margin: 0 auto;
	}
	.ata__topbar-prompt { color: #00e5c8; font-size: 0.6rem; }
	.ata__topbar-search-input {
		flex: 1; background: none; border: none; outline: none;
		color: #b8dce8; font-family: 'JetBrains Mono', monospace;
		font-size: 0.55rem; letter-spacing: 0.05em;
	}
	.ata__topbar-search-input::placeholder { color: #1a3545; }

	/* ═══ BODY: 3-column grid ═══ */
	.ata__body {
		flex: 1;
		display: grid;
		grid-template-columns: clamp(160px, 12vw, 260px) 1fr clamp(180px, 14vw, 300px);
		gap: clamp(4px, 0.4vw, 10px);
		padding: clamp(4px, 0.4vw, 10px);
		min-height: 0;
		overflow: hidden;
	}

	/* ═══ SIDEBAR ═══ */
	.ata__sidebar {
		display: flex;
		flex-direction: column;
		gap: 8px;
		overflow-y: auto;
	}

	.ata__tree { display: flex; flex-direction: column; gap: 2px; }

	.ata__tree-group { margin-bottom: 4px; }

	.ata__tree-folder {
		display: block;
		font-size: 0.5rem;
		color: #00e5c8;
		letter-spacing: 0.1em;
		padding: 2px 0;
		font-weight: 600;
	}

	.ata__tree-item {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 2px 0 2px 12px;
		font-size: 0.55rem;
		color: #6a98a8;
		transition: all 100ms ease;
		text-decoration: none;
	}

	.ata__tree-item:hover { color: #b8dce8; background: rgba(0, 230, 200, 0.04); }
	.ata__tree-item--online { color: #8ab8c8; }

	.ata__tree-dot {
		width: 4px; height: 4px; border-radius: 50%;
		background: #2d5568; flex-shrink: 0;
	}
	.ata__tree-dot--on { background: #00ff88; box-shadow: 0 0 4px rgba(0, 255, 136, 0.5); }
	.ata__tree-dot--off { background: #ff3355; }

	.ata__tree-name { font-family: 'JetBrains Mono', monospace; }

	/* Links */
	.ata__links { display: flex; flex-direction: column; gap: 1px; }

	.ata__link {
		display: flex; align-items: center; gap: 4px;
		padding: 2px 0;
		color: #6a98a8;
		font-size: 0.55rem;
		text-decoration: none;
		transition: color 100ms ease;
	}
	.ata__link:hover { color: #00e5c8; }
	.ata__link-arrow { color: #00e5c8; }
	.ata__link-name { font-family: 'JetBrains Mono', monospace; }

	/* ═══ CENTER ═══ */
	.ata__center {
		display: flex;
		flex-direction: column;
		gap: 8px;
		overflow-y: auto;
	}

	/* Identity */
	.ata__identity {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.ata__identity-ascii {
		width: 56px; height: 56px;
		display: flex; align-items: center; justify-content: center;
		border: 1px solid rgba(0, 230, 200, 0.2);
		border-radius: 4px;
		background: rgba(0, 230, 200, 0.04);
		flex-shrink: 0;
	}

	.ata__identity-v {
		font-size: 1.8rem; font-weight: 800;
		background: linear-gradient(135deg, #00e5c8, #00ff88);
		-webkit-background-clip: text; -webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.ata__identity-name { font-size: 1rem; font-weight: 700; color: #b8dce8; letter-spacing: 0.1em; }
	.ata__identity-sub { font-size: 0.5rem; color: #2d5568; letter-spacing: 0.08em; margin-top: 2px; }
	.ata__identity-stats { display: flex; gap: 12px; margin-top: 6px; font-size: 0.55rem; color: #6a98a8; }
	.ata__identity-stats b { color: #b8dce8; }

	/* Service grid */
	.ata__svc-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: 6px;
	}

	.ata__svc {
		display: flex; flex-direction: column; gap: 3px;
		padding: clamp(6px, 0.5vw, 12px) clamp(8px, 0.6vw, 14px);
		background: #0d1925;
		border: 1px solid rgba(0, 230, 200, 0.08);
		border-radius: 3px;
		text-decoration: none;
		color: #b8dce8;
		transition: all 150ms ease;
		position: relative;
		overflow: hidden;
	}

	.ata__svc::before {
		content: '';
		position: absolute; top: 0; left: 0; right: 0; height: 1px;
		background: linear-gradient(90deg, transparent, rgba(0, 230, 200, 0.25), transparent);
	}

	.ata__svc::after {
		content: '';
		position: absolute; bottom: 0; left: 0; height: 2px;
		width: 100%;
		background: linear-gradient(90deg, #00e5c8, #00ff88);
		opacity: 0;
		transition: opacity 150ms ease;
	}

	.ata__svc--on::after { opacity: 0.4; }
	.ata__svc--off::after { opacity: 0; }

	.ata__svc:hover {
		border-color: rgba(0, 230, 200, 0.3);
		background: #0f1e2d;
		box-shadow: 0 0 20px rgba(0, 230, 200, 0.08), inset 0 0 30px rgba(0, 230, 200, 0.02);
	}

	.ata__svc-top { display: flex; align-items: center; gap: 5px; }

	.ata__svc-dot {
		width: 6px; height: 6px; border-radius: 50%;
		background: #2d5568; flex-shrink: 0;
	}
	.ata__svc-dot--on { background: #00ff88; box-shadow: 0 0 6px rgba(0, 255, 136, 0.6); animation: pulse 2s ease infinite; }
	.ata__svc-dot--off { background: #ff3355; box-shadow: 0 0 4px rgba(255, 51, 85, 0.4); }

	@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }

	.ata__svc-name { font-size: clamp(0.55rem, 0.4vw + 0.3rem, 0.75rem); font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
	.ata__svc-desc { font-size: clamp(0.45rem, 0.3vw + 0.25rem, 0.6rem); color: #2d5568; }
	.ata__svc-url { font-size: clamp(0.4rem, 0.25vw + 0.2rem, 0.55rem); color: #1a3545; font-variant-numeric: tabular-nums; }

	/* Scripts */
	.ata__scripts { display: flex; flex-direction: column; gap: 3px; }

	.ata__script {
		display: flex; align-items: baseline; gap: 6px;
		padding: 3px 0;
		font-size: 0.55rem;
	}
	.ata__script-prompt { color: #00e5c8; font-weight: 700; }
	.ata__script-name { color: #b8dce8; font-weight: 600; }
	.ata__script-desc { color: #2d5568; }

	/* ═══ RIGHT SIDEBAR ═══ */
	.ata__right {
		display: flex; flex-direction: column; gap: 8px;
		overflow-y: auto;
	}

	.ata__monitor { display: flex; flex-direction: column; gap: 2px; }

	.ata__mon-row {
		display: flex; align-items: center; gap: 5px;
		padding: 2px 0;
		font-size: 0.5rem;
	}

	.ata__mon-dot { width: 4px; height: 4px; border-radius: 50%; background: #2d5568; flex-shrink: 0; }
	.ata__mon-dot--on { background: #00ff88; box-shadow: 0 0 4px rgba(0, 255, 136, 0.5); }
	.ata__mon-dot--off { background: #ff3355; }

	.ata__mon-bar {
		flex: 1; height: 4px; background: rgba(0,230,200,0.06);
		border-radius: 1px; overflow: hidden; margin: 0 4px;
	}
	.ata__mon-bar-fill {
		height: 100%; width: 30%; background: #2d5568;
		border-radius: 1px; transition: all 300ms ease;
	}
	.ata__mon-bar-fill--on { width: 100%; background: linear-gradient(90deg, #00e5c8, #00ff88); box-shadow: 0 0 4px rgba(0,255,136,0.3); }
	.ata__mon-bar-fill--off { width: 60%; background: linear-gradient(90deg, #ff3355, #ff6644); }

	.ata__mon-name { color: #6a98a8; font-family: 'JetBrains Mono', monospace; white-space: nowrap; }
	.ata__mon-status { font-weight: 700; letter-spacing: 0.1em; color: #2d5568; font-size: 0.45rem; }
	.ata__mon-status--on { color: #00ff88; }
	.ata__mon-status--off { color: #ff3355; }

	/* System info */
	.ata__sysinfo { display: flex; flex-direction: column; gap: 3px; }

	.ata__sys-row {
		display: flex; justify-content: space-between; align-items: center;
		padding: 2px 0;
		font-size: 0.5rem;
		border-bottom: 1px solid rgba(0, 230, 200, 0.04);
	}

	.ata__sys-k { color: #6a98a8; }
	.ata__sys-v { color: #b8dce8; font-weight: 600; font-variant-numeric: tabular-nums; }

	/* Color helpers */
	.ata__g { color: #00ff88 !important; }
	.ata__r { color: #ff3355 !important; }

	/* ═══ BOTTOM BAR ═══ */
	.ata__bottombar {
		display: flex; align-items: center; gap: 8px;
		padding: 0 12px; height: 24px;
		background: #050b14;
		border-top: 1px solid rgba(0, 230, 200, 0.12);
		font-size: 0.48rem; color: #2d5568;
		letter-spacing: 0.08em;
		flex-shrink: 0;
	}

	.ata__bottombar-sep { color: #1a3545; }
	.ata__bottombar-ver { margin-left: auto; color: #1a3545; }

	/* ═══ RESPONSIVE ═══ */
	@media (max-width: 768px) {
		.ata__body { grid-template-columns: 1fr; }
		.ata__sidebar, .ata__right { display: none; }
		.ata__topbar-date, .ata__topbar-mode, .ata__topbar-search { display: none; }
		.ata__svc-grid { grid-template-columns: 1fr 1fr; }
	}
	@media (min-width: 769px) and (max-width: 1200px) {
		.ata__body { grid-template-columns: 1fr clamp(180px, 16vw, 250px); }
		.ata__sidebar { display: none; }
	}
	@media (min-width: 2560px) {
		.ata { background-size: 28px 28px, 100% 100%, 100% 100%; }
		.ata__svc-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
	}
</style>
