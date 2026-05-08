<script lang="ts">
	import ThemeManager from './ThemeManager.svelte';
	import DesignEditor from './DesignEditor.svelte';

	let {
		isOpen = false,
		settings = {} as Record<string, unknown>,
		onClose = () => {},
		onSettingsChange = (_s: Record<string, unknown>) => {}
	}: {
		isOpen: boolean;
		settings: Record<string, unknown>;
		onClose: () => void;
		onSettingsChange: (s: Record<string, unknown>) => void;
	} = $props();

	let activeTab = $state<'themes' | 'design' | 'layout' | 'general'>('themes');
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;

	const tabs = [
		{ id: 'themes' as const, label: '🎨', name: 'Themes' },
		{ id: 'design' as const, label: '🖌️', name: 'Design' },
		{ id: 'layout' as const, label: '📐', name: 'Layout' },
		{ id: 'general' as const, label: '📝', name: 'General' },
	];

	// Save with debounce
	function saveSettings(updated: Record<string, unknown>) {
		if (saveTimeout) clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			onSettingsChange(updated);
		}, 400);
	}

	// ── Theme handlers ──
	function handleThemeChange(themeId: string) {
		document.documentElement.setAttribute('data-theme', themeId);
		localStorage.setItem('varodashboard-theme', themeId);

		// Apply custom theme vars if it's a custom theme
		const customThemes = (settings.customThemes || []) as Array<{ id: string; vars: Record<string, string> }>;
		const custom = customThemes.find(t => t.id === themeId);
		// Clear previous overrides
		const el = document.documentElement;
		el.removeAttribute('style');
		if (custom) {
			for (const [k, v] of Object.entries(custom.vars)) {
				el.style.setProperty(k, v);
			}
		}

		saveSettings({ ...settings, theme: themeId });
	}

	function handleCustomThemeSave(themes: Array<{ id: string; name: string; vars: Record<string, string> }>) {
		saveSettings({ ...settings, customThemes: themes });
	}

	// ── Design handlers ──
	function handleVarChange(key: string, value: string) {
		if (key === '__reset__') {
			saveSettings({ ...settings, customTheme: {} });
			return;
		}
		const customTheme = ((settings.customTheme || {}) as Record<string, string>);
		customTheme[key] = value;
		saveSettings({ ...settings, customTheme });
	}

	// ── Layout handlers ──
	function toggleLayout(key: string) {
		const layout = { ...(settings.layout as Record<string, unknown> || {}) };
		layout[key] = !(layout[key] !== false);
		saveSettings({ ...settings, layout });
	}

	function setColumns(val: string) {
		const layout = { ...(settings.layout as Record<string, unknown> || {}) };
		layout.columns = val;
		saveSettings({ ...settings, layout });
	}

	// ── General handlers ──
	function updateGeneral(key: string, value: string) {
		saveSettings({ ...settings, [key]: value });
	}

	// Derived layout for template
	const layout = $derived((settings.layout || {}) as Record<string, unknown>);

	// Escape to close
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) onClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="sp__backdrop" onclick={onClose}></div>

	<aside class="sp" id="settings-panel">
		<!-- Header -->
		<div class="sp__header">
			<h2 class="sp__title">Settings</h2>
			<button class="sp__close" onclick={onClose} aria-label="Close settings">✕</button>
		</div>

		<!-- Tabs -->
		<div class="sp__tabs">
			{#each tabs as tab (tab.id)}
				<button
					class="sp__tab"
					class:sp__tab--active={activeTab === tab.id}
					onclick={() => (activeTab = tab.id)}
					title={tab.name}
				>
					<span class="sp__tab-icon">{tab.label}</span>
					<span class="sp__tab-name">{tab.name}</span>
				</button>
			{/each}
		</div>

		<!-- Content -->
		<div class="sp__content">
			{#if activeTab === 'themes'}
				<ThemeManager
					currentTheme={(settings.theme as string) || 'dark'}
					customThemes={(settings.customThemes || []) as Array<{ id: string; name: string; vars: Record<string, string> }>}
					onThemeChange={handleThemeChange}
					onCustomThemeSave={handleCustomThemeSave}
				/>

			{:else if activeTab === 'design'}
				<DesignEditor onVarChange={handleVarChange} />

			{:else if activeTab === 'layout'}
				<div class="sp__layout">
					<div class="sp__label">VISIBILITY</div>
					{#each [
						{ key: 'showHeader', label: 'Show Header' },
						{ key: 'showSearch', label: 'Show Search Bar' },
						{ key: 'showClock', label: 'Show Clock' },
						{ key: 'showGreeting', label: 'Show Greeting' },
						{ key: 'groupsCollapsible', label: 'Collapsible Groups' },
					] as opt (opt.key)}
						<label class="sp__toggle">
							<span class="sp__toggle-label">{opt.label}</span>
							<button
								class="sp__switch"
								class:sp__switch--on={layout[opt.key] !== false}
								onclick={() => toggleLayout(opt.key)}
								role="switch"
								aria-checked={layout[opt.key] !== false}
							>
								<span class="sp__switch-thumb"></span>
							</button>
						</label>
					{/each}

					<div class="sp__label" style="margin-top: var(--space-md);">GRID COLUMNS</div>
					<div class="sp__columns">
						{#each ['auto', '2', '3', '4', '5'] as col (col)}
							<button
								class="sp__col-btn"
								class:sp__col-btn--active={(layout.columns || 'auto') === col}
								onclick={() => setColumns(col)}
							>
								{col === 'auto' ? 'Auto' : col}
							</button>
						{/each}
					</div>
				</div>

			{:else if activeTab === 'general'}
				<div class="sp__general">
					<div class="sp__label">DASHBOARD IDENTITY</div>
					<div class="sp__field">
						<label class="sp__field-label" for="settings-title">Title</label>
						<input
							id="settings-title"
							class="sp__field-input"
							value={(settings.title as string) || ''}
							oninput={(e) => updateGeneral('title', (e.target as HTMLInputElement).value)}
							placeholder="VaroDashboard"
						/>
					</div>
					<div class="sp__field">
						<label class="sp__field-label" for="settings-subtitle">Subtitle</label>
						<input
							id="settings-subtitle"
							class="sp__field-input"
							value={(settings.subtitle as string) || ''}
							oninput={(e) => updateGeneral('subtitle', (e.target as HTMLInputElement).value)}
							placeholder="Your Command Center"
						/>
					</div>
				</div>
			{/if}
		</div>
	</aside>
{/if}

<style>
	.sp__backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: var(--z-modal-backdrop);
		animation: fadeIn 200ms ease;
	}

	.sp {
		position: fixed;
		top: 0;
		right: 0;
		width: 340px;
		max-width: 90vw;
		height: 100vh;
		background: var(--color-surface-solid);
		border-left: 1px solid var(--color-border);
		z-index: var(--z-modal);
		display: flex;
		flex-direction: column;
		animation: slideInRight 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
		box-shadow: -8px 0 32px rgba(0, 0, 0, 0.3);
	}

	@keyframes slideInRight {
		from { transform: translateX(100%); }
		to { transform: translateX(0); }
	}

	.sp__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-md) var(--space-lg);
		border-bottom: 1px solid var(--color-border);
		flex-shrink: 0;
	}

	.sp__title {
		font-size: var(--font-lg);
		font-weight: 700;
		color: var(--color-text);
	}

	.sp__close {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		font-size: var(--font-sm);
		transition: all var(--transition-fast);
	}

	.sp__close:hover {
		background: var(--color-surface-hover);
		color: var(--color-text);
	}

	.sp__tabs {
		display: flex;
		border-bottom: 1px solid var(--color-border);
		flex-shrink: 0;
		padding: 0 var(--space-sm);
	}

	.sp__tab {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 10px 4px 8px;
		border-bottom: 2px solid transparent;
		transition: all var(--transition-fast);
		color: var(--color-text-muted);
	}

	.sp__tab:hover { color: var(--color-text); }

	.sp__tab--active {
		color: var(--color-primary);
		border-bottom-color: var(--color-primary);
	}

	.sp__tab-icon { font-size: 1rem; }
	.sp__tab-name { font-size: 0.6rem; font-weight: 500; letter-spacing: 0.02em; }

	.sp__content {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-md) var(--space-lg);
	}

	/* Layout tab */
	.sp__label {
		font-size: 0.6rem;
		font-weight: 600;
		color: var(--color-text-muted);
		letter-spacing: 0.1em;
		margin-bottom: var(--space-sm);
	}

	.sp__toggle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 0;
		cursor: pointer;
	}

	.sp__toggle-label {
		font-size: var(--font-sm);
		color: var(--color-text);
	}

	.sp__switch {
		width: 36px;
		height: 20px;
		border-radius: 10px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		position: relative;
		transition: all var(--transition-fast);
		flex-shrink: 0;
	}

	.sp__switch--on {
		background: var(--color-primary);
		border-color: var(--color-primary);
	}

	.sp__switch-thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: white;
		transition: transform var(--transition-fast);
		box-shadow: 0 1px 3px rgba(0,0,0,0.3);
	}

	.sp__switch--on .sp__switch-thumb {
		transform: translateX(16px);
	}

	.sp__columns {
		display: flex;
		gap: 4px;
	}

	.sp__col-btn {
		flex: 1;
		padding: 6px 0;
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
		color: var(--color-text-secondary);
		font-size: var(--font-sm);
		transition: all var(--transition-fast);
	}

	.sp__col-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.sp__col-btn--active {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
		font-weight: 600;
	}

	/* General tab */
	.sp__general {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.sp__field {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.sp__field-label {
		font-size: var(--font-sm);
		color: var(--color-text-secondary);
		font-weight: 500;
	}

	.sp__field-input {
		padding: 8px 12px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		font-size: var(--font-sm);
		outline: none;
		transition: border-color var(--transition-fast);
	}

	.sp__field-input:focus {
		border-color: var(--color-primary);
	}

	@media (max-width: 480px) {
		.sp { width: 100vw; }
	}
</style>
