'use client';

import React, { useState } from 'react';
import { Badge, Input } from '@/components/ui';

interface AuditLogEntry {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetTable: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export default function AdminAuditLogsPage() {
  const [filterSearch, setFilterSearch] = useState('');

  const [logs] = useState<AuditLogEntry[]>([
    {
      id: 'log-1',
      actorName: 'أحمد سعيد',
      actorRole: 'verifier',
      action: 'اعتماد تحويل (Approve Payment)',
      targetTable: 'orders',
      details: 'تم اعتماد التحويل للطلب WE-261001-0984 بقيمة 1,175 ج.م',
      ipAddress: '197.38.12.84',
      createdAt: '2026-10-01 18:29:14',
    },
    {
      id: 'log-2',
      actorName: 'المهندس سيف',
      actorRole: 'owner',
      action: 'تعديل سعر باقة (Price Change)',
      targetTable: 'plans',
      details: 'تعديل سعر باقة سوبر 500 GB من 660 ج.م إلى 660 ج.م وإضافة شارة الأكثر طلباً',
      ipAddress: '156.204.18.91',
      createdAt: '2026-10-01 17:15:02',
    },
    {
      id: 'log-3',
      actorName: 'أحمد سعيد',
      actorRole: 'verifier',
      action: 'رفض طلب (Reject Order)',
      targetTable: 'orders',
      details: 'رفض الطلب WE-261001-0711 لعدم تطابق رقم العملية مع كشف حساب فودافون كاش',
      ipAddress: '197.38.12.84',
      createdAt: '2026-10-01 15:40:22',
    },
    {
      id: 'log-4',
      actorName: 'المهندس سيف',
      actorRole: 'owner',
      action: 'تحديث وسيلة دفع (Payment Method Update)',
      targetTable: 'payment_methods',
      details: 'تأكيد رقم فودافون كاش المعتمد 01034027398 وتحديث التعليمات',
      ipAddress: '156.204.18.91',
      createdAt: '2026-10-01 12:00:10',
    },
  ]);

  const filteredLogs = logs.filter(
    (l) =>
      l.actorName.includes(filterSearch) ||
      l.action.includes(filterSearch) ||
      l.details.includes(filterSearch) ||
      l.ipAddress.includes(filterSearch)
  );

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
            سجل التدقيق الرقابي غير القابل للتعديل (Audit Logs)
          </h1>
          <p className="text-xs text-[#5E5873]">
            توثيق كامل لكل عملية حساسة (اعتماد، رفض، تعديل أسعار، تغيير إعدادات) مع هوية الفاعل وعنوان الـ IP والوقت الدقيق.
          </p>
        </div>

        <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
          سجل غير قابل للحذف (Immutable)
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
        <Input
          placeholder="ابحث في سجلات التدقيق بالاسم، الإجراء، أو عنوان الـ IP..."
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
        />
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#F8F9FA] text-[#5E5873] border-b border-[#E5E7EB] font-bold">
              <tr>
                <th className="py-3 px-4">الوقت والتاريخ</th>
                <th className="py-3 px-4">الفاعل والدور</th>
                <th className="py-3 px-4">نوع الإجراء</th>
                <th className="py-3 px-4">تفاصيل العملية</th>
                <th className="py-3 px-4">عنوان IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F5F7]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F6F2FC]/30">
                  <td className="py-3.5 px-4 font-mono text-[#5E5873] whitespace-nowrap">
                    {log.createdAt}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#14101F] block">{log.actorName}</span>
                    <span className="text-[10px] text-[#5C2D91] font-bold uppercase">{log.actorRole}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#14101F]">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 text-[#5E5873] max-w-md">
                    {log.details}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#8E8A9F]">
                    {log.ipAddress}
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
