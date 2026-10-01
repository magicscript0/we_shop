'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input, Button, Badge, GBGauge } from '@/components/ui';
import { ORDER_STATUS_LABELS } from '@/lib/constants';
import { ClockIcon, ShieldCheckIcon, ArrowLeftRTL } from '@/components/ui/Icons';
import { OrderStatus } from '@/types/database';

export default function TrackOrderPage() {
  const [orderQuery, setOrderQuery] = useState<string>('');
  const [searched, setSearched] = useState<boolean>(false);
  const [mockOrder, setMockOrder] = useState<{
    orderNumber: string;
    status: OrderStatus;
    planName: string;
    quota: string;
    line: string;
    date: string;
    price: string;
  } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setSearched(true);
    // Showcase simulation for Phase 2 tracking layout
    setMockOrder({
      orderNumber: orderQuery.toUpperCase().trim(),
      status: 'proof_submitted',
      planName: 'سوبر (Super)',
      quota: '500 GB',
      line: '013-3214567',
      date: new Date().toLocaleDateString('ar-EG'),
      price: '660 ج.م',
    });
  };

  const statusSteps = [
    { key: 'awaiting_payment', label: 'في انتظار الدفع' },
    { key: 'proof_submitted', label: 'جاري التحقق' },
    { key: 'payment_verified', label: 'تم تأكيد الدفع' },
    { key: 'processing', label: 'جاري الشحن' },
    { key: 'completed', label: 'تم الشحن' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#14101F]">
      <Header />

      <main className="flex-1 bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E0F5] text-[#5C2D91] text-xs font-semibold">
              <ClockIcon size={14} />
              <span>متابعة لحظية ومباشرة</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#14101F]">
              تتبع حالة طلبك
            </h1>
            <p className="text-xs sm:text-sm text-[#5E5873]">
              أدخل رقم الطلب الخاص بك لمتابعة حالة مراجعة الحوالة وتفعيل الباقة.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="bg-white rounded-3xl border border-[#E5E7EB] shadow-md p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="مثال: WE-261001-4821"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="font-mono text-center sm:text-right"
              />
              <Button type="submit" variant="primary" size="md" className="shrink-0">
                استعلام عن الطلب
              </Button>
            </div>
          </form>

          {/* Search Result Card */}
          {searched && mockOrder && (
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#F4F5F7] gap-3">
                <div>
                  <span className="text-xs text-[#5E5873]">رقم الطلب:</span>
                  <div className="font-mono font-bold text-lg text-[#14101F] tracking-wider mt-0.5">
                    {mockOrder.orderNumber}
                  </div>
                </div>
                <div>
                  <Badge variant="status" statusKey={mockOrder.status} size="lg" />
                </div>
              </div>

              {/* Status Stepper Progression */}
              <div className="py-2">
                <span className="block text-xs font-bold text-[#5E5873] mb-4 text-right">
                  مراحل تنفيذ وتفعيل الطلب:
                </span>
                <div className="grid grid-cols-5 gap-2 text-center select-none" dir="rtl">
                  {statusSteps.map((step, idx) => {
                    const isPassed = idx <= 1; // simulation for proof_submitted
                    const isCurrent = idx === 1;

                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-[#5C2D91] text-white ring-4 ring-[#E9E0F5]'
                              : isPassed
                              ? 'bg-[#B9F03C] text-[#1B0A33]'
                              : 'bg-[#F4F5F7] text-[#8E8A9F]'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <span
                          className={`text-[10px] mt-2 leading-tight ${
                            isCurrent
                              ? 'font-bold text-[#5C2D91]'
                              : isPassed
                              ? 'text-[#14101F]'
                              : 'text-[#8E8A9F]'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Info Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F6F2FC] text-right text-xs">
                <div>
                  <span className="text-[#8E8A9F] block">الباقة المطلوبة:</span>
                  <span className="font-bold text-[#14101F] mt-0.5 block">{mockOrder.planName} {mockOrder.quota}</span>
                </div>
                <div>
                  <span className="text-[#8E8A9F] block">رقم الخط الأرضي:</span>
                  <span className="font-bold text-[#14101F] mt-0.5 block font-mono">{mockOrder.line}</span>
                </div>
                <div>
                  <span className="text-[#8E8A9F] block">المبلغ الإجمالي:</span>
                  <span className="font-bold text-[#14101F] mt-0.5 block">{mockOrder.price}</span>
                </div>
                <div>
                  <span className="text-[#8E8A9F] block">تاريخ الإنشاء:</span>
                  <span className="font-bold text-[#14101F] mt-0.5 block">{mockOrder.date}</span>
                </div>
              </div>

              {/* WhatsApp Support Direct Button */}
              <div className="pt-2 text-center">
                <a
                  href={`https://wa.me/201034027398?text=${encodeURIComponent(
                    `مرحباً، أستفسر عن طلبي رقم: ${mockOrder.orderNumber}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#5C2D91] hover:underline"
                >
                  <span>هل تحتاج لمساعدة فورية بخصوص هذا الطلب؟ تواصل معنا عبر واتساب ↗</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
