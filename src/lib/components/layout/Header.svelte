<script lang="ts">
	import SearchWidget from '$lib/components/widgets/SearchWidget.svelte';
	import ClockWidget from '$lib/components/widgets/ClockWidget.svelte';
	import ThemeSwitcher from '$lib/components/editor/ThemeSwitcher.svelte';

	let {
		settings
	}: {
		settings: Record<string, unknown>;
	} = $props();

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
				<SearchWidget engines={((settings.search as Record<string, unknown>)?.engines || {}) as Record<string, string>} defaultEngine={((settings.search as Record<string, unknown>)?.defaultEngine as string) || 'google'} />
			{/if}
		</div>

		<div class="header__right">
			{#if layout.showClock !== false}
				<ClockWidget />
			{/if}
			<ThemeSwitcher currentTheme={(settings.theme as string) || 'dark'} />
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
