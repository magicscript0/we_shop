import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// 1. SEO, Metadata & Structured Data Tests
test('Phase F: SEO, Metadata & Schema.org Structured Data', async (t) => {
  const layoutPath = path.resolve('src/app/layout.tsx');
  const planSlugPagePath = path.resolve('src/app/plans/[slug]/page.tsx');
  const robotsPath = path.resolve('src/app/robots.ts');
  const sitemapPath = path.resolve('src/app/sitemap.ts');

  assert.ok(fs.existsSync(layoutPath), 'src/app/layout.tsx must exist');
  assert.ok(fs.existsSync(planSlugPagePath), 'src/app/plans/[slug]/page.tsx must exist');
  assert.ok(fs.existsSync(robotsPath), 'src/app/robots.ts must exist');
  assert.ok(fs.existsSync(sitemapPath), 'src/app/sitemap.ts must exist');

  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  const planSlugContent = fs.readFileSync(planSlugPagePath, 'utf8');
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

  await t.test('Root layout contains metadataBase, OpenGraph, and Twitter tags', () => {
    assert.ok(layoutContent.includes('metadataBase'), 'Must define metadataBase');
    assert.ok(layoutContent.includes('openGraph'), 'Must define openGraph defaults');
    assert.ok(layoutContent.includes('twitter'), 'Must define twitter defaults');
    assert.ok(layoutContent.includes('canonical'), 'Must specify canonical URL');
  });

  await t.test('Root layout embeds Organization and WebSite Schema.org JSON-LD', () => {
    assert.ok(layoutContent.includes('application/ld+json'), 'Must contain JSON-LD script tag');
    assert.ok(layoutContent.includes('492-819-204'), 'Organization schema must contain tax registration');
    assert.ok(layoutContent.includes('2026-WE-8841'), 'Organization schema must contain agency code');
    assert.ok(layoutContent.includes('@type\': \'WebSite\'') || layoutContent.includes('"@type": "WebSite"') || layoutContent.includes('WebSite'), 'Must define WebSite schema');
  });

  await t.test('Plan details page exports dynamic generateMetadata', () => {
    assert.ok(planSlugContent.includes('export async function generateMetadata'), 'Must export generateMetadata');
    assert.ok(planSlugContent.includes('openGraph'), 'Must define OpenGraph for plan details');
    assert.ok(planSlugContent.includes('canonical'), 'Must specify canonical link for plan details');
  });

  await t.test('Plan details page embeds Product/Offer Schema.org JSON-LD', () => {
    assert.ok(planSlugContent.includes('Product'), 'Must define Product schema');
    assert.ok(planSlugContent.includes('Offer'), 'Must define Offer schema with price');
    assert.ok(planSlugContent.includes('EGP'), 'Must declare price currency as EGP');
    assert.ok(planSlugContent.includes('InStock'), 'Must declare availability');
  });

  await t.test('Robots and sitemap correctly configure crawling', () => {
    assert.ok(robotsContent.includes('sitemap.xml'), 'robots.ts must reference sitemap.xml');
    assert.ok(robotsContent.includes('/admin/'), 'robots.ts must disallow /admin/');
    assert.ok(sitemapContent.includes('SEED_PLANS'), 'sitemap.ts must index all active seed plans');
    assert.ok(sitemapContent.includes('/renew'), 'sitemap.ts must include /renew page');
  });
});

// 2. Accessibility (a11y) & Skip Link Tests
test('Phase F: Accessibility (a11y) & Semantic Landmarks', async (t) => {
  const headerPath = path.resolve('src/components/layout/Header.tsx');
  const homePath = path.resolve('src/app/page.tsx');

  const headerContent = fs.readFileSync(headerPath, 'utf8');
  const homeContent = fs.readFileSync(homePath, 'utf8');

  await t.test('Header includes skip to main content anchor', () => {
    assert.ok(headerContent.includes('#main-content'), 'Must link to #main-content');
    assert.ok(headerContent.includes('sr-only'), 'Must use sr-only with focus styling');
    assert.ok(headerContent.includes('تخطي إلى المحتوى الرئيسي'), 'Must have descriptive Arabic text');
  });

  await t.test('Homepage main landmark matches target skip ID', () => {
    assert.ok(homeContent.includes('id="main-content"'), 'Must define id="main-content" on main tag');
  });
});

// 3. Error Boundaries & 404 Resiliency Tests
test('Phase F: Error Boundaries & 404 Pages Resiliency', async (t) => {
  const notFoundPath = path.resolve('src/app/not-found.tsx');
  const errorPath = path.resolve('src/app/error.tsx');
  const globalErrorPath = path.resolve('src/app/global-error.tsx');

  assert.ok(fs.existsSync(notFoundPath), 'src/app/not-found.tsx must exist');
  assert.ok(fs.existsSync(errorPath), 'src/app/error.tsx must exist');
  assert.ok(fs.existsSync(globalErrorPath), 'src/app/global-error.tsx must exist');

  const notFoundContent = fs.readFileSync(notFoundPath, 'utf8');
  const errorContent = fs.readFileSync(errorPath, 'utf8');
  const globalErrorContent = fs.readFileSync(globalErrorPath, 'utf8');

  await t.test('404 page provides branded Arabic recovery routes', () => {
    assert.ok(notFoundContent.includes('404'), 'Must display 404 badge');
    assert.ok(notFoundContent.includes('/plans'), 'Must link to /plans');
    assert.ok(notFoundContent.includes('/renew'), 'Must link to /renew');
    assert.ok(notFoundContent.includes('/track'), 'Must link to /track');
  });

  await t.test('error.tsx provides reset retry handler', () => {
    assert.ok(errorContent.includes('reset: () => void'), 'Must accept reset callback');
    assert.ok(errorContent.includes('reset()'), 'Must invoke reset() on button click');
  });

  await t.test('global-error.tsx defines root html and body structure', () => {
    assert.ok(globalErrorContent.includes('<html'), 'Must define <html> tag');
    assert.ok(globalErrorContent.includes('<body'), 'Must define <body> tag');
  });
});

// 4. Launch Guard & Health Checklist Verification
test('Phase F: Site Health & Launch Guard Checklist', async (t) => {
  const healthPath = path.resolve('src/app/admin/health/page.tsx');
  assert.ok(fs.existsSync(healthPath), 'src/app/admin/health/page.tsx must exist');

  const healthContent = fs.readFileSync(healthPath, 'utf8');

  await t.test('verifies all 6 core launch systems', () => {
    assert.ok(healthContent.includes('catalogPass'), 'Must check catalog integrity');
    assert.ok(healthContent.includes('officialChannelsPass'), 'Must check official support channels');
    assert.ok(healthContent.includes('paymentSecurityPass'), 'Must check payment destination security');
    assert.ok(healthContent.includes('pricingPass'), 'Must check central pricing engine');
    assert.ok(healthContent.includes('offerPass'), 'Must check welcome offer safeguards');
    assert.ok(healthContent.includes('expiryCheckPass'), 'Must check 60-minute expiry');
  });

  await t.test('ensures 50GB plan is permanently prohibited', () => {
    assert.ok(healthContent.includes('super-monthly-50gb'), 'Must verify 50GB plan absence');
  });
});
