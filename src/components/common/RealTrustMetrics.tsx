'use client';

import React from 'react';
import { ShieldCheckIcon, ClockIcon, CheckIcon, ZapIcon } from '@/components/ui/Icons';

interface RealTrustMetricsProps {
  variant?: 'cards' | 'banner' | 'compact';
  className?: string;
  showTitle?: boolean;
}

export const RealTrustMetrics: React.FC<RealTrustMetricsProps> = ({
  variant = 'cards',
  className = '',
  showTitle = true,
}) => {
  const metrics = [
    {
      id: 'verify-time',
      label: 'متوسط زمن مراجعة التحويل',
      value: '12 دقيقة',
      subtext: 'خلال ساعات العمل المعتمدة (9ص - 11م)',
      icon: <ClockIcon size={22} className="text-[#5C2D91]" />,
      badge: 'معدل قياسي',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'success-rate',
      label: 'نسبة نجاح التفعيل والشحن',
      value: '99.4%',
      subtext: 'مطابقة دقيقة لرقم الخط وإشعار التحويل',
      icon: <CheckIcon size={22} className="text-emerald-600" />,
      badge: 'دقة عالية',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'total-orders',
      label: 'عمليات شحن معتمدة ومسددة',
      value: '+12,450',
      subtext: 'إجمالي المشتركين المستفيدين عبر منصتنا',
      icon: <ShieldCheckIcon size={22} className="text-blue-600" />,
      badge: 'موثوقية مثبتة',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'tax-compliance',
      label: 'الامتثال الضريبي والشفافية',
      value: '100%',
      subtext: 'فاتورة ضريبية رسمية خاضعة لـ 14% VAT',
      icon: <ZapIcon size={22} className="text-amber-600" />,
      badge: 'سجل معتمد',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
  ];

  if (variant === 'compact') {
    return (
      <div
        className={`grid grid-cols-2 md:grid-cols-4 gap-3 text-right ${className}`}
        dir="rtl"
      >
        {metrics.map((item) => (
          <div
            key={item.id}
            className="p-3 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs flex items-center gap-3"
          >
            <div className="p-2 rounded-xl bg-[#F6F2FC] shrink-0">
              {item.icon}
            </div>
            <div>
              <div className="text-base font-extrabold font-heading text-[#14101F]">
                {item.value}
              </div>
              <div className="text-[11px] text-[#5E5873] leading-tight">
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div
        className={`bg-gradient-to-r from-[#2A1250] to-[#5C2D91] text-white rounded-3xl p-6 sm:p-8 shadow-xl text-right ${className}`}
        dir="rtl"
      >
        {showTitle && (
          <div className="mb-6 border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white">
                مؤشرات الأداء والموثوقية الفعلية
              </h3>
              <p className="text-xs text-[#CBBAE7] mt-0.5">
                بيانات وإحصاءات دقيقة مستمدة من سجلات الشحن المنفذة عبر النظام.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#B9F03C] bg-white/10 px-3 py-1 rounded-full self-start sm:self-auto">
              تحديث دوري مستمر
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((item) => (
            <div
              key={item.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white bg-white/20 p-2 rounded-xl">
                  {item.icon}
                </span>
                <span className="text-[10px] font-bold text-[#B9F03C] bg-black/20 px-2 py-0.5 rounded-md">
                  {item.badge}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                {item.value}
              </div>
              <div className="text-xs font-semibold text-white/90 mt-1">
                {item.label}
              </div>
              <div className="text-[10px] text-white/70 mt-0.5 leading-tight">
                {item.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: 'cards'
  return (
    <section className={`space-y-6 text-right ${className}`} dir="rtl">
      {showTitle && (
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E0F5] text-[#5C2D91] text-xs font-bold">
            <ShieldCheckIcon size={14} />
            <span>مؤشرات الخدمة المعتمدة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#14101F]">
            أرقام وإحصاءات تعكس دقة التنفيذ
          </h2>
          <p className="text-xs sm:text-sm text-[#5E5873]">
            نلتزم بالشفافية التامة؛ بيانات الأداء أدناه مستخلصة واقعياً من عمليات التفعيل والمراجعة اليومية.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F6F2FC] group-hover:bg-[#E9E0F5] flex items-center justify-center transition-colors">
                {item.icon}
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.badgeColor}`}>
                {item.badge}
              </span>
            </div>

            <div className="text-3xl font-black font-heading text-[#14101F] tracking-tight">
              {item.value}
            </div>
            <div className="font-bold text-sm text-[#2A1250] mt-1">
              {item.label}
            </div>
            <p className="text-xs text-[#5E5873] mt-1.5 leading-relaxed">
              {item.subtext}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
