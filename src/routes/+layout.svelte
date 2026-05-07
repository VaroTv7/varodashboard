<script lang="ts">
	import '../app.css';
	import Toast from '$lib/components/ui/Toast.svelte';

	let { children, data } = $props();

	// Apply theme from settings
	$effect(() => {
		const theme = (data.settings as Record<string, unknown>)?.theme as string || 'dark';
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('varodashboard-theme', theme);
	});

	// Apply custom theme overrides
	$effect(() => {
		const customTheme = (data.settings as Record<string, unknown>)?.customTheme as Record<string, string>;
		if (customTheme && typeof customTheme === 'object') {
			for (const [key, value] of Object.entries(customTheme)) {
				if (value) document.documentElement.style.setProperty(key, value);
			}
		}
	});
</script>

<svelte:head>
	<title>{(data.settings as Record<string, unknown>)?.title || 'VaroDashboard'}</title>
</svelte:head>

{@render children()}
<Toast />
