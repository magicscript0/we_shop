'use client';

import React from 'react';
import { Plan } from '@/types/database';
import { Card, Badge, Button, GBGauge } from '@/components/ui';
import { ZapIcon, ArrowLeftRTL, GiftIcon } from '@/components/ui/Icons';
import { calculatePlanPricing, formatPriceEgp } from '@/lib/services/pricing';

interface PlanCardProps {
  plan: Plan;
  isDiscountEligible?: boolean;
  discountPercent?: number;
  onSelect?: (plan: Plan) => void;
  className?: string;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isDiscountEligible = false,
  discountPercent = 50,
  onSelect,
  className,
}) => {
  const isMonthly = plan.billing_period === 'monthly';

  // Standard pricing without discount
  const standardPricing = calculatePlanPricing(plan.price_egp, null);

  // Welcome offer preview pricing (50% off base price, capped at 350 EGP, 14% VAT on net)
  const welcomeOfferInput = isMonthly
    ? {
        percent: discountPercent,
        max_discount_amount: 350,
        is_eligible: true,
      }
    : null;
  const welcomePricing = isMonthly
    ? calculatePlanPricing(plan.price_egp, welcomeOfferInput)
    : null;

  return (
    <Card
      tier={plan.tier}
      isPopular={Boolean(plan.badge)}
      className={`flex flex-col justify-between h-full group ${className || ''}`}
    >
      <div>
        {/* Top Badges: Family & Period & Welcome Offer Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="family" tier={plan.tier}>
              {plan.tier_label_ar}
            </Badge>
            <Badge variant="period" period={plan.billing_period} />
          </div>

          {plan.badge ? (
            <span className="px-2.5 py-0.5 text-xs font-bold bg-[#B9F03C] text-[#1B0A33] rounded-full shadow-sm">
              {plan.badge}
            </span>
          ) : isMonthly && welcomePricing ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-extrabold bg-[#FF7A1A]/15 text-[#FF7A1A] rounded-full border border-[#FF7A1A]/30">
              <GiftIcon size={12} />
              <span>وفر {formatPriceEgp(welcomePricing.discount_amount)}</span>
            </span>
          ) : null}
        </div>

        {/* The Signature GB Gauge (Energy Ring) */}
        <div className="my-4 flex flex-col items-center justify-center">
          <GBGauge
            quotaValue={plan.quota_value}
            quotaUnit={plan.quota_unit}
            tier={plan.tier}
            size="md"
          />

          {/* Speed: Rendered ONLY if speed_mbps is present */}
          {plan.speed_mbps !== null && plan.speed_mbps !== undefined && (
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#5C2D91] bg-[#F6F2FC] px-2.5 py-1 rounded-md">
              <ZapIcon size={14} />
              <span>سرعة حتى {plan.speed_mbps} ميجابت/ث</span>
            </div>
          )}

          {/* Mandatory Quota-based statement */}
          <p className="mt-3 text-xs text-[#5E5873] font-medium tracking-tight">
            باقة محددة بسعة تحميل
          </p>
        </div>
      </div>

      {/* Pricing & CTA Section */}
      <div className="pt-3 border-t border-[#F4F5F7] mt-2 space-y-3">
        {/* Pricing Display */}
        <div className="text-center space-y-1">
          {isMonthly && welcomePricing ? (
            <div className="space-y-1.5">
              {/* Highlighted Welcome Offer Price */}
              <div className="bg-[#F6F2FC] border border-[#CBBAE7]/50 rounded-xl p-2.5">
                <div className="flex items-center justify-between text-xs text-[#5C2D91] font-bold mb-0.5">
                  <span className="flex items-center gap-1">
                    <GiftIcon size={12} />
                    <span>لأول شهر (للجدد):</span>
                  </span>
                  <span className="text-[11px] bg-[#FF7A1A] text-white px-1.5 py-0.2 rounded font-extrabold">
                    خصم 50%
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#8E8A9F] line-through tabular-nums">
                    {standardPricing.formatted_total_due}
                  </span>
                  <span className="text-xl font-heading font-extrabold text-[#14101F] tabular-nums">
                    {welcomePricing.formatted_total_due}
                  </span>
                </div>
                <p className="text-[10px] text-[#5E5873] text-right mt-1">
                  شامل ضريبة 14% (توفير {formatPriceEgp(welcomePricing.discount_amount)})
                </p>
              </div>

              {/* Standard Renewal Price Notice */}
              <p className="text-[11px] text-[#8E8A9F]">
                سعر التجديد الشهري: {standardPricing.formatted_base} قبل الضريبة ({standardPricing.formatted_total_due} شامل 14%)
              </p>
            </div>
          ) : (
            <div>
              <div className="text-2xl font-heading font-extrabold text-[#14101F] tabular-nums">
                {standardPricing.formatted_base}
              </div>
              <p className="text-[11px] font-medium text-[#5E5873] mt-0.5">
                السعر قبل الضريبة · الإجمالي {standardPricing.formatted_total_due} بعد القيمة المضافة (14%)
              </p>
              {!isMonthly && (
                <p className="text-[10px] text-[#5C2D91] font-semibold mt-0.5">
                  باقة سنوية معفاة من عرض الترحيب (وفر حتى 20% سنوياً)
                </p>
              )}
            </div>
          )}
        </div>

        <Button
          variant="primary"
          size="md"
          className="w-full justify-between"
          onClick={() => onSelect && onSelect(plan)}
          rightIcon={<ArrowLeftRTL size={18} />}
        >
          اشترك الآن
        </Button>
      </div>
    </Card>
  );
};
