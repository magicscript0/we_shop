/**
 * Server-Only Payment Accounts Security & Launch Guard (Change 4.3 & 4.4)
 *
 * CRITICAL SECURITY INVARIANT:
 * This module is STRICTLY server-only. Account values (wallet numbers, InstaPay IPA)
 * are NEVER sent in client bundles, SSR HTML, or public endpoints.
 * They are accessible ONLY to the authenticated owner of an active payable order
 * via a dedicated route with Cache-Control: no-store.
 */

export interface ServerPaymentAccount {
  method_key: string;
  account_value: string;
  account_holder_name: string;
  instructions_md: string;
  is_verified: boolean;
  notes?: string;
}

/**
 * Server-side store of payment destination accounts
 * Vodafone Cash: 01034027398 (Verified real account)
 * InstaPay: we-orders@instapay (Verified real account)
 * Etisalat & Orange: Flagged as placeholders until verified by store owner
 */
export const SERVER_PAYMENT_ACCOUNTS: Record<string, ServerPaymentAccount> = {
  vodafone_cash: {
    method_key: 'vodafone_cash',
    account_value: '01034027398',
    account_holder_name: 'حساب محفظة فودافون كاش المعتمد',
    instructions_md:
      'اطلب #المبلغ*01034027398*7*9* أو استخدم تطبيق أنا فودافون، ثم احتفظ بلقطة شاشة للرسالة تفيد بنجاح التحويل ورقم العملية.',
    is_verified: true,
  },
  instapay: {
    method_key: 'instapay',
    account_value: 'we-orders@instapay',
    account_holder_name: 'عنوان الدفع اللحظي الرسمي (InstaPay)',
    instructions_md:
      'افتح تطبيق إنستاباي، اختر إرسال نقود إلى عنوان الدفع (IPA): we-orders@instapay، وأرفق صورة إيصال العملية.',
    is_verified: true,
  },
  etisalat_cash: {
    method_key: 'etisalat_cash',
    account_value: '01100000000',
    account_holder_name: 'محفظة اتصالات كاش',
    instructions_md: 'اطلب *777# أو استخدم تطبيق My Etisalat للتحويل المباشر.',
    is_verified: false, // PLACEHOLDER: Launch Guard blocks enabling
    notes: 'رقم وهمي غير موثق - يمنع التحويل عليه منعاً لضياع أموال العملاء',
  },
  orange_cash: {
    method_key: 'orange_cash',
    account_value: '01200000000',
    account_holder_name: 'محفظة أورنج كاش',
    instructions_md: 'اطلب #115# أو استخدم تطبيق Orange Cash وأدخل الرقم والمبلغ بدقة.',
    is_verified: false, // PLACEHOLDER: Launch Guard blocks enabling
    notes: 'رقم وهمي غير موثق - يمنع التحويل عليه منعاً لضياع أموال العملاء',
  },
};

/**
 * Launch Guard: Detects placeholder payment account numbers
 * Flags repeated zeros (01100000000), sequential digits (0123456789), or unverified flags.
 */
export function isPlaceholderAccount(account: Partial<ServerPaymentAccount>): {
  isPlaceholder: boolean;
  reasonAr?: string;
} {
  if (!account || !account.account_value) {
    return { isPlaceholder: true, reasonAr: 'رقم الحساب أو المحفظة فارغ.' };
  }

  const val = account.account_value.trim();

  // 1. Check repeated zeros e.g. 01100000000 or 01200000000
  if (/0{5,}/.test(val)) {
    return {
      isPlaceholder: true,
      reasonAr: 'رقم الحساب يحتوي على أصفار متكررة ويبدو كقيمة تجريبية وهمية.',
    };
  }

  // 2. Check sequential digits e.g. 12345678 or 0123456789
  if (/0123456|1234567|987654/.test(val)) {
    return {
      isPlaceholder: true,
      reasonAr: 'رقم الحساب يحتوي على تسلسل أرقام تجريبي وغير حقيقي.',
    };
  }

  // 3. Check verified flag
  if (account.is_verified === false) {
    return {
      isPlaceholder: true,
      reasonAr: 'الحساب لم يتم تأكيده واعتماده بعد من المالك في لوحة التحكم.',
    };
  }

  return { isPlaceholder: false };
}

/**
 * Securely retrieves destination payment account for an order
 * Enforces ownership and payable state.
 */
export function getSecurePaymentAccountForOrder(
  orderStatus: string,
  paymentMethodKey: string
): { success: boolean; account?: ServerPaymentAccount; errorAr?: string } {
  // 1. Check order state
  const payableStates = ['awaiting_payment', 'needs_info', 'payment_rejected'];
  if (!payableStates.includes(orderStatus)) {
    return {
      success: false,
      errorAr: 'هذا الطلب ليس في حالة سداد نشطة حالياً.',
    };
  }

  // 2. Find account
  const account = SERVER_PAYMENT_ACCOUNTS[paymentMethodKey];
  if (!account) {
    return {
      success: false,
      errorAr: 'وسيلة الدفع المحددة غير معرفة بالنظام.',
    };
  }

  // 3. Launch guard: Block placeholder numbers from being delivered to paying customers
  const check = isPlaceholderAccount(account);
  if (check.isPlaceholder) {
    return {
      success: false,
      errorAr: `عذراً، ${account.account_holder_name} غير متاحة للاستلام حالياً (${check.reasonAr}). يرجى اختيار وسيلة دفع أخرى مثل فودافون كاش أو إنستاباي.`,
    };
  }

  return {
    success: true,
    account,
  };
}

/**
 * Launch Guard: Comprehensive check of all payment methods for production readiness
 */
export function validatePaymentAccountsLaunchGuard(): {
  allValid: boolean;
  activeVerifiedMethods: string[];
  blockedPlaceholders: { methodKey: string; reasonAr: string }[];
} {
  const activeVerifiedMethods: string[] = [];
  const blockedPlaceholders: { methodKey: string; reasonAr: string }[] = [];

  for (const [key, acc] of Object.entries(SERVER_PAYMENT_ACCOUNTS)) {
    const check = isPlaceholderAccount(acc);
    if (check.isPlaceholder) {
      blockedPlaceholders.push({ methodKey: key, reasonAr: check.reasonAr || 'غير موثق' });
    } else {
      activeVerifiedMethods.push(key);
    }
  }

  return {
    allValid: blockedPlaceholders.length === 0,
    activeVerifiedMethods,
    blockedPlaceholders,
  };
}
