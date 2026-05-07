import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const CONFIG_DIR = join(process.cwd(), 'config');

const defaults: Record<string, object> = {
	settings: {
		title: 'VaroDashboard',
		subtitle: 'Your Command Center',
		theme: 'dark',
		layout: { style: 'grid', columns: 'auto', tileSize: 'normal', showHeader: true, showSearch: true, showClock: true, showGreeting: true, groupsCollapsible: true },
		search: { defaultEngine: 'google', engines: { google: 'https://www.google.com/search?q=', duckduckgo: 'https://duckduckgo.com/?q=' } },
		customTheme: {},
		background: { type: 'gradient', value: '' }
	},
	services: { groups: [] },
	bookmarks: { groups: [] },
	scripts: { scripts: [] }
};

async function ensureConfigDir(): Promise<void> {
	if (!existsSync(CONFIG_DIR)) {
		await mkdir(CONFIG_DIR, { recursive: true });
	}
}

export async function loadConfig<T = Record<string, unknown>>(name: string): Promise<T> {
	await ensureConfigDir();
	const filePath = join(CONFIG_DIR, `${name}.json`);

	try {
		const raw = await readFile(filePath, 'utf-8');
		return JSON.parse(raw) as T;
	} catch {
		// If file doesn't exist, return defaults and create it
		const defaultData = defaults[name] || {};
		await writeFile(filePath, JSON.stringify(defaultData, null, '\t'), 'utf-8');
		return defaultData as T;
	}
}

export async function saveConfig(name: string, data: unknown): Promise<void> {
	await ensureConfigDir();
	const filePath = join(CONFIG_DIR, `${name}.json`);
	await writeFile(filePath, JSON.stringify(data, null, '\t'), 'utf-8');
}

export async function loadAllConfigs() {
	const [settings, services, bookmarks, scripts] = await Promise.all([
		loadConfig('settings'),
		loadConfig('services'),
		loadConfig('bookmarks'),
		loadConfig('scripts')
	]);

	return { settings, services, bookmarks, scripts };
}
