import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8 text-right">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold font-heading text-[#14101F]">
              سياسة الخصوصية وحماية البيانات
            </h1>
            <p className="text-xs text-[#5E5873]">
              متوافقة مع أحكام قانون حماية البيانات الشخصية المصري رقم 151 لسنة 2020
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-md p-6 sm:p-10 space-y-6 text-sm text-[#5E5873] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold font-heading text-[#14101F]">
                1. البيانات التي نقوم بجمعها
              </h2>
              <p>
                نلتزم بجمع الحد الأدنى الضروري من البيانات لتنفيذ وشحن باقتك، وتشمل:
              </p>
              <ul className="list-disc list-inside space-y-1 pr-2 text-xs">
                <li>الاسم ورقم الهاتف المحمول للتواصل وتأكيد الحساب.</li>
                <li>رقم خط التليفون الأرضي المنزلي المراد شحن الباقة عليه.</li>
                <li>بيانات إثبات التحويل (لقطة الشاشة ورقم العملية وقيمة التحويل).</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold font-heading text-[#14101F]">
                2. الغرض من معالجة البيانات
              </h2>
              <p>
                تُستخدم بياناتك حصراً لأغراض التحقق من سداد قيمة الباقة وتفعيلها يدوياً على خطك عبر الأنظمة المعتمدة، ولإرسال إشعارات حالة الطلب عبر الموقع أو البريد الإلكتروني.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold font-heading text-[#14101F]">
                3. أمن وتخزين البيانات وإيصالات التحويل
              </h2>
              <p>
                تُحفظ صور إيصالات الدفع في مستودعات سحابية خاصة مشفرة (Private Storage) ولا تتاح إلا لمدققي ومراجعي المدفوعات عبر روابط مؤقتة قصيرة الأجل (Signed URLs) بحد أقصى 15 دقيقة، ويتم حذف الصور نهائياً بعد انتهاء فترة التسوية المالية المعتمدة (90 يوماً).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold font-heading text-[#14101F]">
                4. عدم مشاركة البيانات مع أطراف ثالثة
              </h2>
              <p>
                لا نقوم ببيع أو تأجير أو مشاركة بياناتك الشخصية مع أي جهات خارجية أو شبكات إعلانية، وتقتصر المشاركة فقط على تنفيذ عملية الشحن لدى الشركة المزودة للخدمة (WE).
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
