'use client';

import React from 'react';
import { Plan } from '@/types/database';
import { Card, Badge, Button, GBGauge } from '@/components/ui';
import { ZapIcon, ArrowLeftRTL } from '@/components/ui/Icons';
import { formatEgp } from '@/lib/utils';

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
  const originalPrice = plan.price_egp;
  const discountedPrice = isDiscountEligible
    ? Math.round(originalPrice * (1 - discountPercent / 100))
    : originalPrice;

  return (
    <Card
      tier={plan.tier}
      isPopular={Boolean(plan.badge)}
      className={`flex flex-col justify-between h-full group ${className || ''}`}
    >
      <div>
        {/* Top Badges: Family & Period & Optional Manual Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="family" tier={plan.tier}>
              {plan.tier_label_ar}
            </Badge>
            <Badge variant="period" period={plan.billing_period} />
          </div>

          {plan.badge && (
            <span className="px-2.5 py-0.5 text-xs font-bold bg-[#B9F03C] text-[#1B0A33] rounded-full shadow-sm">
              {plan.badge}
            </span>
          )}
        </div>

        {/* The Signature GB Gauge (Energy Ring) */}
        <div className="my-5 flex flex-col items-center justify-center">
          <GBGauge
            quotaValue={plan.quota_value}
            quotaUnit={plan.quota_unit}
            tier={plan.tier}
            size="md"
          />

          {/* Speed: Rendered ONLY if speed_mbps is present (Section 6 & 7) */}
          {plan.speed_mbps !== null && plan.speed_mbps !== undefined && (
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#5C2D91] bg-[#F6F2FC] px-2.5 py-1 rounded-md">
              <ZapIcon size={14} />
              <span>سرعة حتى {plan.speed_mbps} ميجابت/ث</span>
            </div>
          )}

          {/* Mandatory Quota-based statement (Section 1 & 6) */}
          <p className="mt-3 text-xs text-[#5E5873] font-medium tracking-tight">
            باقة محددة بسعة تحميل
          </p>
        </div>
      </div>

      {/* Pricing & CTA Section */}
      <div className="pt-4 border-t border-[#F4F5F7] mt-2">
        <div className="mb-3 text-center">
          {isDiscountEligible ? (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs line-through text-[#8E8A9F] font-semibold tabular-nums">
                  {formatEgp(originalPrice)}
                </span>
                <Badge variant="discount">خصم {discountPercent}%</Badge>
              </div>
              <div className="text-2xl font-heading font-extrabold text-[#14101F] tabular-nums">
                {formatEgp(discountedPrice)}
              </div>
            </div>
          ) : (
            <div className="text-2xl font-heading font-extrabold text-[#14101F] tabular-nums">
              {formatEgp(originalPrice)}
            </div>
          )}

          {/* VAT Setting Line */}
          <p className="text-[11px] text-[#8E8A9F] mt-0.5">
            {plan.price_includes_tax
              ? 'الأسعار شاملة ضريبة القيمة المضافة'
              : 'غير شامل ضريبة القيمة المضافة (14%)'}
          </p>
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
