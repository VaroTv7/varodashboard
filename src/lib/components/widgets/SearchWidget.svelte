<script lang="ts">
	let {
		engines = {},
		defaultEngine = 'google'
	}: {
		engines: Record<string, string>;
		defaultEngine: string;
	} = $props();

	let query = $state('');
	let selectedEngine = $state(defaultEngine);
	let inputEl: HTMLInputElement | undefined = $state();
	let isFocused = $state(false);

	const engineNames: Record<string, string> = {
		google: 'Google',
		duckduckgo: 'DuckDuckGo',
		youtube: 'YouTube',
		github: 'GitHub',
		reddit: 'Reddit'
	};

	const engineIcons: Record<string, string> = {
		google: '🔍',
		duckduckgo: '🦆',
		youtube: '▶️',
		github: '🐙',
		reddit: '💬'
	};

	function handleSearch() {
		if (!query.trim()) return;
		const baseUrl = engines[selectedEngine] || engines.google || 'https://www.google.com/search?q=';
		window.open(baseUrl + encodeURIComponent(query.trim()), '_blank');
		query = '';
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.key === '/' || (e.key === 'k' && (e.ctrlKey || e.metaKey))) && document.activeElement !== inputEl) {
			e.preventDefault();
			inputEl?.focus();
		}
		if (e.key === 'Escape' && document.activeElement === inputEl) {
			inputEl?.blur();
			query = '';
		}
		// Tab to cycle engines
		if (e.key === 'Tab' && isFocused && query === '') {
			e.preventDefault();
			const keys = Object.keys(engines);
			const idx = keys.indexOf(selectedEngine);
			selectedEngine = keys[(idx + 1) % keys.length];
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<form class="search" class:search--focused={isFocused} onsubmit={(e) => { e.preventDefault(); handleSearch(); }} id="search-widget">
	<button
		type="button"
		class="search__engine"
		onclick={() => {
			const keys = Object.keys(engines);
			const idx = keys.indexOf(selectedEngine);
			selectedEngine = keys[(idx + 1) % keys.length];
		}}
		title="Switch search engine (Tab)"
	>
		<span class="search__engine-icon">{engineIcons[selectedEngine] || '🔍'}</span>
	</button>

	<input
		bind:this={inputEl}
		bind:value={query}
		onfocus={() => (isFocused = true)}
		onblur={() => (isFocused = false)}
		type="text"
		class="search__input"
		placeholder="Search {engineNames[selectedEngine] || selectedEngine}...  (/ or Ctrl+K)"
		autocomplete="off"
		spellcheck="false"
		id="search-input"
	/>

	{#if query}
		<button type="button" class="search__clear" onclick={() => { query = ''; inputEl?.focus(); }} aria-label="Clear search">
			✕
		</button>
	{/if}

	<button type="submit" class="search__submit" aria-label="Search">
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
			<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
		</svg>
	</button>
</form>

<style>
	.search {
		width: 100%;
		display: flex;
		align-items: center;
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-full);
		padding: 0 var(--space-xs);
		transition: all var(--transition-normal);
		height: 40px;
	}

	.search--focused {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-glow), 0 0 0 3px var(--color-primary-subtle);
		background: var(--glass-bg-hover);
	}

	.search:hover:not(.search--focused) {
		border-color: var(--glass-border-hover);
		background: var(--glass-bg-hover);
	}

	.search__engine {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: var(--radius-full);
		transition: all var(--transition-fast);
		flex-shrink: 0;
	}

	.search__engine:hover {
		background: var(--color-surface-hover);
		transform: scale(1.1);
	}

	.search__engine-icon {
		font-size: 14px;
	}

	.search__input {
		flex: 1;
		background: none;
		border: none;
		outline: none;
		padding: 0 var(--space-sm);
		font-size: var(--font-sm);
		color: var(--color-text);
		min-width: 0;
	}

	.search__input::placeholder {
		color: var(--color-text-muted);
	}

	.search__clear {
		color: var(--color-text-muted);
		font-size: var(--font-xs);
		padding: var(--space-xs);
		transition: color var(--transition-fast);
		flex-shrink: 0;
	}

	.search__clear:hover { color: var(--color-text); }

	.search__submit {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: var(--radius-full);
		color: var(--color-text-muted);
		transition: all var(--transition-fast);
		flex-shrink: 0;
	}

	.search__submit:hover {
		color: var(--color-primary);
		background: var(--color-primary-subtle);
	}
</style>
