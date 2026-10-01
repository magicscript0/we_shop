'use client';

import React, { useState } from 'react';
import { Button, Badge } from '@/components/ui';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'verifier' | 'support';
  roleLabelAr: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
}

export default function AdminTeamPage() {
  const [members] = useState<TeamMember[]>([
    {
      id: 'mem-1',
      name: 'المهندس سيف (المالك)',
      email: 'owner@store.com',
      role: 'owner',
      roleLabelAr: 'مالك المتجر (Owner)',
      twoFactorEnabled: true,
      lastLogin: 'نشط الآن',
    },
    {
      id: 'mem-2',
      name: 'أحمد سعيد',
      email: 'verifier@store.com',
      role: 'verifier',
      roleLabelAr: 'مدقق مدفوعات (Verifier)',
      twoFactorEnabled: true,
      lastLogin: 'منذ ساعتين',
    },
    {
      id: 'mem-3',
      name: 'مروة كمال',
      email: 'support@store.com',
      role: 'support',
      roleLabelAr: 'خدمة عملاء (Support)',
      twoFactorEnabled: true,
      lastLogin: 'منذ 40 دقيقة',
    },
  ]);

  const permissionMatrix = [
    { name: 'مراجعة واعتماد إيصالات الدفع', verifier: true, support: false, admin: true, owner: true },
    { name: 'رفض الطلبات وإعادة إرسالها', verifier: true, support: false, admin: true, owner: true },
    { name: 'تعديل أسعار الباقات والخصومات', verifier: false, support: false, admin: false, owner: true },
    { name: 'تعديل أرقام المحافظ ووسائل الدفع', verifier: false, support: false, admin: true, owner: true },
    { name: 'حظر ورفع حظر العملاء', verifier: false, support: false, admin: true, owner: true },
    { name: 'الرد على استفسارات الدعم الفني', verifier: true, support: true, admin: true, owner: true },
    { name: 'الاطلاع على سجلات التدقيق الرقابي', verifier: false, support: false, admin: true, owner: true },
  ];

  return (
    <div className="space-y-8 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
            فريق العمل ومصفوفة الصلاحيات (RBAC)
          </h1>
          <p className="text-xs text-[#5E5873]">
            إدارة الأدوار (Owner / Admin / Verifier / Support) وتقييد الصلاحيات الحساسة مع إلزامية الـ 2FA.
          </p>
        </div>

        <span className="text-xs font-bold text-[#5C2D91] bg-white px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
          2FA إلزامي لجميع الإداريين
        </span>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="font-heading font-bold text-base text-[#14101F] pb-3 border-b border-[#F4F5F7]">
          أعضاء الفريق النشطين
        </h2>

        <div className="divide-y divide-[#F4F5F7]">
          {members.map((m) => (
            <div key={m.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2A1250] text-[#B9F03C] flex items-center justify-center font-bold">
                  {m.name.slice(0, 1)}
                </div>
                <div>
                  <span className="font-bold text-[#14101F] text-sm block">{m.name}</span>
                  <span className="text-[#8E8A9F]">{m.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-[#5C2D91] bg-[#F6F2FC] px-2.5 py-1 rounded-lg">
                  {m.roleLabelAr}
                </span>

                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <span>✓ 2FA مفعل</span>
                </div>

                <span className="text-[#8E8A9F] text-[11px] font-mono">{m.lastLogin}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Granular Permission Matrix (Section 12.10) */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden p-6 sm:p-8 space-y-4">
        <div className="pb-3 border-b border-[#F4F5F7]">
          <h2 className="font-heading font-bold text-base text-[#14101F]">
            مصفوفة الصلاحيات الدقيقة (Granular Permissions Matrix)
          </h2>
          <p className="text-xs text-[#5E5873] mt-0.5">
            توضح الإجراءات المسموح بها لكل دور على حدة (مثال: المدقق يعتمد الحوالات ولا يمكنه تعديل الأسعار).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#F8F9FA] text-[#5E5873] border-b border-[#E5E7EB] font-bold">
              <tr>
                <th className="py-3 px-4">الصلاحية / الإجراء</th>
                <th className="py-3 px-4 text-center">المدقق (Verifier)</th>
                <th className="py-3 px-4 text-center">خدمة العملاء (Support)</th>
                <th className="py-3 px-4 text-center">المدير (Admin)</th>
                <th className="py-3 px-4 text-center text-[#5C2D91]">المالك (Owner)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F5F7]">
              {permissionMatrix.map((p, idx) => (
                <tr key={idx} className="hover:bg-[#F6F2FC]/30">
                  <td className="py-3.5 px-4 font-bold text-[#14101F]">{p.name}</td>
                  <td className="py-3.5 px-4 text-center font-bold">
                    {p.verifier ? <span className="text-emerald-600">✓ مسموح</span> : <span className="text-rose-500">✕ محظور</span>}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold">
                    {p.support ? <span className="text-emerald-600">✓ مسموح</span> : <span className="text-rose-500">✕ محظور</span>}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold">
                    {p.admin ? <span className="text-emerald-600">✓ مسموح</span> : <span className="text-rose-500">✕ محظور</span>}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-[#5C2D91]">
                    <span className="text-emerald-600">✓ كامل الصلاحيات</span>
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
