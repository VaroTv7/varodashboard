import { json } from '@sveltejs/kit';
import { getScripts, executeScript } from '$lib/server/scripts.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const scripts = await getScripts();
	// Return scripts without the command field for security
	const safe = scripts.map(({ command, ...rest }) => rest);
	return json(safe);
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { id, params } = await request.json();

		if (!id) {
			return json({ error: 'Script ID required' }, { status: 400 });
		}

		const result = await executeScript(id, params || {});
		return json(result);
	} catch {
		return json({ error: 'Invalid request' }, { status: 400 });
	}
};
