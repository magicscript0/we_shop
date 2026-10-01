'use client';

import React, { useState } from 'react';
import { Button, Badge, Modal, Input } from '@/components/ui';
import {
  CheckIcon,
  AlertTriangleIcon,
  ShieldCheckIcon,
  WalletIcon,
  ClockIcon,
  RouterIcon,
  ZapIcon,
} from '@/components/ui/Icons';
import { formatEgp } from '@/lib/utils';
import { OrderStatus } from '@/types/database';

interface VerificationOrder {
  id: string;
  orderNumber: string;
  submittedAt: string;
  customerName: string;
  customerPhone: string;
  weLineNumber: string;
  governorateCode: string;
  planName: string;
  quota: string;
  priceOriginal: number;
  discountAmount: number;
  priceFinal: number;
  paymentMethod: string;
  senderRef: string;
  transactionRef: string;
  amountSent: number;
  proofImageUrl: string;
  isDuplicateTx: boolean;
  isAmountMismatch: boolean;
  isFlaggedCustomer: boolean;
  status: OrderStatus;
  internalNotes: string;
}

export default function VerificationQueuePage() {
  // Mock Active Verification Queue (Oldest first as per Section 12.2)
  const [queue, setQueue] = useState<VerificationOrder[]>([
    {
      id: 'ord-101',
      orderNumber: 'WE-261001-1042',
      submittedAt: 'منذ 12 دقيقة',
      customerName: 'محمود عبد الفتاح',
      customerPhone: '01034027398',
      weLineNumber: '3214567',
      governorateCode: '013',
      planName: 'سوبر (Super)',
      quota: '500 GB',
      priceOriginal: 660,
      discountAmount: 330,
      priceFinal: 330,
      paymentMethod: 'فودافون كاش',
      senderRef: '01099887766',
      transactionRef: 'TX-98402192',
      amountSent: 330,
      proofImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      isDuplicateTx: false,
      isAmountMismatch: false,
      isFlaggedCustomer: false,
      status: 'proof_submitted',
      internalNotes: '',
    },
    {
      id: 'ord-102',
      orderNumber: 'WE-261001-1048',
      submittedAt: 'منذ 25 دقيقة',
      customerName: 'كريم إبراهيم',
      customerPhone: '01122334455',
      weLineNumber: '3298711',
      governorateCode: '013',
      planName: 'ميجا (Mega)',
      quota: '750 GB',
      priceOriginal: 1175,
      discountAmount: 588,
      priceFinal: 587,
      paymentMethod: 'إنستاباي (InstaPay)',
      senderRef: 'karim@instapay',
      transactionRef: 'IPN-5541920',
      amountSent: 500, // Mismatch! Sent 500 instead of 587
      proofImageUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80',
      isDuplicateTx: false,
      isAmountMismatch: true,
      isFlaggedCustomer: false,
      status: 'proof_submitted',
      internalNotes: 'المبلغ المحول في الإيصال 500 ج.م بينما المطلوب 587 ج.م.',
    },
    {
      id: 'ord-103',
      orderNumber: 'WE-261001-1055',
      submittedAt: 'منذ 38 دقيقة',
      customerName: 'سارة خالد',
      customerPhone: '01288776655',
      weLineNumber: '3214567', // Same line as ord-101! (Flagged)
      governorateCode: '013',
      planName: 'ألترا (Ultra)',
      quota: '500 GB',
      priceOriginal: 1150,
      discountAmount: 575,
      priceFinal: 575,
      paymentMethod: 'فودافون كاش',
      senderRef: '01288776655',
      transactionRef: 'TX-98402192', // Duplicate TX with ord-101!
      amountSent: 575,
      proofImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      isDuplicateTx: true,
      isAmountMismatch: false,
      isFlaggedCustomer: true,
      status: 'proof_submitted',
      internalNotes: 'اشتباه احتيال: تكرار رقم العملية واستخدام نفس الخط الأرضي في حسابين.',
    },
  ]);

  // Selected Order for Modal Detail & Zoom
  const [selectedOrder, setSelectedOrder] = useState<VerificationOrder | null>(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [rejectReasonModal, setRejectReasonModal] = useState(false);
  const [rejectReasonText, setRejectReasonText] = useState('رقم العملية غير مطابق لكشف الحساب الوارد.');

  // Actions
  const handleApprove = (orderId: string) => {
    setQueue((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'payment_verified' as OrderStatus } : o))
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: 'payment_verified' } : null));
    }
  };

  const handleStartProcessing = (orderId: string) => {
    setQueue((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'processing' as OrderStatus } : o))
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: 'processing' } : null));
    }
  };

  const handleComplete = (orderId: string) => {
    setQueue((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'completed' as OrderStatus } : o))
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: 'completed' } : null));
    }
  };

  const handleReject = () => {
    if (!selectedOrder) return;
    setQueue((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id
          ? { ...o, status: 'rejected' as OrderStatus, internalNotes: rejectReasonText }
          : o
      )
    );
    setSelectedOrder((prev) =>
      prev ? { ...prev, status: 'rejected', internalNotes: rejectReasonText } : null
    );
    setRejectReasonModal(false);
  };

  const pendingOrders = queue.filter((o) => o.status === 'proof_submitted');

  return (
    <div className="space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
              طابور مراجعة وتأكيد المدفوعات
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#B9F03C] text-[#1B0A33] text-xs font-bold font-mono">
              {pendingOrders.length} طلبات
            </span>
          </div>
          <p className="text-xs text-[#5E5873]">
            قلب المنظومة: مراجعة إيصالات التحويل، مطابقة كشوف الحساب، ورصد إشارات الاشتباه بدقة.
          </p>
        </div>

        <div className="text-xs text-[#5E5873] bg-white px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
          مرتب حسب: <strong>الأقدم أولاً (Oldest First)</strong>
        </div>
      </div>

      {/* Queue List Table */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#F8F9FA] text-[#5E5873] border-b border-[#E5E7EB] font-bold">
              <tr>
                <th className="py-3.5 px-4">رقم الطلب والوقت</th>
                <th className="py-3.5 px-4">العميل ورقم المحمول</th>
                <th className="py-3.5 px-4">الخط الأرضي</th>
                <th className="py-3.5 px-4">الباقة المطلوبة</th>
                <th className="py-3.5 px-4">المبلغ المستحق</th>
                <th className="py-3.5 px-4">وسيلة التحويل</th>
                <th className="py-3.5 px-4">رقم العملية (TX ID)</th>
                <th className="py-3.5 px-4 text-center">إشارات التحذير</th>
                <th className="py-3.5 px-4 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F5F7]">
              {queue.map((order) => (
                <tr
                  key={order.id}
                  className={`hover:bg-[#F6F2FC]/50 transition-colors ${
                    order.status === 'completed'
                      ? 'bg-emerald-50/40 opacity-70'
                      : order.status === 'rejected'
                      ? 'bg-rose-50/40 opacity-70'
                      : ''
                  }`}
                >
                  <td className="py-4 px-4 font-mono">
                    <span className="font-bold text-[#14101F] block">{order.orderNumber}</span>
                    <span className="text-[11px] text-[#8E8A9F]">{order.submittedAt}</span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-[#14101F] block">{order.customerName}</span>
                    <span className="text-[11px] text-[#5E5873] font-mono">{order.customerPhone}</span>
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-[#5C2D91]">
                    ({order.governorateCode}) - {order.weLineNumber}
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-[#14101F]">{order.planName}</span>
                    <span className="text-[#5C2D91] mr-1">({order.quota})</span>
                  </td>

                  <td className="py-4 px-4 tabular-nums font-bold text-[#14101F]">
                    {formatEgp(order.priceFinal)}
                    {order.discountAmount > 0 && (
                      <span className="block text-[10px] text-[#FF7A1A]">
                        (خصم {formatEgp(order.discountAmount)})
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 font-medium text-[#14101F]">
                    {order.paymentMethod}
                  </td>

                  <td className="py-4 px-4 font-mono text-[#5E5873]">
                    {order.transactionRef}
                  </td>

                  {/* Warning Indicators (Section 12.2) */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      {order.isDuplicateTx && (
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                          ⚠️ تكرار العملية
                        </span>
                      )}
                      {order.isAmountMismatch && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                          ⚠️ نقص في المبلغ
                        </span>
                      )}
                      {order.isFlaggedCustomer && (
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold text-[10px]">
                          ⚠️ اشتباه حسابات
                        </span>
                      )}
                      {!order.isDuplicateTx && !order.isAmountMismatch && !order.isFlaggedCustomer && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ سليم
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Action Button */}
                  <td className="py-4 px-4 text-center">
                    <Button
                      variant={order.status === 'proof_submitted' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      فتح الإيصال والمطابقة
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Full Order Verification & Image Zoom (Section 12.2) */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`مراجعة إيصال الطلب: ${selectedOrder.orderNumber}`}
          className="max-w-4xl"
        >
          <div className="space-y-6 text-right">
            {/* Warning Banners inside modal */}
            {selectedOrder.isDuplicateTx && (
              <div className="p-3 bg-rose-100 border border-rose-300 text-rose-900 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertTriangleIcon size={16} className="text-rose-700 shrink-0" />
                <span>تحذير أمني: رقم العملية ({selectedOrder.transactionRef}) مكرر في طلب سابق! يرجى التدقيق قبل الاعتماد.</span>
              </div>
            )}

            {selectedOrder.isAmountMismatch && (
              <div className="p-3 bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertTriangleIcon size={16} className="text-amber-700 shrink-0" />
                <span>تحذير مالي: المبلغ المحول ({selectedOrder.amountSent} ج.م) لا يطابق المطلوب ({selectedOrder.priceFinal} ج.م)!</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Column: Proof Image Preview with Zoom */}
              <div className="md:col-span-6 space-y-2">
                <span className="text-xs font-bold text-[#5E5873] block">
                  صورة إيصال التحويل (اضغط للتكبير):
                </span>
                <div
                  onClick={() => setIsZoomOpen(true)}
                  className="rounded-2xl border border-[#CBBAE7] p-2 bg-[#F4F5F7] cursor-zoom-in hover:shadow-md transition-shadow relative group"
                >
                  <img
                    src={selectedOrder.proofImageUrl}
                    alt="إيصال التحويل"
                    className="max-h-72 w-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-bold">
                    🔍 تكبير الصورة بدقة كاملة
                  </div>
                </div>
              </div>

              {/* Right Column: Verification Details */}
              <div className="md:col-span-6 space-y-4 text-xs">
                <div className="p-4 bg-[#F6F2FC] rounded-2xl border border-[#CBBAE7]/50 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#8E8A9F]">العميل:</span>
                    <span className="font-bold text-[#14101F]">{selectedOrder.customerName} ({selectedOrder.customerPhone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8A9F]">رقم الخط الأرضي:</span>
                    <span className="font-mono font-bold text-[#5C2D91]">({selectedOrder.governorateCode}) - {selectedOrder.weLineNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8A9F]">الباقة:</span>
                    <span className="font-bold text-[#14101F]">{selectedOrder.planName} {selectedOrder.quota}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8A9F]">المبلغ المطلوب:</span>
                    <span className="font-bold text-[#14101F] tabular-nums">{formatEgp(selectedOrder.priceFinal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8A9F]">المبلغ المحول:</span>
                    <span className={`font-bold tabular-nums ${selectedOrder.isAmountMismatch ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {formatEgp(selectedOrder.amountSent)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8A9F]">رقم المحفظة المحول منها:</span>
                    <span className="font-mono font-bold text-[#14101F]">{selectedOrder.senderRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8A9F]">رقم العملية (TX ID):</span>
                    <span className="font-mono font-bold text-[#5C2D91]">{selectedOrder.transactionRef}</span>
                  </div>
                </div>

                {/* Internal Notes Field */}
                <div>
                  <label className="block font-bold text-[#14101F] mb-1">
                    ملاحظات داخلية للمراجعين (Audit Trail Note):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="اكتب ملاحظاتك حول هذا الطلب..."
                    value={selectedOrder.internalNotes}
                    onChange={(e) =>
                      setSelectedOrder({ ...selectedOrder, internalNotes: e.target.value })
                    }
                    className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#5C2D91]"
                  />
                </div>
              </div>
            </div>

            {/* Workflow Action Buttons (Section 12.2) */}
            <div className="pt-4 border-t border-[#F4F5F7] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* 1. Approve Button */}
                {selectedOrder.status === 'proof_submitted' && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleApprove(selectedOrder.id)}
                    rightIcon={<CheckIcon size={16} />}
                  >
                    اعتماد التحويل (Approve)
                  </Button>
                )}

                {/* 2. Processing Button */}
                {selectedOrder.status === 'payment_verified' && (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => handleStartProcessing(selectedOrder.id)}
                    rightIcon={<ZapIcon size={16} />}
                  >
                    بدء الشحن على الخط (Processing)
                  </Button>
                )}

                {/* 3. Complete Button */}
                {selectedOrder.status === 'processing' && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleComplete(selectedOrder.id)}
                    rightIcon={<CheckIcon size={16} />}
                  >
                    تم الشحن بنجاح (Complete)
                  </Button>
                )}

                {/* Status Badge when completed */}
                {selectedOrder.status === 'completed' && (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                    ✓ مكتمل وتم التفعيل
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="md"
                  className="text-rose-600 border-rose-300 hover:bg-rose-50"
                  onClick={() => setRejectReasonModal(true)}
                >
                  رفض الطلب (Reject)
                </Button>

                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setSelectedOrder(null)}
                >
                  إغلاق
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Image Zoom Modal */}
      {isZoomOpen && selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomOpen(false)}
        >
          <img
            src={selectedOrder.proofImageUrl}
            alt="تكبير الإيصال"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectReasonModal && (
        <Modal
          isOpen={rejectReasonModal}
          onClose={() => setRejectReasonModal(false)}
          title="تحديد سبب رفض الطلب"
        >
          <div className="space-y-4 text-right">
            <p className="text-xs text-[#5E5873]">
              سيتم إشعار العميل بهذا السبب مع إتاحة إمكانية إعادة رفع الإيصال الصحيح:
            </p>

            <select
              value={rejectReasonText}
              onChange={(e) => setRejectReasonText(e.target.value)}
              className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl p-3 text-xs font-semibold"
            >
              <option value="رقم العملية غير مطابق لكشف الحساب الوارد.">رقم العملية غير مطابق لكشف الحساب الوارد.</option>
              <option value="المبلغ المحول في الإيصال أقل من إجمالي قيمة الباقة المطلوبة.">المبلغ المحول أقل من المطلوب.</option>
              <option value="الصورة المرفقة غير واضحة أو لا تظهر تفاصيل الحوالة.">الصورة المرفقة غير واضحة.</option>
              <option value="تم استخدام رقم هذه العملية مسبقاً في طلب آخر.">رقم العملية مكرر.</option>
              <option value="خط الإنترنت الأرضي موقوف أو عليه مديونية سابقة من شركة WE.">الخط موقوف من شركة WE.</option>
            </select>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-rose-600 border-rose-300"
                onClick={handleReject}
              >
                تأكيد الرفض
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectReasonModal(false)}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
