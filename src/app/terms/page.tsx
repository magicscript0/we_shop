import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8 text-right">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold font-heading text-[#14101F]">
              الشروط والأحكام
            </h1>
            <p className="text-xs text-[#5E5873]">
              تاريخ آخر تحديث: 1 أكتوبر 2026
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-md p-6 sm:p-10 space-y-6 text-sm text-[#5E5873] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold font-heading text-[#14101F]">
                1. مقدمة وصفة المتجر
              </h2>
              <p>
                يعمل هذا المتجر كوسيط وموزع معتمد لخدمات الشركة المصرية للاتصالات (WE). شراء أي باقة يعني موافقة العميل على تفويض فريق العمل بسداد وتفعيل الباقة المختارة على خط التليفون الأرضي المحدد.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold font-heading text-[#14101F]">
                2. دقة بيانات الخط الأرضي
              </h2>
              <p>
                يتحمل العميل المسؤولية الكاملة عن صحة رقم التليفون الأرضي وكود المحافظة المدخلين عند الطلب. في حال إدخال رقم خاطئ وتم شحن الباقة عليه بالفعل لا يمكن التراجع عن العملية أو استرداد المبلغ.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold font-heading text-[#14101F]">
                3. مهلة العداد التنازلي للتحويل (60 دقيقة)
              </h2>
              <p>
                تُحجز الباقة بسعرها المعلن لمدة 60 دقيقة من لحظة إنشاء الطلب. يلتزم العميل بإتمام التحويل ورفع لقطة الشاشة ورقم العملية قبل انقضاء العداد. في حال انقضاء الوقت دون رفع الإثبات، يلغى الطلب تلقائياً، وفي حال تم التحويل بعد انتهاء الوقت يجب مراجعة الدعم الفني يدوياً لتأكيد العملية.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold font-heading text-[#14101F]">
                4. شروط خصم الترحيب (50%)
              </h2>
              <p>
                يمنح خصم الترحيب حصرياً للعملاء الجدد عند أول طلب، ويحق لكل عميل الاستفادة منه لمرة واحدة فقط لكل حساب موثق، ولكل خط تليفون أرضي، ولكل رقم هاتف محمول. أي محاولة لإنشاء حسابات وهمية للاستفادة المتكررة من الخصم لنفس الخط تؤدي لرفض الطلب وحظر الحساب.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold font-heading text-[#14101F]">
                5. سعة التحميل وسياسة الاستخدام العادل
              </h2>
              <p>
                كافة الباقات محددة بسعات جيجابايت/تيرابايت صريحة. عند استهلاك السعة بالكامل تنخفض السرعة للحد الأدنى المعتمد من الشركة المصرية للاتصالات حتى بداية دورة الفاتورة القادمة أو تجديد الباقة مبكراً.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
