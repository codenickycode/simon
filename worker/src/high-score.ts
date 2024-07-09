import { HighScoreEntry } from '@simon/shared';
import { Env } from './types';

export default async function highScoreHandler(request: Request, env: Env, headers: Headers) {
	switch (request.method) {
		case 'GET':
			return await getHighScore(env, headers);
		case 'POST':
			return await updateHighScore(request, env, headers);
		default:
			return new Response('Not Found', { status: 404, headers });
	}
}

async function getHighScore(env: Env, headers: Headers) {
	const highScore = await getCurrentHighScore(env);
	return new Response(JSON.stringify(highScore), { headers });
}

async function updateHighScore(request: Request, env: Env, headers: Headers) {
	try {
		const { score, name } = await request.json<{ score: unknown; name: unknown }>();
		if (typeof score !== 'number' || typeof name !== 'string') {
			throw new Error('Invalid score or name');
		}
		const currentHighScore = await getCurrentHighScore(env);
		if (score > currentHighScore.score) {
			const newHighScore = { score, name: name.trim() || 'Anonymous' };
			await env.db.put('highScore', JSON.stringify(newHighScore));
			return new Response(JSON.stringify({ success: true, newHighScore }), { headers });
		} else {
			return new Response(JSON.stringify({ success: false, currentHighScore }), { headers });
		}
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400, headers });
	}
}

async function getCurrentHighScore(env: Env): Promise<HighScoreEntry> {
	const currentHighScore = await env.db.get<HighScoreEntry>('highScore', 'json');
	if (!currentHighScore) {
		return { score: 0, name: 'Anonymous' };
	}
	return currentHighScore;
}
