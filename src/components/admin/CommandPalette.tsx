'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: string;
  href: string;
  keywords?: string[];
  badge?: string;
}

const COMMANDS: CommandItem[] = [
  {
    id: 'verify',
    title: 'طابور مراجعة وإثباتات المدفوعات',
    category: 'العمليات الأساسية',
    icon: '⚡',
    href: '/admin/verification',
    keywords: ['مراجعة', 'تحويل', 'إثبات', 'فودافون', 'انستاباي', 'طلب معلق'],
    badge: '3 بانتظار الاعتماد',
  },
  {
    id: 'orders',
    title: 'كافة الطلبات وسجل المعاملات',
    category: 'العمليات الأساسية',
    icon: '📦',
    href: '/admin/orders',
    keywords: ['طلبات', 'فواتير', 'بحث عن طلب', 'سجل'],
  },
  {
    id: 'plans',
    title: 'إدارة باقات الإنترنت والأسعار',
    category: 'الكتالوج والتسعير',
    icon: '🏷️',
    href: '/admin/plans',
    keywords: ['باقات', 'سوبر', 'ميجا', 'الترا', 'ماكس', 'اسعار', 'جيجابايت'],
  },
  {
    id: 'campaigns',
    title: 'الحملات والخصومات (عرض الترحيب 50%)',
    category: 'الكتالوج والتسعير',
    icon: '🎁',
    href: '/admin/campaigns',
    keywords: ['خصم', 'عرض الترحيب', 'كوبون', 'ترويج'],
  },
  {
    id: 'content',
    title: 'إدارة محتوى المتجر و CMS (الأسئلة والشروط)',
    category: 'المحتوى والإعدادات',
    icon: '📝',
    href: '/admin/content',
    keywords: ['محتوى', 'cms', 'اسئلة شائعة', 'بنرات', 'شروط'],
  },
  {
    id: 'settings',
    title: 'إعدادات المتجر العامة (ضريبة 14% والقواعد)',
    category: 'المحتوى والإعدادات',
    icon: '⚙️',
    href: '/admin/settings',
    keywords: ['ضريبة', 'vat', 'تقريب', 'عملة', 'اعدادات'],
  },
  {
    id: 'health',
    title: 'فاحص الجاهزية وحارس الأمان (Launch Guard)',
    category: 'الأمان والمراقبة',
    icon: '🛡️',
    href: '/admin/health',
    keywords: ['امان', 'تسريب', 'فحص', 'جاهزية', 'launch guard'],
    badge: '100% Launch Ready',
  },
  {
    id: 'payment-methods',
    title: 'وسائل الدفع وتوزيع المحافظ الرقمية',
    category: 'الأمان والمراقبة',
    icon: '💳',
    href: '/admin/payment-methods',
    keywords: ['محافظ', 'انستاباي', 'فودافون كاش', 'حسابات'],
  },
  {
    id: 'reports',
    title: 'التقارير ومسار الشراء والتحويل (Funnel)',
    category: 'التقارير والتحليلات',
    icon: '📈',
    href: '/admin/reports',
    keywords: ['تقارير', 'تحويل', 'مسار الشراء', 'مبيعات', 'funnel'],
  },
  {
    id: 'customers',
    title: 'قاعدة بيانات العملاء والخطوط الأرضية',
    category: 'العملاء',
    icon: '👥',
    href: '/admin/customers',
    keywords: ['عملاء', 'خط ارضي', 'ارقام', 'سجل مستخدمين'],
  },
  {
    id: 'audit-logs',
    title: 'سجل التدقيق الرقابي والنشاطات الإدارية',
    category: 'الأمان والمراقبة',
    icon: '📜',
    href: '/admin/audit-logs',
    keywords: ['audit', 'رقابة', 'نشاط', 'سجل امني'],
  },
  {
    id: 'storefront',
    title: 'زيارة واجهة المتجر الرئيسية (Storefront)',
    category: 'روابط خارجية',
    icon: '🛒',
    href: '/',
    keywords: ['متجر', 'رئيسية', 'شراء'],
  },
  {
    id: 'renew',
    title: 'بوابة التجديد السريع لخطوط WE',
    category: 'روابط خارجية',
    icon: '🔄',
    href: '/renew',
    keywords: ['تجديد', 'شحن خط', 'renew'],
  },
];

/**
 * Synthesizes a clean two-tone chime alert using Web Audio API
 */
export function playOrderAlertChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    
    // First tone (523.25 Hz - C5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second tone (659.25 Hz - E5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, now + 0.12);
    gain2.gain.setValueAtTime(0.22, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch {
    // Audio context may be restricted by browser policy before first interaction
  }
}

export const CommandPalette: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load sound setting
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('we_admin_sound_chime');
      if (stored !== null) {
        setSoundEnabled(stored === 'true');
      }
    }
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('we_admin_sound_chime', String(next));
    }
    if (next) {
      playOrderAlertChime();
    }
  };

  // Filter commands
  const filteredCommands = COMMANDS.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    if (cmd.title.toLowerCase().includes(q)) return true;
    if (cmd.category.toLowerCase().includes(q)) return true;
    if (cmd.keywords?.some((k) => k.toLowerCase().includes(q))) return true;
    return false;
  });

  const handleSelect = (item: CommandItem) => {
    setIsOpen(false);
    router.push(item.href);
  };

  // Keyboard navigation within list
  const handleKeyDownInList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredCommands[selectedIndex];
      if (current) handleSelect(current);
    }
  };

  return (
    <>
      {/* Top Header Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white/90 px-3 py-1.5 rounded-xl text-xs font-heading font-semibold border border-white/10 cursor-pointer transition-colors shadow-xs"
        title="فتح لوحة الأوامر السريعة (Ctrl+K)"
      >
        <span className="text-[#B9F03C]">⚡</span>
        <span className="hidden md:inline">لوحة الأوامر السريعة</span>
        <kbd className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/20 text-[#A98BD6]">
          Ctrl+K
        </kbd>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-[#170828] text-white rounded-3xl max-w-xl w-full shadow-2xl border border-[#3A1C6E] overflow-hidden flex flex-col font-body animate-in zoom-in-95 duration-150"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDownInList}
          >
            {/* Search Input Box */}
            <div className="p-4 border-b border-[#2A1250] flex items-center gap-3">
              <span className="text-[#B9F03C] text-lg font-bold">🔍</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="ابحث عن قسم، باقة، عميل، أمر سريع، أو إعداد..."
                className="w-full bg-transparent text-sm text-white placeholder-[#8E8A9F] outline-none font-heading"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-xs text-[#8E8A9F] hover:text-white px-2 py-1"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#2A1250]/40">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={cmd.id}
                      onClick={() => handleSelect(cmd)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#5C2D91] text-white shadow-md'
                          : 'text-[#E9E0F5] hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-base">
                          {cmd.icon}
                        </span>
                        <div>
                          <div className="text-xs font-bold font-heading">
                            {cmd.title}
                          </div>
                          <div className="text-[10px] text-[#A98BD6] mt-0.5">
                            {cmd.category}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {cmd.badge && (
                          <span className="text-[10px] font-extrabold bg-[#B9F03C] text-[#1B0A33] px-2 py-0.5 rounded-full">
                            {cmd.badge}
                          </span>
                        )}
                        <span className="text-xs text-[#8E8A9F]">↵</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-xs text-[#8E8A9F]">
                  لا توجد نتائج مطابقة لـ &quot;{query}&quot;
                </div>
              )}
            </div>

            {/* Footer Bar with Audio Chime Control */}
            <div className="p-3 bg-[#11051F] border-t border-[#2A1250] flex items-center justify-between text-[11px] text-[#8E8A9F]">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleSound}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                    soundEnabled
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-[#8E8A9F]'
                  }`}
                  title="تفعيل/تعطيل نغمة التنبيه للطلبات الجديدة"
                >
                  <span>{soundEnabled ? '🔔 التنبيه الصوتي مفعّل' : '🔕 التنبيه الصوتي صامت'}</span>
                </button>

                <button
                  type="button"
                  onClick={playOrderAlertChime}
                  className="hover:text-white underline cursor-pointer text-[10px]"
                >
                  تجربة الصوت ♫
                </button>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span>التنقل: ↑ ↓</span>
                <span>•</span>
                <span>الاختيار: Enter</span>
                <span>•</span>
                <span>الإغلاق: Esc</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
