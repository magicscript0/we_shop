'use client';

import React, { useState } from 'react';
import { Button, Badge, Modal, Input } from '@/components/ui';
import { SEED_PLANS } from '@/lib/constants';
import { formatEgp } from '@/lib/utils';
import { Plan } from '@/types/database';

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>(SEED_PLANS);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editSpeed, setEditSpeed] = useState<string>('');
  const [editBadge, setEditBadge] = useState<string>('');
  const [auditLogNotice, setAuditLogNotice] = useState<string | null>(null);

  const handleOpenEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setEditPrice(plan.price_egp);
    setEditSpeed(plan.speed_mbps !== null && plan.speed_mbps !== undefined ? String(plan.speed_mbps) : '');
    setEditBadge(plan.badge || '');
  };

  const handleSavePlan = () => {
    if (!editingPlan) return;

    const oldPrice = editingPlan.price_egp;
    const newPrice = Number(editPrice);

    setPlans((prev) =>
      prev.map((p) =>
        p.id === editingPlan.id
          ? {
              ...p,
              price_egp: newPrice,
              speed_mbps: editSpeed ? Number(editSpeed) : null,
              badge: editBadge.trim() || null,
            }
          : p
      )
    );

    // Audit log notification (Section 7 & 12.4)
    if (oldPrice !== newPrice) {
      setAuditLogNotice(
        `تم تسجيل تعديل سعر باقة ${editingPlan.tier_label_ar} ${editingPlan.quota_value} ${editingPlan.quota_unit} من ${formatEgp(oldPrice)} إلى ${formatEgp(newPrice)} في سجل التدقيق الرقابي (Audit Log).`
      );
      setTimeout(() => setAuditLogNotice(null), 5000);
    }

    setEditingPlan(null);
  };

  const handleToggleActive = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, is_active: !p.is_active } : p))
    );
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
            إدارة الباقات والأسعار المعتمدة
          </h1>
          <p className="text-xs text-[#5E5873]">
            التحكم في الـ 34 باقة، تعديل الأسعار المسجلة في سجل الرقابة، وتحديد شارات الطلب وسرعة الخط.
          </p>
        </div>

        <span className="text-xs font-bold text-[#5C2D91] bg-white px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
          إجمالي الباقات: {plans.length} باقة
        </span>
      </div>

      {auditLogNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 font-bold animate-in fade-in">
          ✓ {auditLogNotice}
        </div>
      )}

      {/* Plans Table */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#F8F9FA] text-[#5E5873] border-b border-[#E5E7EB] font-bold">
              <tr>
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">العائلة</th>
                <th className="py-3.5 px-4">السعة المحددة</th>
                <th className="py-3.5 px-4">الفترة</th>
                <th className="py-3.5 px-4">السعر الرسمي</th>
                <th className="py-3.5 px-4">السرعة (ميجابت/ث)</th>
                <th className="py-3.5 px-4">الشارة</th>
                <th className="py-3.5 px-4 text-center">الحالة</th>
                <th className="py-3.5 px-4 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F5F7]">
              {plans.map((p, idx) => (
                <tr key={p.id} className="hover:bg-[#F6F2FC]/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[#8E8A9F]">{idx + 1}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="family" tier={p.tier}>
                      {p.tier_label_ar}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-heading font-extrabold text-sm text-[#14101F]">
                    {p.quota_value} {p.quota_unit}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="period" period={p.billing_period} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 font-heading font-bold text-sm text-[#14101F] tabular-nums">
                    {formatEgp(p.price_egp)}
                  </td>
                  <td className="py-3.5 px-4 text-[#5E5873]">
                    {p.speed_mbps ? `${p.speed_mbps} ميجابت/ث` : 'غير محدد (مخفي)'}
                  </td>
                  <td className="py-3.5 px-4">
                    {p.badge ? (
                      <span className="px-2 py-0.5 rounded bg-[#B9F03C] text-[#1B0A33] font-bold text-[10px]">
                        {p.badge}
                      </span>
                    ) : (
                      <span className="text-[#8E8A9F]">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(p.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                        p.is_active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {p.is_active ? 'نشط' : 'معطل'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(p)}
                      className="text-xs font-bold text-[#5C2D91] hover:underline cursor-pointer"
                    >
                      تعديل ⚙
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Plan Modal */}
      {editingPlan && (
        <Modal
          isOpen={Boolean(editingPlan)}
          onClose={() => setEditingPlan(null)}
          title={`تعديل باقة: ${editingPlan.tier_label_ar} ${editingPlan.quota_value} ${editingPlan.quota_unit}`}
        >
          <div className="space-y-4 text-right">
            <Input
              label="سعر الباقة (ج.م)"
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(Number(e.target.value))}
              helperText="كل تعديل على السعر يسجل فورياً في سجل الرقابة ولا يمس الطلبات السابقة."
            />

            <Input
              label="السرعة المعلنة بالميجابت/ث (اتركها فارغة لإخفائها)"
              type="number"
              placeholder="مثال: 30 أو 70 أو 100"
              value={editSpeed}
              onChange={(e) => setEditSpeed(e.target.value)}
              helperText="وفقاً للبند 7، لا تعرض السرعة إلا إذا أدخلت رقماً صريحاً هنا."
            />

            <Input
              label="شارة التمييز اليدوية (Badge)"
              placeholder="مثال: الأكثر طلباً، باقة التوفير..."
              value={editBadge}
              onChange={(e) => setEditBadge(e.target.value)}
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F4F5F7]">
              <Button variant="primary" size="sm" onClick={handleSavePlan}>
                حفظ التعديلات وتسجيلها
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setEditingPlan(null)}>
                إلغاء
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
