'use client';

import React from 'react';
import { Button, Badge } from '@/components/ui';
import { formatEgp } from '@/lib/utils';

export default function AdminReportsPage() {
  const methodStats = [
    { method: 'فودافون كاش', total: 64200, count: 82, share: 57 },
    { method: 'إنستاباي (InstaPay)', total: 38100, count: 34, share: 34 },
    { method: 'اتصالات كاش', total: 6500, count: 6, share: 6 },
    { method: 'أورنج كاش', total: 4000, count: 4, share: 3 },
  ];

  const rateMetrics = {
    totalOrders: 126,
    completed: 121,
    rejected: 3,
    expired: 2,
    completionRate: '96.0%',
    rejectionRate: '2.4%',
    expiryRate: '1.6%',
    avgReviewTime: '4.2 دقيقة',
  };

  const handleExportReport = () => {
    alert('جاري إعداد وتحميل تقرير الأداء المالي والتشغيلي الشامل...');
  };

  return (
    <div className="space-y-8 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
            التقارير والإحصائيات التحليلية
          </h1>
          <p className="text-xs text-[#5E5873]">
            تحليل دقيق للمبيعات حسب وسيلة الدفع، ومعدلات القبول والرفض، وزمن المراجعة الفعلي.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleExportReport}>
          تحميل تقرير شامل (PDF / Excel) ⤓
        </Button>
      </div>

      {/* Operational Efficiency Rates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-1">
          <span className="text-xs text-[#5E5873]">نسبة نجاح واكتمال الطلبات:</span>
          <div className="text-2xl font-extrabold font-heading text-emerald-600">
            {rateMetrics.completionRate}
          </div>
          <span className="text-[11px] text-[#8E8A9F] block">{rateMetrics.completed} من أصل {rateMetrics.totalOrders} طلب</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-1">
          <span className="text-xs text-[#5E5873]">متوسط وقت المراجعة والاعتماد:</span>
          <div className="text-2xl font-extrabold font-heading text-[#5C2D91]">
            {rateMetrics.avgReviewTime}
          </div>
          <span className="text-[11px] text-[#8E8A9F] block">من رفع الإيصال حتى التفعيل</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-1">
          <span className="text-xs text-[#5E5873]">معدل رفض الإيصالات (Rejection):</span>
          <div className="text-2xl font-extrabold font-heading text-rose-600">
            {rateMetrics.rejectionRate}
          </div>
          <span className="text-[11px] text-[#8E8A9F] block">{rateMetrics.rejected} طلبات مرفوضة مع ذكر السبب</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-1">
          <span className="text-xs text-[#5E5873]">معدل انقضاء العداد (Expiry):</span>
          <div className="text-2xl font-extrabold font-heading text-amber-600">
            {rateMetrics.expiryRate}
          </div>
          <span className="text-[11px] text-[#8E8A9F] block">{rateMetrics.expired} طلبات لم يتم رفع إيصال لها</span>
        </div>
      </div>

      {/* Payment Method Share Table */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="font-heading font-bold text-base text-[#14101F] pb-3 border-b border-[#F4F5F7]">
          توزيع المبيعات بحسب وسيلة الدفع (Payment Method Share)
        </h2>

        <div className="divide-y divide-[#F4F5F7]">
          {methodStats.map((item) => (
            <div key={item.method} className="py-4 space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-sm font-bold text-[#14101F]">{item.method}</span>
                <span className="font-bold text-[#5C2D91] tabular-nums text-sm">
                  {formatEgp(item.total)} ({item.count} عملية • {item.share}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#F4F5F7] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2A1250] to-[#5C2D91] rounded-full"
                  style={{ width: `${item.share}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
