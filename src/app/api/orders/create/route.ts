import { NextResponse } from 'next/server';
import { SEED_PLANS, SEED_PAYMENT_METHODS } from '@/lib/constants';
import { calculateServerDiscount } from '@/lib/services/discount';
import { calculatePlanPricing } from '@/lib/services/pricing';
import { isValidWeLineNumber, isValidEgyptianMobile, generateOrderNumber, calculateOrderExpiry } from '@/lib/utils';
import { Order, OrderStatus } from '@/types/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      planId,
      weLineNumber,
      confirmWeLineNumber,
      governorateCode = '013',
      customerPhone,
      customerName = '',
      paymentMethodKey = 'vodafone_cash',
      isNewCustomer = true,
      userId = 'guest',
    } = body;

    // 1. Validate Plan
    const plan = SEED_PLANS.find((p) => p.id === planId || p.slug === planId);
    if (!plan) {
      return NextResponse.json({ error: 'الباقة المحددة غير موجودة في الكتالوج.' }, { status: 400 });
    }

    // 2. Validate Landline number & double confirmation
    const landlineValidation = isValidWeLineNumber(weLineNumber, governorateCode);
    if (!landlineValidation.isValid) {
      return NextResponse.json({ error: landlineValidation.errorAr }, { status: 400 });
    }

    if (weLineNumber.trim() !== confirmWeLineNumber?.trim()) {
      return NextResponse.json(
        { error: 'رقم التليفون الأرضي غير متطابق في الحقلين. يرجى التأكد لتجنب شحن خط آخر.' },
        { status: 400 }
      );
    }

    // 3. Validate Mobile Phone
    if (!isValidEgyptianMobile(customerPhone)) {
      return NextResponse.json(
        { error: 'رقم هاتف التواصل غير صحيح. يجب أن يتكون من 11 رقماً ويبدأ بـ 010 أو 011 أو 012 أو 015.' },
        { status: 400 }
      );
    }

    // 4. Server-Side Pricing Engine with VAT (Change 2)
    const discountResult = calculateServerDiscount({
      userId,
      userCreatedAt: isNewCustomer ? new Date().toISOString() : undefined,
      weLineNumber: weLineNumber.trim(),
      customerPhone: customerPhone.trim(),
      plan,
    });

    const pricing = calculatePlanPricing(
      plan.price_egp,
      discountResult.isEligible
        ? {
            percent: discountResult.percent,
            max_discount_amount: 350,
            is_eligible: true,
            name_ar: 'خصم الترحيب 50%',
          }
        : null
    );

    // 5. Server-Enforced Expiry: strictly 60 minutes from now (Section 10.2)
    const expiryDate = calculateOrderExpiry(60);
    const orderNumber = generateOrderNumber('WE');

    // 6. Selected payment method
    const paymentMethod =
      SEED_PAYMENT_METHODS.find((m) => m.key === paymentMethodKey) || SEED_PAYMENT_METHODS[0];

    // 7. Assemble Immutable Order Snapshot
    const orderRecord: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      user_id: userId,
      plan_id: plan.id,
      status: 'awaiting_payment',
      we_line_number: weLineNumber.trim(),
      line_governorate_code: governorateCode,
      customer_phone: customerPhone.trim(),
      price_original: pricing.base_price,
      discount_amount: pricing.discount_amount,
      net_amount: pricing.net_amount,
      vat_rate: pricing.vat_rate,
      vat_amount: pricing.vat_amount,
      rounding_adjustment: pricing.rounding_adjustment,
      total_due: pricing.total_due,
      price_final: pricing.total_due, // Total amount to transfer
      campaign_id: discountResult.campaignId || null,
      plan_snapshot: {
        tier: plan.tier,
        tier_label_ar: plan.tier_label_ar,
        quota_value: plan.quota_value,
        quota_unit: plan.quota_unit,
        billing_period: plan.billing_period,
        price_egp: plan.price_egp,
        slug: plan.slug,
      },
      offer_snapshot: discountResult.isEligible
        ? {
            percent: discountResult.percent,
            max_discount_amount: null,
            name_ar: 'خصم الترحيب 50%',
          }
        : null,
      expires_at: expiryDate.toISOString(),
      payment_method_id: paymentMethod.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      order: orderRecord,
      orderId: orderRecord.id,
      orderNumber: orderRecord.order_number,
      expiresAt: orderRecord.expires_at,
      paymentMethod,
    });
  } catch {
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة الطلب على الخادم. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}
