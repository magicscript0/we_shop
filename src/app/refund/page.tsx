import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8 text-right">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold font-heading text-[#14101F]">
              سياسة الإلغاء والاسترجاع
            </h1>
            <p className="text-xs text-[#5E5873]">
              تاريخ آخر تحديث: 1 أكتوبر 2026
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-md p-6 sm:p-10 space-y-6 text-sm text-[#5E5873] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold font-heading text-[#14101F]">
                1. الإلغاء قبل التحويل
              </h2>
              <p>
                يحق للعميل إلغاء الطلب في أي وقت خلال فترة الـ 60 دقيقة طالما لم يقم بإجراء التحويل ورفع الإيصال، وينتهي الطلب تلقائياً بدون أي التزامات مالية.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold font-heading text-[#14101F]">
                2. الإلغاء بعد التحويل وقبل التفعيل
              </h2>
              <p>
                في حال قام العميل بالتحويل ويرغب في الإلغاء قبل بدء عملية شحن الباقة على الخط، يمكنه التواصل الفوري مع الدعم الفني عبر واتساب لطلب استرداد المبلغ، وتتم إعادة المبلغ لنفس رقم المحفظة أو الحساب المحول منه بعد خصم أي رسوم تحويل مفروضة من شبكة الاتصالات.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold font-heading text-[#14101F]">
                3. بعد إتمام شحن الباقة على الخط
              </h2>
              <p>
                بمجرد إتمام شحن الباقة وتفعيل الجيجابايت على رقم الخط الأرضي للعميل بنجاح، تصبح العملية نهائية وغير قابلة للإلغاء أو الاسترجاع نظراً لطبيعة الخدمات الرقمية المنفذة فورياً لدى الشركة المزودة (WE).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold font-heading text-[#14101F]">
                4. رفض الطلب من جانب الإدارة
              </h2>
              <p>
                في حال تعذر شحن الباقة لأسباب فنية متعلقة بالخط (مثل وجود مديونية سابقة على الخط أو إيقاف الخدمة من الشركة)، يتم إشعار العميل فوراً وإعادة كامل المبلغ المحول لنفس المحفظة خلال 24 ساعة عمل.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
