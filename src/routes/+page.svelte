<script lang="ts">
	import SettingsPanel from '$lib/components/editor/SettingsPanel.svelte';
	import LayoutManager from '$lib/components/layout/LayoutManager.svelte';
	import { telemetry } from '$lib/stores/telemetry.svelte';
	import { onMount, onDestroy } from 'svelte';

	let { data } = $props();

	// Telemetry management
	onMount(() => {
		telemetry.start();
	});
	onDestroy(() => {
		telemetry.stop();
	});

	// State management
	let settings = $state(data.settings as Record<string, unknown>);
	const services = $derived(data.services);
	const bookmarks = $derived(data.bookmarks);
	const scripts = $derived(data.scripts);

	let searchQuery = $state('');
	let settingsOpen = $state(false);
	let statuses = $state<Record<string, string>>({});

	// Settings persistence
	async function handleSettingsChange(updated: Record<string, unknown>) {
		settings = updated;
		try {
			await fetch('/api/config?name=settings', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updated)
			});
		} catch { /* silent */ }
	}

	// Service status monitoring
	$effect(() => {
		if (!services?.groups) return;

		const allServices: Array<{ name: string; url: string }> = [];
		for (const group of services.groups) {
			for (const svc of group.services) {
				if (svc.statusCheck) {
					allServices.push({ name: svc.name as string, url: svc.url as string });
				}
			}
		}

		if (allServices.length === 0) return;

		async function checkStatuses() {
			try {
				const res = await fetch('/api/status', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ services: allServices })
				});
				const results = await res.json();

				for (const [name, result] of Object.entries(results)) {
					const r = result as { online: boolean };
					statuses[name] = r.online ? 'online' : 'offline';
				}
			} catch { /* silent */ }
		}

		checkStatuses();
		const interval = setInterval(checkStatuses, 30000);
		return () => clearInterval(interval);
	});
</script>

<LayoutManager
	{settings}
	{services}
	{scripts}
	{bookmarks}
	{statuses}
	{searchQuery}
	onOpenSettings={() => settingsOpen = true}
	onSearch={(q) => searchQuery = q}
/>

<SettingsPanel
	isOpen={settingsOpen}
	{settings}
	onClose={() => settingsOpen = false}
	onSettingsChange={handleSettingsChange}
/>
