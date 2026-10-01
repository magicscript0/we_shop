'use client';

import React, { useState } from 'react';
import { Button, Badge, Input, Modal } from '@/components/ui';
import { ShieldCheckIcon, AlertTriangleIcon } from '@/components/ui/Icons';
import { formatEgp } from '@/lib/utils';

interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  registeredLines: string[];
  totalOrders: number;
  totalSpent: number;
  discountUsed: boolean;
  isBlocked: boolean;
  suspicionFlags: string[];
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([
    {
      id: 'cust-1',
      name: 'محمود عبد الفتاح',
      phone: '01034027398',
      email: 'mahmoud@example.com',
      registeredLines: ['013-3214567'],
      totalOrders: 3,
      totalSpent: 1650,
      discountUsed: true,
      isBlocked: false,
      suspicionFlags: [],
    },
    {
      id: 'cust-2',
      name: 'سارة خالد',
      phone: '01288776655',
      email: 'sara@example.com',
      registeredLines: ['013-3214567'], // Same line!
      totalOrders: 1,
      totalSpent: 575,
      discountUsed: true,
      isBlocked: false,
      suspicionFlags: ['اشتباه تعدد حسابات على نفس الخط الأرضي', 'محاولة تكرار رقم العملية TX-98402192'],
    },
    {
      id: 'cust-3',
      name: 'كريم إبراهيم',
      phone: '01122334455',
      email: 'karim@example.com',
      registeredLines: ['013-3298711'],
      totalOrders: 2,
      totalSpent: 2350,
      discountUsed: true,
      isBlocked: false,
      suspicionFlags: [],
    },
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  const toggleBlock = (custId: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === custId ? { ...c, isBlocked: !c.isBlocked } : c))
    );
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
            سجل العملاء وإشارات الاشتباه
          </h1>
          <p className="text-xs text-[#5E5873]">
            متابعة حسابات المشتركين، الخطوط المسجلة، استهلاك الخصومات، ورصد الأنماط الاحتيالية.
          </p>
        </div>

        <span className="text-xs font-bold text-[#5C2D91] bg-white px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
          إجمالي المسجلين: {customers.length} عميل
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#F8F9FA] text-[#5E5873] border-b border-[#E5E7EB] font-bold">
              <tr>
                <th className="py-3.5 px-4">العميل</th>
                <th className="py-3.5 px-4">رقم المحمول الموثق</th>
                <th className="py-3.5 px-4">الخطوط الأرضية</th>
                <th className="py-3.5 px-4">الطلبات</th>
                <th className="py-3.5 px-4">إجمالي السداد</th>
                <th className="py-3.5 px-4 text-center">خصم الترحيب</th>
                <th className="py-3.5 px-4 text-center">إشارات الاشتباه</th>
                <th className="py-3.5 px-4 text-center">الحالة والإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F5F7]">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-[#F6F2FC]/30 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-bold text-[#14101F] block">{c.name}</span>
                    <span className="text-[11px] text-[#8E8A9F]">{c.email}</span>
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-[#14101F]">
                    {c.phone}
                  </td>

                  <td className="py-4 px-4 font-mono text-[#5C2D91]">
                    {c.registeredLines.join('، ')}
                  </td>

                  <td className="py-4 px-4 font-bold tabular-nums">
                    {c.totalOrders}
                  </td>

                  <td className="py-4 px-4 font-bold tabular-nums text-[#14101F]">
                    {formatEgp(c.totalSpent)}
                  </td>

                  <td className="py-4 px-4 text-center">
                    {c.discountUsed ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        مستهلك
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                        متاح
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-center">
                    {c.suspicionFlags.length > 0 ? (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center justify-center gap-1 mx-auto max-w-[140px]">
                        ⚠️ {c.suspicionFlags.length} إشارات
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-bold text-[11px]">✓ طبيعي</span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => toggleBlock(c.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        c.isBlocked
                          ? 'bg-rose-600 text-white hover:bg-rose-700'
                          : 'bg-[#F4F5F7] text-rose-600 hover:bg-rose-50 border border-rose-200'
                      }`}
                    >
                      {c.isBlocked ? 'رفع الحظر' : 'حظر الحساب'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
