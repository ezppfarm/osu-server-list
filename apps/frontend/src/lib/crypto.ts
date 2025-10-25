import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

const encryptionKey =
	process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length >= 16
		? process.env.ENCRYPTION_KEY
		: 'recorderinsandybrige';
const encryptionKeyBytes = new Bun.SHA256().update(encryptionKey).digest('hex').substring(0, 32);
const ivLength = 16;

export const encrypt = (str: string): string => {
	const iv = randomBytes(ivLength);
	const cipher = createCipheriv('aes-256-cbc', encryptionKeyBytes, iv);
	const encrypted = Buffer.concat([cipher.update(str, 'utf8'), cipher.final()]);
	return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decrypt = (str: string): string => {
	const [ivPart, encryptedPart] = str.split(':');
	if (!ivPart || !encryptedPart) throw new Error('Invalid encrypted string format');
	const iv = Buffer.from(ivPart, 'hex');
	const encryptedText = Buffer.from(encryptedPart, 'hex');
	const decipher = createDecipheriv('aes-256-cbc', encryptionKeyBytes, iv);
	const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
	return decrypted.toString('utf8');
};
