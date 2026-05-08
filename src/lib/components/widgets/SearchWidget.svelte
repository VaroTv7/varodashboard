<script lang="ts">
	let {
		onSearch = (_q: string) => {}
	}: {
		onSearch: (query: string) => void;
	} = $props();

	let query = $state('');
	let inputEl: HTMLInputElement | undefined = $state();
	let isFocused = $state(false);

	function handleInput() {
		onSearch(query);
	}

	function clearSearch() {
		query = '';
		onSearch('');
		inputEl?.focus();
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.key === '/' || (e.key === 'k' && (e.ctrlKey || e.metaKey))) && document.activeElement !== inputEl) {
			e.preventDefault();
			inputEl?.focus();
		}
		if (e.key === 'Escape' && document.activeElement === inputEl) {
			inputEl?.blur();
			clearSearch();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="search" class:search--focused={isFocused} id="search-widget">
	<svg class="search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
		<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
	</svg>

	<input
		bind:this={inputEl}
		bind:value={query}
		oninput={handleInput}
		onfocus={() => (isFocused = true)}
		onblur={() => (isFocused = false)}
		type="text"
		class="search__input"
		placeholder="Filter services... (/ or Ctrl+K)"
		autocomplete="off"
		spellcheck="false"
		id="search-input"
	/>

	{#if query}
		<button type="button" class="search__clear" onclick={clearSearch} aria-label="Clear search">
			✕
		</button>
	{:else}
		<span class="search__hint">
			<kbd>/</kbd>
		</span>
	{/if}
</div>

<style>
	.search {
		width: 100%;
		display: flex;
		align-items: center;
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-full);
		padding: 0 var(--space-sm);
		transition: all var(--transition-normal);
		height: 40px;
		gap: var(--space-xs);
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

	.search__icon {
		color: var(--color-text-muted);
		flex-shrink: 0;
	}

	.search__input {
		flex: 1;
		background: none;
		border: none;
		outline: none;
		padding: 0 var(--space-xs);
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

	.search__hint {
		flex-shrink: 0;
	}

	.search__hint kbd {
		font-family: inherit;
		font-size: 0.65rem;
		color: var(--color-text-muted);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xs);
		padding: 1px 6px;
	}
</style>
