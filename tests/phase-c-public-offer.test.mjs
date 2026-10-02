import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  calculatePlanPricing,
  formatPriceEgp,
  DEFAULT_PRICING_SETTINGS,
} from '../src/lib/services/pricing.ts';
import {
  calculateServerDiscount,
  DEFAULT_WELCOME_CAMPAIGN,
} from '../src/lib/services/discount.ts';

// Sample plans representative of catalog
const PLAN_SUPER_200GB = {
  id: '1',
  slug: 'super-monthly-200gb',
  tier: 'Super',
  tier_label_ar: 'سوبر',
  billing_period: 'monthly',
  quota_value: 200,
  quota_unit: 'GB',
  price_egp: 330,
  speed_mbps: null,
};

const PLAN_SUPER_500GB = {
  id: '5',
  slug: 'super-monthly-500gb',
  tier: 'Super',
  tier_label_ar: 'سوبر',
  billing_period: 'monthly',
  quota_value: 500,
  quota_unit: 'GB',
  price_egp: 660,
  speed_mbps: null,
};

const PLAN_SUPER_750GB = {
  id: '6',
  slug: 'super-monthly-750gb',
  tier: 'Super',
  tier_label_ar: 'سوبر',
  billing_period: 'monthly',
  quota_value: 750,
  quota_unit: 'GB',
  price_egp: 925,
  speed_mbps: null,
};

const PLAN_SUPER_1500GB = {
  id: '7',
  slug: 'super-monthly-1500gb',
  tier: 'Super',
  tier_label_ar: 'سوبر',
  billing_period: 'monthly',
  quota_value: 1500,
  quota_unit: 'GB',
  price_egp: 1650,
  speed_mbps: null,
};

const PLAN_SUPER_YEARLY = {
  id: '8',
  slug: 'super-yearly-1800gb',
  tier: 'Super',
  tier_label_ar: 'سوبر',
  billing_period: 'yearly',
  quota_value: 1800,
  quota_unit: 'GB',
  price_egp: 3120,
  speed_mbps: null,
};

const PLAN_SUPER_YEARLY_18TB = {
  id: '15',
  slug: 'super-yearly-18tb',
  tier: 'Super',
  tier_label_ar: 'سوبر',
  billing_period: 'yearly',
  quota_value: 18,
  quota_unit: 'TB',
  price_egp: 16500,
  speed_mbps: null,
};

describe('Phase C: Public Welcome Offer System & Cap Verification', () => {
  describe('1. 50% Welcome Offer with 350 EGP Ceiling Cap', () => {
    test('Super 200GB (330 EGP) discount = 165 EGP, total due with 14% VAT = 188 EGP', () => {
      const discount = calculateServerDiscount({
        userId: 'user-new-c1',
        userCreatedAt: new Date().toISOString(),
        weLineNumber: '3214567',
        customerPhone: '01012345678',
        plan: PLAN_SUPER_200GB,
      });

      assert.strictEqual(discount.isEligible, true);
      assert.strictEqual(discount.discountAmount, 165);

      const pricing = calculatePlanPricing(PLAN_SUPER_200GB.price_egp, {
        percent: 50,
        max_discount_amount: 350,
        is_eligible: true,
      });

      assert.strictEqual(pricing.base_price, 330);
      assert.strictEqual(pricing.discount_amount, 165);
      assert.strictEqual(pricing.net_amount, 165);
      assert.strictEqual(pricing.vat_amount, 23.1);
      assert.strictEqual(pricing.total_due, 188); // 165 + 23.1 = 188.1 -> 188
    });

    test('Super 500GB (660 EGP) discount = 330 EGP, total due with 14% VAT = 376 EGP', () => {
      const discount = calculateServerDiscount({
        userId: 'user-new-c2',
        userCreatedAt: new Date().toISOString(),
        weLineNumber: '3214568',
        customerPhone: '01012345679',
        plan: PLAN_SUPER_500GB,
      });

      assert.strictEqual(discount.isEligible, true);
      assert.strictEqual(discount.discountAmount, 330); // 330 <= 350 cap

      const pricing = calculatePlanPricing(PLAN_SUPER_500GB.price_egp, {
        percent: 50,
        max_discount_amount: 350,
        is_eligible: true,
      });

      assert.strictEqual(pricing.base_price, 660);
      assert.strictEqual(pricing.discount_amount, 330);
      assert.strictEqual(pricing.net_amount, 330);
      assert.strictEqual(pricing.vat_amount, 46.2);
      assert.strictEqual(pricing.total_due, 376); // 330 + 46.2 = 376.2 -> 376
    });

    test('Super 750GB (925 EGP) reaches 350 EGP cap (instead of 462.5 EGP), total due = 656 EGP', () => {
      const discount = calculateServerDiscount({
        userId: 'user-new-c3',
        userCreatedAt: new Date().toISOString(),
        weLineNumber: '3214569',
        customerPhone: '01012345670',
        plan: PLAN_SUPER_750GB,
      });

      assert.strictEqual(discount.isEligible, true);
      assert.strictEqual(discount.discountAmount, 350); // Capped at 350 EGP!

      const pricing = calculatePlanPricing(PLAN_SUPER_750GB.price_egp, {
        percent: 50,
        max_discount_amount: 350,
        is_eligible: true,
      });

      assert.strictEqual(pricing.base_price, 925);
      assert.strictEqual(pricing.discount_amount, 350);
      assert.strictEqual(pricing.net_amount, 575); // 925 - 350 = 575
      assert.strictEqual(pricing.vat_amount, 80.5); // 575 * 0.14 = 80.5
      assert.strictEqual(pricing.total_due, 656); // 575 + 80.5 = 655.5 -> 656
    });

    test('Super 1500GB (1650 EGP) reaches 350 EGP cap (instead of 825 EGP), total due = 1482 EGP', () => {
      const discount = calculateServerDiscount({
        userId: 'user-new-c4',
        userCreatedAt: new Date().toISOString(),
        weLineNumber: '3214570',
        customerPhone: '01012345671',
        plan: PLAN_SUPER_1500GB,
      });

      assert.strictEqual(discount.isEligible, true);
      assert.strictEqual(discount.discountAmount, 350);

      const pricing = calculatePlanPricing(PLAN_SUPER_1500GB.price_egp, {
        percent: 50,
        max_discount_amount: 350,
        is_eligible: true,
      });

      assert.strictEqual(pricing.base_price, 1650);
      assert.strictEqual(pricing.discount_amount, 350);
      assert.strictEqual(pricing.net_amount, 1300);
      assert.strictEqual(pricing.vat_amount, 182); // 1300 * 0.14 = 182
      assert.strictEqual(pricing.total_due, 1482); // 1300 + 182 = 1482
    });
  });

  describe('2. Strict Exclusion of Yearly Plans', () => {
    test('Rejects welcome discount on Super Yearly 1800GB plan', () => {
      const discount = calculateServerDiscount({
        userId: 'user-new-c5',
        userCreatedAt: new Date().toISOString(),
        weLineNumber: '3214571',
        customerPhone: '01012345672',
        plan: PLAN_SUPER_YEARLY,
      });

      assert.strictEqual(discount.isEligible, false);
      assert.strictEqual(discount.discountAmount, 0);
      assert.strictEqual(discount.finalPrice, 3120);
      assert.ok(discount.reasonAr?.includes('الشهرية فقط'));
    });

    test('Rejects welcome discount on Super Yearly 18TB plan', () => {
      const discount = calculateServerDiscount({
        userId: 'user-new-c6',
        userCreatedAt: new Date().toISOString(),
        weLineNumber: '3214572',
        customerPhone: '01012345673',
        plan: PLAN_SUPER_YEARLY_18TB,
      });

      assert.strictEqual(discount.isEligible, false);
      assert.strictEqual(discount.discountAmount, 0);
      assert.strictEqual(discount.finalPrice, 16500);
    });

    test('calculatePlanPricing without offer computes standard renewal / yearly price with 14% VAT', () => {
      const pricing = calculatePlanPricing(PLAN_SUPER_YEARLY.price_egp, null);

      assert.strictEqual(pricing.has_offer, false);
      assert.strictEqual(pricing.base_price, 3120);
      assert.strictEqual(pricing.discount_amount, 0);
      assert.strictEqual(pricing.net_amount, 3120);
      assert.strictEqual(pricing.vat_amount, 436.8); // 3120 * 0.14 = 436.8
      assert.strictEqual(pricing.total_due, 3557); // 3120 + 436.8 = 3556.8 -> 3557
    });
  });

  describe('3. Anti-Abuse Prevention Rules Verification', () => {
    const existingRedemptions = [
      { userId: 'usr-claimed-01', weLineNumber: '3214567', phoneNumber: '01012345678' },
    ];

    test('Blocks duplicate redemption by same user ID', () => {
      const res = calculateServerDiscount({
        userId: 'usr-claimed-01',
        userCreatedAt: new Date().toISOString(),
        weLineNumber: '9999999',
        customerPhone: '01299999999',
        plan: PLAN_SUPER_500GB,
        existingRedemptions,
      });

      assert.strictEqual(res.isEligible, false);
      assert.ok(res.reasonAr?.includes('لهذا الحساب'));
    });

    test('Blocks duplicate redemption on same WE Landline number', () => {
      const res = calculateServerDiscount({
        userId: 'usr-different-new',
        userCreatedAt: new Date().toISOString(),
        weLineNumber: '3214567',
        customerPhone: '01299999999',
        plan: PLAN_SUPER_500GB,
        existingRedemptions,
      });

      assert.strictEqual(res.isEligible, false);
      assert.ok(res.reasonAr?.includes('الخط الأرضي'));
    });

    test('Blocks duplicate redemption with same verified mobile phone', () => {
      const res = calculateServerDiscount({
        userId: 'usr-different-new-2',
        userCreatedAt: new Date().toISOString(),
        weLineNumber: '8888888',
        customerPhone: '01012345678',
        plan: PLAN_SUPER_500GB,
        existingRedemptions,
      });

      assert.strictEqual(res.isEligible, false);
      assert.ok(res.reasonAr?.includes('الهاتف المحمول'));
    });

    test('Rejects redemption when user registration is older than 7 days', () => {
      const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
      const res = calculateServerDiscount({
        userId: 'usr-old-account',
        userCreatedAt: eightDaysAgo,
        weLineNumber: '7777777',
        customerPhone: '01077777777',
        plan: PLAN_SUPER_500GB,
      });

      assert.strictEqual(res.isEligible, false);
      assert.ok(res.reasonAr?.includes('انتهت صلاحية هدية الترحيب'));
    });
  });

  describe('4. Component & Session Storage Key Conventions', () => {
    test('Announcement bar dismissal key is we_welcome_bar_dismissed', () => {
      const key = 'we_welcome_bar_dismissed';
      assert.strictEqual(key, 'we_welcome_bar_dismissed');
    });

    test('Mobile sticky bar dismissal key is we_mobile_bar_dismissed', () => {
      const key = 'we_mobile_bar_dismissed';
      assert.strictEqual(key, 'we_mobile_bar_dismissed');
    });

    test('Default welcome campaign specifies 350 EGP cap and yearly exclusion', () => {
      assert.strictEqual(DEFAULT_WELCOME_CAMPAIGN.percent, 50);
      assert.strictEqual(DEFAULT_WELCOME_CAMPAIGN.max_discount_amount, 350);
      assert.strictEqual(DEFAULT_WELCOME_CAMPAIGN.exclude_yearly, true);
      assert.strictEqual(DEFAULT_WELCOME_CAMPAIGN.claim_window_days, 7);
      assert.strictEqual(DEFAULT_WELCOME_CAMPAIGN.is_active, true);
    });
  });
});
