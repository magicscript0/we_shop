'use client';

import React, { useState } from 'react';
import { Button, Input } from '@/components/ui';

export default function AdminSettingsPage() {
  const [countdownMinutes, setCountdownMinutes] = useState(60);
  const [allowedCodes, setAllowedCodes] = useState('013, 02, 03');
  const [workingHoursFrom, setWorkingHoursFrom] = useState('09:00');
  const [workingHoursTo, setWorkingHoursTo] = useState('23:00');
  const [taxNoticeText, setTaxNoticeText] = useState('الأسعار غير شاملة ضريبة القيمة المضافة (14%)');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveAlert('تم حفظ وتحديث إعدادات المتجر العامة بنجاح.');
    setTimeout(() => setSaveAlert(null), 4000);
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
            إعدادات المتجر والتشغيل
          </h1>
          <p className="text-xs text-[#5E5873]">
            التحكم في مهلة العداد التنازلي، أكواد المحافظات المقبولة، وساعات العمل اليومية.
          </p>
        </div>

        <span className="text-xs font-bold text-[#5C2D91] bg-white px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
          System Settings
        </span>
      </div>

      {saveAlert && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 font-bold animate-in fade-in">
          ✓ {saveAlert}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="مدة العداد التنازلي لإرسال إثبات الدفع (بالدقائق)"
            type="number"
            required
            min={15}
            max={180}
            value={countdownMinutes}
            onChange={(e) => setCountdownMinutes(Number(e.target.value))}
            helperText="المدة الافتراضية المحددة في النظام: 60 دقيقة."
          />

          <Input
            label="أكواد المحافظات المقبولة للخطوط الأرضية (مفصولة بفاصلة)"
            required
            value={allowedCodes}
            onChange={(e) => setAllowedCodes(e.target.value)}
            helperText="013 كود القليوبية، 02 القاهرة والجيزة، 03 الإسكندرية."
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#14101F]">
              ساعات العمل اليومية (توقيت القاهرة)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={workingHoursFrom}
                onChange={(e) => setWorkingHoursFrom(e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl p-3 text-sm font-mono text-center"
              />
              <span className="text-xs text-[#5E5873]">إلى</span>
              <input
                type="time"
                value={workingHoursTo}
                onChange={(e) => setWorkingHoursTo(e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl p-3 text-sm font-mono text-center"
              />
            </div>
          </div>

          <Input
            label="نص إشعار ضريبة القيمة المضافة"
            value={taxNoticeText}
            onChange={(e) => setTaxNoticeText(e.target.value)}
          />
        </div>

        {/* Maintenance Mode Toggle */}
        <div className="pt-4 border-t border-[#F4F5F7]">
          <label className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB] cursor-pointer">
            <div>
              <span className="font-heading font-bold text-sm text-[#14101F] block">
                تفعيل وضع الصيانة المؤقت (Maintenance Mode)
              </span>
              <span className="text-xs text-[#5E5873]">
                عند التفعيل، تظهر رسالة صيانة للعملاء وتتوقف عمليات إنشاء طلبات جديدة مؤقتاً.
              </span>
            </div>

            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-[#5C2D91] focus:ring-[#5C2D91] cursor-pointer"
            />
          </label>
        </div>

        <div className="pt-2">
          <Button type="submit" variant="primary" size="md">
            حفظ إعدادات المتجر
          </Button>
        </div>
      </form>
    </div>
  );
}
