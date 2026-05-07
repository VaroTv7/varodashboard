<script lang="ts">
	let { currentTheme = 'dark' }: { currentTheme: string } = $props();

	const themes = [
		{ id: 'dark', name: 'Dark', color: '#1a1f36' },
		{ id: 'light', name: 'Light', color: '#eef0f6' },
		{ id: 'midnight', name: 'Midnight', color: '#0d1321' },
		{ id: 'cyberpunk', name: 'Cyber', color: '#1a0a2e' },
		{ id: 'nord', name: 'Nord', color: '#2e3440' },
		{ id: 'emerald', name: 'Emerald', color: '#0d1f17' },
		{ id: 'varoserver', name: 'VaroServer', color: '#1e1e2e' }
	];

	let isOpen = $state(false);

	async function setTheme(themeId: string) {
		document.documentElement.setAttribute('data-theme', themeId);
		localStorage.setItem('varodashboard-theme', themeId);

		// Persist to config
		try {
			const res = await fetch('/api/config?name=settings');
			const settings = await res.json();
			settings.theme = themeId;
			await fetch('/api/config?name=settings', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(settings)
			});
		} catch {
			// Silently fail — theme still applied locally
		}

		currentTheme = themeId;
		isOpen = false;
	}
</script>

<div class="theme-switcher" id="theme-switcher">
	<button
		class="theme-switcher__trigger"
		onclick={() => (isOpen = !isOpen)}
		title="Switch theme"
		aria-label="Switch theme"
		aria-expanded={isOpen}
	>
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
		</svg>
	</button>

	{#if isOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="theme-switcher__backdrop" onclick={() => (isOpen = false)}></div>
		<div class="theme-switcher__dropdown" role="listbox" aria-label="Theme selection">
			<div class="theme-switcher__label">Theme</div>
			{#each themes as theme (theme.id)}
				<button
					class="theme-switcher__option"
					class:theme-switcher__option--active={currentTheme === theme.id}
					onclick={() => setTheme(theme.id)}
					role="option"
					aria-selected={currentTheme === theme.id}
				>
					<span class="theme-switcher__swatch" style:background={theme.color}></span>
					<span class="theme-switcher__name">{theme.name}</span>
					{#if currentTheme === theme.id}
						<svg class="theme-switcher__check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
							<polyline points="20 6 9 17 4 12" />
						</svg>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.theme-switcher {
		position: relative;
	}

	.theme-switcher__trigger {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: var(--radius-md);
		color: var(--color-text-secondary);
		transition: all var(--transition-fast);
	}

	.theme-switcher__trigger:hover {
		color: var(--color-text);
		background: var(--color-surface-hover);
	}

	.theme-switcher__backdrop {
		position: fixed;
		inset: 0;
		z-index: var(--z-dropdown);
	}

	.theme-switcher__dropdown {
		position: absolute;
		top: calc(100% + var(--space-sm));
		right: 0;
		background: var(--color-surface-solid);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-xl);
		padding: var(--space-sm);
		min-width: 180px;
		z-index: calc(var(--z-dropdown) + 1);
		animation: fadeInScale 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
		transform-origin: top right;
	}

	.theme-switcher__label {
		font-size: var(--font-xs);
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: var(--space-xs) var(--space-sm);
		margin-bottom: var(--space-xs);
	}

	.theme-switcher__option {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		width: 100%;
		padding: var(--space-sm) var(--space-sm);
		border-radius: var(--radius-sm);
		transition: all var(--transition-fast);
		font-size: var(--font-sm);
		color: var(--color-text);
	}

	.theme-switcher__option:hover {
		background: var(--color-surface-hover);
	}

	.theme-switcher__option--active {
		background: var(--color-primary-subtle);
		color: var(--color-primary);
	}

	.theme-switcher__swatch {
		width: 16px;
		height: 16px;
		border-radius: var(--radius-xs);
		border: 1px solid var(--color-border);
		flex-shrink: 0;
	}

	.theme-switcher__name {
		flex: 1;
		text-align: left;
	}

	.theme-switcher__check {
		color: var(--color-primary);
		flex-shrink: 0;
	}
</style>
