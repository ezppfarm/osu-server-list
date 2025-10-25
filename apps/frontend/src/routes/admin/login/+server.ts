import { encrypt } from '@/crypto.js';
import { checkLoginUser } from '@osu-server-list/db/query';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, cookies }) => {
	const formData = await request.formData();
	const username = (formData.get('username') as string) ?? '';
	const password = (formData.get('password') as string) ?? '';

	if (!username || !password || username.trim().length <= 0 || password.trim().length <= 0) {
		return json({ error: 'Missing username or password' }, { status: 400 });
	}

	const user = await checkLoginUser(username, password);

	if (!user) {
		return json({ error: 'Invalid username or password' }, { status: 401 });
	}

	//TODO: just for testing, implement proper session management
	const encodedUser = encrypt(`${user.id}:${user.name}:${user.passwordHash}`);

	cookies.set('session', encodedUser, {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
		maxAge: 3600 // 1 hour expiration
	});

	return json(
		{
			message: 'Login successful',
			user: {
				id: user.id,
				name: user.name
			}
		},
		{ status: 200 }
	);
};
