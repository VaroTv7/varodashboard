<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import { ui } from '$lib/stores/ui.svelte';

	interface ScriptParam {
		name: string;
		label: string;
		type: string;
		required: boolean;
		placeholder?: string;
	}

	interface ScriptDef {
		id: string;
		name: string;
		description: string;
		icon: string;
		color?: string;
		parameters: ScriptParam[];
		confirm?: boolean;
	}

	let { script }: { script: ScriptDef } = $props();

	let modalOpen = $state(false);
	let params = $state<Record<string, string>>({});
	let isRunning = $state(false);
	let output = $state('');

	function openModal() {
		params = {};
		output = '';
		for (const p of script.parameters) {
			params[p.name] = '';
		}
		modalOpen = true;
	}

	async function executeScript() {
		if (script.confirm && !confirm(`Are you sure you want to run "${script.name}"?`)) return;

		isRunning = true;
		output = '';

		try {
			const res = await fetch('/api/scripts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: script.id, params })
			});

			const result = await res.json();

			if (result.success) {
				output = result.output;
				ui.addToast(`${script.name} completed successfully`, 'success');
			} else {
				output = result.error || 'Script failed';
				ui.addToast(`${script.name} failed: ${result.error}`, 'error');
			}
		} catch (err) {
			output = 'Network error';
			ui.addToast('Failed to connect to script API', 'error');
		} finally {
			isRunning = false;
		}
	}
</script>

<button
	class="script-tile"
	onclick={script.parameters.length > 0 ? openModal : executeScript}
	id="script-{script.id}"
	style:--tile-accent={script.color || 'var(--color-accent)'}
>
	<div class="script-tile__glow"></div>
	<div class="script-tile__content">
		<div class="script-tile__icon-wrap">
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="4 17 10 11 4 5" />
				<line x1="12" y1="19" x2="20" y2="19" />
			</svg>
		</div>
		<div class="script-tile__info">
			<span class="script-tile__name">{script.name}</span>
			{#if script.description}
				<span class="script-tile__desc">{script.description}</span>
			{/if}
		</div>
		{#if isRunning}
			<div class="script-tile__spinner"></div>
		{/if}
	</div>
</button>

<Modal bind:open={modalOpen} title={script.name} size="md">
	<form class="script-form" onsubmit={(e) => { e.preventDefault(); executeScript(); }}>
		{#if script.description}
			<p class="script-form__desc">{script.description}</p>
		{/if}

		{#each script.parameters as param (param.name)}
			<div class="script-form__field">
				<label class="script-form__label" for="param-{param.name}">
					{param.label}
					{#if param.required}<span class="script-form__required">*</span>{/if}
				</label>
				<input
					id="param-{param.name}"
					type={param.type || 'text'}
					bind:value={params[param.name]}
					placeholder={param.placeholder}
					required={param.required}
					class="script-form__input"
					disabled={isRunning}
				/>
			</div>
		{/each}

		{#if output}
			<div class="script-form__output">
				<div class="script-form__output-label">Output</div>
				<pre class="script-form__output-content">{output}</pre>
			</div>
		{/if}

		<div class="script-form__actions">
			<button type="button" class="script-form__btn script-form__btn--cancel" onclick={() => (modalOpen = false)} disabled={isRunning}>
				Cancel
			</button>
			<button type="submit" class="script-form__btn script-form__btn--run" disabled={isRunning}>
				{#if isRunning}
					<span class="script-form__btn-spinner"></span>
					Running...
				{:else}
					▶ Execute
				{/if}
			</button>
		</div>
	</form>
</Modal>

<style>
	.script-tile {
		position: relative;
		display: block;
		width: 100%;
		text-align: left;
		background: var(--glass-bg);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		transition: all var(--transition-normal);
		overflow: hidden;
		cursor: pointer;
	}

	.script-tile__glow {
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

	.script-tile:hover {
		border-color: var(--glass-border-hover);
		transform: translateY(-4px);
		box-shadow: var(--shadow-lg), 0 0 30px color-mix(in srgb, var(--tile-accent) 15%, transparent);
	}

	.script-tile:hover .script-tile__glow {
		opacity: 0.06;
	}

	.script-tile:hover .script-tile__icon-wrap {
		transform: scale(1.08);
	}

	.script-tile__content {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-md);
		z-index: 1;
	}

	.script-tile__icon-wrap {
		width: 44px;
		height: 44px;
		border-radius: var(--radius-md);
		background: color-mix(in srgb, var(--tile-accent) 12%, transparent);
		color: var(--tile-accent);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition: all var(--transition-normal);
	}

	.script-tile__info {
		flex: 1;
		min-width: 0;
	}

	.script-tile__name {
		font-size: var(--font-base);
		font-weight: 600;
		color: var(--color-text);
		display: block;
	}

	.script-tile__desc {
		font-size: var(--font-xs);
		color: var(--color-text-secondary);
		display: block;
		margin-top: 2px;
	}

	.script-tile__spinner {
		width: 18px;
		height: 18px;
		border: 2px solid var(--color-text-muted);
		border-top-color: var(--tile-accent);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		flex-shrink: 0;
	}

	/* Form styles */
	.script-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.script-form__desc {
		color: var(--color-text-secondary);
		font-size: var(--font-sm);
		line-height: 1.5;
	}

	.script-form__field {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.script-form__label {
		font-size: var(--font-sm);
		font-weight: 500;
		color: var(--color-text);
	}

	.script-form__required {
		color: var(--color-error);
	}

	.script-form__input {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		padding: var(--space-sm) var(--space-md);
		color: var(--color-text);
		font-size: var(--font-sm);
		transition: all var(--transition-fast);
		outline: none;
	}

	.script-form__input:focus {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px var(--color-primary-subtle);
	}

	.script-form__input:disabled {
		opacity: 0.5;
	}

	.script-form__output {
		background: hsl(0, 0%, 5%);
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.script-form__output-label {
		font-size: var(--font-xs);
		font-weight: 600;
		color: var(--color-text-muted);
		padding: var(--space-sm) var(--space-md);
		border-bottom: 1px solid var(--color-border);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.script-form__output-content {
		padding: var(--space-md);
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: var(--font-xs);
		color: var(--color-success);
		white-space: pre-wrap;
		word-break: break-all;
		max-height: 200px;
		overflow-y: auto;
		line-height: 1.6;
	}

	.script-form__actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-sm);
		padding-top: var(--space-sm);
	}

	.script-form__btn {
		padding: var(--space-sm) var(--space-lg);
		border-radius: var(--radius-sm);
		font-size: var(--font-sm);
		font-weight: 500;
		transition: all var(--transition-fast);
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.script-form__btn:disabled { opacity: 0.5; pointer-events: none; }

	.script-form__btn--cancel {
		color: var(--color-text-secondary);
	}

	.script-form__btn--cancel:hover {
		background: var(--color-surface-hover);
		color: var(--color-text);
	}

	.script-form__btn--run {
		background: var(--gradient-primary);
		color: white;
		font-weight: 600;
	}

	.script-form__btn--run:hover {
		filter: brightness(1.1);
		box-shadow: var(--shadow-glow);
	}

	.script-form__btn-spinner {
		width: 14px;
		height: 14px;
		border: 2px solid hsla(0, 0%, 100%, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}
</style>
