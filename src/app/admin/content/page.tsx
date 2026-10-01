'use client';

import React, { useState } from 'react';
import { Button, Input, Modal, Badge } from '@/components/ui';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  isPublished: boolean;
}

export default function AdminContentPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([
    {
      id: 'faq-1',
      question: 'كيف يتم تفعيل وشحن الباقة على خطي بعد الدفع؟',
      answer:
        'بعد اختيار باقتك وإدخال رقم التليفون الأرضي وإتمام التحويل، يقوم فريق التحقق بمراجعة العملية وتفعيل الباقة مباشرة على خطك.',
      isPublished: true,
    },
    {
      id: 'faq-2',
      question: 'هل باقات الإنترنت المنزلي من WE غير محدودة؟',
      answer:
        'لا، جميع باقات الإنترنت المنزلي محددة بسعة تحميل صريحة (جيجابايت أو تيرابايت) وفقاً للوائح الرسمية الصادرة عن WE.',
      isPublished: true,
    },
    {
      id: 'faq-3',
      question: 'ما هي مهلة العداد التنازلي لإرسال إثبات الدفع؟',
      answer:
        'يتوفر لك عداد تنازلي مدته 60 دقيقة من لحظة إنشاء الطلب لحجز الباقة بالسعر الحالي.',
      isPublished: true,
    },
  ]);

  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [heroTitle, setHeroTitle] = useState('باقات WE للإنترنت المنزلي بشحن موثوق ودفع محلي');
  const [heroSubtitle, setHeroSubtitle] = useState('اشترك وجدد باقات الإنترنت المنزلي لسعات تبدأ من 50 جيجابايت حتى 18 تيرابايت.');
  const [whatsappPhone, setWhatsappPhone] = useState('01034027398');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSaveFaq = () => {
    if (!editingFaq) return;
    setFaqs((prev) =>
      prev.map((f) =>
        f.id === editingFaq.id ? { ...f, question: newQuestion, answer: newAnswer } : f
      )
    );
    setEditingFaq(null);
  };

  const handleAddFaq = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const item: FaqItem = {
      id: `faq-${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      isPublished: true,
    };
    setFaqs([...faqs, item]);
    setNewQuestion('');
    setNewAnswer('');
    setIsAddModalOpen(false);
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  const handleSaveSiteContent = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessNotice('تم حفظ محتوى الواجهة والبيانات بنجاح.');
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  return (
    <div className="space-y-8 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
            إدارة محتوى المتجر والأسئلة الشائعة
          </h1>
          <p className="text-xs text-[#5E5873]">
            تعديل نصوص الصفحة الرئيسية، بنك الأسئلة الشائعة، وأرقام التواصل الرسمية.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
          إضافة سؤال شائع جديد +
        </Button>
      </div>

      {successNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 font-bold animate-in fade-in">
          ✓ {successNotice}
        </div>
      )}

      {/* Hero Banner & Contact Editor */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-8 space-y-5">
        <h2 className="font-heading font-bold text-base text-[#14101F] pb-3 border-b border-[#F4F5F7]">
          نصوص واجهة البداية والاتصال
        </h2>

        <form onSubmit={handleSaveSiteContent} className="space-y-4">
          <Input
            label="العنوان الرئيسي في واجهة البداية (Hero Headline)"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
          />

          <Input
            label="النص التوضيحي للعنوان"
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
          />

          <Input
            label="رقم واتساب المعتمد لخدمة العملاء"
            value={whatsappPhone}
            onChange={(e) => setWhatsappPhone(e.target.value)}
            helperText="الرقم الفعلي المرتبط بمحادثات الدعم المباشرة."
          />

          <Button type="submit" variant="secondary" size="md">
            حفظ تعديلات الواجهة
          </Button>
        </form>
      </div>

      {/* FAQs List */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4F5F7]">
          <h2 className="font-heading font-bold text-base text-[#14101F]">
            بنك الأسئلة الشائعة ({faqs.length})
          </h2>
          <span className="text-xs text-[#5E5873]">تظهر في الصفحة الرئيسية وصفحة الدعم</span>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="p-4 rounded-2xl border border-[#E5E7EB] bg-[#F8F9FA] space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-2xl">
                <h3 className="font-heading font-bold text-sm text-[#14101F]">
                  {faq.question}
                </h3>
                <p className="text-xs text-[#5E5873] leading-relaxed">
                  {faq.answer}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingFaq(faq);
                    setNewQuestion(faq.question);
                    setNewAnswer(faq.answer);
                  }}
                  className="px-3 py-1 text-xs font-bold text-[#5C2D91] bg-white border border-[#CBBAE7] rounded-lg hover:bg-[#F6F2FC] cursor-pointer"
                >
                  تعديل ⚙
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit FAQ Modal */}
      {(isAddModalOpen || editingFaq) && (
        <Modal
          isOpen={isAddModalOpen || Boolean(editingFaq)}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingFaq(null);
          }}
          title={editingFaq ? 'تعديل السؤال الشائع' : 'إضافة سؤال شائع جديد'}
        >
          <div className="space-y-4 text-right">
            <Input
              label="نص السؤال"
              placeholder="مثال: كيف يتم الشحن؟"
              required
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />

            <div>
              <label className="block text-sm font-semibold text-[#14101F] mb-1.5">
                نص الإجابة:
              </label>
              <textarea
                rows={4}
                required
                placeholder="اكتب الإجابة بأسلوب دقيق وواضح..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:border-[#5C2D91]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F4F5F7]">
              <Button
                variant="primary"
                size="sm"
                onClick={editingFaq ? handleSaveFaq : handleAddFaq}
              >
                {editingFaq ? 'حفظ التعديل' : 'إضافة السؤال'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingFaq(null);
                }}
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
