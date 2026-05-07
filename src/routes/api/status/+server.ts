import { json } from '@sveltejs/kit';
import { checkMultipleServices } from '$lib/server/status.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { services } = await request.json();

		if (!Array.isArray(services)) {
			return json({ error: 'Services must be an array' }, { status: 400 });
		}

		const results = await checkMultipleServices(services);
		return json(results);
	} catch {
		return json({ error: 'Invalid request' }, { status: 400 });
	}
};
