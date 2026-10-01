'use client';

import React, { useState, useMemo } from 'react';
import { Button, Badge, Input, Modal } from '@/components/ui';
import { ORDER_STATUS_LABELS } from '@/lib/constants';
import { formatEgp } from '@/lib/utils';
import { OrderStatus } from '@/types/database';

interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  weLineNumber: string;
  governorateCode: string;
  planName: string;
  priceFinal: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  events: Array<{ from: string; to: string; time: string; note?: string }>;
}

export default function AllOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  // Mock Orders Dataset
  const [orders] = useState<OrderItem[]>([
    {
      id: 'ord-1',
      orderNumber: 'WE-261001-1042',
      customerName: 'محمود عبد الفتاح',
      customerPhone: '01034027398',
      weLineNumber: '3214567',
      governorateCode: '013',
      planName: 'سوبر 500 GB',
      priceFinal: 330,
      paymentMethod: 'فودافون كاش',
      status: 'proof_submitted',
      createdAt: '2026-10-01 19:40',
      events: [
        { from: 'awaiting_payment', to: 'proof_submitted', time: '19:42', note: 'قام العميل برفع صورة الإيصال' },
      ],
    },
    {
      id: 'ord-2',
      orderNumber: 'WE-261001-0984',
      customerName: 'طارق حسام',
      customerPhone: '01122334455',
      weLineNumber: '3298711',
      governorateCode: '013',
      planName: 'ميجا 750 GB',
      priceFinal: 1175,
      paymentMethod: 'إنستاباي (InstaPay)',
      status: 'completed',
      createdAt: '2026-10-01 18:20',
      events: [
        { from: 'awaiting_payment', to: 'proof_submitted', time: '18:25' },
        { from: 'proof_submitted', to: 'payment_verified', time: '18:29', note: 'مطابقة تحويل إنستاباي' },
        { from: 'payment_verified', to: 'processing', time: '18:30' },
        { from: 'processing', to: 'completed', time: '18:34', note: 'تم التفعيل بنجاح على نظام WE' },
      ],
    },
    {
      id: 'ord-3',
      orderNumber: 'WE-261001-0850',
      customerName: 'أشرف كمال',
      customerPhone: '01299887766',
      weLineNumber: '3244190',
      governorateCode: '013',
      planName: 'ألترا 500 GB',
      priceFinal: 1150,
      paymentMethod: 'اتصالات كاش',
      status: 'completed',
      createdAt: '2026-10-01 16:15',
      events: [
        { from: 'awaiting_payment', to: 'proof_submitted', time: '16:20' },
        { from: 'proof_submitted', to: 'completed', time: '16:25', note: 'شحن فوري' },
      ],
    },
    {
      id: 'ord-4',
      orderNumber: 'WE-261001-0720',
      customerName: 'مازن يسري',
      customerPhone: '01511223344',
      weLineNumber: '3200192',
      governorateCode: '013',
      planName: 'سوبر 250 GB',
      priceFinal: 395,
      paymentMethod: 'فودافون كاش',
      status: 'expired',
      createdAt: '2026-10-01 14:10',
      events: [
        { from: 'awaiting_payment', to: 'expired', time: '15:10', note: 'انقضاء مهلة الـ 60 دقيقة دون رفع إيصال' },
      ],
    },
  ]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matches =
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.includes(q) ||
          o.customerPhone.includes(q) ||
          o.weLineNumber.includes(q);
        if (!matches) return false;
      }

      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (methodFilter !== 'all' && o.paymentMethod !== methodFilter) return false;

      return true;
    });
  }, [orders, search, statusFilter, methodFilter]);

  // CSV Export with UTF-8 BOM for Arabic excel compatibility (Section 12.3)
  const handleExportCsv = () => {
    const headers = ['رقم الطلب', 'اسم العميل', 'رقم الهاتف', 'الخط الأرضي', 'الباقة', 'المبلغ (ج.م)', 'طريقة الدفع', 'الحالة', 'التاريخ'];
    const rows = filteredOrders.map((o) => [
      o.orderNumber,
      o.customerName,
      o.customerPhone,
      `(${o.governorateCode}) ${o.weLineNumber}`,
      o.planName,
      o.priceFinal,
      o.paymentMethod,
      ORDER_STATUS_LABELS[o.status]?.labelAr || o.status,
      o.createdAt,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `we_store_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-right">
      {/* Title & CSV Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
            سجل كافة الطلبات والعمليات
          </h1>
          <p className="text-xs text-[#5E5873]">
            البحث والفلترة التفصيلية ومراجعة السجل الزمني لكل حركة شحن.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleExportCsv}>
          تصدير إلى ملف CSV (Excel) ⤓
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-6">
          <Input
            placeholder="ابحث برقم الطلب، رقم الخط، أو رقم هاتف العميل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl px-3 py-3 text-xs font-semibold text-[#14101F] focus:outline-none"
          >
            <option value="all">كافة الحالات</option>
            <option value="proof_submitted">جاري التحقق</option>
            <option value="payment_verified">تم تأكيد الدفع</option>
            <option value="processing">جاري الشحن</option>
            <option value="completed">تم الشحن (مكتمل)</option>
            <option value="rejected">مرفوض</option>
            <option value="expired">منتهي الصلاحية</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl px-3 py-3 text-xs font-semibold text-[#14101F] focus:outline-none"
          >
            <option value="all">كافة وسائل الدفع</option>
            <option value="فودافون كاش">فودافون كاش</option>
            <option value="إنستاباي (InstaPay)">إنستاباي (InstaPay)</option>
            <option value="اتصالات كاش">اتصالات كاش</option>
            <option value="أورنج كاش">أورنج كاش</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#F8F9FA] text-[#5E5873] border-b border-[#E5E7EB] font-bold">
              <tr>
                <th className="py-3 px-4">رقم الطلب</th>
                <th className="py-3 px-4">العميل</th>
                <th className="py-3 px-4">الخط الأرضي</th>
                <th className="py-3 px-4">الباقة</th>
                <th className="py-3 px-4">المبلغ</th>
                <th className="py-3 px-4">وسيلة الدفع</th>
                <th className="py-3 px-4 text-center">الحالة</th>
                <th className="py-3 px-4">التاريخ</th>
                <th className="py-3 px-4 text-center">التفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F5F7]">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-[#F6F2FC]/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#14101F]">
                    {o.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#14101F] block">{o.customerName}</span>
                    <span className="text-[11px] text-[#5E5873] font-mono">{o.customerPhone}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#5C2D91]">
                    ({o.governorateCode}) - {o.weLineNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#14101F]">
                    {o.planName}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums font-bold text-[#14101F]">
                    {formatEgp(o.priceFinal)}
                  </td>
                  <td className="py-3.5 px-4 text-[#5E5873]">
                    {o.paymentMethod}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant="status" statusKey={o.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-[#8E8A9F]">
                    {o.createdAt}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(o)}
                      className="text-xs font-bold text-[#5C2D91] hover:underline cursor-pointer"
                    >
                      عرض السجل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Event Log Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`سجل أحداث الطلب: ${selectedOrder.orderNumber}`}
        >
          <div className="space-y-4 text-right text-xs">
            <div className="p-3 bg-[#F6F2FC] rounded-xl border border-[#CBBAE7]/50 space-y-1">
              <div>العميل: <strong>{selectedOrder.customerName}</strong> ({selectedOrder.customerPhone})</div>
              <div>الخط الأرضي: <strong>({selectedOrder.governorateCode}) {selectedOrder.weLineNumber}</strong></div>
              <div>الباقة: <strong>{selectedOrder.planName}</strong> بمبلغ <strong>{formatEgp(selectedOrder.priceFinal)}</strong></div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-[#14101F] block">التاريخ الزمني للحالات (Order Events Trail):</span>
              <div className="space-y-2 border-r-2 border-[#5C2D91] pr-3 mr-1">
                {selectedOrder.events.map((ev, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#8E8A9F]">{ev.time}</span>
                      <span className="font-bold text-[#14101F]">
                        {ORDER_STATUS_LABELS[ev.to]?.labelAr || ev.to}
                      </span>
                    </div>
                    {ev.note && <p className="text-[11px] text-[#5E5873]">{ev.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
