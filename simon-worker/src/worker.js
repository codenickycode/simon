import highScoreHandler from './high-score';

export default {
	async fetch(request, env) {
		return await handleRequest(request, env);
	},
};

async function handleRequest(request, env) {
	const headers = {
		'Access-Control-Allow-Origin': '*', // Replace * with your domain in production
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Content-Type': 'application/json',
	};
	if (request.method === 'OPTIONS') {
		return new Response(null, { headers });
	}
	const pathname = new URL(request.url).pathname;
	switch (pathname) {
		case '/high-score':
			return highScoreHandler(request, env, headers);
		default:
			return new Response('Not Found', { status: 404, headers });
	}
}
