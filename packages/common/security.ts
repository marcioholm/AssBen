import * as crypto from 'crypto';
import * as argon2 from 'argon2';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts a CPF using AES-256-GCM.
 * The result is a hex string in the format: iv:authTag:encryptedData
 */
export function encryptCpf(cpf: string, key: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key, 'hex'), iv);
  
  let encrypted = cipher.update(cpf, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a CPF encrypted with AES-256-GCM.
 */
export function decryptCpf(encryptedCpf: string, key: string): string {
  const [ivHex, authTagHex, encryptedData] = encryptedCpf.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key, 'hex'), iv);
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Creates a deterministic HMAC-SHA256 hash of a CPF for indexing/searching.
 */
export function hashCpfForSearch(cpf: string, hmacKey: string): string {
  return crypto
    .createHmac('sha256', hmacKey)
    .update(cpf)
    .digest('hex');
}

/**
 * Hashes a PIN using Argon2.
 */
export async function hashPin(pin: string): Promise<string> {
  return argon2.hash(pin, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });
}

/**
 * Verifies a PIN against an Argon2 hash.
 */
export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return argon2.verify(hash, pin);
}
