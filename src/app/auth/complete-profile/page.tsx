'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input, Button } from '@/components/ui';
import { isValidEgyptianMobile } from '@/lib/utils';
import { GOVERNORATE_CODES } from '@/lib/constants';
import { ShieldCheckIcon } from '@/components/ui/Icons';
import { supabase } from '@/lib/supabase/client';

export default function CompleteProfilePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [governorateCode, setGovernorateCode] = useState('013');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const phoneValid = isValidEgyptianMobile(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneValid) {
      setErrorMsg('رقم المحمول غير صحيح. يجب أن يتكون من 11 رقماً ويبدأ بـ 010 أو 011 أو 012 أو 015.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from('profiles')
          .update({
            full_name: fullName.trim(),
            phone_number: phone.trim(),
            governorate_code: governorateCode,
          })
          .eq('id', user.id);
      }

      router.push('/auth/welcome-gift');
    } catch {
      router.push('/auth/welcome-gift');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] py-14 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E0F5] text-[#5C2D91] text-xs font-semibold">
              <ShieldCheckIcon size={14} />
              <span>الخطوة الأخيرة قبل استلام الهدية</span>
            </div>
            <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
              استكمال بيانات الحساب
            </h1>
            <p className="text-xs text-[#5E5873]">
              يرجى إدخال اسمك ورقم هاتفك المحمول المعتمد لتلقي إشعارات الشحن.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-6 sm:p-8 space-y-5 text-right">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold leading-relaxed">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="الاسم الثلاثي"
                placeholder="أدخل اسمك الكريم"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <Input
                label="رقم الهاتف المحمول (11 رقم)"
                placeholder="010XXXXXXXX"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={phone.length >= 11 && !phoneValid ? 'رقم هاتف مصري غير صحيح' : undefined}
                helperText="يستخدم لتأكيد العمليات والتواصل معك عبر واتساب."
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[#14101F]">
                  المحافظة التابع لها الخط الأرضي
                </label>
                <select
                  value={governorateCode}
                  onChange={(e) => setGovernorateCode(e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm font-semibold text-[#14101F] focus:outline-none focus:border-[#5C2D91] cursor-pointer"
                >
                  {Object.entries(GOVERNORATE_CODES).map(([code, name]) => (
                    <option key={code} value={code}>
                      ({code}) {name}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                isLoading={isLoading}
                disabled={phone.length > 0 && !phoneValid}
              >
                حفظ والمتابعة لاستلام هديتك
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
