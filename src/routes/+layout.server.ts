import { loadAllConfigs } from '$lib/server/config.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const configs = await loadAllConfigs();
	return {
		settings: configs.settings as Record<string, unknown>,
		services: configs.services as Record<string, unknown>,
		bookmarks: configs.bookmarks as Record<string, unknown>,
		scripts: configs.scripts as Record<string, unknown>
	};
};
