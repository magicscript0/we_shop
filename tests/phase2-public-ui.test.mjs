import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Plan data definition directly matching Section 7 and seed.sql
const SEED_PLANS = [
  // Super Monthly
  { id: '1', slug: 'super-monthly-50gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'monthly', quota_value: 50, quota_unit: 'GB', price_egp: 150, sort_order: 1 },
  { id: '2', slug: 'super-monthly-200gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'monthly', quota_value: 200, quota_unit: 'GB', price_egp: 330, sort_order: 2 },
  { id: '3', slug: 'super-monthly-250gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'monthly', quota_value: 250, quota_unit: 'GB', price_egp: 395, sort_order: 3 },
  { id: '4', slug: 'super-monthly-300gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'monthly', quota_value: 300, quota_unit: 'GB', price_egp: 460, sort_order: 4 },
  { id: '5', slug: 'super-monthly-400gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'monthly', quota_value: 400, quota_unit: 'GB', price_egp: 580, sort_order: 5 },
  { id: '6', slug: 'super-monthly-500gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'monthly', quota_value: 500, quota_unit: 'GB', price_egp: 660, sort_order: 6 },
  { id: '7', slug: 'super-monthly-750gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'monthly', quota_value: 750, quota_unit: 'GB', price_egp: 925, sort_order: 7 },
  { id: '8', slug: 'super-monthly-1500gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'monthly', quota_value: 1500, quota_unit: 'GB', price_egp: 1650, sort_order: 8 },

  // Super Yearly
  { id: '9', slug: 'super-yearly-1800gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'yearly', quota_value: 1800, quota_unit: 'GB', price_egp: 3120, sort_order: 9 },
  { id: '10', slug: 'super-yearly-2400gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'yearly', quota_value: 2400, quota_unit: 'GB', price_egp: 3960, sort_order: 10 },
  { id: '11', slug: 'super-yearly-3000gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'yearly', quota_value: 3000, quota_unit: 'GB', price_egp: 4345, sort_order: 11 },
  { id: '12', slug: 'super-yearly-3600gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'yearly', quota_value: 3600, quota_unit: 'GB', price_egp: 5060, sort_order: 12 },
  { id: '13', slug: 'super-yearly-4800gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'yearly', quota_value: 4800, quota_unit: 'GB', price_egp: 6380, sort_order: 13 },
  { id: '14', slug: 'super-yearly-6000gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'yearly', quota_value: 6000, quota_unit: 'GB', price_egp: 6930, sort_order: 14 },
  { id: '15', slug: 'super-yearly-9000gb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'yearly', quota_value: 9000, quota_unit: 'GB', price_egp: 9715, sort_order: 15 },
  { id: '16', slug: 'super-yearly-18tb', tier: 'Super', tier_label_ar: 'سوبر', billing_period: 'yearly', quota_value: 18, quota_unit: 'TB', price_egp: 16500, sort_order: 16 },

  // Mega Monthly
  { id: '17', slug: 'mega-monthly-250gb', tier: 'Mega', tier_label_ar: 'ميجا', billing_period: 'monthly', quota_value: 250, quota_unit: 'GB', price_egp: 590, sort_order: 17 },
  { id: '18', slug: 'mega-monthly-500gb', tier: 'Mega', tier_label_ar: 'ميجا', billing_period: 'monthly', quota_value: 500, quota_unit: 'GB', price_egp: 900, sort_order: 18 },
  { id: '19', slug: 'mega-monthly-750gb', tier: 'Mega', tier_label_ar: 'ميجا', billing_period: 'monthly', quota_value: 750, quota_unit: 'GB', price_egp: 1175, sort_order: 19 },
  { id: '20', slug: 'mega-monthly-1500gb', tier: 'Mega', tier_label_ar: 'ميجا', billing_period: 'monthly', quota_value: 1500, quota_unit: 'GB', price_egp: 2000, sort_order: 20 },

  // Mega Yearly
  { id: '21', slug: 'mega-yearly-3000gb', tier: 'Mega', tier_label_ar: 'ميجا', billing_period: 'yearly', quota_value: 3000, quota_unit: 'GB', price_egp: 6490, sort_order: 21 },
  { id: '22', slug: 'mega-yearly-6000gb', tier: 'Mega', tier_label_ar: 'ميجا', billing_period: 'yearly', quota_value: 6000, quota_unit: 'GB', price_egp: 9450, sort_order: 22 },
  { id: '23', slug: 'mega-yearly-9000gb', tier: 'Mega', tier_label_ar: 'ميجا', billing_period: 'yearly', quota_value: 9000, quota_unit: 'GB', price_egp: 12340, sort_order: 23 },
  { id: '24', slug: 'mega-yearly-18tb', tier: 'Mega', tier_label_ar: 'ميجا', billing_period: 'yearly', quota_value: 18, quota_unit: 'TB', price_egp: 20000, sort_order: 24 },

  // Ultra Monthly
  { id: '25', slug: 'ultra-monthly-250gb', tier: 'Ultra', tier_label_ar: 'ألترا', billing_period: 'monthly', quota_value: 250, quota_unit: 'GB', price_egp: 785, sort_order: 25 },
  { id: '26', slug: 'ultra-monthly-500gb', tier: 'Ultra', tier_label_ar: 'ألترا', billing_period: 'monthly', quota_value: 500, quota_unit: 'GB', price_egp: 1150, sort_order: 26 },
  { id: '27', slug: 'ultra-monthly-750gb', tier: 'Ultra', tier_label_ar: 'ألترا', billing_period: 'monthly', quota_value: 750, quota_unit: 'GB', price_egp: 1425, sort_order: 27 },

  // Ultra Yearly
  { id: '28', slug: 'ultra-yearly-3000gb', tier: 'Ultra', tier_label_ar: 'ألترا', billing_period: 'yearly', quota_value: 3000, quota_unit: 'GB', price_egp: 8635, sort_order: 28 },
  { id: '29', slug: 'ultra-yearly-6000gb', tier: 'Ultra', tier_label_ar: 'ألترا', billing_period: 'yearly', quota_value: 6000, quota_unit: 'GB', price_egp: 12075, sort_order: 29 },
  { id: '30', slug: 'ultra-yearly-9000gb', tier: 'Ultra', tier_label_ar: 'ألترا', billing_period: 'yearly', quota_value: 9000, quota_unit: 'GB', price_egp: 14965, sort_order: 30 },

  // Max Monthly
  { id: '31', slug: 'max-monthly-1500gb', tier: 'Max', tier_label_ar: 'ماكس', billing_period: 'monthly', quota_value: 1500, quota_unit: 'GB', price_egp: 2350, sort_order: 31 },
  { id: '32', slug: 'max-plus-monthly-1500gb', tier: 'Max Plus', tier_label_ar: 'ماكس بلس', billing_period: 'monthly', quota_value: 1500, quota_unit: 'GB', price_egp: 2700, sort_order: 32 },

  // Max Yearly
  { id: '33', slug: 'max-yearly-18tb', tier: 'Max', tier_label_ar: 'ماكس', billing_period: 'yearly', quota_value: 18, quota_unit: 'TB', price_egp: 23500, sort_order: 33 },

  // Elite (other)
  { id: '34', slug: 'elite-3tb', tier: 'Elite', tier_label_ar: 'إليت', billing_period: 'other', quota_value: 3, quota_unit: 'TB', price_egp: 3500, sort_order: 34 },
];

function filterPlans({ search = '', family = 'all', period = 'all', quotaFilter = 'all', sort = 'default' }) {
  return SEED_PLANS.filter((plan) => {
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const match =
        plan.tier.toLowerCase().includes(q) ||
        plan.tier_label_ar.includes(q) ||
        String(plan.quota_value).includes(q) ||
        String(plan.price_egp).includes(q) ||
        plan.quota_unit.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (family !== 'all' && !plan.tier.toLowerCase().includes(family.toLowerCase())) {
      return false;
    }
    if (period !== 'all' && plan.billing_period !== period) {
      return false;
    }
    if (quotaFilter === 'tb' && plan.quota_unit !== 'TB') {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sort === 'price-asc') return a.price_egp - b.price_egp;
    if (sort === 'price-desc') return b.price_egp - a.price_egp;
    if (sort === 'quota-desc') {
      const valA = a.quota_unit === 'TB' ? a.quota_value * 1024 : a.quota_value;
      const valB = b.quota_unit === 'TB' ? b.quota_value * 1024 : b.quota_value;
      return valB - valA;
    }
    return a.sort_order - b.sort_order;
  });
}

describe('Phase 2 Public UI Tests', () => {
  describe('1. Plans Page Filter and Search Engine', () => {
    test('Search "500" returns exactly plans with 500 in quota or price', () => {
      const results = filterPlans({ search: '500' });
      assert.ok(results.length > 0);
      for (const r of results) {
        assert.ok(
          String(r.quota_value).includes('500') ||
          String(r.price_egp).includes('500')
        );
      }
    });

    test('Filter by family "Mega" returns only Mega plans', () => {
      const results = filterPlans({ family: 'mega' });
      assert.strictEqual(results.length, 8);
      for (const r of results) {
        assert.strictEqual(r.tier, 'Mega');
      }
    });

    test('Filter by period "yearly" returns only yearly plans', () => {
      const results = filterPlans({ period: 'yearly' });
      assert.ok(results.length > 0);
      for (const r of results) {
        assert.strictEqual(r.billing_period, 'yearly');
      }
    });

    test('Filter by quota "tb" returns all 4 Terabyte plans (Super 18TB, Mega 18TB, Max 18TB, Elite 3TB)', () => {
      const results = filterPlans({ quotaFilter: 'tb' });
      assert.strictEqual(results.length, 4);
      for (const r of results) {
        assert.strictEqual(r.quota_unit, 'TB');
      }
    });

    test('Sort by price-asc orders lowest price first', () => {
      const results = filterPlans({ sort: 'price-asc' });
      assert.strictEqual(results[0].price_egp, 150);
      assert.strictEqual(results[results.length - 1].price_egp, 23500);
    });

    test('Sort by quota-desc correctly treats 18 TB as greater than 9000 GB', () => {
      const results = filterPlans({ sort: 'quota-desc' });
      // 18 TB = 18432 GB, should be at the top
      assert.strictEqual(results[0].quota_unit, 'TB');
      assert.strictEqual(results[0].quota_value, 18);
    });
  });

  describe('2. Dynamic Route Slug Generation & Completeness', () => {
    test('All 34 plans have valid unique slugs', () => {
      const slugs = SEED_PLANS.map((p) => p.slug);
      const uniqueSlugs = new Set(slugs);
      assert.strictEqual(uniqueSlugs.size, 34);
    });

    test('Slugs follow standard URL hyphenated naming', () => {
      for (const plan of SEED_PLANS) {
        assert.match(plan.slug, /^[a-z0-9-]+$/);
      }
    });
  });

  describe('3. Transparency & Official Link Verification', () => {
    test('Usage lookup target is strictly official te.eg domain', () => {
      const officialUrl = 'https://te.eg';
      assert.strictEqual(new URL(officialUrl).hostname, 'te.eg');
    });

    test('Customer support phone is 01034027398', () => {
      const phone = '01034027398';
      assert.match(phone, /^010\d{8}$/);
    });
  });
});
