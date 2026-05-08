<script lang="ts">
	import { onMount } from 'svelte';

	let { 
		containerName, 
		variant = 'default',
		onStatusChange = (_status: string) => {} 
	}: { 
		containerName: string; 
		variant?: 'default' | 'compact' | 'minimal';
		onStatusChange?: (status: string) => void;
	} = $props();

	let containerStatus = $state<'running' | 'exited' | 'loading' | 'unknown'>('unknown');
	let isActionLoading = $state(false);

	onMount(() => {
		if (containerName) {
			fetchContainerStatus();
		}
	});

	async function fetchContainerStatus() {
		try {
			const res = await fetch(`/api/container?containerName=${containerName}`);
			const data = await res.json();
			if (data.status) {
				containerStatus = data.status === 'running' ? 'running' : 'exited';
				onStatusChange(containerStatus);
			}
		} catch (err) {
			console.error('Failed to fetch container status:', err);
		}
	}

	async function handleAction(action: 'start' | 'stop', e: Event) {
		e.preventDefault();
		e.stopPropagation();

		if (isActionLoading || !containerName) return;

		isActionLoading = true;
		try {
			const res = await fetch('/api/container', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action, containerName })
			});
			const data = await res.json();
			if (data.success) {
				containerStatus = data.status === 'running' ? 'running' : 'exited';
				onStatusChange(containerStatus);
			}
		} catch (err) {
			console.error(`Failed to ${action} container:`, err);
		} finally {
			isActionLoading = false;
		}
	}
</script>

<div class="container-control" class:container-control--loading={isActionLoading}>
	{#if isActionLoading}
		<div class="spinner"></div>
	{:else if containerStatus === 'running'}
		<button 
			class="action-btn action-btn--stop" 
			class:action-btn--compact={variant === 'compact'}
			onclick={(e) => handleAction('stop', e)}
			title="Stop Container"
		>
			<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1.5"/></svg>
		</button>
	{:else if containerStatus === 'exited'}
		<button 
			class="action-btn action-btn--start" 
			class:action-btn--compact={variant === 'compact'}
			onclick={(e) => handleAction('start', e)}
			title="Start Container"
		>
			<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
		</button>
	{/if}
</div>

<style>
	.container-control {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 28px;
		min-height: 28px;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border-radius: 6px;
		border: 1px solid var(--vs-surface0, #313244);
		background: rgba(0, 0, 0, 0.2);
		cursor: pointer;
		transition: all 0.2s ease;
		padding: 0;
		color: inherit;
	}

	.action-btn--compact {
		width: 20px;
		height: 20px;
		border-radius: 4px;
	}

	.action-btn--start {
		color: var(--vs-ok, #a6e3a1);
	}

	.action-btn--start:hover {
		background: rgba(166, 227, 161, 0.1);
		border-color: var(--vs-ok, #a6e3a1);
		transform: scale(1.1);
	}

	.action-btn--stop {
		color: var(--vs-error, #f38ba8);
	}

	.action-btn--stop:hover {
		background: rgba(243, 139, 168, 0.1);
		border-color: var(--vs-error, #f38ba8);
		transform: scale(1.1);
	}

	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.1);
		border-top-color: currentColor;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
