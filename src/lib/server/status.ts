interface StatusResult {
	url: string;
	online: boolean;
	responseTime: number | null;
	statusCode: number | null;
}

export async function checkServiceStatus(url: string, timeout = 5000): Promise<StatusResult> {
	const start = Date.now();

	try {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), timeout);

		const response = await fetch(url, {
			method: 'HEAD',
			signal: controller.signal,
			redirect: 'follow'
		});

		clearTimeout(timer);
		const responseTime = Date.now() - start;

		return {
			url,
			online: response.ok || response.status < 500,
			responseTime,
			statusCode: response.status
		};
	} catch {
		return {
			url,
			online: false,
			responseTime: null,
			statusCode: null
		};
	}
}

export async function checkMultipleServices(
	services: Array<{ name: string; url: string }>
): Promise<Record<string, StatusResult>> {
	const results: Record<string, StatusResult> = {};

	const checks = services.map(async (service) => {
		const result = await checkServiceStatus(service.url);
		results[service.name] = result;
	});

	await Promise.allSettled(checks);
	return results;
}
