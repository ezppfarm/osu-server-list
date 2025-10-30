import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

const encryptionKey =
	process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length >= 16
		? process.env.ENCRYPTION_KEY
		: 'recorderinsandybrige';

const encryptionKeyBytes = Buffer.from(
	new Bun.SHA256().update(encryptionKey).digest('hex').substring(0, 32),
	'utf8'
);

const ivLength = 16;

export const encrypt = <T>(data: T): string => {
	const json = typeof data === 'string' ? data : JSON.stringify(data);
	const iv = randomBytes(ivLength);
	const cipher = createCipheriv('aes-256-cbc', encryptionKeyBytes, iv);
	const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()]);
	return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decrypt = <T>(encryptedStr: string): T => {
	const [ivPart, encryptedPart] = encryptedStr.split(':');
	if (!ivPart || !encryptedPart) throw new Error('Invalid encrypted string format');

	const iv = Buffer.from(ivPart, 'hex');
	const encryptedText = Buffer.from(encryptedPart, 'hex');
	const decipher = createDecipheriv('aes-256-cbc', encryptionKeyBytes, iv);
	const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
	const result = decrypted.toString('utf8');

	let parsed: unknown;
	try {
		parsed = JSON.parse(result);
	} catch {
		throw new Error('Decrypted value is not valid JSON');
	}

	return parsed as T;
};
