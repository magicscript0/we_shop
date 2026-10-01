'use client';

import React, { useState } from 'react';
import { Button, Input, Modal, Badge } from '@/components/ui';
import { SEED_PAYMENT_METHODS } from '@/lib/constants';
import { PaymentMethod } from '@/types/database';

export default function AdminPaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>(SEED_PAYMENT_METHODS);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

  const [accountValue, setAccountValue] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [instructions, setInstructions] = useState('');
  const [feeNote, setFeeNote] = useState('');
  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  const handleOpenEdit = (m: PaymentMethod) => {
    setEditingMethod(m);
    setAccountValue(m.account_value);
    setAccountHolder(m.account_holder_name);
    setInstructions(m.instructions_md);
    setFeeNote(m.fee_note);
  };

  const handleSave = () => {
    if (!editingMethod) return;

    setMethods((prev) =>
      prev.map((m) =>
        m.id === editingMethod.id
          ? {
              ...m,
              account_value: accountValue.trim(),
              account_holder_name: accountHolder.trim(),
              instructions_md: instructions.trim(),
              fee_note: feeNote.trim(),
            }
          : m
      )
    );

    setSaveAlert(`تم تحديث بيانات وسيلة الدفع (${editingMethod.label_ar}) بنجاح.`);
    setTimeout(() => setSaveAlert(null), 4000);
    setEditingMethod(null);
  };

  const toggleMethod = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_enabled: !m.is_enabled } : m))
    );
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
            وسائل الدفع والمحافظ الإلكترونية
          </h1>
          <p className="text-xs text-[#5E5873]">
            إدارة أرقام المحافظ، حساب إنستاباي، خطوات التحويل، وإمكانية التفعيل أو التعطيل الفوري.
          </p>
        </div>

        <span className="text-xs font-bold text-[#5C2D91] bg-white px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
          فودافون كاش: 01034027398
        </span>
      </div>

      {saveAlert && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 font-bold animate-in fade-in">
          ✓ {saveAlert}
        </div>
      )}

      {/* Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {methods.map((method) => (
          <div
            key={method.id}
            className={`bg-white rounded-3xl border p-6 space-y-4 shadow-sm transition-all ${
              method.is_enabled ? 'border-[#E5E7EB]' : 'border-gray-300 opacity-60 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F4F5F7]">
              <div>
                <h3 className="font-heading font-bold text-base text-[#14101F]">
                  {method.label_ar}
                </h3>
                <span className="text-[11px] text-[#8E8A9F]">كود: {method.key}</span>
              </div>

              <button
                type="button"
                onClick={() => toggleMethod(method.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  method.is_enabled
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {method.is_enabled ? 'مفعل في المتجر' : 'معطل مؤقتاً'}
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-[#F6F2FC] border border-[#CBBAE7]/40">
                <span className="text-[#5E5873]">الرقم / العنوان المستلم:</span>
                <span className="font-mono font-bold text-sm text-[#5C2D91]" dir="ltr">
                  {method.account_value}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#8E8A9F]">اسم صاحب الحساب:</span>
                <span className="font-semibold text-[#14101F]">{method.account_holder_name}</span>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[#8E8A9F] block">ملاحظة الرسوم:</span>
                <p className="text-[11px] text-[#5E5873] bg-[#F8F9FA] p-2.5 rounded-xl border border-[#E5E7EB]">
                  {method.fee_note}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEdit(method)}
              >
                تعديل الرقم والتعليمات ⚙
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Payment Method Modal */}
      {editingMethod && (
        <Modal
          isOpen={Boolean(editingMethod)}
          onClose={() => setEditingMethod(null)}
          title={`تعديل وسيلة الدفع: ${editingMethod.label_ar}`}
          className="max-w-xl"
        >
          <div className="space-y-4 text-right">
            <Input
              label="رقم المحفظة أو عنوان InstaPay المستلم"
              placeholder="مثال: 01034027398 أو user@instapay"
              required
              value={accountValue}
              onChange={(e) => setAccountValue(e.target.value)}
            />

            <Input
              label="اسم صاحب الحساب أو المحفظة"
              placeholder="مثال: متجر وي المعتمد"
              required
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
            />

            <Input
              label="تنبيه رسوم التحويل"
              value={feeNote}
              onChange={(e) => setFeeNote(e.target.value)}
            />

            <div>
              <label className="block text-sm font-semibold text-[#14101F] mb-1.5">
                خطوات التحويل المفصلة (تظهر للعميل في بوابة الدفع):
              </label>
              <textarea
                rows={4}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:border-[#5C2D91]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F4F5F7]">
              <Button variant="primary" size="sm" onClick={handleSave}>
                حفظ البيانات
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setEditingMethod(null)}>
                إلغاء
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
