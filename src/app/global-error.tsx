'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Critical root-level application error:', error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-[#F8F9FA] text-[#14101F] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#5C2D91] text-white flex items-center justify-center mx-auto text-2xl font-bold">
            WE
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-extrabold text-[#14101F]">
              حدث خطأ أثناء تحميل التطبيق
            </h1>
            <p className="text-xs text-[#5E5873] leading-relaxed">
              يرجى إعادة المحاولة لتحديث الاتصال بالخادم.
            </p>
          </div>

          {error.digest && (
            <div className="font-mono text-xs text-[#8E8A9F] bg-[#F4F5F7] p-2 rounded-lg">
              رمز الخطأ: {error.digest}
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#5C2D91] text-white text-xs font-bold hover:bg-[#4A2480] transition-colors cursor-pointer"
            >
              إعادة تحميل الصفحة ↺
            </button>
            <a
              href="/"
              className="w-full py-2.5 px-4 rounded-xl bg-[#F4F5F7] text-[#14101F] text-xs font-bold hover:bg-[#E5E7EB] transition-colors"
            >
              الذهاب للرئيسية 🏠
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
