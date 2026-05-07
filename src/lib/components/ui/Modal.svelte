<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(false),
		title = '',
		size = 'md',
		children,
		footer
	}: {
		open: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg';
		children: Snippet;
		footer?: Snippet;
	} = $props();

	function handleBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) open = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-backdrop" onclick={handleBackdrop}>
		<div class="modal modal--{size}" role="dialog" aria-modal="true" aria-label={title}>
			{#if title}
				<div class="modal__header">
					<h2 class="modal__title">{title}</h2>
					<button class="modal__close" onclick={() => (open = false)} aria-label="Close">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>
			{/if}
			<div class="modal__body">
				{@render children()}
			</div>
			{#if footer}
				<div class="modal__footer">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: hsla(0, 0%, 0%, 0.6);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: var(--z-modal-backdrop);
		animation: fadeIn 200ms ease;
		padding: var(--space-lg);
	}

	.modal {
		background: var(--color-surface-solid);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-xl);
		width: 100%;
		max-height: 85vh;
		display: flex;
		flex-direction: column;
		animation: fadeInScale 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
		overflow: hidden;
	}

	.modal--sm { max-width: 400px; }
	.modal--md { max-width: 560px; }
	.modal--lg { max-width: 720px; }

	.modal__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-lg) var(--space-xl);
		border-bottom: 1px solid var(--color-border);
	}

	.modal__title {
		font-size: var(--font-lg);
		font-weight: 600;
		color: var(--color-text);
	}

	.modal__close {
		color: var(--color-text-muted);
		padding: var(--space-xs);
		border-radius: var(--radius-sm);
		transition: all var(--transition-fast);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal__close:hover {
		color: var(--color-text);
		background: var(--color-surface-hover);
	}

	.modal__body {
		padding: var(--space-xl);
		overflow-y: auto;
		flex: 1;
	}

	.modal__footer {
		padding: var(--space-md) var(--space-xl);
		border-top: 1px solid var(--color-border);
		display: flex;
		justify-content: flex-end;
		gap: var(--space-sm);
	}
</style>
