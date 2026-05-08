<script lang="ts">
	import { ui } from '$lib/stores/ui.svelte';

	let { 
		containers = [], 
		groupName = 'Grupo',
		variant = 'default' 
	}: { 
		containers: string[]; 
		groupName?: string;
		variant?: 'default' | 'compact';
	} = $props();

	let isLoading = $state(false);

	async function batchAction(action: 'start' | 'stop') {
		if (containers.length === 0 || isLoading) return;
		
		isLoading = true;
		const actionName = action === 'start' ? 'Iniciando' : 'Deteniendo';
		ui.addToast(`${actionName} flota ${groupName}...`, 'info');
		
		let successCount = 0;
		for (const containerName of containers) {
			try {
				const res = await fetch('/api/container', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ action, containerName })
				});
				if (res.ok) successCount++;
			} catch (e) {
				console.error(`Fleet error for ${containerName}:`, e);
			}
		}
		
		isLoading = false;
		if (successCount === containers.length) {
			ui.addToast(`Flota ${groupName} ${action === 'start' ? 'en marcha' : 'detenida'} ✓`, 'success');
		} else {
			ui.addToast(`${successCount}/${containers.length} unidades procesadas`, 'info');
		}
	}
</script>

<div class="fleet-control" class:fleet-control--loading={isLoading}>
	{#if variant === 'compact'}
		<button class="fleet-btn fleet-btn--start" onclick={() => batchAction('start')} title="BOOT_ALL ({groupName})">
			▶
		</button>
		<button class="fleet-btn fleet-btn--stop" onclick={() => batchAction('stop')} title="KILL_ALL ({groupName})">
			⏹
		</button>
	{:else}
		<button class="fleet-btn fleet-btn--start" onclick={() => batchAction('start')}>
			▶ BOOT_ALL
		</button>
		<button class="fleet-btn fleet-btn--stop" onclick={() => batchAction('stop')}>
			⏹ KILL_ALL
		</button>
	{/if}
</div>

<style>
	.fleet-control {
		display: flex;
		gap: 8px;
		align-items: center;
	}

	.fleet-control--loading {
		opacity: 0.5;
		pointer-events: none;
	}

	.fleet-btn {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid var(--vs-surface1, #45475a);
		color: var(--vs-text, #cdd6f4);
		font-size: 0.65rem;
		padding: 2px 8px;
		cursor: pointer;
		font-family: inherit;
		font-weight: bold;
		letter-spacing: 1px;
		transition: all 0.2s ease;
		border-radius: 4px;
	}

	.fleet-btn:hover {
		background: rgba(255, 255, 255, 0.05);
		border-color: var(--vs-text, #cdd6f4);
	}

	.fleet-btn--start:hover {
		color: var(--vs-ok, #a6e3a1);
		border-color: var(--vs-ok, #a6e3a1);
	}

	.fleet-btn--stop:hover {
		color: var(--vs-error, #f38ba8);
		border-color: var(--vs-error, #f38ba8);
	}
</style>
