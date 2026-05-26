import { generateSecret as otpGenerateSecret, generateSync, verifySync, generateURI } from 'otplib';
import { createHash, randomBytes } from 'crypto';

export function generateTOTPSecret(): string {
  return otpGenerateSecret();
}

export function generateOTPAuthURL(secret: string, email: string, issuer: string = 'EthioAgencyHub'): string {
  return generateURI({ secret, issuer, label: email, strategy: 'totp' });
}

export function verifyTOTP(token: string, secret: string): boolean {
  try {
    const result = verifySync({ secret, token });
    return result.valid;
  } catch {
    return false;
  }
}

export function generateBackupCodes(count: number = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = randomBytes(4).toString('hex').toUpperCase().slice(0, 8);
    const formatted = `${code.slice(0, 4)}-${code.slice(4, 8)}`;
    codes.push(formatted);
  }
  return codes;
}

export function hashBackupCode(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}

export function verifyBackupCode(code: string, hashedCodes: string): string | null {
  const cleaned = code.replace(/\s|-/g, '').toUpperCase();
  const formatted = cleaned.length === 8 ? `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}` : code;

  const stored: string[] = JSON.parse(hashedCodes);
  const hashed = hashBackupCode(formatted);
  const idx = stored.indexOf(hashed);
  if (idx === -1) return null;

  stored.splice(idx, 1);
  return JSON.stringify(stored);
}

export function hashBackupCodes(codes: string[]): string {
  return JSON.stringify(codes.map(c => {
    const cleaned = c.replace(/\s|-/g, '').toUpperCase();
    const formatted = cleaned.length === 8 ? `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}` : c;
    return hashBackupCode(formatted);
  }));
}
