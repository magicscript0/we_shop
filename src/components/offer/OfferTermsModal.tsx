'use client';

import React from 'react';
import { Button } from '@/components/ui';
import { ShieldCheckIcon, GiftIcon, ClockIcon } from '@/components/ui/Icons';

interface OfferTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfferTermsModal: React.FC<OfferTermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E5E7EB] text-right max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F4F5F7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F6F2FC] text-[#5C2D91] flex items-center justify-center">
              <GiftIcon size={22} />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg text-[#14101F]">
                شروط وأحكام العرض الترحيبي (خصم 50%)
              </h2>
              <span className="text-xs text-[#5E5873]">الشفافية الكاملة لحقوقك والتزاماتك</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="text-[#8E8A9F] hover:text-[#14101F] p-1.5 rounded-lg hover:bg-[#F4F5F7] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Clauses */}
        <div className="space-y-4 text-xs sm:text-sm text-[#5E5873] leading-relaxed">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F6F2FC] border border-[#CBBAE7]/50">
            <ShieldCheckIcon size={20} className="text-[#5C2D91] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#14101F] block mb-0.5">1. نسبة الخصم وسقف القيمة:</strong>
              يمنح العميل خصماً بنسبة 50% على السعر الأساسي للباقة الشهرية المؤهلة، وبحد أقصى (سقف الخصم) 350 جنيهاً مصرياً.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB]">
            <ShieldCheckIcon size={20} className="text-[#5C2D91] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#14101F] block mb-0.5">2. الأهلية وقاعدة الاستخدام الواحد:</strong>
              يطبق العرض تلقائياً عند أول عملية اشتراك فقط، ويشترط ألا يكون حساب العميل أو رقم التليفون الأرضي (WE) أو رقم الهاتف المحمول قد استفاد مسبقاً من أي عرض ترحيبي.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB]">
            <ClockIcon size={20} className="text-[#5C2D91] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#14101F] block mb-0.5">3. فترة الصلاحية:</strong>
              تظل الهدية الترحيبية مفعلة وصالحة للاستخدام بحسابك لمدة 7 أيام تقويمية تبدأ من تاريخ وساعة التسجيل لأول مرة.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB]">
            <ShieldCheckIcon size={20} className="text-[#5C2D91] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#14101F] block mb-0.5">4. نطاق الباقات المشمولة:</strong>
              العرض مخصص لباقات الإنترنت المنزلي الشهرية (سوبر، ميجا، ألترا، ماكس). الباقات السنوية مستثناة نظراً لتمتعها بخصومات سنوية مدمجة مسبقاً.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB]">
            <ShieldCheckIcon size={20} className="text-[#5C2D91] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#14101F] block mb-0.5">5. احتساب ضريبة القيمة المضافة (14%):</strong>
              تُحسب ضريبة الـ 14% على السعر الصافي بعد خصم قيمة العرض، مما يمنحك توفيراً إضافياً حقيقياً في إجمالي الفاتورة المدفوعة.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB]">
            <ClockIcon size={20} className="text-[#5C2D91] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#14101F] block mb-0.5">6. حجز السعر ومهلة السداد:</strong>
              عند إنشاء طلبك، يتم حجز الخصم والباقة لك عبر عداد تنازلي مدته 60 دقيقة محسوبة على الخادم لإتمام التحويل وإرفاق الإيصال.
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-2">
          <Button variant="primary" size="md" className="w-full" onClick={onClose}>
            فهمت الشروط، مواصلة التصفح
          </Button>
        </div>
      </div>
    </div>
  );
};
