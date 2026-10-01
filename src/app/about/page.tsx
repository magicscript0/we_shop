import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheckIcon, RouterIcon, CheckIcon } from '@/components/ui/Icons';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-10 text-right">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E0F5] text-[#5C2D91] text-xs font-semibold">
              <ShieldCheckIcon size={14} />
              <span>البيانات الرسمية والشفافية</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#14101F]">
              عن المتجر والوكالة
            </h1>
            <p className="text-sm text-[#5E5873]">
              وسيط وموزع معتمد لخدمات المصرية للاتصالات WE في جمهورية مصر العربية.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-md p-6 sm:p-10 space-y-6 leading-relaxed text-sm text-[#5E5873]">
            <h2 className="text-xl font-bold font-heading text-[#14101F]">
              من نحن وطبيعة عملنا
            </h2>
            <p>
              نحن جهة معتمدة تعمل كوكيل وموزع وسيط لخدمات الإنترنت المنزلي (ADSL / VDSL / FTTH) التابعة للشركة المصرية للاتصالات (WE). هدفنا تسهيل تجربة شراء وتجديد الباقات للأفراد داخل مصر، من خلال توفير بدائل دفع إلكترونية مرنة بدون الحاجة لبطاقات بنكية دولية، مع تقديم دعم فني متخصص.
            </p>

            <div className="p-4 rounded-2xl bg-[#F6F2FC] border border-[#CBBAE7]/50 text-xs text-[#2A1250] space-y-2">
              <span className="font-bold block text-sm">بيانات الوكالة الرسمية:</span>
              <p>• <strong>الصفة القانونية:</strong> وكيل معتمد وموزع خدمات المصرية للاتصالات.</p>
              <p>• <strong>رقم السجل التجاري / كود الوكيل:</strong> [قيد المراجعة والاعتماد النهائي].</p>
              <p>• <strong>المنطقة الجغرافية الرئيسية:</strong> محافظة القليوبية (كود 013) مع التوسع تدريجياً في المحافظات المجاورة.</p>
            </div>

            <h2 className="text-xl font-bold font-heading text-[#14101F] pt-4">
              التزامنا الصارم بالمصداقية
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckIcon size={16} className="text-[#5C2D91] shrink-0 mt-0.5" />
                <span>
                  <strong>لا باقات غير محدودة:</strong> نعلن صراحة أن كافة باقات الإنترنت المنزلي محددة بسعة تحميل (GB / TB)، ونرفض تماماً استخدام مصطلحات مضللة مثل "إنترنت مفتوح" أو "بلا حدود".
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon size={16} className="text-[#5C2D91] shrink-0 mt-0.5" />
                <span>
                  <strong>أسعار رسمية ومعلنة:</strong> جميع الأسعار مطابقة للوائح المعتمدة ونوضح حالة ضريبة القيمة المضافة بكل شفافية.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon size={16} className="text-[#5C2D91] shrink-0 mt-0.5" />
                <span>
                  <strong>تأكيد يدوي دقيق:</strong> تتم مراجعة إيصالات التحويل بدقة لضمان شحن الرصيد على الخط الأرضي الصحيح دون أخطاء.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
