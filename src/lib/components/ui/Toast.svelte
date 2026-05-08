<script lang="ts">
	import { ui } from '$lib/stores/ui.svelte';
	import { fly } from 'svelte/transition';
</script>

<div class="toast-container">
	{#each ui.toasts as toast (toast.id)}
		<div
			class="toast toast--{toast.type}"
			in:fly={{ y: 20, duration: 300 }}
			out:fly={{ x: 100, duration: 200 }}
		>
			<div class="toast__icon">
				{#if toast.type === 'success'}
					✓
				{:else if toast.type === 'error'}
					✕
				{:else}
					ℹ
				{/if}
			</div>
			<div class="toast__message">{toast.message}</div>
			<button class="toast__close" onclick={() => ui.removeToast(toast.id)}>
				✕
			</button>
		</div>
	{/each}
</div>

<style>
	.toast-container {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		z-index: 9999;
		pointer-events: none;
	}

	.toast {
		pointer-events: auto;
		background: var(--vs-mantle, #181825);
		border: 1px solid var(--vs-surface0, #313244);
		border-radius: var(--vs-radius-md, 8px);
		padding: 12px 16px;
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 280px;
		max-width: 400px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
		color: var(--vs-text, #cdd6f4);
	}

	.toast--success {
		border-left: 4px solid var(--vs-ok, #a6e3a1);
	}

	.toast--error {
		border-left: 4px solid var(--vs-error, #f38ba8);
	}

	.toast--info {
		border-left: 4px solid var(--vs-primary, #cba6f7);
	}

	.toast__icon {
		font-weight: bold;
		font-size: 1.2rem;
	}

	.toast--success .toast__icon { color: var(--vs-ok, #a6e3a1); }
	.toast--error .toast__icon { color: var(--vs-error, #f38ba8); }
	.toast--info .toast__icon { color: var(--vs-primary, #cba6f7); }

	.toast__message {
		flex: 1;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.toast__close {
		background: none;
		border: none;
		color: var(--vs-overlay, #6c7086);
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.2s;
	}

	.toast__close:hover {
		color: var(--vs-text, #cdd6f4);
	}
</style>
