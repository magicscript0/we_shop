'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import {
  PricingSettings,
  RoundingMode,
  CardPriceDisplay,
  DEFAULT_PRICING_SETTINGS,
  getStoredPricingSettings,
  saveStoredPricingSettings,
  resetPricingSettingsToDefault,
  calculatePlanPricing,
  formatPriceEgp,
} from '@/lib/services/pricing';
import { CheckIcon, AlertTriangleIcon, ShieldCheckIcon } from '@/components/ui/Icons';

export default function AdminSettingsPage() {
  // Central Pricing Settings (Change 2)
  const [pricingSettings, setPricingSettings] = useState<PricingSettings>(DEFAULT_PRICING_SETTINGS);

  // Operational Settings
  const [countdownMinutes, setCountdownMinutes] = useState(60);
  const [allowedCodes, setAllowedCodes] = useState('013, 02, 03');
  const [workingHoursFrom, setWorkingHoursFrom] = useState('09:00');
  const [workingHoursTo, setWorkingHoursTo] = useState('23:00');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  useEffect(() => {
    setPricingSettings(getStoredPricingSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredPricingSettings(pricingSettings);
    setSaveAlert('تم حفظ وتحديث إعدادات التسعير والتشغيل العامة وتطبيقها فورياً على المتجر.');
    setTimeout(() => setSaveAlert(null), 5000);
  };

  const handleResetPricing = () => {
    if (confirm('هل ترغب في إعادة ضبط إعدادات التسعير والضريبة إلى النسب الافتراضية (14% وضريبة غير مدمجة وتقريب لأقرب جنيه)؟')) {
      const reset = resetPricingSettingsToDefault();
      setPricingSettings(reset);
      setSaveAlert('تمت استعادة إعدادات التسعير الافتراضية بنجاح.');
      setTimeout(() => setSaveAlert(null), 4000);
    }
  };

  // Live Simulator on 200GB (330 EGP) and 500GB (660 EGP)
  const samplePricing200 = calculatePlanPricing(330, null, pricingSettings);
  const samplePricing200Discounted = calculatePlanPricing(
    330,
    { percent: 50, max_discount_amount: 350, is_eligible: true },
    pricingSettings
  );

  return (
    <div className="space-y-6 text-right font-body">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
            إعدادات المتجر ومحرك التسعير (Pricing & Operations)
          </h1>
          <p className="text-xs text-[#5E5873]">
            التحكم في نسبة ضريبة القيمة المضافة، سياسة التقريب، طريقة عرض الأسعار، ومهلة الـ 60 دقيقة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleResetPricing}>
            استعادة افتراضيات التسعير
          </Button>
          <span className="text-xs font-bold text-[#5C2D91] bg-white px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
            Central Pricing Engine v2
          </span>
        </div>
      </div>

      {saveAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
          <CheckIcon size={18} className="text-emerald-600 shrink-0" />
          <span>{saveAlert}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Central Pricing Engine Settings (Change 2) */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4F5F7]">
            <div>
              <h2 className="font-heading font-bold text-base text-[#14101F]">
                1. إعدادات محرك التسعير وضريبة القيمة المضافة (VAT Engine)
              </h2>
              <span className="text-xs text-[#5E5873]">
                تطبق هذه الإعدادات على كافة البطاقات، وصفحات التفاصيل، وبوابة الدفع.
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              محرك موحد نشط
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="نسبة ضريبة القيمة المضافة (VAT Rate %)"
              type="number"
              required
              min={0}
              max={30}
              step={0.5}
              value={pricingSettings.vat_rate}
              onChange={(e) =>
                setPricingSettings({ ...pricingSettings, vat_rate: Number(e.target.value) })
              }
              helperText="النسبة القانونية الرسمية المقررة في مصر: 14%."
            />

            <Input
              label="رمز العملة المعروضة (Currency Label)"
              required
              value={pricingSettings.currency_label}
              onChange={(e) =>
                setPricingSettings({ ...pricingSettings, currency_label: e.target.value })
              }
              helperText="الافتراضي المعتمد: ج.م"
            />

            {/* Rounding Mode */}
            <div className="space-y-1.5 text-right">
              <label className="block text-xs font-semibold text-[#14101F]">
                طريقة تقريب الفواتير (Rounding Mode):
              </label>
              <select
                value={pricingSettings.rounding_mode}
                onChange={(e) =>
                  setPricingSettings({
                    ...pricingSettings,
                    rounding_mode: e.target.value as RoundingMode,
                  })
                }
                className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#14101F]"
              >
                <option value="nearest_egp">التقريب لأقرب جنيه صحيح (nearest_egp - معتمد)</option>
                <option value="up_egp">التقريب لأعلى لأقرب جنيه (up_egp)</option>
                <option value="none">بدون تقريب كسور (إظهار القروش العشرية)</option>
              </select>
              <span className="text-[11px] text-[#8E8A9F] block">
                تمنع الكسور العشرية وتسهل على العميل تحويل المبلغ عبر فودافون كاش دون قروش.
              </span>
            </div>

            {/* Card Price Display */}
            <div className="space-y-1.5 text-right">
              <label className="block text-xs font-semibold text-[#14101F]">
                عرض السعر في بطاقات الكتالوج:
              </label>
              <select
                value={pricingSettings.card_price_display}
                onChange={(e) =>
                  setPricingSettings({
                    ...pricingSettings,
                    card_price_display: e.target.value as CardPriceDisplay,
                  })
                }
                className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold text-[#14101F]"
              >
                <option value="before_vat">السعر الأساسي مع بيان الضريبة 14% (قبل الضريبة)</option>
                <option value="after_vat">السعر النهائي الإجمالي شاملاً الضريبة مباشرة</option>
              </select>
            </div>
          </div>

          {/* Include VAT Toggle */}
          <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB] flex items-center justify-between">
            <div>
              <span className="font-heading font-bold text-xs text-[#14101F] block">
                الأسعار المعلنة في الكتالوج شاملة الضريبة بالفعل (Prices Include VAT)
              </span>
              <span className="text-[11px] text-[#5E5873]">
                الوضع الافتراضي معطل: أسعار WE الرسمية غير شاملة وتضاف الضريبة 14% عند الدفع.
              </span>
            </div>
            <input
              type="checkbox"
              checked={pricingSettings.prices_include_vat}
              onChange={(e) =>
                setPricingSettings({
                  ...pricingSettings,
                  prices_include_vat: e.target.checked,
                })
              }
              className="h-5 w-5 text-[#5C2D91] rounded cursor-pointer"
            />
          </div>

          {/* Live Simulator Box */}
          <div className="p-4 bg-gradient-to-r from-[#F6F2FC] to-purple-50 rounded-2xl border border-[#CBBAE7] space-y-2">
            <span className="text-xs font-bold text-[#5C2D91] block">
              معاينة حية للمحرك على باقة سوبر 200 GB (330 ج.م):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#CBBAE7]/50 space-y-1">
                <span className="font-bold text-[#14101F] block">سعر التجديد العادي:</span>
                <div className="flex justify-between text-[#5E5873]">
                  <span>الأساسي: {samplePricing200.formatted_base}</span>
                  <span>الضريبة: {samplePricing200.formatted_vat}</span>
                </div>
                <div className="flex justify-between font-bold text-[#5C2D91] pt-1 border-t border-[#F4F5F7]">
                  <span>المبلغ المطلوب:</span>
                  <span className="font-mono text-sm">{samplePricing200.formatted_total_due}</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-800 block">سعر الشهر الأول (خصم 50%):</span>
                <div className="flex justify-between text-[#5E5873]">
                  <span>الخصم: {samplePricing200Discounted.formatted_discount}</span>
                  <span>الضريبة: {samplePricing200Discounted.formatted_vat}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700 pt-1 border-t border-[#F4F5F7]">
                  <span>المبلغ المطلوب:</span>
                  <span className="font-mono text-sm">{samplePricing200Discounted.formatted_total_due}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Operations & Checkout Settings */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-8 space-y-6">
          <h2 className="font-heading font-bold text-base text-[#14101F] pb-3 border-b border-[#F4F5F7]">
            2. إعدادات التشغيل والعداد التنازلي
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="مدة العداد التنازلي لإرسال إثبات الدفع (بالدقائق)"
              type="number"
              required
              min={15}
              max={180}
              value={countdownMinutes}
              onChange={(e) => setCountdownMinutes(Number(e.target.value))}
              helperText="المدة الرسمية المقررة: 60 دقيقة لحجز الباقة."
            />

            <Input
              label="أكواد المحافظات المقبولة للخطوط الأرضية"
              required
              value={allowedCodes}
              onChange={(e) => setAllowedCodes(e.target.value)}
              helperText="013 القليوبية، 02 القاهرة الكبرى، 03 الإسكندرية."
            />

            <div className="space-y-1.5 text-right">
              <label className="block text-xs font-semibold text-[#14101F]">
                ساعات العمل اليومية لخدمة العملاء:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={workingHoursFrom}
                  onChange={(e) => setWorkingHoursFrom(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl p-3 text-xs font-mono text-center"
                />
                <span className="text-xs text-[#5E5873]">إلى</span>
                <input
                  type="time"
                  value={workingHoursTo}
                  onChange={(e) => setWorkingHoursTo(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl p-3 text-xs font-mono text-center"
                />
              </div>
            </div>

            <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB] flex items-center justify-between">
              <div>
                <span className="font-heading font-bold text-xs text-[#14101F] block">
                  تفعيل وضع الصيانة المؤقت (Maintenance Mode)
                </span>
                <span className="text-[11px] text-[#5E5873]">
                  يحجب إجراء طلبات جديدة مؤقتاً أثناء التحديثات الفنية.
                </span>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="h-5 w-5 text-[#5C2D91] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" variant="primary" size="lg" className="shadow-md">
            حفظ وتفعيل كافة الإعدادات
          </Button>
        </div>
      </form>
    </div>
  );
}
