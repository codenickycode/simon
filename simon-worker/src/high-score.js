export default async function highScoreHandler(request, env, headers) {
	switch (request.method) {
		case 'GET':
			return await getHighScore(env, headers);
		case 'POST':
			return await updateHighScore(request, env, headers);
		default:
			return new Response('Not Found', { status: 404, headers });
	}
}

async function getHighScore(env, headers) {
	const highScore = await getCurrentHighScore(env);
	return new Response(JSON.stringify(highScore), { headers });
}

async function updateHighScore(request, env, headers) {
	try {
		const { score, name } = await request.json();
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

async function getCurrentHighScore(env) {
	let highScore = await env.db.get('highScore', 'json');
	if (!highScore) {
		highScore = { score: 0, name: 'Anonymous' };
	}
	return highScore;
}
