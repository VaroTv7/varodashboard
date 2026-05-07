import { json } from '@sveltejs/kit';
import { loadConfig, saveConfig } from '$lib/server/config.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const name = url.searchParams.get('name');
	if (!name || !['settings', 'services', 'bookmarks', 'scripts'].includes(name)) {
		return json({ error: 'Invalid config name' }, { status: 400 });
	}

	const config = await loadConfig(name);
	return json(config);
};

export const PUT: RequestHandler = async ({ request, url }) => {
	const name = url.searchParams.get('name');
	if (!name || !['settings', 'services', 'bookmarks', 'scripts'].includes(name)) {
		return json({ error: 'Invalid config name' }, { status: 400 });
	}

	try {
		const data = await request.json();
		await saveConfig(name, data);
		return json({ success: true });
	} catch {
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}
};
