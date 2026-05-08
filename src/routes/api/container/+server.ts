import { json } from '@sveltejs/kit';
import http from 'http';
import type { RequestHandler } from './$types';

function dockerRequest(path: string, method: 'GET' | 'POST' = 'GET'): Promise<{ statusCode: number; body: string }> {
	return new Promise((resolve, reject) => {
		const options = {
			socketPath: '/var/run/docker.sock',
			path: `/v1.41${path}`,
			method: method
		};

		const req = http.request(options, (res) => {
			let data = '';
			res.on('data', (chunk) => (data += chunk));
			res.on('end', () => {
				resolve({ statusCode: res.statusCode ?? 0, body: data });
			});
		});

		req.on('error', (err) => {
			reject(err);
		});

		req.end();
	});
}

export const GET: RequestHandler = async ({ url }) => {
	const containerName = url.searchParams.get('containerName');

	if (!containerName) {
		return json({ error: 'containerName is required' }, { status: 400 });
	}

	try {
		const { statusCode, body } = await dockerRequest(`/containers/${containerName}/json`);
		
		if (statusCode === 200) {
			const info = JSON.parse(body);
			return json({ status: info.State.Status });
		} else if (statusCode === 404) {
			return json({ status: 'not_found' });
		} else {
			return json({ error: `Docker API error: ${statusCode}`, details: body }, { status: 500 });
		}
	} catch (err) {
		console.error('Docker socket error:', err);
		return json({ error: 'Could not connect to Docker socket' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { action, containerName } = await request.json();

		if (!containerName || !['start', 'stop'].includes(action)) {
			return json({ error: 'Invalid request' }, { status: 400 });
		}

		const { statusCode, body } = await dockerRequest(`/containers/${containerName}/${action}`, 'POST');

		// Docker returns 204 for successful start/stop, 304 if already in that state
		if (statusCode === 204 || statusCode === 304) {
			return json({ success: true, status: action === 'start' ? 'running' : 'exited' });
		} else {
			return json({ success: false, error: `Docker API error: ${statusCode}`, details: body }, { status: 500 });
		}
	} catch (err) {
		console.error('Docker action error:', err);
		return json({ error: 'Failed to perform Docker action' }, { status: 500 });
	}
};
