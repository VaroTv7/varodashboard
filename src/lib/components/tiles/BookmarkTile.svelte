<script lang="ts">
	interface Bookmark {
		name: string;
		url: string;
		icon?: string;
	}

	let { bookmark }: { bookmark: Bookmark } = $props();
</script>

<a
	href={bookmark.url}
	target="_blank"
	rel="noopener noreferrer"
	class="bookmark-tile"
	id="bookmark-{bookmark.name.toLowerCase().replace(/\s+/g, '-')}"
	title={bookmark.url}
>
	<span class="bookmark-tile__name">{bookmark.name}</span>
	<svg class="bookmark-tile__arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
		<path d="M7 17l9.2-9.2M17 17V7.8H7.8" />
	</svg>
</a>

<style>
	.bookmark-tile {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-sm);
		transition: all var(--transition-fast);
		text-decoration: none;
	}

	.bookmark-tile:hover {
		background: var(--glass-bg-hover);
		border-color: var(--glass-border-hover);
		transform: translateX(4px);
	}

	.bookmark-tile:hover .bookmark-tile__arrow {
		opacity: 1;
		color: var(--color-primary);
	}

	.bookmark-tile__name {
		font-size: var(--font-sm);
		color: var(--color-text);
		font-weight: 500;
	}

	.bookmark-tile__arrow {
		color: var(--color-text-muted);
		opacity: 0;
		transition: all var(--transition-fast);
		flex-shrink: 0;
	}
</style>
