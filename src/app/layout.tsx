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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://we-store.eg';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'متجر باقات الإنترنت المنزلي WE | وكيل معتمد',
    template: '%s | متجر باقات WE',
  },
  description: 'المتجر الإلكتروني المعتمد لاشتراكات وتجديد باقات الإنترنت المنزلي من WE (المصرية للاتصالات) في مصر. دفع فوري عبر المحافظ الإلكترونية وتفعيل يدوي موثوق.',
  keywords: ['باقات وي', 'إنترنت منزلي WE', 'تجديد باقة وي', 'سوبر', 'ميجا', 'ألترا', 'فودافون كاش', 'إنستاباي'],
  authors: [{ name: 'وكيل معتمد لخدمات المصرية للاتصالات' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'متجر باقات الإنترنت المنزلي WE | وكيل معتمد',
    description: 'المتجر الإلكتروني المعتمد لاشتراكات وتجديد باقات الإنترنت المنزلي من WE في مصر. دفع فوري عبر المحافظ الإلكترونية وتفعيل يدوي موثوق.',
    url: siteUrl,
    siteName: 'متجر باقات WE للإنترنت المنزلي',
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'متجر باقات الإنترنت المنزلي WE | وكيل معتمد',
    description: 'المتجر الإلكتروني المعتمد لاشتراكات وتجديد باقات الإنترنت المنزلي من WE في مصر.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#5C2D91',
};

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'متجر باقات WE للإنترنت المنزلي',
      url: siteUrl,
      taxID: '492-819-204',
      identifier: '2026-WE-8841',
      description: 'وكيل وموزع معتمد لخدمات الإنترنت المنزلي من المصرية للاتصالات WE في جمهورية مصر العربية.',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'support@westore-eg.com',
        contactType: 'customer service',
        areaServed: 'EG',
        availableLanguage: ['Arabic', 'ar'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'متجر باقات WE للإنترنت المنزلي',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      inLanguage: 'ar',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${readexPro.variable} ${ibmPlexArabic.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
      </head>
      <body className="min-h-screen bg-[#FFFFFF] text-[#14101F] font-body selection:bg-[#E9E0F5] selection:text-[#2A1250]">
        {children}
      </body>
    </html>
  );
}
