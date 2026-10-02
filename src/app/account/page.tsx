'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button, Badge, Input, Card } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';
import {
  RouterIcon,
  ShieldCheckIcon,
  ClockIcon,
  GiftIcon,
  ArrowLeftRTL,
  CheckIcon,
} from '@/components/ui/Icons';
import { isValidWeLineNumber } from '@/lib/utils';

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'lines' | 'notifications'>('orders');

  // Interactive Saved Lines State
  const [savedLines, setSavedLines] = useState<string[]>(['013-3214567']);
  const [newLineNumber, setNewLineNumber] = useState('');
  const [lineAddError, setLineAddError] = useState<string | null>(null);

  // Sample Customer Data (demonstrated in UI)
  const user = {
    name: 'أحمد محمود',
    email: 'ahmed@example.com',
    phone: '01012345678',
    role: 'customer',
    hasWelcomeDiscount: true,
    discountDaysLeft: 6,
  };

  const orders = [
    {
      id: 'ord-1',
      orderNumber: 'WE-261001-4821',
      planName: 'سوبر (Super) 500 GB',
      price: '330 ج.م',
      originalPrice: '660 ج.م',
      discountApplied: '330 ج.م (خصم 50%)',
      line: '013-3214567',
      status: 'proof_submitted',
      date: '2026-10-01',
    },
  ];

  const notifications = [
    {
      id: 'notif-1',
      title: 'تم استلام إيصال التحويل لطلبك',
      message: 'يقوم فريق المراجعة حالياً بالتحقق من الحوالة وسيتم شحن الباقة على خطك قريباً.',
      time: 'منذ 15 دقيقة',
      isRead: false,
    },
    {
      id: 'notif-2',
      title: 'مرحباً بك! تم تفعيل خصم 50% الترحيبي',
      message: 'يمكنك استخدام الخصم على أول اشتراك لك خلال 7 أيام من تاريخ التسجيل.',
      time: 'منذ ساعتين',
      isRead: true,
    },
  ];

  const handleAddLine = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = isValidWeLineNumber(newLineNumber, '013');
    if (!validation.isValid) {
      setLineAddError(validation.errorAr || 'رقم الخط غير صحيح');
      return;
    }

    const formatted = `013-${newLineNumber.trim()}`;
    if (savedLines.includes(formatted)) {
      setLineAddError('هذا الخط مضاف بالفعل في قائمتك.');
      return;
    }

    setSavedLines([...savedLines, formatted]);
    setNewLineNumber('');
    setLineAddError(null);
  };

  const handleRemoveLine = (line: string) => {
    setSavedLines(savedLines.filter((l) => l !== line));
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // fallback
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Profile Header Card */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-right">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2A1250] to-[#5C2D91] text-[#B9F03C] flex items-center justify-center font-heading font-extrabold text-2xl shadow-md shrink-0">
                {user.name.slice(0, 1)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-[#14101F]">
                    {user.name}
                  </h1>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#F4F5F7] text-[#5C2D91] border border-[#E5E7EB] font-bold">
                    حساب عميل
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#5E5873]">
                  <span>البريد: {user.email}</span>
                  <span>•</span>
                  <span>المحمول: {user.phone}</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              تسجيل الخروج
            </Button>
          </div>

          {/* Active Welcome Gift Widget */}
          {user.hasWelcomeDiscount && (
            <div className="bg-gradient-to-r from-[#2A1250] to-[#4A2480] text-white rounded-3xl p-6 shadow-md border border-[#FF7A1A]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-right">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FF7A1A] text-white flex items-center justify-center shadow-lg shrink-0">
                  <GiftIcon size={26} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-base text-white">
                      هدية الترحيب: خصم 50% مفعّل بحسابك
                    </h3>
                    <Badge variant="discount">متبقي {user.discountDaysLeft} أيام</Badge>
                  </div>
                  <p className="text-xs text-[#cbbae7] mt-0.5">
                    يطبق تلقائياً عند إتمام أول طلب لشحن أي خط أرضي جديد.
                  </p>
                </div>
              </div>

              <Link href="/plans" className="shrink-0 w-full sm:w-auto">
                <Button variant="primary" size="sm" className="w-full sm:w-auto">
                  استخدم الخصم الآن
                </Button>
              </Link>
            </div>
          )}

          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-2 text-sm font-heading font-bold text-right" dir="rtl">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#5C2D91] text-white shadow-sm'
                  : 'text-[#5E5873] hover:text-[#14101F]'
              }`}
            >
              طلباتي ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('lines')}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'lines'
                  ? 'bg-[#5C2D91] text-white shadow-sm'
                  : 'text-[#5E5873] hover:text-[#14101F]'
              }`}
            >
              خطوط WE المحفوظة ({savedLines.length})
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-[#5C2D91] text-white shadow-sm'
                  : 'text-[#5E5873] hover:text-[#14101F]'
              }`}
            >
              الإشعارات ({notifications.filter((n) => !n.isRead).length})
            </button>
          </div>

          {/* Tab 1: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-right"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-base text-[#14101F]">
                          {order.orderNumber}
                        </span>
                        <Badge variant="status" statusKey={order.status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#5E5873]">
                        <span>الباقة: <strong>{order.planName}</strong></span>
                        <span>•</span>
                        <span>الخط الأرضي: <strong className="font-mono">{order.line}</strong></span>
                        <span>•</span>
                        <span>التاريخ: {order.date}</span>
                      </div>
                      <div className="text-xs text-[#5C2D91] font-semibold">
                        المبلغ المسدد: {order.price} ({order.discountApplied})
                      </div>
                    </div>

                    <Link href={`/track?order=${order.orderNumber}`}>
                      <Button variant="outline" size="sm" rightIcon={<ArrowLeftRTL size={16} />}>
                        تتبع الطلب مباشرة
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#CBBAE7] p-8 space-y-3">
                  <p className="text-sm font-semibold text-[#5E5873]">
                    لم تقم بإجراء أي طلبات حتى الآن.
                  </p>
                  <Link href="/plans">
                    <Button variant="primary" size="sm">
                      تصفح الباقات واطلب الآن
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Saved Lines */}
          {activeTab === 'lines' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-right">
              {/* Existing Lines List */}
              <div className="md:col-span-7 space-y-3">
                <h3 className="font-heading font-bold text-sm text-[#14101F] mb-3">
                  الخطوط الأرضية المسجلة بحسابك:
                </h3>
                {savedLines.map((line) => (
                  <div
                    key={line}
                    className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F6F2FC] text-[#5C2D91] flex items-center justify-center font-bold">
                        <RouterIcon size={20} />
                      </div>
                      <div>
                        <span className="font-mono font-bold text-base text-[#14101F] block" dir="ltr">
                          {line}
                        </span>
                        <span className="text-[11px] text-[#5E5873]">خط منزلي - القليوبية</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/renew`}>
                        <Button variant="secondary" size="sm">
                          تجديد فوري
                        </Button>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemoveLine(line)}
                        className="text-xs text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-md cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Line Form */}
              <div className="md:col-span-5 bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-sm space-y-4">
                <h3 className="font-heading font-bold text-sm text-[#14101F]">
                  إضافة خط أرضي جديد
                </h3>
                <p className="text-xs text-[#5E5873]">
                  احفظ خطوط منزلك أو أقاربك لتسهيل اختيارها بضغطة واحدة في الطلبات القادمة.
                </p>

                <form onSubmit={handleAddLine} className="space-y-4">
                  <Input
                    label="رقم التليفون الأرضي (بدون الكود)"
                    prefixAddon="013"
                    placeholder="أدخل 7 أرقام"
                    value={newLineNumber}
                    onChange={(e) => setNewLineNumber(e.target.value)}
                    error={lineAddError || undefined}
                  />

                  <Button type="submit" variant="primary" size="md" className="w-full">
                    حفظ الخط في الحساب
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* Tab 3: Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-3 text-right">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`bg-white rounded-2xl border p-5 transition-all ${
                    notif.isRead ? 'border-[#E5E7EB]' : 'border-[#5C2D91] bg-[#F6F2FC]/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-heading font-bold text-sm text-[#14101F]">
                      {notif.title}
                    </h4>
                    <span className="text-[11px] text-[#8E8A9F]">{notif.time}</span>
                  </div>
                  <p className="text-xs text-[#5E5873] leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
