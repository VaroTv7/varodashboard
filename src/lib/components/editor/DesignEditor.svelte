<script lang="ts">
	let {
		onVarChange = (_key: string, _value: string) => {}
	}: {
		onVarChange: (key: string, value: string) => void;
	} = $props();

	// Read current computed values
	function getVar(name: string): string {
		return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	}

	// Color fields
	const colorFields = [
		{ key: '--color-primary', label: 'Primary', fallback: '#7b8cde' },
		{ key: '--color-accent', label: 'Accent', fallback: '#9b6ce0' },
		{ key: '--color-bg', label: 'Background', fallback: '#0a0e1a' },
		{ key: '--color-surface-solid', label: 'Surface', fallback: '#141929' },
		{ key: '--color-text', label: 'Text', fallback: '#e8ecf4' },
		{ key: '--color-success', label: 'Success', fallback: '#3dd68c' },
		{ key: '--color-warning', label: 'Warning', fallback: '#e5a530' },
		{ key: '--color-error', label: 'Error', fallback: '#d94444' },
	];

	// Range fields
	const rangeFields = [
		{ key: '--glass-blur', label: 'Blur', min: 0, max: 40, unit: 'px', fallback: '24' },
		{ key: '--radius-md', label: 'Radius', min: 0, max: 24, unit: 'px', fallback: '12' },
		{ key: '--tile-gap', label: 'Tile Gap', min: 4, max: 32, unit: 'px', fallback: '16' },
		{ key: '--tile-min-width', label: 'Tile Width', min: 150, max: 400, unit: 'px', fallback: '280' },
	];

	// Font options
	const fonts = [
		{ id: 'inter', label: 'Inter', value: "'Inter', -apple-system, system-ui, sans-serif" },
		{ id: 'jetbrains', label: 'JetBrains Mono', value: "'JetBrains Mono', 'Fira Code', monospace" },
		{ id: 'roboto', label: 'Roboto', value: "'Roboto', 'Helvetica Neue', sans-serif" },
		{ id: 'system', label: 'System Default', value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" },
	];

	// Parse numeric from CSS value (e.g., "24px" → 24)
	function parseNum(val: string, fallback: number): number {
		const n = parseFloat(val);
		return isNaN(n) ? fallback : n;
	}

	// Convert CSS color to hex for input[type=color]
	function toHex(cssColor: string): string {
		if (cssColor.startsWith('#') && cssColor.length <= 9) return cssColor.substring(0, 7);
		try {
			const el = document.createElement('div');
			el.style.color = cssColor;
			document.body.appendChild(el);
			const computed = getComputedStyle(el).color;
			document.body.removeChild(el);
			const match = computed.match(/\d+/g);
			if (match) {
				const [r, g, b] = match.map(Number);
				return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
			}
		} catch { /* ignore */ }
		return '#888888';
	}

	function handleColor(key: string, hex: string) {
		document.documentElement.style.setProperty(key, hex);
		onVarChange(key, hex);
	}

	function handleRange(key: string, value: string, unit: string) {
		const cssVal = value + unit;
		document.documentElement.style.setProperty(key, cssVal);
		onVarChange(key, cssVal);
	}

	function handleFont(value: string) {
		document.documentElement.style.setProperty('font-family', value);
		onVarChange('font-family', value);
	}

	function resetAll() {
		for (const f of colorFields) document.documentElement.style.removeProperty(f.key);
		for (const f of rangeFields) document.documentElement.style.removeProperty(f.key);
		document.documentElement.style.removeProperty('font-family');
		onVarChange('__reset__', '');
	}
</script>

<div class="de">
	<!-- Colors -->
	<div class="de__section">
		<div class="de__label">COLORS</div>
		<div class="de__colors">
			{#each colorFields as field (field.key)}
				<label class="de__color-field">
					<input
						type="color"
						class="de__color-input"
						value={toHex(getVar(field.key) || field.fallback)}
						oninput={(e) => handleColor(field.key, (e.target as HTMLInputElement).value)}
					/>
					<span class="de__color-label">{field.label}</span>
				</label>
			{/each}
		</div>
	</div>

	<!-- Ranges -->
	<div class="de__section">
		<div class="de__label">EFFECTS & SPACING</div>
		{#each rangeFields as field (field.key)}
			{@const currentVal = parseNum(getVar(field.key) || field.fallback, parseFloat(field.fallback))}
			<div class="de__range-field">
				<div class="de__range-header">
					<span class="de__range-name">{field.label}</span>
					<span class="de__range-value">{currentVal}{field.unit}</span>
				</div>
				<input
					type="range"
					class="de__range-input"
					min={field.min}
					max={field.max}
					value={currentVal}
					oninput={(e) => handleRange(field.key, (e.target as HTMLInputElement).value, field.unit)}
				/>
			</div>
		{/each}
	</div>

	<!-- Font -->
	<div class="de__section">
		<div class="de__label">FONT FAMILY</div>
		<div class="de__fonts">
			{#each fonts as font (font.id)}
				<button
					class="de__font-btn"
					onclick={() => handleFont(font.value)}
					style="font-family: {font.value};"
				>
					{font.label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Reset -->
	<button class="de__reset" onclick={resetAll}>
		↺ Reset All Overrides
	</button>
</div>

<style>
	.de__section {
		margin-bottom: var(--space-md);
	}

	.de__label {
		font-size: 0.6rem;
		font-weight: 600;
		color: var(--color-text-muted);
		letter-spacing: 0.1em;
		margin-bottom: var(--space-sm);
	}

	/* Colors */
	.de__colors {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 6px;
	}

	.de__color-field {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		cursor: pointer;
	}

	.de__color-input {
		width: 36px;
		height: 28px;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		cursor: pointer;
		padding: 0;
		background: transparent;
	}

	.de__color-input::-webkit-color-swatch-wrapper { padding: 2px; }
	.de__color-input::-webkit-color-swatch { border: none; border-radius: 4px; }

	.de__color-label {
		font-size: 0.55rem;
		color: var(--color-text-secondary);
		text-align: center;
	}

	/* Ranges */
	.de__range-field {
		margin-bottom: 10px;
	}

	.de__range-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 4px;
	}

	.de__range-name {
		font-size: var(--font-sm);
		color: var(--color-text);
	}

	.de__range-value {
		font-size: 0.65rem;
		color: var(--color-primary);
		font-weight: 500;
		font-variant-numeric: tabular-nums;
	}

	.de__range-input {
		width: 100%;
		height: 4px;
		-webkit-appearance: none;
		appearance: none;
		background: var(--color-surface);
		border-radius: 2px;
		outline: none;
	}

	.de__range-input::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--color-primary);
		cursor: pointer;
		border: 2px solid var(--color-bg);
		box-shadow: 0 0 4px rgba(0,0,0,0.3);
	}

	/* Fonts */
	.de__fonts {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.de__font-btn {
		padding: 8px 10px;
		border-radius: var(--radius-sm);
		font-size: var(--font-sm);
		color: var(--color-text);
		text-align: left;
		transition: all var(--transition-fast);
		border: 1px solid transparent;
	}

	.de__font-btn:hover {
		background: var(--color-surface-hover);
		border-color: var(--color-border);
	}

	/* Reset */
	.de__reset {
		width: 100%;
		padding: 8px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
		color: var(--color-text-secondary);
		font-size: var(--font-sm);
		transition: all var(--transition-fast);
		margin-top: var(--space-sm);
	}

	.de__reset:hover {
		border-color: var(--color-warning);
		color: var(--color-warning);
		background: hsla(38, 92%, 55%, 0.08);
	}
</style>
