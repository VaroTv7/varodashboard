<script lang="ts">
		import SearchWidget from '$lib/components/widgets/SearchWidget.svelte';
	import ClockWidget from '$lib/components/widgets/ClockWidget.svelte';
	import FleetControl from '$lib/components/tiles/FleetControl.svelte';

	let {
		settings,
		services = { groups: [] },
		onSearch = (_q: string) => {},
		onOpenSettings = () => {},
	}: {
		settings: Record<string, unknown>;
		services: { groups: Array<{ services: Array<Record<string, unknown>> }> };
		onSearch: (query: string) => void;
		onOpenSettings: () => void;
	} = $props();

	const allContainers = $derived(
		(services?.groups || [])
			.flatMap(g => g.services)
			.filter(s => s.containerName)
			.map(s => s.containerName as string)
	);

	const layout = $derived((settings.layout as Record<string, boolean>) || {});
</script>

<header class="header" id="dashboard-header">
	<div class="header__inner">
		<div class="header__left">
			<div class="header__brand">
				<div class="header__logo">
					<svg width="28" height="28" viewBox="0 0 64 64" fill="none">
						<defs>
							<linearGradient id="logo-g" x1="0%" y1="0%" x2="100%" y2="100%">
								<stop offset="0%" style="stop-color: var(--color-primary)" />
								<stop offset="100%" style="stop-color: var(--color-accent)" />
							</linearGradient>
						</defs>
						<rect width="64" height="64" rx="14" fill="url(#logo-g)" />
						<text x="32" y="44" font-family="Inter,sans-serif" font-weight="800" font-size="36" fill="white" text-anchor="middle">V</text>
					</svg>
				</div>
				<div class="header__titles">
					<h1 class="header__title">{settings.title || 'VaroDashboard'}</h1>
					{#if settings.subtitle}
						<span class="header__subtitle">{settings.subtitle}</span>
					{/if}
				</div>
			</div>
		</div>

		<div class="header__center">
			{#if layout.showSearch !== false}
				<SearchWidget onSearch={onSearch} />
			{/if}
		</div>

		<div class="header__right">
			{#if allContainers.length > 0}
				<div class="header__fleet">
					<FleetControl containers={allContainers} groupName="GLOBAL" />
				</div>
			{/if}
			{#if layout.showClock !== false}
				<ClockWidget />
			{/if}
			<button
				class="header__settings-btn"
				onclick={onOpenSettings}
				aria-label="Open settings"
				title="Settings"
				id="settings-trigger"
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="3" />
					<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
				</svg>
			</button>
		</div>
	</div>
</header>

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
		background: var(--glass-bg);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		border-bottom: 1px solid var(--glass-border);
		padding: 0 var(--space-xl);
		height: var(--header-height);
	}

	.header__inner {
		max-width: var(--content-max-width);
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100%;
		gap: var(--space-lg);
	}

	.header__left {
		flex-shrink: 0;
	}

	.header__brand {
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}

	.header__logo {
		display: flex;
		align-items: center;
		transition: transform var(--transition-spring);
	}

	.header__logo:hover {
		transform: rotate(-5deg) scale(1.05);
	}

	.header__titles {
		display: flex;
		flex-direction: column;
	}

	.header__title {
		font-size: var(--font-lg);
		font-weight: 700;
		color: var(--color-text);
		letter-spacing: -0.02em;
		line-height: 1.2;
	}

	.header__subtitle {
		font-size: var(--font-xs);
		color: var(--color-text-muted);
		font-weight: 400;
		letter-spacing: 0.02em;
	}

	.header__center {
		flex: 1;
		max-width: 520px;
		display: flex;
		justify-content: center;
	}

	.header__right {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}

	.header__fleet {
		margin-right: var(--space-sm);
	}

	.header__settings-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: var(--radius-md);
		color: var(--color-text-secondary);
		transition: all var(--transition-fast);
	}

	.header__settings-btn:hover {
		color: var(--color-primary);
		background: var(--color-primary-subtle);
		transform: rotate(30deg);
	}

	@media (max-width: 768px) {
		.header {
			padding: 0 var(--space-md);
		}

		.header__subtitle,
		.header__center {
			display: none;
		}

		.header__title {
			font-size: var(--font-base);
		}
	}
</style>
