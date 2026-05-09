<script lang="ts">
	import AtalayaLayout from '$lib/components/layouts/AtalayaLayout.svelte';
	import GlitchCoreLayout from '$lib/components/layouts/GlitchCoreLayout.svelte';
	import QuantumLayout from '$lib/components/layouts/QuantumLayout.svelte';
	import WarcraftLayout from '$lib/components/layouts/WarcraftLayout.svelte';
	import CyberdeckLayout from '$lib/components/layouts/CyberdeckLayout.svelte';
	import BioHazardLayout from '$lib/components/layouts/BioHazardLayout.svelte';
	import NeonTokyoLayout from '$lib/components/layouts/NeonTokyoLayout.svelte';
	import DashboardContent from './DashboardContent.svelte';

	let { 
		settings, 
		services, 
		scripts, 
		bookmarks, 
		statuses, 
		searchQuery,
		onOpenSettings,
		onSearch
	} = $props<{
		settings: any;
		services: any;
		scripts: any;
		bookmarks: any;
		statuses: Record<string, string>;
		searchQuery: string;
		onOpenSettings: () => void;
		onSearch: (q: string) => void;
	}>();

	const activeTheme = $derived((settings.theme as string) || 'dark');
</script>

{#if activeTheme === 'atalaya'}
	<AtalayaLayout
		{settings}
		{services}
		{scripts}
		{bookmarks}
		{statuses}
		{searchQuery}
		{onOpenSettings}
		onSearch={onSearch}
	/>
{:else if activeTheme === 'glitchcore'}
	<GlitchCoreLayout
		{settings}
		{services}
		{scripts}
		{bookmarks}
		{statuses}
		{searchQuery}
		{onOpenSettings}
		onSearch={onSearch}
	/>
{:else if activeTheme === 'quantum'}
	<QuantumLayout
		{settings}
		{services}
		{scripts}
		{bookmarks}
		{statuses}
		{searchQuery}
		{onOpenSettings}
		onSearch={onSearch}
	/>
{:else if activeTheme === 'warcraft'}
	<WarcraftLayout
		{settings}
		{services}
		{scripts}
		{statuses}
		{onOpenSettings}
	/>
{:else if activeTheme === 'cyberdeck'}
	<CyberdeckLayout
		{settings}
		{services}
		{scripts}
		{statuses}
		{onOpenSettings}
	/>
{:else if activeTheme === 'biohazard'}
	<BioHazardLayout
		{settings}
		{services}
		{scripts}
		{statuses}
		{onOpenSettings}
	/>
{:else if activeTheme === 'neontokyo'}
	<NeonTokyoLayout
		{settings}
		{services}
		{scripts}
		{statuses}
		{onOpenSettings}
	/>
{:else}
	<DashboardContent
		{settings}
		{services}
		{scripts}
		{bookmarks}
		{statuses}
		{searchQuery}
		{onOpenSettings}
		{onSearch}
	/>
{/if}
