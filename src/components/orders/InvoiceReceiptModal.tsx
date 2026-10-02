'use client';

import React from 'react';
import { Order } from '@/types/database';
import { formatEgp } from '@/lib/utils';
import { ShieldCheckIcon, CheckIcon, RouterIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui';

interface InvoiceReceiptModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const plan = order.plan_snapshot;
  const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E5E7EB] text-right max-h-[95vh] overflow-y-auto font-body print:p-0 print:border-none print:shadow-none print:max-w-none"
        dir="rtl"
        id="printable-invoice"
      >
        {/* Actions bar (hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F4F5F7] print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#5C2D91] bg-[#F6F2FC] px-3 py-1 rounded-full">
              إيصال رسمي معتمد
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" onClick={handlePrint} className="shadow-sm">
              طباعة / حفظ كـ PDF 🖨️
            </Button>
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="text-[#8E8A9F] hover:text-[#14101F] p-1.5 rounded-lg hover:bg-[#F4F5F7] transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="space-y-6 p-2 sm:p-4 border border-[#E5E7EB] rounded-2xl bg-white print:border-none">
          {/* Header */}
          <div className="flex items-start justify-between border-b pb-4 border-[#E5E7EB]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#5C2D91] text-white flex items-center justify-center font-bold">
                  <RouterIcon size={18} />
                </div>
                <h2 className="font-heading font-black text-xl text-[#14101F]">
                  فاتورة ضريبية رسمية / إشعار سداد
                </h2>
              </div>
              <p className="text-xs text-[#5E5873]">
                متجر باقات WE للإنترنت المنزلي • وكيل خدمات معتمد
              </p>
              <div className="text-[11px] text-[#8E8A9F] space-y-0.5">
                <div>رقم التسجيل الضريبي: 492-819-204 (خاضع لضريبة القيمة المضافة 14%)</div>
                <div>كود الوكالة المعتمد: 2026-WE-8841</div>
              </div>
            </div>

            <div className="text-left font-mono text-xs text-[#5E5873] space-y-1">
              <div>
                رقم الفاتورة: <strong className="text-[#14101F]">{order.order_number}</strong>
              </div>
              <div>التاريخ: {orderDate}</div>
              <div>
                الحالة:{' '}
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  مسدد بالكامل ومفعل
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Line Info */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-[#F8F9FA] p-4 rounded-xl border border-[#E5E7EB]">
            <div>
              <span className="text-[#5E5873] block mb-0.5">بيانات المستفيد والخط:</span>
              <div className="font-bold text-[#14101F]">
                {order.customer_phone ? `المحمول: ${order.customer_phone}` : 'عميل معتمد'}
              </div>
              <div className="font-mono font-bold text-[#5C2D91] mt-0.5" dir="ltr">
                خط أرضي: ({order.line_governorate_code || '013'}) {order.we_line_number}
              </div>
            </div>

            <div>
              <span className="text-[#5E5873] block mb-0.5">وسيلة السداد المستخدمة:</span>
              <div className="font-bold text-[#14101F]">
                {order.payment_method_id === 'instapay'
                  ? 'إنستاباي (InstaPay - تحويل لحظي)'
                  : 'محفظة فودافون كاش الإلكترونية'}
              </div>
              {order.proof_data?.transaction_ref && (
                <div className="font-mono text-[#5E5873] mt-0.5">
                  رقم العملية: {order.proof_data.transaction_ref}
                </div>
              )}
            </div>
          </div>

          {/* Line Item Table */}
          <table className="w-full text-right text-xs">
            <thead className="bg-[#F6F2FC] text-[#5C2D91] font-bold border-b border-[#CBBAE7]/50">
              <tr>
                <th className="py-2.5 px-3">البند / الخدمة</th>
                <th className="py-2.5 px-3">السعة المحددة</th>
                <th className="py-2.5 px-3">الفترة</th>
                <th className="py-2.5 px-3 text-left">السعر الأساسي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F5F7]">
              <tr>
                <td className="py-3 px-3 font-bold text-[#14101F]">
                  شحن باقة إنترنت منزلي ({plan?.tier_label_ar || 'سوبر'})
                </td>
                <td className="py-3 px-3">
                  {plan?.quota_value} {plan?.quota_unit}
                </td>
                <td className="py-3 px-3">
                  {plan?.billing_period === 'yearly' ? 'سنوية' : 'شهرية'}
                </td>
                <td className="py-3 px-3 text-left font-mono font-bold">
                  {formatEgp(order.price_original)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Pricing & VAT Breakdown (Change 2 & Change 3 Compliant) */}
          <div className="border-t border-[#E5E7EB] pt-3 flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-[#5E5873]">
                <span>السعر الأساسي قبل الضريبة:</span>
                <span className="font-mono">{formatEgp(order.price_original)}</span>
              </div>

              {order.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded">
                  <span>خصم الترحيب المطبق (50%):</span>
                  <span className="font-mono">− {formatEgp(order.discount_amount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#5E5873]">
                <span>الصافي الخاضع للضريبة:</span>
                <span className="font-mono">{formatEgp(order.net_amount || (order.price_original - order.discount_amount))}</span>
              </div>

              <div className="flex justify-between text-[#5E5873]">
                <span>ضريبة القيمة المضافة (14%):</span>
                <span className="font-mono">+ {formatEgp(order.vat_amount || 0)}</span>
              </div>

              {order.rounding_adjustment !== 0 && order.rounding_adjustment !== undefined && (
                <div className="flex justify-between text-[11px] text-[#8E8A9F]">
                  <span>تقريب لأقرب جنيه:</span>
                  <span className="font-mono">{formatEgp(order.rounding_adjustment)}</span>
                </div>
              )}

              <div className="flex justify-between font-heading font-extrabold text-sm text-[#5C2D91] pt-2 border-t-2 border-[#5C2D91] bg-[#F6F2FC] p-2.5 rounded-xl">
                <span>الإجمالي المسدد بالكامل:</span>
                <span className="font-mono text-base">{formatEgp(order.total_due || order.price_final)}</span>
              </div>
            </div>
          </div>

          {/* Official Verification Seal */}
          <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#5E5873]">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon size={24} className="text-emerald-600" />
              <div>
                <span className="font-bold text-[#14101F] block">تم التحقق والشحن رسمياً بنجاح</span>
                <span className="text-[10px] text-[#8E8A9F]">إيصال إلكتروني صادر آلياً ولا يحتاج إلى توقيع خطي.</span>
              </div>
            </div>

            <div className="text-left text-[10px] text-[#8E8A9F]">
              الدعم والاستفسار: support@westore-eg.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
