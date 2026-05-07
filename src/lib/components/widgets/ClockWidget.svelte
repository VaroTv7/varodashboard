<script lang="ts">
	let time = $state(new Date());

	$effect(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);
		return () => clearInterval(interval);
	});

	const formattedTime = $derived(
		time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	);

	const formattedDate = $derived(
		time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
	);
</script>

<div class="clock" id="clock-widget">
	<span class="clock__time">{formattedTime}</span>
	<span class="clock__date">{formattedDate}</span>
</div>

<style>
	.clock {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 1px;
		user-select: none;
	}

	.clock__time {
		font-size: var(--font-lg);
		font-weight: 600;
		color: var(--color-text);
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
	}

	.clock__date {
		font-size: var(--font-xs);
		color: var(--color-text-muted);
		font-weight: 400;
	}
</style>
