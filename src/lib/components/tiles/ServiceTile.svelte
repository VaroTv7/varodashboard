<script lang="ts">
	import StatusDot from '$lib/components/ui/StatusDot.svelte';
	import ContainerControl from './ContainerControl.svelte';

	interface Service {
		name: string;
		url: string | null;
		icon: string;
		color?: string;
		description?: string;
		statusCheck?: boolean;
		openInNewTab?: boolean;
		containerName?: string;
		dependsOn?: string[];
	}

	let { service, status = 'unknown' }: { service: Service; status?: string } = $props();

	let containerStatus = $state<'running' | 'exited' | 'loading' | 'unknown'>('unknown');

	function handleStatusChange(status: string) {
		containerStatus = status as any;
	}

	const iconMap: Record<string, string> = {
		'tv': 'M4 7V4h16v14H4v-3 M2 20h20 M9 17v3 M15 17v3',
		'film': 'M7 2v20 M17 2v20 M2 12h20 M2 7h5 M2 17h5 M17 17h5 M17 7h5',
		'monitor': 'M2 3h20v14H2z M8 21h8 M12 17v4',
		'download': 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3',
		'container': 'M22 12.5V6l-10-4L2 6v6.5l10 4 10-4Z M2 6l10 4 10-4',
		'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
		'activity': 'M22 12h-4l-3 9L9 3l-3 9H2',
		'git-branch': 'M6 3v12 M18 9a3 3 0 100-6 3 3 0 000 6z M6 21a3 3 0 100-6 3 3 0 000 6z M18 9a9 9 0 01-9 9',
		'lock': 'M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4',
		'play-circle': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M10 8l6 4-6 4V8z',
		'server': 'M2 4h20v6H2z M2 14h20v6H2z M6 7h.01 M6 17h.01',
		'wrench': 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
		'refresh-cw': 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15',
		'trash-2': 'M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2 M10 11v6 M14 11v6',
		'gamepad-2': 'M6 11h4 M8 9v4 M15 12h.01 M18 10h.01 M17.32 5H6.68a4 4 0 00-3.978 3.59C2.218 12.16 2 16.28 2 17.5a2.5 2.5 0 005 0c.229-.545.854-1.5 2-1.5h6c1.146 0 1.771.955 2 1.5a2.5 2.5 0 005 0c0-1.22-.218-5.34-.702-8.91A4 4 0 0017.32 5z'
	};

	function getIconPath(icon: string): string {
		return iconMap[icon] || iconMap['server'] || '';
	}
</script>

{#snippet tileContent()}
	<div class="service-tile__glow"></div>
	<div class="service-tile__content">
		<div class="service-tile__icon-wrap">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="service-tile__icon">
				<path d={getIconPath(service.icon)} />
			</svg>
		</div>
		<div class="service-tile__info">
			<div class="service-tile__name-row">
				<span class="service-tile__name">{service.name}</span>
				{#if service.statusCheck}
					<div class="service-tile__dot-wrap">
						<StatusDot {status} size="sm" />
					</div>
				{/if}
			</div>
			{#if service.description}
				<span class="service-tile__desc">{service.description}</span>
			{/if}
		</div>

		{#if service.containerName}
			<div class="service-tile__actions">
				<ContainerControl 
					containerName={service.containerName} 
					dependencies={service.dependsOn}
					onStatusChange={handleStatusChange} 
				/>
			</div>
		{/if}
		
		{#if service.url}
			<svg class="service-tile__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
				<path d="M7 17l9.2-9.2M17 17V7.8H7.8" />
			</svg>
		{/if}
	</div>
{/snippet}

{#if service.url}
	<a
		href={service.url}
		target={service.openInNewTab !== false ? '_blank' : '_self'}
		rel="noopener noreferrer"
		class="service-tile"
		class:service-tile--offline={service.containerName && containerStatus === 'exited'}
		id="service-{service.name.toLowerCase().replace(/\s+/g, '-')}"
		style:--tile-accent={service.color || 'var(--color-primary)'}
	>
		{@render tileContent()}
	</a>
{:else}
	<div
		class="service-tile service-tile--no-url"
		class:service-tile--offline={service.containerName && containerStatus === 'exited'}
		id="service-{service.name.toLowerCase().replace(/\s+/g, '-')}"
		style:--tile-accent={service.color || 'var(--color-primary)'}
	>
		{@render tileContent()}
	</div>
{/if}

<style>
	.service-tile {
		position: relative;
		display: block;
		background: var(--glass-bg);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		transition: all var(--transition-normal);
		overflow: hidden;
		cursor: pointer;
		text-decoration: none;
	}

	.service-tile--no-url {
		cursor: default;
	}

	.service-tile--offline {
		opacity: 0.6;
		filter: grayscale(0.5);
	}

	.service-tile__glow {
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle at center, var(--tile-accent), transparent 70%);
		opacity: 0;
		transition: opacity var(--transition-slow);
		pointer-events: none;
	}

	.service-tile:hover:not(.service-tile--no-url) {
		border-color: var(--glass-border-hover);
		transform: translateY(-4px);
		box-shadow: var(--shadow-lg), 0 0 30px color-mix(in srgb, var(--tile-accent) 15%, transparent);
	}

	.service-tile:hover .service-tile__glow {
		opacity: 0.06;
	}

	.service-tile:hover .service-tile__arrow {
		opacity: 1;
		transform: translate(2px, -2px);
	}

	.service-tile:hover .service-tile__icon-wrap {
		transform: scale(1.08);
		box-shadow: 0 0 20px color-mix(in srgb, var(--tile-accent) 25%, transparent);
	}

	.service-tile:active:not(.service-tile--no-url) {
		transform: translateY(-2px) scale(0.99);
	}

	.service-tile__content {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-md);
		z-index: 1;
	}

	.service-tile__icon-wrap {
		width: 44px;
		height: 44px;
		border-radius: var(--radius-md);
		background: color-mix(in srgb, var(--tile-accent) 12%, transparent);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition: all var(--transition-normal);
	}

	.service-tile__icon {
		color: var(--tile-accent);
	}

	.service-tile__info {
		flex: 1;
		min-width: 0;
	}

	.service-tile__name-row {
		display: flex;
		align-items: flex-start;
		gap: var(--space-sm);
	}

	.service-tile__dot-wrap {
		margin-top: 4px;
		flex-shrink: 0;
	}

	.service-tile__name {
		font-size: var(--font-base);
		font-weight: 600;
		color: var(--color-text);
		white-space: normal;
		overflow-wrap: break-word;
		word-break: normal;
		line-height: 1.3;
	}

	.service-tile__desc {
		font-size: var(--font-xs);
		color: var(--color-text-secondary);
		display: block;
		margin-top: 2px;
		white-space: normal;
		overflow-wrap: break-word;
		word-break: normal;
		line-height: 1.3;
	}

	.service-tile__actions {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 4px;
		z-index: 10;
		flex-shrink: 0;
	}

	.service-tile__arrow {
		color: var(--color-text-muted);
		opacity: 0;
		transition: all var(--transition-normal);
		flex-shrink: 0;
	}
</style>
