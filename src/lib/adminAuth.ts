import crypto from 'crypto';

export interface AdminSessionPayload {
  userId: string;
  email: string;
  role: 'owner' | 'admin' | 'super_admin' | 'verifier' | 'support' | 'auditor';
  name: string;
  exp: number; // unix timestamp in ms
}

const DEFAULT_SECRET = 'we-store-admin-master-secret-key-2026-secure';

function getSecret(): string {
  return process.env.ADMIN_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SECRET;
}

/**
 * Creates a signed admin session token: base64(payload).signature
 */
export function createAdminSessionToken(data: Omit<AdminSessionPayload, 'exp'>, expiresInDays = 7): string {
  const exp = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;
  const payload: AdminSessionPayload = { ...data, exp };
  const json = JSON.stringify(payload);
  const base64 = Buffer.from(json).toString('base64url');
  
  const secret = getSecret();
  const signature = crypto.createHmac('sha256', secret).update(base64).digest('hex');
  
  return `${base64}.${signature}`;
}

/**
 * Verifies and decodes an admin session token
 */
export function verifyAdminSessionToken(token: string | undefined | null): AdminSessionPayload | null {
  if (!token || typeof token !== 'string') return null;
  
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  
  const [base64, signature] = parts;
  const secret = getSecret();
  const expectedSignature = crypto.createHmac('sha256', secret).update(base64).digest('hex');
  
  // Timing safe comparison to prevent timing attacks
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }
  
  try {
    const json = Buffer.from(base64, 'base64url').toString('utf8');
    const payload: AdminSessionPayload = JSON.parse(json);
    
    // Check expiry
    if (Date.now() > payload.exp) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

/**
 * Validates the master admin security passcode / PIN
 */
export function validateMasterAccessCode(code: string): boolean {
  if (!code || typeof code !== 'string') return false;
  const expectedCode = (process.env.ADMIN_SECRET_KEY || 'we-admin-2026').trim();
  const trimmedInput = code.trim();
  
  if (trimmedInput.length !== expectedCode.length) return false;
  
  return crypto.timingSafeEqual(
    Buffer.from(trimmedInput),
    Buffer.from(expectedCode)
  );
}
