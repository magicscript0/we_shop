import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { GBGauge, Button, Badge, Card } from '@/components/ui';
import { SEED_PLANS } from '@/lib/constants';
import { formatEgp } from '@/lib/utils';
import { calculatePlanPricing, formatPriceEgp } from '@/lib/services/pricing';
import {
  ShieldCheckIcon,
  ZapIcon,
  ClockIcon,
  CheckIcon,
  ArrowLeftRTL,
  RouterIcon,
} from '@/components/ui/Icons';
import type { Metadata } from 'next';
import { Plan } from '@/types/database';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const plan = SEED_PLANS.find((p) => p.slug === slug);
  if (!plan) {
    return {
      title: 'الباقة غير موجودة',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://we-store.eg';
  const pricing = calculatePlanPricing(plan.price_egp);
  const periodLabel = plan.billing_period === 'yearly' ? 'السنوية' : 'الشهرية';
  const title = `باقة ${plan.tier_label_ar} ${plan.quota_value} ${plan.quota_unit} ${periodLabel}`;
  const description = `اشحن باقة WE إنترنت منزلي ${plan.tier_label_ar} سعة ${plan.quota_value} ${plan.quota_unit} بسعر ${pricing.formatted_total_due} شامل ضريبة القيمة المضافة 14%. دفع فوري وتفعيل موثوق.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/plans/${plan.slug}`,
    },
    openGraph: {
      title: `${title} | متجر باقات WE`,
      description,
      url: `${siteUrl}/plans/${plan.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | متجر باقات WE`,
      description,
    },
  };
}

export async function generateStaticParams() {
  return SEED_PLANS.map((plan) => ({
    slug: plan.slug,
  }));
}

export default async function PlanDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const plan = SEED_PLANS.find((p) => p.slug === slug);

  if (!plan) {
    notFound();
  }

  // Related plans in the same family (excluding current)
  const relatedPlans = SEED_PLANS.filter(
    (p) => p.tier === plan.tier && p.id !== plan.id
  ).slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://we-store.eg';
  const pricing = calculatePlanPricing(plan.price_egp);
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `باقة WE إنترنت منزلي ${plan.tier_label_ar} ${plan.quota_value} ${plan.quota_unit}`,
    description: `باقة إنترنت منزلي رسمية بسعة ${plan.quota_value} ${plan.quota_unit} وسرعة فائقة من المصرية للاتصالات WE.`,
    sku: plan.slug,
    offers: {
      '@type': 'Offer',
      price: pricing.total_due,
      priceCurrency: 'EGP',
      priceValidUntil: '2026-12-31',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/plans/${plan.slug}`,
      seller: {
        '@type': 'Organization',
        name: 'متجر باقات WE للإنترنت المنزلي',
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] py-10 px-4 sm:px-6 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-[#5E5873]" dir="rtl">
            <Link href="/" className="hover:text-[#5C2D91]">
              الرئيسية
            </Link>
            <span>/</span>
            <Link href="/plans" className="hover:text-[#5C2D91]">
              باقات الإنترنت
            </Link>
            <span>/</span>
            <span className="text-[#14101F] font-bold">
              {plan.tier_label_ar} {plan.quota_value} {plan.quota_unit}
            </span>
          </nav>

          {/* Main Plan Details Grid */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Right Side: Hero Large GB Gauge */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-[#F6F2FC] rounded-2xl border border-[#CBBAE7]/40">
              <GBGauge
                quotaValue={plan.quota_value}
                quotaUnit={plan.quota_unit}
                tier={plan.tier}
                size="lg"
                animated={true}
              />
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="family" tier={plan.tier}>
                  {plan.tier_label_ar}
                </Badge>
                <Badge variant="period" period={plan.billing_period} />
              </div>

              {plan.speed_mbps && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#5C2D91] bg-white px-3 py-1.5 rounded-lg border border-[#CBBAE7]">
                  <ZapIcon size={14} />
                  <span>سرعة حتى {plan.speed_mbps} ميجابت/ث</span>
                </div>
              )}
            </div>

            {/* Left Side: Pricing, Limits, & Checkout CTA */}
            <div className="md:col-span-7 space-y-6 text-right">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#14101F]">
                  باقة {plan.tier_label_ar} {plan.quota_value} {plan.quota_unit}
                </h1>
                <p className="text-xs sm:text-sm text-[#5E5873] mt-1">
                  الاشتراك {plan.billing_period === 'yearly' ? 'السنوي' : 'الشهري'} المعتمد للإنترنت المنزلي من المصرية للاتصالات WE.
                </p>
              </div>

              {/* Pricing Breakdown Card (Change 2.3 & Change 3) */}
              {(() => {
                const isMonthly = plan.billing_period === 'monthly';
                const pricing = calculatePlanPricing(
                  plan.price_egp,
                  isMonthly
                    ? {
                        percent: 50,
                        max_discount_amount: 350,
                        is_eligible: true,
                        name_ar: 'خصم الترحيب 50%',
                      }
                    : null
                );

                return (
                  <div className="p-6 rounded-2xl bg-[#F8F9FA] border-2 border-[#E9E0F5] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                      <span className="text-sm font-semibold text-[#5E5873]">السعر الأساسي قبل الضريبة</span>
                      <span className="text-base font-bold text-[#14101F] tabular-nums">
                        {pricing.formatted_base}
                      </span>
                    </div>

                    {isMonthly && (
                      <div className="flex items-center justify-between text-sm text-[#FF7A1A] font-semibold">
                        <span>خصم الترحيب للعملاء الجدد (−50% بحد أقصى 350 ج.م)</span>
                        <span className="tabular-nums">− {pricing.formatted_discount}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-[#5E5873]">
                      <span>ضريبة القيمة المضافة القانونية (14%)</span>
                      <span className="tabular-nums font-medium">+ {pricing.formatted_vat}</span>
                    </div>

                    {pricing.rounding_adjustment !== 0 && (
                      <div className="flex items-center justify-between text-xs text-[#8E8A9F]">
                        <span>تقريب لأقرب جنيه</span>
                        <span className="tabular-nums">{pricing.formatted_rounding}</span>
                      </div>
                    )}

                    {/* Most Prominent Element: Total Due */}
                    <div className="pt-3 border-t-2 border-[#5C2D91]/20 flex items-baseline justify-between bg-[#F3EEFA] p-4 rounded-xl">
                      <div>
                        <span className="text-sm sm:text-base font-bold font-heading text-[#2A1250] block">
                          الإجمالي المستحق بعد الضريبة
                        </span>
                        <span className="text-[11px] text-[#5E5873]">
                          {isMonthly
                            ? 'سعر أول شهر للمشترك الجديد شامل 14% ضريبة'
                            : 'المبلغ المطلوب سداده للاشتراك السنوي شامل 14% ضريبة'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl sm:text-4xl font-extrabold font-heading text-[#5C2D91] tabular-nums block">
                          {pricing.formatted_total_due}
                        </span>
                        {isMonthly && (
                          <span className="text-[11px] text-[#8E8A9F] line-through tabular-nums">
                            التجديد الشهري: {calculatePlanPricing(plan.price_egp).formatted_total_due}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-[#8E8A9F] text-center">
                      {isMonthly
                        ? '* العرض الترحيبي (50% حتى 350 ج.م) سارٍ لأول طلب للعميل الجديد ولمرة واحدة لكل خط أرضي.'
                        : '* باقة سنوية تتمتع بخصم سنوي خاص (معفاة من عرض الترحيب).'}
                    </p>
                  </div>
                );
              })()}

              {/* Mandatory Quota Policy Clarification */}
              <div className="space-y-2.5 text-xs text-[#5E5873]">
                <div className="flex items-start gap-2">
                  <CheckIcon size={16} className="text-[#5C2D91] shrink-0 mt-0.5" />
                  <span>
                    <strong>سعة التحميل المحددة:</strong> {plan.quota_value} {plan.quota_unit} صريحة غير قابلة للتجزئة.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckIcon size={16} className="text-[#5C2D91] shrink-0 mt-0.5" />
                  <span>
                    <strong>عند انتهاء السعة:</strong> تنخفض سرعة الخط تلقائياً وفق سياسة الاستخدام العادل المعتمدة، ويمكنك شحن سعات إضافية أو التجديد المبكر في أي وقت.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckIcon size={16} className="text-[#5C2D91] shrink-0 mt-0.5" />
                  <span>
                    <strong>طرق الدفع بالتحويل الفوري:</strong> فودافون كاش، تطبيق إنستاباي، اتصالات كاش، وأورنج كاش.
                  </span>
                </div>
              </div>

              {/* Action Button & In-Site Support */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/checkout?planId=${plan.id}`}
                  className="flex-1"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-between"
                    rightIcon={<ArrowLeftRTL size={20} />}
                  >
                    متابعة الشراء وتأكيد رقم الخط
                  </Button>
                </Link>

                <Link href="/support" className="shrink-0">
                  <Button variant="outline" size="lg">
                    مركز الدعم والمساعدة
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Related Plans in Same Family */}
          {relatedPlans.length > 0 && (
            <div className="pt-8 space-y-4">
              <h2 className="text-xl font-bold font-heading text-[#14101F] text-right">
                سعات أخرى من عائلة {plan.tier_label_ar}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedPlans.map((rPlan) => (
                  <Card key={rPlan.id} tier={rPlan.tier} className="p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[#5C2D91]">
                        {rPlan.tier_label_ar}
                      </span>
                      <Badge variant="period" period={rPlan.billing_period} />
                    </div>
                    <div className="my-2 flex flex-col items-center">
                      <GBGauge
                        quotaValue={rPlan.quota_value}
                        quotaUnit={rPlan.quota_unit}
                        tier={rPlan.tier}
                        size="sm"
                      />
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#F4F5F7] flex items-center justify-between">
                      <span className="font-heading font-extrabold text-base text-[#14101F] tabular-nums">
                        {formatEgp(rPlan.price_egp)}
                      </span>
                      <Link href={`/plans/${rPlan.slug}`}>
                        <Button variant="ghost" size="sm">
                          التفاصيل ↗
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
