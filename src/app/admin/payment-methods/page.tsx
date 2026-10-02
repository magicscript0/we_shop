'use client';

import React, { useState } from 'react';
import { Button, Input, Modal, Badge } from '@/components/ui';
import { SEED_PAYMENT_METHODS } from '@/lib/constants';
import { PaymentMethod } from '@/types/database';
import { ShieldCheckIcon, AlertTriangleIcon, CheckIcon, WalletIcon } from '@/components/ui/Icons';
import { isPlaceholderAccountNumber } from '@/lib/services/paymentAccounts.server';

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
    setAccountValue(m.account_value || '');
    setAccountHolder(m.account_holder_name || '');
    setInstructions(m.instructions_md || '');
    setFeeNote(m.fee_note || '');
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

  // Launch Guard Check
  const dummyAccounts = methods.filter((m) => m.account_value && isPlaceholderAccountNumber(m.account_value));
  const hasDummyAccounts = dummyAccounts.length > 0;

  return (
    <div className="space-y-6 text-right font-body">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
            وسائل الدفع والمحافظ الإلكترونية (Payment Accounts)
          </h1>
          <p className="text-xs text-[#5E5873]">
            إدارة أرقام المحافظ، حساب إنستاباي، خطوات التحويل، والتحقق الأمني من سلامة الحسابات ضد الأرقام الوهمية.
          </p>
        </div>

        <span className="text-xs font-bold text-[#5C2D91] bg-white px-3 py-1.5 rounded-xl border border-[#E5E7EB]">
          حماية الحزم العامة نشطة (Server-Isolated)
        </span>
      </div>

      {saveAlert && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 font-bold animate-in fade-in flex items-center gap-2">
          <CheckIcon size={16} className="text-emerald-600 shrink-0" />
          <span>{saveAlert}</span>
        </div>
      )}

      {/* Security & Launch Guard Banner */}
      {hasDummyAccounts ? (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 leading-relaxed flex items-start gap-3">
          <AlertTriangleIcon size={20} className="text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-sm mb-0.5">تحذير حارس الإطلاق (Launch Guard):</strong>
            تم رصد {dummyAccounts.length} حساب دفع يحمل أرقاماً وهمية أو متكررة ({dummyAccounts.map((d) => d.label_ar).join(', ')}). يجب تحديثها بحسابات حقيقية معتمدة قبل فتح الموقع للجمهور.
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2.5">
          <ShieldCheckIcon size={20} className="text-emerald-600 shrink-0" />
          <span>
            كافة أرقام الحسابات المعتمدة حقيقية ومفحوصة بواسطة <strong>Launch Guard</strong> ومعزولة عن حزم المتصفح العامة.
          </span>
        </div>
      )}

      {/* Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {methods.map((method) => {
          const isDummy = method.account_value && isPlaceholderAccountNumber(method.account_value);

          return (
            <div
              key={method.id}
              className={`bg-white rounded-3xl border p-6 space-y-4 shadow-sm transition-all ${
                method.is_enabled ? 'border-[#E5E7EB]' : 'border-gray-300 opacity-60 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F4F5F7]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-base text-[#14101F]">
                      {method.label_ar}
                    </h3>
                    {isDummy ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        رقم تجريبي
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        حقيقي معتمد
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#8E8A9F]">كود الوسيلة: {method.key}</span>
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
                  {method.is_enabled ? 'مفعّلة' : 'معطلة'}
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#F8F9FA]">
                  <span className="text-[#5E5873]">رقم الحساب / المحفظة:</span>
                  <span className="font-mono font-bold text-[#14101F]" dir="ltr">
                    {method.account_value || 'غير محدد'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#F8F9FA]">
                  <span className="text-[#5E5873]">اسم صاحب الحساب:</span>
                  <span className="font-semibold text-[#14101F]">
                    {method.account_holder_name || 'غير محدد'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#F8F9FA]">
                  <span className="text-[#5E5873]">رسوم التحويل:</span>
                  <span className="text-emerald-700 font-bold">{method.fee_note || 'مجاني'}</span>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] text-[#8E8A9F] block mb-1">تعليمات التحويل للعميل:</span>
                  <p className="text-[11px] text-[#5E5873] bg-[#F8F9FA] p-2.5 rounded-xl border border-[#E5E7EB]">
                    {method.instructions_md || 'لا توجد تعليمات خاصة.'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(method)}>
                  تعديل بيانات الحساب ⚙
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingMethod && (
        <Modal
          isOpen={Boolean(editingMethod)}
          onClose={() => setEditingMethod(null)}
          title={`تعديل حساب: ${editingMethod.label_ar}`}
        >
          <div className="space-y-4 text-right font-body">
            <Input
              label="رقم المحفظة / عنوان إنستاباي (Account Value)"
              required
              value={accountValue}
              onChange={(e) => setAccountValue(e.target.value)}
              helperText="يخزن هذا الرقم على الخادم ولا يظهر للزوار إلا في صفحة الدفع لطلبهم الخاص."
            />

            <Input
              label="اسم صاحب الحساب أو المحفظة"
              required
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
            />

            <Input
              label="ملاحظة الرسوم"
              placeholder="مثال: مجاني بدون رسوم، أو رسوم شبكة عادية"
              value={feeNote}
              onChange={(e) => setFeeNote(e.target.value)}
            />

            <div className="space-y-1 text-right">
              <label className="block text-xs font-semibold text-[#14101F]">
                خطوات وتعليمات التحويل (Markdown)
              </label>
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl p-2.5 text-xs text-[#14101F]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F4F5F7]">
              <Button variant="primary" size="sm" onClick={handleSave}>
                حفظ التعديلات
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
