<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import ServiceTile from '$lib/components/tiles/ServiceTile.svelte';
	import ScriptTile from '$lib/components/tiles/ScriptTile.svelte';
	import BookmarkTile from '$lib/components/tiles/BookmarkTile.svelte';
	import SettingsPanel from '$lib/components/editor/SettingsPanel.svelte';
	import AtalayaLayout from '$lib/components/layouts/AtalayaLayout.svelte';
	import GlitchCoreLayout from '$lib/components/layouts/GlitchCoreLayout.svelte';
	import QuantumLayout from '$lib/components/layouts/QuantumLayout.svelte';
	import WarcraftLayout from '$lib/components/layouts/WarcraftLayout.svelte';
	import CyberdeckLayout from '$lib/components/layouts/CyberdeckLayout.svelte';
	import BioHazardLayout from '$lib/components/layouts/BioHazardLayout.svelte';
	import NeonTokyoLayout from '$lib/components/layouts/NeonTokyoLayout.svelte';
	import { telemetry } from '$lib/stores/telemetry.svelte';
	import { onMount, onDestroy } from 'svelte';

	// Start telemetry
	onMount(() => {
		telemetry.start();
	});
	onDestroy(() => {
		telemetry.stop();
	});

	// Active theme detection
	const activeTheme = $derived((settings.theme as string) || 'dark');
	const isAtalaya = $derived(activeTheme === 'atalaya');
	const isGlitchCore = $derived(activeTheme === 'glitchcore');
	const isQuantum = $derived(activeTheme === 'quantum');
	const isWarcraft = $derived(activeTheme === 'warcraft');
	const isCyberdeck = $derived(activeTheme === 'cyberdeck');
	const isBioHazard = $derived(activeTheme === 'biohazard');
	const isNeonTokyo = $derived(activeTheme === 'neontokyo');

	let { data } = $props();

	let settings = $state(data.settings as Record<string, unknown>);
	const services = $derived(data.services as { groups: Array<{ name: string; icon: string; collapsed?: boolean; services: Array<Record<string, unknown>> }> });
	const bookmarks = $derived(data.bookmarks as { groups: Array<{ name: string; icon: string; bookmarks: Array<{ name: string; url: string; icon?: string }> }> });
	const scripts = $derived(data.scripts as { scripts: Array<Record<string, unknown>> });

	// ── Search / filter ──
	let searchQuery = $state('');
	const queryLower = $derived(searchQuery.toLowerCase());

	// Filter services in real-time
	const filteredServiceGroups = $derived(
		(services?.groups || []).map(group => ({
			...group,
			services: group.services.filter(svc => {
				if (!queryLower) return true;
				const name = ((svc.name as string) || '').toLowerCase();
				const desc = ((svc.description as string) || '').toLowerCase();
				return name.includes(queryLower) || desc.includes(queryLower);
			})
		})).filter(group => group.services.length > 0)
	);

	// Filter scripts in real-time
	const filteredScripts = $derived(
		(scripts?.scripts || []).filter(s => {
			if (!queryLower) return true;
			const name = ((s.name as string) || '').toLowerCase();
			const desc = ((s.description as string) || '').toLowerCase();
			return name.includes(queryLower) || desc.includes(queryLower);
		})
	);

	// Filter bookmarks in real-time
	const filteredBookmarkGroups = $derived(
		(bookmarks?.groups || []).map(group => ({
			...group,
			bookmarks: group.bookmarks.filter(b => {
				if (!queryLower) return true;
				return b.name.toLowerCase().includes(queryLower) || b.url.toLowerCase().includes(queryLower);
			})
		})).filter(group => group.bookmarks.length > 0)
	);

	// ── Settings panel ──
	let settingsOpen = $state(false);

	async function handleSettingsChange(updated: Record<string, unknown>) {
		settings = updated;
		try {
			await fetch('/api/config?name=settings', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updated)
			});
		} catch { /* silent */ }
	}

	// ── Service status tracking ──
	let statuses = $state<Record<string, string>>({});
	let collapsedGroups = $state<Record<string, boolean>>({});

	// Init collapsed state from config
	$effect(() => {
		if (services?.groups) {
			for (const group of services.groups) {
				if (group.collapsed) {
					collapsedGroups[group.name] = true;
				}
			}
		}
	});

	// Check service statuses
	$effect(() => {
		if (!services?.groups) return;

		const allServices: Array<{ name: string; url: string }> = [];
		for (const group of services.groups) {
			for (const svc of group.services) {
				if (svc.statusCheck) {
					allServices.push({ name: svc.name as string, url: svc.url as string });
				}
			}
		}

		if (allServices.length === 0) return;

		async function checkStatuses() {
			try {
				const res = await fetch('/api/status', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ services: allServices })
				});
				const results = await res.json();

				for (const [name, result] of Object.entries(results)) {
					const r = result as { online: boolean };
					statuses[name] = r.online ? 'online' : 'offline';
				}
			} catch {
				// Silently fail
			}
		}

		checkStatuses();
		const interval = setInterval(checkStatuses, 30000);
		return () => clearInterval(interval);
	});

	function toggleGroup(name: string) {
		collapsedGroups[name] = !collapsedGroups[name];
	}

	// Greeting based on time of day
	const greeting = $derived(() => {
		const hour = new Date().getHours();
		if (hour < 6) return '🌙 Good Night';
		if (hour < 12) return '☀️ Good Morning';
		if (hour < 18) return '🌤️ Good Afternoon';
		return '🌆 Good Evening';
	});

	// Result count for search feedback
	const totalResults = $derived(
		filteredServiceGroups.reduce((sum, g) => sum + g.services.length, 0) +
		filteredScripts.length +
		filteredBookmarkGroups.reduce((sum, g) => sum + g.bookmarks.length, 0)
	);
</script>

{#if isAtalaya}
	<AtalayaLayout
		{settings}
		{services}
		{scripts}
		{bookmarks}
		{statuses}
		{searchQuery}
		onOpenSettings={() => settingsOpen = true}
		onSearch={(q) => searchQuery = q}
	/>
{:else if isGlitchCore}
	<GlitchCoreLayout
		{settings}
		{services}
		{scripts}
		{bookmarks}
		{statuses}
		{searchQuery}
		onOpenSettings={() => settingsOpen = true}
		onSearch={(q) => searchQuery = q}
	/>
{:else if isQuantum}
	<QuantumLayout
		{settings}
		{services}
		{scripts}
		{bookmarks}
		{statuses}
		{searchQuery}
		onOpenSettings={() => settingsOpen = true}
		onSearch={(q) => searchQuery = q}
	/>
{:else if isWarcraft}
	<WarcraftLayout
		{settings}
		{services}
		{scripts}
		{statuses}
		onOpenSettings={() => settingsOpen = true}
	/>
{:else if isCyberdeck}
	<CyberdeckLayout
		{settings}
		{services}
		{scripts}
		{statuses}
		onOpenSettings={() => settingsOpen = true}
	/>
{:else if isBioHazard}
	<BioHazardLayout
		{settings}
		{services}
		{scripts}
		{statuses}
		onOpenSettings={() => settingsOpen = true}
	/>
{:else if isNeonTokyo}
	<NeonTokyoLayout
		{settings}
		{services}
		{scripts}
		{statuses}
		onOpenSettings={() => settingsOpen = true}
	/>
{:else}
<div class="dashboard">
	<Header {settings} {services} onSearch={(q) => searchQuery = q} onOpenSettings={() => settingsOpen = true} />

	<main class="dashboard__main">
		<div class="dashboard__content">
			<!-- Greeting -->
			{#if (settings.layout as Record<string, boolean>)?.showGreeting !== false && !searchQuery}
				<div class="dashboard__greeting" style="animation: fadeIn 600ms ease both">
					<h2 class="dashboard__greeting-text">{greeting()}</h2>
				</div>
			{/if}

			<!-- Search result indicator -->
			{#if searchQuery}
				<div class="dashboard__search-info" style="animation: fadeIn 150ms ease both">
					<span class="dashboard__search-count">{totalResults} result{totalResults !== 1 ? 's' : ''}</span>
					<span class="dashboard__search-query">for "{searchQuery}"</span>
				</div>
			{/if}

			<!-- Service Groups -->
			{#if filteredServiceGroups.length > 0}
				{#each filteredServiceGroups as group, groupIdx (group.name)}
					<section
						class="dashboard__section"
						style="animation: slideInUp {400 + groupIdx * 100}ms cubic-bezier(0.34, 1.56, 0.64, 1) both"
					>
						<button
							class="dashboard__section-header"
							onclick={() => toggleGroup(group.name)}
							aria-expanded={!collapsedGroups[group.name]}
						>
							<div class="dashboard__section-title-wrap">
								<span class="dashboard__section-icon">
									{#if group.icon === 'play-circle'}▶{:else if group.icon === 'server'}⚙{:else if group.icon === 'wrench'}🔧{:else}📁{/if}
								</span>
								<h3 class="dashboard__section-title">{group.name}</h3>
								<span class="dashboard__section-count">{group.services.length}</span>
							</div>
							<svg
								class="dashboard__section-chevron"
								class:dashboard__section-chevron--collapsed={collapsedGroups[group.name]}
								width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
							>
								<polyline points="6 9 12 15 18 9" />
							</svg>
						</button>

						{#if !collapsedGroups[group.name]}
							<div class="dashboard__grid">
								{#each group.services as service, svcIdx (service.name)}
									<div style="animation: fadeIn {200 + svcIdx * 80}ms ease both">
										<ServiceTile
											service={service as { name: string; url: string; icon: string; color?: string; description?: string; statusCheck?: boolean; openInNewTab?: boolean }}
											status={statuses[service.name as string] || 'unknown'}
										/>
									</div>
								{/each}
							</div>
						{/if}
					</section>
				{/each}
			{/if}

			<!-- Scripts Section -->
			{#if filteredScripts.length > 0}
				<section
					class="dashboard__section"
					style="animation: slideInUp {400 + (filteredServiceGroups.length || 0) * 100}ms cubic-bezier(0.34, 1.56, 0.64, 1) both"
				>
					<button
						class="dashboard__section-header"
						onclick={() => toggleGroup('__scripts')}
						aria-expanded={!collapsedGroups['__scripts']}
					>
						<div class="dashboard__section-title-wrap">
							<span class="dashboard__section-icon">⚡</span>
							<h3 class="dashboard__section-title">Scripts</h3>
							<span class="dashboard__section-count">{filteredScripts.length}</span>
						</div>
						<svg
							class="dashboard__section-chevron"
							class:dashboard__section-chevron--collapsed={collapsedGroups['__scripts']}
							width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
						>
							<polyline points="6 9 12 15 18 9" />
						</svg>
					</button>

					{#if !collapsedGroups['__scripts']}
						<div class="dashboard__grid">
							{#each filteredScripts as script (script.id)}
								<ScriptTile script={script as { id: string; name: string; description: string; icon: string; color?: string; parameters: Array<{ name: string; label: string; type: string; required: boolean; placeholder?: string }>; confirm?: boolean }} />
							{/each}
						</div>
					{/if}
				</section>
			{/if}

			<!-- Bookmarks Section -->
			{#if filteredBookmarkGroups.length > 0}
				<section
					class="dashboard__section"
					style="animation: slideInUp {500 + (filteredServiceGroups.length || 0) * 100}ms cubic-bezier(0.34, 1.56, 0.64, 1) both"
				>
					<div class="dashboard__section-header dashboard__section-header--static">
						<div class="dashboard__section-title-wrap">
							<span class="dashboard__section-icon">🔖</span>
							<h3 class="dashboard__section-title">Bookmarks</h3>
						</div>
					</div>

					<div class="dashboard__bookmarks-grid">
						{#each filteredBookmarkGroups as group (group.name)}
							<div class="dashboard__bookmark-group">
								<h4 class="dashboard__bookmark-group-title">{group.name}</h4>
								<div class="dashboard__bookmark-list">
									{#each group.bookmarks as bookmark (bookmark.name)}
										<BookmarkTile {bookmark} />
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</section>
			{/if}

			<!-- Empty search state -->
			{#if searchQuery && totalResults === 0}
				<div class="dashboard__empty">
					<span class="dashboard__empty-icon">🔍</span>
					<p class="dashboard__empty-text">No results for "{searchQuery}"</p>
				</div>
			{/if}
		</div>
	</main>

	<!-- Footer -->
	<footer class="dashboard__footer">
		<span class="dashboard__footer-text">
			VaroDashboard — <a href="https://github.com/VaroTv7/varodashboard" target="_blank" rel="noopener noreferrer" class="dashboard__footer-link">Open Source</a>
		</span>
	</footer>
</div>
{/if}

<!-- Settings Panel -->
<SettingsPanel
	isOpen={settingsOpen}
	{settings}
	onClose={() => settingsOpen = false}
	onSettingsChange={handleSettingsChange}
/>

<style>
	.dashboard {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.dashboard__main {
		flex: 1;
		padding: var(--space-xl) var(--space-xl) var(--space-3xl);
	}

	.dashboard__content {
		max-width: var(--content-max-width);
		margin: 0 auto;
	}

	/* Greeting */
	.dashboard__greeting {
		margin-bottom: var(--space-xl);
		padding: var(--space-md) 0;
	}

	.dashboard__greeting-text {
		font-size: var(--font-2xl);
		font-weight: 700;
		color: var(--color-text);
		letter-spacing: -0.03em;
	}

	/* Search results info */
	.dashboard__search-info {
		display: flex;
		align-items: baseline;
		gap: var(--space-sm);
		margin-bottom: var(--space-lg);
		padding: var(--space-sm) 0;
	}

	.dashboard__search-count {
		font-size: var(--font-md);
		font-weight: 600;
		color: var(--color-primary);
	}

	.dashboard__search-query {
		font-size: var(--font-sm);
		color: var(--color-text-muted);
	}

	/* Sections */
	.dashboard__section {
		margin-bottom: var(--space-xl);
	}

	.dashboard__section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--space-sm) var(--space-xs);
		margin-bottom: var(--space-md);
		border-radius: var(--radius-sm);
		transition: all var(--transition-fast);
		cursor: pointer;
	}

	.dashboard__section-header:hover {
		background: var(--color-primary-subtle);
	}

	.dashboard__section-header--static {
		cursor: default;
	}

	.dashboard__section-header--static:hover {
		background: transparent;
	}

	.dashboard__section-title-wrap {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.dashboard__section-icon {
		font-size: var(--font-md);
	}

	.dashboard__section-title {
		font-size: var(--font-md);
		font-weight: 600;
		color: var(--color-text);
		letter-spacing: -0.01em;
	}

	.dashboard__section-count {
		font-size: var(--font-xs);
		color: var(--color-text-muted);
		background: var(--color-surface);
		padding: 1px 8px;
		border-radius: var(--radius-full);
		font-weight: 500;
	}

	.dashboard__section-chevron {
		color: var(--color-text-muted);
		transition: transform var(--transition-normal);
	}

	.dashboard__section-chevron--collapsed {
		transform: rotate(-90deg);
	}

	/* Service Grid */
	.dashboard__grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(var(--tile-min-width), 1fr));
		gap: var(--tile-gap);
	}

	/* Bookmarks Grid */
	.dashboard__bookmarks-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: var(--space-lg);
	}

	.dashboard__bookmark-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.dashboard__bookmark-group-title {
		font-size: var(--font-sm);
		font-weight: 600;
		color: var(--color-text-secondary);
		padding-left: var(--space-xs);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.dashboard__bookmark-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	/* Empty state */
	.dashboard__empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-3xl) var(--space-xl);
		color: var(--color-text-muted);
	}

	.dashboard__empty-icon {
		font-size: 2rem;
		margin-bottom: var(--space-md);
		opacity: 0.5;
	}

	.dashboard__empty-text {
		font-size: var(--font-md);
	}

	/* Footer */
	.dashboard__footer {
		padding: var(--space-lg) var(--space-xl);
		text-align: center;
		border-top: 1px solid var(--color-border);
	}

	.dashboard__footer-text {
		font-size: var(--font-xs);
		color: var(--color-text-muted);
	}

	.dashboard__footer-link {
		color: var(--color-primary);
		transition: color var(--transition-fast);
	}

	.dashboard__footer-link:hover {
		color: var(--color-primary-hover);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.dashboard__main {
			padding: var(--space-md);
		}

		.dashboard__greeting-text {
			font-size: var(--font-xl);
		}

		.dashboard__grid {
			grid-template-columns: 1fr;
		}

		.dashboard__bookmarks-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 480px) {
		.dashboard__main {
			padding: var(--space-sm);
		}
	}
</style>
