import type { Metadata, Viewport } from 'next';
import { Readex_Pro, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';

const readexPro = Readex_Pro({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-readex-pro',
  display: 'swap',
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'متجر باقات الإنترنت المنزلي WE | وكيل معتمد',
  description: 'المتجر الإلكتروني المعتمد لاشتراكات وتجديد باقات الإنترنت المنزلي من WE (المصرية للاتصالات) في مصر. دفع فوري عبر المحافظ الإلكترونية وتفعيل يدوي موثوق.',
  keywords: ['باقات وي', 'إنترنت منزلي WE', 'تجديد باقة وي', 'سوبر', 'ميجا', 'ألترا', 'فودافون كاش', 'إنستاباي'],
  authors: [{ name: 'وكيل معتمد لخدمات المصرية للاتصالات' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#5C2D91',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${readexPro.variable} ${ibmPlexArabic.variable}`}>
      <body className="min-h-screen bg-[#FFFFFF] text-[#14101F] font-body selection:bg-[#E9E0F5] selection:text-[#2A1250]">
        {children}
      </body>
    </html>
  );
}
