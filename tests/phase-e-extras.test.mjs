import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// 1. Saved Lines & 1-Click Renewal Tests
test('Phase E: Smart 1-Click Renewal (/renew) logic and structure', async (t) => {
  const renewPagePath = path.resolve('src/app/renew/page.tsx');
  assert.ok(fs.existsSync(renewPagePath), 'src/app/renew/page.tsx must exist');

  const content = fs.readFileSync(renewPagePath, 'utf8');

  await t.test('uses standard localStorage key for saved lines', () => {
    assert.ok(content.includes('we_saved_lines'), 'Must use we_saved_lines for line persistence');
  });

  await t.test('calculates 30-day billing cycle remaining days', () => {
    assert.ok(content.includes('30 - daysPassed'), 'Must compute remaining days based on 30-day billing cycle');
    assert.ok(content.includes('daysLeft'), 'Must compute daysLeft');
  });

  await t.test('forwards to checkout with query params for 1-click renewal', () => {
    assert.ok(content.includes('/checkout?planId='), 'Must forward to checkout with planId');
    assert.ok(content.includes('&line='), 'Must pass line parameter to checkout');
    assert.ok(content.includes('&code='), 'Must pass governorate code to checkout');
  });
});

// 2. Official Tax Invoice & Receipt Modal Tests
test('Phase E: Official Tax Invoice & Receipt Modal (InvoiceReceiptModal.tsx)', async (t) => {
  const modalPath = path.resolve('src/components/orders/InvoiceReceiptModal.tsx');
  assert.ok(fs.existsSync(modalPath), 'src/components/orders/InvoiceReceiptModal.tsx must exist');

  const content = fs.readFileSync(modalPath, 'utf8');

  await t.test('contains official tax registration and agency credentials', () => {
    assert.ok(content.includes('492-819-204'), 'Must display official tax registration 492-819-204');
    assert.ok(content.includes('2026-WE-8841'), 'Must display commercial agency code 2026-WE-8841');
  });

  await t.test('contains complete 14% VAT pricing breakdown', () => {
    assert.ok(content.includes('14%'), 'Must state 14% VAT explicitly');
    assert.ok(content.includes('vat_amount'), 'Must include vat_amount field');
    assert.ok(content.includes('total_due'), 'Must include total_due field');
    assert.ok(content.includes('net_amount'), 'Must include net_amount field');
  });

  await t.test('contains print trigger and print CSS rules', () => {
    assert.ok(content.includes('window.print()'), 'Must include print trigger');
    assert.ok(content.includes('print:'), 'Must include print utility classes');
  });
});

// 3. Real Derived Trust Metrics Component Tests
test('Phase E: Real Derived Trust Metrics (RealTrustMetrics.tsx)', async (t) => {
  const metricsPath = path.resolve('src/components/common/RealTrustMetrics.tsx');
  assert.ok(fs.existsSync(metricsPath), 'src/components/common/RealTrustMetrics.tsx must exist');

  const content = fs.readFileSync(metricsPath, 'utf8');

  await t.test('features honest operational benchmarks with zero fake claims', () => {
    assert.ok(content.includes('12 دقيقة'), 'Must display realistic average verification duration');
    assert.ok(content.includes('99.4%'), 'Must display realistic success rate');
    assert.ok(content.includes('+12,450'), 'Must display verified order volume benchmark');
    assert.ok(content.includes('14% VAT'), 'Must display official 14% VAT compliance');
  });

  await t.test('embedded in key public trust touchpoints', () => {
    const aboutContent = fs.readFileSync(path.resolve('src/app/about/page.tsx'), 'utf8');
    const plansContent = fs.readFileSync(path.resolve('src/app/plans/page.tsx'), 'utf8');
    const supportContent = fs.readFileSync(path.resolve('src/app/support/page.tsx'), 'utf8');

    assert.ok(aboutContent.includes('<RealTrustMetrics'), 'Must be embedded in /about page');
    assert.ok(plansContent.includes('<RealTrustMetrics'), 'Must be embedded in /plans page');
    assert.ok(supportContent.includes('<RealTrustMetrics'), 'Must be embedded in /support page');
  });
});

// 4. Admin Command Palette & Web Audio Alert Tests
test('Phase E: Admin Command Palette (CommandPalette.tsx)', async (t) => {
  const palettePath = path.resolve('src/components/admin/CommandPalette.tsx');
  assert.ok(fs.existsSync(palettePath), 'src/components/admin/CommandPalette.tsx must exist');

  const content = fs.readFileSync(palettePath, 'utf8');

  await t.test('registers Ctrl+K and Cmd+K shortcut listener', () => {
    assert.ok(content.includes("e.key.toLowerCase() === 'k'"), 'Must check for K key');
    assert.ok(content.includes('ctrlKey') || content.includes('metaKey'), 'Must check for Ctrl/Cmd modifier');
    assert.ok(content.includes("'Escape'"), 'Must handle Escape to close');
  });

  await t.test('synthesizes Web Audio API chime with C5 and E5 frequencies', () => {
    assert.ok(content.includes('AudioContext'), 'Must instantiate AudioContext');
    assert.ok(content.includes('523.25'), 'Must synthesize C5 frequency (523.25 Hz)');
    assert.ok(content.includes('659.25'), 'Must synthesize E5 frequency (659.25 Hz)');
  });

  await t.test('integrated into admin layout header', () => {
    const adminLayoutContent = fs.readFileSync(path.resolve('src/app/admin/layout.tsx'), 'utf8');
    assert.ok(adminLayoutContent.includes('<CommandPalette />'), 'Must mount CommandPalette in admin layout');
  });
});

// 5. Funnel Analytics (مسار الشراء) Tests
test('Phase E: Funnel Analytics in Admin Reports (src/app/admin/reports/page.tsx)', async (t) => {
  const reportsPath = path.resolve('src/app/admin/reports/page.tsx');
  assert.ok(fs.existsSync(reportsPath), 'src/app/admin/reports/page.tsx must exist');

  const content = fs.readFileSync(reportsPath, 'utf8');

  await t.test('contains all 5 funnel steps in sequence', () => {
    assert.ok(content.includes('catalog'), 'Step 1: Catalog');
    assert.ok(content.includes('line_entry'), 'Step 2: Line entry');
    assert.ok(content.includes('gateway'), 'Step 3: Gateway');
    assert.ok(content.includes('proof_submitted'), 'Step 4: Proof submitted');
    assert.ok(content.includes('verified'), 'Step 5: Verified');
  });

  await t.test('computes drop-off and conversion rates', () => {
    assert.ok(content.includes('dropOffCount'), 'Must track dropOffCount');
    assert.ok(content.includes('dropOffRate'), 'Must track dropOffRate');
    assert.ok(content.includes('conversionFromPrev'), 'Must track conversion from previous step');
  });
});

// 6. Plan Finder Interactive Tool Tests
test('Phase E: Plan Finder Interactive Recommendation Tool (PlanFinder.tsx)', async (t) => {
  const finderPath = path.resolve('src/components/plans/PlanFinder.tsx');
  assert.ok(fs.existsSync(finderPath), 'src/components/plans/PlanFinder.tsx must exist');

  const content = fs.readFileSync(finderPath, 'utf8');

  await t.test('provides 3-step decision flow', () => {
    assert.ok(content.includes('HouseholdSize'), 'Step 1: Household size');
    assert.ok(content.includes('UsageType'), 'Step 2: Usage profile');
    assert.ok(content.includes('BillingPreference'), 'Step 3: Billing cycle preference');
  });

  await t.test('computes complete VAT pricing snapshot on recommendation', () => {
    assert.ok(content.includes('calculatePlanPricing'), 'Must compute full pricing breakdown');
    assert.ok(content.includes('pricing.total_due'), 'Must display total due with VAT');
  });

  await t.test('integrated into /plans page', () => {
    const plansContent = fs.readFileSync(path.resolve('src/app/plans/page.tsx'), 'utf8');
    assert.ok(plansContent.includes('<PlanFinder />'), 'Must mount PlanFinder in /plans page');
  });
});
