import { WORKER_PATH_HIGH_SCORE } from '@simon/shared';
import highScoreHandler from './high-score';
import { Env } from './types';

export default {
	async fetch(request: Request, env: Env) {
		return await handleRequest(request, env);
	},
};

async function handleRequest(request: Request, env: Env) {
	const headers = new Headers({
		'Access-Control-Allow-Origin': '*', // Replace * with your domain in production
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Content-Type': 'application/json',
	});
	if (request.method === 'OPTIONS') {
		return new Response(null, { headers });
	}
	const pathname = new URL(request.url).pathname;
	switch (pathname) {
		case WORKER_PATH_HIGH_SCORE:
			return highScoreHandler(request, env, headers);
		default:
			return new Response('Not Found', { status: 404, headers });
	}
}
