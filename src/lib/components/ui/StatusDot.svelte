<script lang="ts">
	let { status = 'unknown', size = 'md' }: { status?: string; size?: string } = $props();
</script>

<span
	class="status-dot status-dot--{status} status-dot--{size}"
	title={status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Checking...'}
	role="img"
	aria-label="Service is {status}"
></span>

<style>
	.status-dot {
		display: inline-block;
		border-radius: var(--radius-full);
		flex-shrink: 0;
	}

	.status-dot--sm { width: 6px; height: 6px; }
	.status-dot--md { width: 8px; height: 8px; }
	.status-dot--lg { width: 10px; height: 10px; }

	.status-dot--online {
		background: var(--color-success);
		box-shadow: 0 0 6px var(--color-success-glow);
		animation: glow-pulse 2s ease-in-out infinite;
	}

	.status-dot--offline {
		background: var(--color-error);
		box-shadow: 0 0 6px var(--color-error-glow);
	}

	.status-dot--unknown {
		background: var(--color-text-muted);
		animation: pulse 1.5s ease-in-out infinite;
	}
</style>
