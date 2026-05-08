<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title = '',
		count = 0,
		collapsible = false,
		collapsed = false,
		onToggle = () => {},
		children
	}: {
		title: string;
		count?: number;
		collapsible?: boolean;
		collapsed?: boolean;
		onToggle?: () => void;
		children?: Snippet;
	} = $props();
</script>

<div class="atp" class:atp--collapsed={collapsed}>
	{#if collapsible}
		<button class="atp__header" onclick={onToggle}>
			<div class="atp__header-left">
				<span class="atp__dot"></span>
				<span class="atp__title">{title}</span>
			</div>
			<div class="atp__header-right">
				{#if count > 0}
					<span class="atp__count">{count}</span>
				{/if}
				<span class="atp__chevron" class:atp__chevron--collapsed={collapsed}>▾</span>
			</div>
		</button>
	{:else}
		<div class="atp__header">
			<div class="atp__header-left">
				<span class="atp__dot"></span>
				<span class="atp__title">{title}</span>
			</div>
			{#if count > 0}
				<span class="atp__count">{count}</span>
			{/if}
		</div>
	{/if}

	{#if !collapsed && children}
		<div class="atp__body">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.atp {
		border: 1px solid rgba(0, 230, 200, 0.12);
		border-radius: 3px;
		background: #0a1520;
		overflow: hidden;
		position: relative;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.atp::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(0, 230, 200, 0.35), transparent);
	}

	.atp__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 6px 10px;
		border-bottom: 1px solid rgba(0, 230, 200, 0.08);
		background: rgba(0, 230, 200, 0.03);
		width: 100%;
		cursor: default;
	}

	button.atp__header { cursor: pointer; }
	button.atp__header:hover { background: rgba(0, 230, 200, 0.06); }

	.atp__header-left {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.atp__header-right {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.atp__dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #00e5c8;
		box-shadow: 0 0 6px rgba(0, 230, 200, 0.5);
		flex-shrink: 0;
	}

	.atp__title {
		font-family: 'JetBrains Mono', monospace;
		font-size: clamp(0.5rem, 0.4vw + 0.25rem, 0.75rem);
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: #00e5c8;
	}

	.atp__count {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.5rem;
		color: #6a98a8;
		background: rgba(0, 230, 200, 0.06);
		border: 1px solid rgba(0, 230, 200, 0.1);
		padding: 0 4px;
		border-radius: 2px;
		font-variant-numeric: tabular-nums;
	}

	.atp__chevron {
		font-size: 0.55rem;
		color: #6a98a8;
		transition: transform 150ms ease;
	}

	.atp__chevron--collapsed { transform: rotate(-90deg); }

	.atp__body {
		padding: clamp(6px, 0.5vw, 12px);
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}
</style>
