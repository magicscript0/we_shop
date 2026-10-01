import React from 'react';
import Link from 'next/link';
import { ShieldCheckIcon, RouterIcon, WalletIcon } from '@/components/ui/Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#14101F] text-white pt-14 pb-8 border-t border-[#2A1250]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#2A1250]">
          {/* Brand & Agency Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3A1C6E] to-[#5C2D91] flex items-center justify-center text-[#B9F03C]">
                <RouterIcon size={22} />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-lg text-white">
                  متجر باقات <span className="text-[#A98BD6]">WE</span>
                </span>
                <span className="text-xs text-[#8E8A9F]">وكيل خدمات معتمد</span>
              </div>
            </div>

            <p className="text-xs text-[#8E8A9F] leading-relaxed">
              منصة معتمدة لحجز وشحن باقات الإنترنت المنزلي من الشركة المصرية للاتصالات (WE) للأفراد في مصر، مع توفير وسائل دفع إلكترونية محلية سريعة وموثوقة.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#B9F03C] bg-[#2A1250]/70 p-2.5 rounded-lg border border-[#3A1C6E]">
              <ShieldCheckIcon size={16} />
              <span>موزع ووسيط معتمد لخدمات WE</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white">روابط سريعة</h4>
            <ul className="space-y-2 text-xs text-[#8E8A9F]">
              <li>
                <Link href="/plans" className="hover:text-[#B9F03C] transition-colors">
                  باقات الإنترنت المنزلي
                </Link>
              </li>
              <li>
                <Link href="/renew" className="hover:text-[#B9F03C] transition-colors">
                  تجديد الباقة الحالية
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-[#B9F03C] transition-colors">
                  تتبع حالة الطلب
                </Link>
              </li>
              <li>
                <a
                  href="https://te.eg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B9F03C] transition-colors"
                >
                  الاستعلام عن الرصيد (موقع WE الرسمي) ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white">السياسات والشروط</h4>
            <ul className="space-y-2 text-xs text-[#8E8A9F]">
              <li>
                <Link href="/terms" className="hover:text-[#B9F03C] transition-colors">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#B9F03C] transition-colors">
                  سياسة الخصوصية وحماية البيانات
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-[#B9F03C] transition-colors">
                  سياسة الإلغاء والاسترجاع
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#B9F03C] transition-colors">
                  عن الوكالة وبيانات السجل
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods & Support */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white">طرق الدفع والدعم</h4>
            <p className="text-xs text-[#8E8A9F]">
              نقبل التحويل الفوري عبر المحافظ الإلكترونية المعتمدة وتطبيق إنستاباي:
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 bg-[#2A1250] rounded-md text-[#E9E0F5] border border-[#3A1C6E]">
                فودافون كاش
              </span>
              <span className="px-2.5 py-1 bg-[#2A1250] rounded-md text-[#E9E0F5] border border-[#3A1C6E]">
                إنستاباي (InstaPay)
              </span>
              <span className="px-2.5 py-1 bg-[#2A1250] rounded-md text-[#E9E0F5] border border-[#3A1C6E]">
                اتصالات كاش
              </span>
              <span className="px-2.5 py-1 bg-[#2A1250] rounded-md text-[#E9E0F5] border border-[#3A1C6E]">
                أورنج كاش
              </span>
            </div>
            <div className="pt-2 text-xs text-[#8E8A9F]">
              <span>الدعم الفني عبر واتساب: </span>
              <a
                href="https://wa.me/201034027398"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B9F03C] font-semibold hover:underline"
              >
                01034027398
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Regulatory Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#5E5873] gap-3">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} - متجر خدمات باقات الإنترنت المنزلي. علامة WE وشعار المصرية للاتصالات ملك للشركة المصرية للاتصالات ش.م.م.
          </p>
          <p>
            رقم السجل التجاري / كود الوكالة المعتمد: [قيد المراجعة والاعتماد النهائي]
          </p>
        </div>
      </div>
    </footer>
  );
};
