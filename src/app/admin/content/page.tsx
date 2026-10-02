'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, Badge } from '@/components/ui';
import {
  CmsRegistry,
  FaqItem,
  DEFAULT_CMS_REGISTRY,
  getDraftCms,
  saveDraftCms,
  publishCms,
  resetCmsToDefault,
} from '@/lib/services/cms';
import {
  ShieldCheckIcon,
  ZapIcon,
  GiftIcon,
  CheckIcon,
  AlertTriangleIcon,
  ClockIcon,
} from '@/components/ui/Icons';

type TabKey = 'announcement_hero' | 'steps_why' | 'faqs' | 'support_legal';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('announcement_hero');
  const [cms, setCms] = useState<CmsRegistry>(DEFAULT_CMS_REGISTRY);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
  const [alertNotice, setAlertNotice] = useState<string | null>(null);

  // FAQ Modal State
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isAddFaqOpen, setIsAddFaqOpen] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState<'general' | 'payment' | 'technical'>('general');

  useEffect(() => {
    setCms(getDraftCms());
  }, []);

  const updateField = <K extends keyof CmsRegistry>(key: K, value: CmsRegistry[K]) => {
    const updated = { ...cms, [key]: value };
    setCms(updated);
    saveDraftCms({ [key]: value });
    setHasUnpublishedChanges(true);
  };

  const handlePublishAll = () => {
    publishCms(cms);
    setHasUnpublishedChanges(false);
    setAlertNotice('تم نشر كافة التعديلات بنجاح وتحديث المتجر فورياً لجميع الزوار!');
    setTimeout(() => setAlertNotice(null), 5000);
  };

  const handleResetDefaults = () => {
    if (confirm('هل أنت متأكد من رغبتك في استعادة النصوص والإعدادات الأصلية الافتراضية؟')) {
      const def = resetCmsToDefault();
      setCms(def);
      setHasUnpublishedChanges(false);
      setAlertNotice('تم استعادة المحتوى الافتراضي المعتمد بنجاح.');
      setTimeout(() => setAlertNotice(null), 4000);
    }
  };

  // FAQ Operations
  const handleOpenAddFaq = () => {
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqCategory('general');
    setIsAddFaqOpen(true);
  };

  const handleSaveNewFaq = () => {
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;
    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      category: faqCategory,
      question: faqQuestion.trim(),
      answer: faqAnswer.trim(),
      isPublished: true,
      sortOrder: (cms.faqs?.length || 0) + 1,
    };
    const updated = [...(cms.faqs || []), newFaq];
    updateField('faqs', updated);
    setIsAddFaqOpen(false);
  };

  const handleOpenEditFaq = (f: FaqItem) => {
    setEditingFaq(f);
    setFaqQuestion(f.question);
    setFaqAnswer(f.answer);
    setFaqCategory(f.category);
  };

  const handleSaveEditFaq = () => {
    if (!editingFaq) return;
    const updated = (cms.faqs || []).map((item) =>
      item.id === editingFaq.id
        ? {
            ...item,
            question: faqQuestion.trim(),
            answer: faqAnswer.trim(),
            category: faqCategory,
          }
        : item
    );
    updateField('faqs', updated);
    setEditingFaq(null);
  };

  const handleDeleteFaq = (id: string) => {
    const updated = (cms.faqs || []).filter((f) => f.id !== id);
    updateField('faqs', updated);
  };

  const handleToggleFaqPublish = (id: string) => {
    const updated = (cms.faqs || []).map((f) =>
      f.id === id ? { ...f, isPublished: !f.isPublished } : f
    );
    updateField('faqs', updated);
  };

  return (
    <div className="space-y-6 text-right font-body">
      {/* Page Header with Action Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold font-heading text-[#14101F]">
              سجل المحتوى المركزي (CMS Content Registry)
            </h1>
            {hasUnpublishedChanges && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                توجد مسودات غير منشورة
              </span>
            )}
          </div>
          <p className="text-xs text-[#5E5873] mt-1">
            التحكم الشامل في كافة نصوص المتجر، أشرطة الإعلانات، مميزات الخدمة، الأسئلة الشائعة، وقنوات الدعم.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="text-gray-600 border-gray-300 hover:bg-gray-100"
          >
            استعادة الافتراضي
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePublishAll}
            className="shadow-md"
          >
            ✓ نشر فوري للمتجر
          </Button>
        </div>
      </div>

      {alertNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
          <CheckIcon size={18} className="text-emerald-600 shrink-0" />
          <span>{alertNotice}</span>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-[#E9E0F5]/40 rounded-2xl border border-[#CBBAE7]/50 text-xs font-bold">
        <button
          onClick={() => setActiveTab('announcement_hero')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'announcement_hero'
              ? 'bg-[#5C2D91] text-white shadow-sm'
              : 'text-[#5C2D91] hover:bg-white/50'
          }`}
        >
          1. شريط الإعلانات وقسم البطل (Hero)
        </button>
        <button
          onClick={() => setActiveTab('steps_why')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'steps_why'
              ? 'bg-[#5C2D91] text-white shadow-sm'
              : 'text-[#5C2D91] hover:bg-white/50'
          }`}
        >
          2. خطوات الاشتراك وركائز الثقة (Steps & Why Us)
        </button>
        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'faqs'
              ? 'bg-[#5C2D91] text-white shadow-sm'
              : 'text-[#5C2D91] hover:bg-white/50'
          }`}
        >
          3. بنك الأسئلة الشائعة (FAQs)
        </button>
        <button
          onClick={() => setActiveTab('support_legal')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'support_legal'
              ? 'bg-[#5C2D91] text-white shadow-sm'
              : 'text-[#5C2D91] hover:bg-white/50'
          }`}
        >
          4. قنوات الدعم والملخصات القانونية
        </button>
      </div>

      {/* TAB 1: Announcement & Hero */}
      {activeTab === 'announcement_hero' && (
        <div className="space-y-6">
          {/* Announcement Bar Settings */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4F5F7]">
              <div>
                <h3 className="font-heading font-bold text-base text-[#14101F]">
                  شريط الإعلانات العلوي العام (Announcement Bar)
                </h3>
                <span className="text-xs text-[#5E5873]">
                  يظهر أعلى الترويسة لجميع الزوار مع إمكانية التفعيل أو الإخفاء.
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={cms['announcement.is_active']}
                  onChange={(e) => updateField('announcement.is_active', e.target.checked)}
                  className="h-4 w-4 text-[#5C2D91] rounded"
                />
                <span className="text-xs font-bold text-[#14101F]">
                  {cms['announcement.is_active'] ? 'مفعّل ويظهر' : 'معطّل ومخفي'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="شارة الشريط (Badge Text)"
                value={cms['announcement.badge']}
                onChange={(e) => updateField('announcement.badge', e.target.value)}
              />
              <Input
                label="ملاحظة السقف / التوفير"
                value={cms['announcement.cap_note']}
                onChange={(e) => updateField('announcement.cap_note', e.target.value)}
              />
              <div className="md:col-span-2">
                <Input
                  label="نص الإعلان الترويجي الرئيسي"
                  value={cms['announcement.title']}
                  onChange={(e) => updateField('announcement.title', e.target.value)}
                />
              </div>
              <Input
                label="نص زر الإجراء (CTA Text)"
                value={cms['announcement.cta_text']}
                onChange={(e) => updateField('announcement.cta_text', e.target.value)}
              />
              <Input
                label="رابط زر الإجراء (CTA Link)"
                value={cms['announcement.cta_link']}
                onChange={(e) => updateField('announcement.cta_link', e.target.value)}
              />
            </div>
          </div>

          {/* Hero Section Settings */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4F5F7]">
              <div>
                <h3 className="font-heading font-bold text-base text-[#14101F]">
                  قسم البطل في الصفحة الرئيسية (Hero Section)
                </h3>
                <span className="text-xs text-[#5E5873]">
                  الواجهة الافتتاحية للمتجر، العنوان، الشارة، والأزرار.
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={cms['hero.seal_active']}
                  onChange={(e) => updateField('hero.seal_active', e.target.checked)}
                  className="h-4 w-4 text-[#5C2D91] rounded"
                />
                <span className="text-xs font-bold text-[#14101F]">
                  {cms['hero.seal_active'] ? 'ختم العرض الترحيبي مفعّل' : 'الختم مخفي'}
                </span>
              </label>
            </div>

            <div className="space-y-4">
              <Input
                label="شارة الاعتماد والتوثيق (Hero Badge)"
                value={cms['hero.badge']}
                onChange={(e) => updateField('hero.badge', e.target.value)}
              />
              <Input
                label="العنوان الافتتاحي الرئيسي (Hero Title)"
                value={cms['hero.title']}
                onChange={(e) => updateField('hero.title', e.target.value)}
              />
              <div className="space-y-1.5 text-right">
                <label className="block text-xs font-semibold text-[#14101F]">
                  الوصف التفصيلي (Hero Subtitle)
                </label>
                <textarea
                  rows={3}
                  value={cms['hero.subtitle']}
                  onChange={(e) => updateField('hero.subtitle', e.target.value)}
                  className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#14101F] focus:outline-none focus:border-[#5C2D91]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="نص زر الإجراء الأساسي"
                  value={cms['hero.cta_primary']}
                  onChange={(e) => updateField('hero.cta_primary', e.target.value)}
                />
                <Input
                  label="نص زر الإجراء الثانوي"
                  value={cms['hero.cta_secondary']}
                  onChange={(e) => updateField('hero.cta_secondary', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Steps & Why Us */}
      {activeTab === 'steps_why' && (
        <div className="space-y-6">
          {/* Steps */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-7 space-y-5">
            <h3 className="font-heading font-bold text-base text-[#14101F] pb-3 border-b border-[#F4F5F7]">
              خطوات الاشتراك وتفعيل الباقة (How It Works)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((stepNum) => {
                const titleKey = `steps.${stepNum}.title` as keyof CmsRegistry;
                const descKey = `steps.${stepNum}.desc` as keyof CmsRegistry;
                return (
                  <div key={stepNum} className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB] space-y-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#5C2D91] text-white text-xs font-bold">
                      الخطوة {stepNum}
                    </span>
                    <Input
                      label="عنوان الخطوة"
                      value={String(cms[titleKey])}
                      onChange={(e) => updateField(titleKey, e.target.value as any)}
                    />
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-[#14101F]">
                        شرح وتفاصيل الخطوة
                      </label>
                      <textarea
                        rows={2}
                        value={String(cms[descKey])}
                        onChange={(e) => updateField(descKey, e.target.value as any)}
                        className="w-full bg-white border border-[#E2E8F0] rounded-xl p-2.5 text-xs text-[#14101F]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Why Us */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-7 space-y-5">
            <h3 className="font-heading font-bold text-base text-[#14101F] pb-3 border-b border-[#F4F5F7]">
              ركائز الثقة والمصداقية (Why Choose Us)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((num) => {
                const titleKey = `why_us.${num}.title` as keyof CmsRegistry;
                const descKey = `why_us.${num}.desc` as keyof CmsRegistry;
                return (
                  <div key={num} className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5E7EB] space-y-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#2A1250] text-[#B9F03C] text-xs font-bold">
                      الميزة {num}
                    </span>
                    <Input
                      label="عنوان الميزة"
                      value={String(cms[titleKey])}
                      onChange={(e) => updateField(titleKey, e.target.value as any)}
                    />
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-[#14101F]">
                        نص الشرح والتأكيد
                      </label>
                      <textarea
                        rows={2}
                        value={String(cms[descKey])}
                        onChange={(e) => updateField(descKey, e.target.value as any)}
                        className="w-full bg-white border border-[#E2E8F0] rounded-xl p-2.5 text-xs text-[#14101F]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FAQs */}
      {activeTab === 'faqs' && (
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4F5F7]">
            <div>
              <h3 className="font-heading font-bold text-base text-[#14101F]">
                بنك الأسئلة الشائعة والأجوبة (FAQ Management)
              </h3>
              <span className="text-xs text-[#5E5873]">
                إجمالي الأسئلة: {cms.faqs?.length || 0} أسئلة معتمدة.
              </span>
            </div>
            <Button variant="primary" size="sm" onClick={handleOpenAddFaq}>
              إضافة سؤال جديد +
            </Button>
          </div>

          <div className="space-y-3">
            {(cms.faqs || []).map((faq, index) => (
              <div
                key={faq.id}
                className="p-4 rounded-2xl border border-[#E5E7EB] hover:border-[#5C2D91]/50 bg-[#FBFBFC] space-y-2 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#5C2D91] bg-[#F6F2FC] px-2 py-0.5 rounded">
                        #{index + 1} {faq.category === 'payment' ? 'دفع ومحافظ' : faq.category === 'technical' ? 'فني وشحن' : 'عام'}
                      </span>
                      <h4 className="font-heading font-bold text-sm text-[#14101F]">
                        {faq.question}
                      </h4>
                    </div>
                    <p className="text-xs text-[#5E5873] leading-relaxed pr-2">
                      {faq.answer}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleFaqPublish(faq.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                        faq.isPublished
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {faq.isPublished ? 'منشور' : 'مسودة'}
                    </button>
                    <button
                      onClick={() => handleOpenEditFaq(faq)}
                      className="text-xs font-bold text-[#5C2D91] hover:underline px-2 py-1 cursor-pointer"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="text-xs font-bold text-rose-600 hover:underline px-2 py-1 cursor-pointer"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Support Channels & Legal */}
      {activeTab === 'support_legal' && (
        <div className="space-y-6">
          {/* Official Support Channels */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-7 space-y-5">
            <h3 className="font-heading font-bold text-base text-[#14101F] pb-3 border-b border-[#F4F5F7]">
              قنوات الدعم الفني الرسمية المعتمدة (Official Support Channels)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="البريد الإلكتروني الرسمي للدعم الفني"
                value={cms['support.email']}
                onChange={(e) => updateField('support.email', e.target.value)}
                helperText="يستخدم في الفواتير وإشعارات السداد والتذاكر الرسمية."
              />
              <Input
                label="رقم الخط الساخن المعتمد"
                value={cms['support.phone']}
                onChange={(e) => updateField('support.phone', e.target.value)}
              />
              <Input
                label="مواعيد العمل الرسمية للدعم"
                value={cms['support.hours']}
                onChange={(e) => updateField('support.hours', e.target.value)}
              />
              <Input
                label="متوسط زمن الرد على تذاكر الدعم"
                value={cms['support.ticket_response_time']}
                onChange={(e) => updateField('support.ticket_response_time', e.target.value)}
              />
            </div>
          </div>

          {/* Legal Summaries */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6 sm:p-7 space-y-5">
            <h3 className="font-heading font-bold text-base text-[#14101F] pb-3 border-b border-[#F4F5F7]">
              ملخصات السياسات والضوابط القانونية (Legal Summaries)
            </h3>
            <div className="space-y-4">
              <Input
                label="ملخص الشروط والأحكام ومهلة الـ 60 دقيقة"
                value={cms['legal.terms_summary']}
                onChange={(e) => updateField('legal.terms_summary', e.target.value)}
              />
              <Input
                label="ملخص سياسة الخصوصية وحماية بيانات الخط"
                value={cms['legal.privacy_summary']}
                onChange={(e) => updateField('legal.privacy_summary', e.target.value)}
              />
              <Input
                label="ملخص سياسة الاسترجاع والضمان"
                value={cms['legal.refund_summary']}
                onChange={(e) => updateField('legal.refund_summary', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add FAQ Modal */}
      {isAddFaqOpen && (
        <Modal isOpen={isAddFaqOpen} onClose={() => setIsAddFaqOpen(false)} title="إضافة سؤال شائع جديد">
          <div className="space-y-4 text-right">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#14101F]">تصنيف السؤال:</label>
              <select
                value={faqCategory}
                onChange={(e) => setFaqCategory(e.target.value as any)}
                className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl p-3 text-xs font-bold text-[#14101F]"
              >
                <option value="general">عام والاستفسارات الأساسية</option>
                <option value="payment">طرق الدفع والمحافظ والتحويل</option>
                <option value="technical">الشحن الفني وتفعيل الخطوط</option>
              </select>
            </div>
            <Input
              label="نص السؤال"
              required
              placeholder="اكتب صيغة السؤال الشائع..."
              value={faqQuestion}
              onChange={(e) => setFaqQuestion(e.target.value)}
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#14101F]">نص الإجابة الشافية:</label>
              <textarea
                rows={4}
                required
                placeholder="اكتب الإجابة بوضوح وشفافية..."
                value={faqAnswer}
                onChange={(e) => setFaqAnswer(e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#14101F]"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F4F5F7]">
              <Button variant="primary" size="sm" onClick={handleSaveNewFaq}>
                حفظ وإضافة السؤال
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsAddFaqOpen(false)}>
                إلغاء
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit FAQ Modal */}
      {editingFaq && (
        <Modal isOpen={Boolean(editingFaq)} onClose={() => setEditingFaq(null)} title="تعديل السؤال الشائع">
          <div className="space-y-4 text-right">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#14101F]">تصنيف السؤال:</label>
              <select
                value={faqCategory}
                onChange={(e) => setFaqCategory(e.target.value as any)}
                className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl p-3 text-xs font-bold text-[#14101F]"
              >
                <option value="general">عام والاستفسارات الأساسية</option>
                <option value="payment">طرق الدفع والمحافظ والتحويل</option>
                <option value="technical">الشحن الفني وتفعيل الخطوط</option>
              </select>
            </div>
            <Input
              label="نص السؤال"
              value={faqQuestion}
              onChange={(e) => setFaqQuestion(e.target.value)}
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#14101F]">نص الإجابة:</label>
              <textarea
                rows={4}
                value={faqAnswer}
                onChange={(e) => setFaqAnswer(e.target.value)}
                className="w-full bg-[#F4F5F7] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#14101F]"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F4F5F7]">
              <Button variant="primary" size="sm" onClick={handleSaveEditFaq}>
                حفظ التعديلات
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setEditingFaq(null)}>
                إلغاء
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
