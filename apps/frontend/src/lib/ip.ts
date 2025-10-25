const availableHeaders = ['CF-Connecting-IP', 'X-Forwarded-For', 'X-Real-IP', 'X-Client-IP'];

export const getClientIP = (request: Request, fallback?: string) => {
	for (const header of availableHeaders) {
		const ip = request.headers.get(header);
		if (ip) {
			return ip;
		}
	}
	return fallback ?? 'Unknown';
};
