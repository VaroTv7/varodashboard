<script lang="ts" module>
	interface ToastMessage {
		id: number;
		message: string;
		type: 'success' | 'error' | 'info' | 'warning';
		duration: number;
	}

	let toasts = $state<ToastMessage[]>([]);
	let nextId = 0;

	export function showToast(message: string, type: ToastMessage['type'] = 'info', duration = 4000) {
		const id = nextId++;
		toasts.push({ id, message, type, duration });
		setTimeout(() => removeToast(id), duration);
	}

	function removeToast(id: number) {
		toasts = toasts.filter((t) => t.id !== id);
	}
</script>

<script lang="ts">
	function getIcon(type: string) {
		switch (type) {
			case 'success': return '✓';
			case 'error': return '✕';
			case 'warning': return '⚠';
			default: return 'ℹ';
		}
	}
</script>

{#if toasts.length > 0}
	<div class="toast-container" role="status" aria-live="polite">
		{#each toasts as toast (toast.id)}
			<div class="toast toast--{toast.type}" role="alert">
				<span class="toast__icon">{getIcon(toast.type)}</span>
				<span class="toast__message">{toast.message}</span>
				<button
					class="toast__close"
					onclick={() => removeToast(toast.id)}
					aria-label="Close notification"
				>✕</button>
			</div>
		{/each}
	</div>
{/if}

<style>
	.toast-container {
		position: fixed;
		top: var(--space-lg);
		right: var(--space-lg);
		z-index: var(--z-toast);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		max-width: 400px;
	}

	.toast {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		background: var(--glass-bg);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-lg);
		animation: toast-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
		font-size: var(--font-sm);
		min-width: 280px;
	}

	.toast--success { border-left: 3px solid var(--color-success); }
	.toast--error { border-left: 3px solid var(--color-error); }
	.toast--warning { border-left: 3px solid var(--color-warning); }
	.toast--info { border-left: 3px solid var(--color-primary); }

	.toast__icon {
		font-size: var(--font-md);
		flex-shrink: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-full);
	}

	.toast--success .toast__icon { color: var(--color-success); }
	.toast--error .toast__icon { color: var(--color-error); }
	.toast--warning .toast__icon { color: var(--color-warning); }
	.toast--info .toast__icon { color: var(--color-primary); }

	.toast__message {
		flex: 1;
		color: var(--color-text);
		line-height: 1.4;
	}

	.toast__close {
		color: var(--color-text-muted);
		font-size: var(--font-sm);
		padding: 2px;
		transition: color var(--transition-fast);
		flex-shrink: 0;
	}

	.toast__close:hover {
		color: var(--color-text);
	}
</style>
