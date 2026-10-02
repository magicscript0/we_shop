import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui';
import { RouterIcon, ShieldCheckIcon } from '@/components/ui/Icons';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F] font-body" dir="rtl">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-[#E5E7EB] shadow-lg">
          {/* Visual Icon Badge */}
          <div className="w-20 h-20 rounded-3xl bg-[#F6F2FC] text-[#5C2D91] flex items-center justify-center mx-auto text-3xl font-black font-mono shadow-inner">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#14101F]">
              الصفحة المطلوبة غير موجودة
            </h1>
            <p className="text-sm text-[#5E5873] leading-relaxed max-w-md mx-auto">
              يبدو أن الرابط الذي اتبعته غير صحيح أو تم نقله. يمكنك العودة لصفحة الباقات أو اختيار أحد الروابط السريعة أدناه.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full sm:w-auto font-bold">
                العودة للرئيسية 🏠
              </Button>
            </Link>

            <Link href="/plans" className="w-full sm:w-auto">
              <Button variant="secondary" size="md" className="w-full sm:w-auto font-bold">
                استعراض باقات WE 🏷️
              </Button>
            </Link>
          </div>

          {/* Helpful Navigation Links */}
          <div className="pt-6 border-t border-[#F4F5F7] grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-[#5E5873]">
            <Link href="/renew" className="p-2.5 rounded-xl hover:bg-[#F6F2FC] hover:text-[#5C2D91] transition-colors">
              🔄 التجديد السريع
            </Link>
            <Link href="/track" className="p-2.5 rounded-xl hover:bg-[#F6F2FC] hover:text-[#5C2D91] transition-colors">
              📦 تتبع حالة الطلب
            </Link>
            <Link href="/support" className="p-2.5 rounded-xl hover:bg-[#F6F2FC] hover:text-[#5C2D91] transition-colors">
              💬 الدعم الفني
            </Link>
          </div>

          <div className="pt-2 text-[11px] text-[#8E8A9F] flex items-center justify-center gap-1.5">
            <ShieldCheckIcon size={14} className="text-emerald-600" />
            <span>متجر معتمد لخدمات الإنترنت المنزلي من المصرية للاتصالات WE</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
