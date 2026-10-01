import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in Egyptian Pounds with tabular numerals
 */
export function formatEgp(amount: number): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${formatted} ج.م`;
}

/**
 * Format quota display (e.g. "500 GB" or "18 TB")
 */
export function formatQuota(value: number, unit: 'GB' | 'TB'): string {
  return `${value} ${unit}`;
}

/**
 * Validates Egyptian Mobile number (Vodafone, Orange, Etisalat, WE)
 * Format: 11 digits starting with 010, 011, 012, or 015
 */
export function isValidEgyptianMobile(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^01[0125][0-9]{8}$/.test(cleaned);
}

/**
 * Validates WE Home Internet Landline number
 * Default code: 013 (Qalyubia), or accepted list from settings
 */
export function isValidWeLineNumber(
  lineNumber: string,
  governorateCode: string = '013',
  allowedCodes: string[] = ['013', '02', '03', '045', '040', '048', '050', '055']
): { isValid: boolean; errorAr?: string } {
  const cleanedNum = lineNumber.replace(/[\s-]/g, '');
  const cleanedCode = governorateCode.replace(/[\s-]/g, '');

  if (!allowedCodes.includes(cleanedCode)) {
    return {
      isValid: false,
      errorAr: `كود المحافظة (${cleanedCode}) غير مدعوم حالياً. الأكواد المدعومة: ${allowedCodes.join('، ')}`,
    };
  }

  // Egyptian landlines are typically 7 digits for provincial areas, 8 digits for Cairo/Giza (02)
  const expectedLength = cleanedCode === '02' ? 8 : 7;
  const regex = new RegExp(`^[0-9]{${expectedLength}}$`);

  if (!regex.test(cleanedNum)) {
    return {
      isValid: false,
      errorAr: `رقم الخط الأرضي يجب أن يتكون من ${expectedLength} أرقام بعد كود المحافظة (${cleanedCode}).`,
    };
  }

  return { isValid: true };
}

/**
 * Generate human-readable order number: WE-YYMMDD-XXXX
 */
export function generateOrderNumber(prefix = 'WE'): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${yy}${mm}${dd}-${rand}`;
}

/**
 * Calculate expiry date (default 60 minutes from now)
 */
export function calculateOrderExpiry(minutes = 60): Date {
  const now = new Date();
  return new Date(now.getTime() + minutes * 60 * 1000);
}
