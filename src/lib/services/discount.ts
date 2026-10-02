import type { Plan, Campaign } from '../../types/database.ts';

export interface DiscountResult {
  isEligible: boolean;
  reasonAr?: string;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  percent: number;
  campaignId?: string;
}

export interface EligibilityParams {
  userId?: string;
  userCreatedAt?: string | Date;
  weLineNumber?: string;
  customerPhone?: string;
  plan: Plan;
  campaign?: Campaign;
  existingRedemptions?: Array<{
    userId?: string;
    weLineNumber?: string;
    phoneNumber?: string;
  }>;
}

/**
 * Default Welcome Campaign configuration (Section 9)
 */
export const DEFAULT_WELCOME_CAMPAIGN: Campaign = {
  id: 'camp-welcome-50',
  slug: 'welcome-50-percent',
  name_ar: 'خصم الترحيب 50% للعملاء الجدد',
  percent: 50,
  max_discount_amount: 350, // 350 EGP ceiling (Change 3)
  claim_window_days: 7,
  starts_at: new Date('2026-01-01').toISOString(),
  ends_at: null,
  is_active: true,
  eligible_plan_ids: null, // all plans
  exclude_yearly: true, // Monthly plans only (Change 3)
};

/**
 * Server-Enforced Discount & Abuse Prevention Calculation (Section 9 & 14)
 * Rules:
 * 1. Campaign must be active.
 * 2. User must be within claim_window_days (default 7 days from signup).
 * 3. Cannot be redeemed more than once per user.
 * 4. Cannot be redeemed more than once per WE Landline number.
 * 5. Cannot be redeemed more than once per Verified Mobile phone.
 * 6. Checks plan eligibility (e.g. exclude_yearly or specific eligible_plan_ids).
 * 7. Applies max_discount_amount cap if set.
 */
export function calculateServerDiscount({
  userId,
  userCreatedAt,
  weLineNumber,
  customerPhone,
  plan,
  campaign = DEFAULT_WELCOME_CAMPAIGN,
  existingRedemptions = [],
}: EligibilityParams): DiscountResult {
  const originalPrice = plan.price_egp;

  // 1. Is campaign active?
  if (!campaign || !campaign.is_active) {
    return {
      isEligible: false,
      reasonAr: 'حملة الخصم الترحيبي غير مفعّلة حالياً.',
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      percent: 0,
    };
  }

  // 2. Is yearly excluded?
  if (campaign.exclude_yearly && plan.billing_period === 'yearly') {
    return {
      isEligible: false,
      reasonAr: 'الخصم الترحيبي متاح للباقات الشهرية فقط.',
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      percent: 0,
    };
  }

  // 3. Specific plan restriction
  if (campaign.eligible_plan_ids && campaign.eligible_plan_ids.length > 0) {
    if (!campaign.eligible_plan_ids.includes(plan.id)) {
      return {
        isEligible: false,
        reasonAr: 'هذه الباقة غير مشمولة في العرض الترحيبي.',
        originalPrice,
        discountAmount: 0,
        finalPrice: originalPrice,
        percent: 0,
      };
    }
  }

  // 4. Claim window validity check (7 days from signup)
  if (userCreatedAt) {
    const signupDate = new Date(userCreatedAt).getTime();
    const now = Date.now();
    const daysSinceSignup = (now - signupDate) / (1000 * 60 * 60 * 24);

    if (daysSinceSignup > campaign.claim_window_days) {
      return {
        isEligible: false,
        reasonAr: `انتهت صلاحية هدية الترحيب (صالحة لمدة ${campaign.claim_window_days} أيام من تاريخ التسجيل).`,
        originalPrice,
        discountAmount: 0,
        finalPrice: originalPrice,
        percent: 0,
      };
    }
  }

  // 5. Anti-Abuse: User redemption check
  if (userId && existingRedemptions.some((r) => r.userId === userId)) {
    return {
      isEligible: false,
      reasonAr: 'تم استخدام خصم الترحيب مسبقاً لهذا الحساب.',
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      percent: 0,
    };
  }

  // 6. Anti-Abuse: WE Line redemption check
  if (weLineNumber && existingRedemptions.some((r) => r.weLineNumber === weLineNumber.trim())) {
    return {
      isEligible: false,
      reasonAr: 'تم استخدام خصم الترحيب مسبقاً لرقم هذا الخط الأرضي.',
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      percent: 0,
    };
  }

  // 7. Anti-Abuse: Customer Mobile Phone check
  if (customerPhone && existingRedemptions.some((r) => r.phoneNumber === customerPhone.trim())) {
    return {
      isEligible: false,
      reasonAr: 'تم استخدام خصم الترحيب مسبقاً لرقم هذا الهاتف المحمول.',
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      percent: 0,
    };
  }

  // Calculation with cap enforcement
  let discount = originalPrice * (campaign.percent / 100);
  if (campaign.max_discount_amount !== null && discount > campaign.max_discount_amount) {
    discount = campaign.max_discount_amount;
  }

  discount = Math.round(discount);
  const finalPrice = Math.max(0, originalPrice - discount);

  return {
    isEligible: true,
    originalPrice,
    discountAmount: discount,
    finalPrice,
    percent: campaign.percent,
    campaignId: campaign.id,
  };
}
