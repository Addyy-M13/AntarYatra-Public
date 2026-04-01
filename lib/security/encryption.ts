/**
 * Encryption Utilities for Sensitive Data
 * Encrypts/decrypts sensitive fields like journal entries and mood data
 */

import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';

if (!ENCRYPTION_KEY && process.env.NODE_ENV === 'production') {
  throw new Error('ENCRYPTION_KEY environment variable is required in production');
}

/**
 * Encrypt sensitive data
 */
export const encrypt = (plaintext: string): string => {
  if (!ENCRYPTION_KEY) {
    console.warn('Encryption key not set, returning plaintext');
    return plaintext;
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

/**
 * Decrypt sensitive data
 */
export const decrypt = (encryptedData: string): string => {
  if (!ENCRYPTION_KEY) {
    return encryptedData;
  }

  try {
    const [iv, authTagStr, encrypted] = encryptedData.split(':');
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      Buffer.from(iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTagStr, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Hash sensitive data (one-way)
 */
export const hash = (data: string, rounds: number = 12): string => {
  return crypto
    .pbkdf2Sync(data, 'antaryatra-salt', 100000, 64, 'sha512')
    .toString('hex');
};

/**
 * Generate encryption key (use once and save to .env)
 */
export const generateEncryptionKey = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export default {
  encrypt,
  decrypt,
  hash,
  generateEncryptionKey,
};
