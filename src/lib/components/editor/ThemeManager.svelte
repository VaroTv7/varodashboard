<script lang="ts">
	let {
		currentTheme = 'dark',
		customThemes = [] as Array<{ id: string; name: string; vars: Record<string, string> }>,
		onThemeChange = (_id: string) => {},
		onCustomThemeSave = (_themes: Array<{ id: string; name: string; vars: Record<string, string> }>) => {},
	}: {
		currentTheme: string;
		customThemes: Array<{ id: string; name: string; vars: Record<string, string> }>;
		onThemeChange: (id: string) => void;
		onCustomThemeSave: (themes: Array<{ id: string; name: string; vars: Record<string, string> }>) => void;
	} = $props();

	const builtinThemes = [
		{ id: 'dark', name: 'Dark', bg: '#0a0e1a', primary: '#7b8cde' },
		{ id: 'light', name: 'Light', bg: '#eef0f6', primary: '#5b6abf' },
		{ id: 'midnight', name: 'Midnight', bg: '#0d1321', primary: '#5580c2' },
		{ id: 'cyberpunk', name: 'Cyberpunk', bg: '#1a0a2e', primary: '#ff3399' },
		{ id: 'nord', name: 'Nord', bg: '#2e3440', primary: '#6b88a3' },
		{ id: 'emerald', name: 'Emerald', bg: '#0d1f17', primary: '#32b87a' },
		{ id: 'varoserver', name: 'VaroServer', bg: '#1e1e2e', primary: '#cba6f7' },
		{ id: 'atalaya', name: 'Atalaya', bg: '#060d1a', primary: '#00e5c8' },
		{ id: 'glitchcore', name: 'Glitch-Core', bg: '#050014', primary: '#39ff14' },
		{ id: 'quantum', name: 'Quantum', bg: '#000000', primary: '#dfbbff' },
		{ id: 'warcraft', name: 'Warcraft III', bg: '#08080f', primary: '#fcd312' },
		{ id: 'cyberdeck', name: 'Cyberdeck', bg: '#0d0202', primary: '#ff3e00' },
		{ id: 'biohazard', name: 'Bio-Hazard', bg: '#0a0a05', primary: '#ffcc00' },
		{ id: 'neontokyo', name: 'Neon-Tokyo', bg: '#050510', primary: '#ff00ff' },
	];

	let showNewForm = $state(false);
	let newThemeName = $state('');

	function createTheme() {
		if (!newThemeName.trim()) return;
		const id = newThemeName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
		if (builtinThemes.some(t => t.id === id) || customThemes.some(t => t.id === id)) return;

		// Capture current computed CSS variables as base
		const style = getComputedStyle(document.documentElement);
		const vars: Record<string, string> = {};
		const keys = ['--color-bg', '--color-surface', '--color-primary', '--color-accent', '--color-text', '--color-text-secondary', '--color-success', '--color-error', '--color-warning'];
		for (const key of keys) {
			const val = style.getPropertyValue(key).trim();
			if (val) vars[key] = val;
		}

		const updated = [...customThemes, { id, name: newThemeName.trim(), vars }];
		onCustomThemeSave(updated);
		newThemeName = '';
		showNewForm = false;
	}

	function deleteTheme(id: string) {
		const updated = customThemes.filter(t => t.id !== id);
		onCustomThemeSave(updated);
		if (currentTheme === id) onThemeChange('dark');
	}

	function duplicateTheme(source: { id: string; name: string; vars?: Record<string, string> }) {
		const id = source.id + '-copy-' + Date.now().toString(36);
		const vars = source.vars ? { ...source.vars } : {};
		const updated = [...customThemes, { id, name: source.name + ' Copy', vars }];
		onCustomThemeSave(updated);
	}
</script>

<div class="tm">
	<div class="tm__label">BUILT-IN THEMES</div>
	<div class="tm__grid">
		{#each builtinThemes as theme (theme.id)}
			<button
				class="tm__card"
				class:tm__card--active={currentTheme === theme.id}
				onclick={() => onThemeChange(theme.id)}
			>
				<div class="tm__swatch">
					<div class="tm__swatch-bg" style:background={theme.bg}></div>
					<div class="tm__swatch-dot" style:background={theme.primary}></div>
				</div>
				<span class="tm__name">{theme.name}</span>
				{#if currentTheme === theme.id}
					<svg class="tm__check" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12" /></svg>
				{/if}
			</button>
		{/each}
	</div>

	{#if customThemes.length > 0}
		<div class="tm__label" style="margin-top: var(--space-md);">CUSTOM THEMES</div>
		<div class="tm__grid">
			{#each customThemes as theme (theme.id)}
				<div class="tm__card-wrap">
					<button
						class="tm__card"
						class:tm__card--active={currentTheme === theme.id}
						onclick={() => onThemeChange(theme.id)}
					>
						<div class="tm__swatch">
							<div class="tm__swatch-bg" style:background={theme.vars['--color-bg'] || '#1a1a2e'}></div>
							<div class="tm__swatch-dot" style:background={theme.vars['--color-primary'] || '#7b8cde'}></div>
						</div>
						<span class="tm__name">{theme.name}</span>
						{#if currentTheme === theme.id}
							<svg class="tm__check" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12" /></svg>
						{/if}
					</button>
					<div class="tm__actions">
						<button class="tm__action" onclick={() => duplicateTheme(theme)} title="Duplicate">⧉</button>
						<button class="tm__action tm__action--danger" onclick={() => deleteTheme(theme.id)} title="Delete">✕</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<div class="tm__new">
		{#if showNewForm}
			<div class="tm__new-form">
				<input
					class="tm__new-input"
					bind:value={newThemeName}
					placeholder="Theme name..."
					onkeydown={(e) => { if (e.key === 'Enter') createTheme(); if (e.key === 'Escape') showNewForm = false; }}
				/>
				<button class="tm__new-save" onclick={createTheme}>Create</button>
				<button class="tm__new-cancel" onclick={() => { showNewForm = false; newThemeName = ''; }}>✕</button>
			</div>
		{:else}
			<button class="tm__new-btn" onclick={() => (showNewForm = true)}>
				<span>+</span> New Theme
			</button>
		{/if}
	</div>
</div>

<style>
	.tm__label {
		font-size: 0.6rem;
		font-weight: 600;
		color: var(--color-text-muted);
		letter-spacing: 0.1em;
		margin-bottom: var(--space-sm);
	}

	.tm__grid {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.tm__card-wrap {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.tm__card {
		flex: 1;
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: 8px 10px;
		border-radius: var(--radius-sm);
		transition: all var(--transition-fast);
		min-width: 0;
	}

	.tm__card:hover { background: var(--color-surface-hover); }
	.tm__card--active {
		background: var(--color-primary-subtle);
		outline: 1px solid var(--color-primary);
	}

	.tm__swatch {
		width: 28px;
		height: 20px;
		border-radius: 4px;
		position: relative;
		overflow: hidden;
		flex-shrink: 0;
		border: 1px solid var(--color-border);
	}

	.tm__swatch-bg { width: 100%; height: 100%; }
	.tm__swatch-dot {
		position: absolute;
		bottom: 3px;
		right: 3px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.tm__name {
		font-size: var(--font-sm);
		color: var(--color-text);
		flex: 1;
		text-align: left;
	}

	.tm__check {
		color: var(--color-primary);
		flex-shrink: 0;
	}

	.tm__actions {
		display: flex;
		gap: 2px;
	}

	.tm__action {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-xs);
		font-size: 0.65rem;
		color: var(--color-text-muted);
		transition: all var(--transition-fast);
	}

	.tm__action:hover { background: var(--color-surface-hover); color: var(--color-text); }
	.tm__action--danger:hover { color: var(--color-error); }

	.tm__new {
		margin-top: var(--space-md);
	}

	.tm__new-btn {
		width: 100%;
		padding: 8px;
		border-radius: var(--radius-sm);
		border: 1px dashed var(--color-border);
		color: var(--color-text-secondary);
		font-size: var(--font-sm);
		transition: all var(--transition-fast);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-xs);
	}

	.tm__new-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
		background: var(--color-primary-subtle);
	}

	.tm__new-form {
		display: flex;
		gap: 4px;
	}

	.tm__new-input {
		flex: 1;
		padding: 6px 10px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		font-size: var(--font-sm);
		outline: none;
	}

	.tm__new-input:focus { border-color: var(--color-primary); }

	.tm__new-save {
		padding: 6px 12px;
		border-radius: var(--radius-sm);
		background: var(--color-primary);
		color: var(--color-text-inverse, #fff);
		font-size: var(--font-sm);
		font-weight: 600;
	}

	.tm__new-cancel {
		padding: 6px 8px;
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		font-size: var(--font-sm);
	}

	.tm__new-cancel:hover { color: var(--color-text); }
</style>
