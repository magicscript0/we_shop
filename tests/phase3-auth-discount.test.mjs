import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateServerDiscount,
  DEFAULT_WELCOME_CAMPAIGN,
} from '../src/lib/services/discount.ts';

const SAMPLE_MONTHLY_PLAN = {
  id: 'plan-super-500',
  slug: 'super-monthly-500gb',
  tier: 'Super',
  tier_label_ar: 'سوبر',
  billing_period: 'monthly',
  quota_value: 500,
  quota_unit: 'GB',
  price_egp: 660,
  speed_mbps: null,
  tier_note_raw: '3',
  badge: null,
  is_active: true,
  sort_order: 6,
  price_includes_tax: false,
};

const SAMPLE_YEARLY_PLAN = {
  id: 'plan-super-yearly-18tb',
  slug: 'super-yearly-18tb',
  tier: 'Super',
  tier_label_ar: 'سوبر',
  billing_period: 'yearly',
  quota_value: 18,
  quota_unit: 'TB',
  price_egp: 16500,
  speed_mbps: null,
  tier_note_raw: '3',
  badge: null,
  is_active: true,
  sort_order: 16,
  price_includes_tax: false,
};

describe('Phase 3: Auth & Welcome Discount Abuse Prevention Tests', () => {
  describe('1. 50% Welcome Discount Calculation & Caps', () => {
    test('New customer gets 50% discount on 660 EGP monthly plan', () => {
      const result = calculateServerDiscount({
        userId: 'user-new-1',
        userCreatedAt: new Date().toISOString(),
        weLineNumber: '3214567',
        customerPhone: '01034027398',
        plan: SAMPLE_MONTHLY_PLAN,
      });

      assert.strictEqual(result.isEligible, true);
      assert.strictEqual(result.originalPrice, 660);
      assert.strictEqual(result.discountAmount, 330);
      assert.strictEqual(result.finalPrice, 330);
      assert.strictEqual(result.percent, 50);
    });

    test('Enforces max discount cap on expensive plans when cap is configured', () => {
      const customCampaign = {
        ...DEFAULT_WELCOME_CAMPAIGN,
        max_discount_amount: 1000,
      };

      const result = calculateServerDiscount({
        userId: 'user-new-2',
        userCreatedAt: new Date().toISOString(),
        weLineNumber: '3214568',
        customerPhone: '01112345678',
        plan: SAMPLE_YEARLY_PLAN,
        campaign: customCampaign,
      });

      assert.strictEqual(result.isEligible, true);
      assert.strictEqual(result.originalPrice, 16500);
      assert.strictEqual(result.discountAmount, 1000);
      assert.strictEqual(result.finalPrice, 15500);
    });

    test('Exclude yearly plans setting properly blocks discount on yearly plans', () => {
      const campaignExcludingYearly = {
        ...DEFAULT_WELCOME_CAMPAIGN,
        exclude_yearly: true,
      };

      const result = calculateServerDiscount({
        userId: 'user-new-3',
        userCreatedAt: new Date().toISOString(),
        plan: SAMPLE_YEARLY_PLAN,
        campaign: campaignExcludingYearly,
      });

      assert.strictEqual(result.isEligible, false);
      assert.strictEqual(result.discountAmount, 0);
      assert.strictEqual(result.finalPrice, 16500);
    });
  });

  describe('2. Anti-Abuse Prevention Rules (User, Line, Phone)', () => {
    const existingRedemptions = [
      { userId: 'user-used-1', weLineNumber: '3214567', phoneNumber: '01034027398' },
    ];

    test('Blocks duplicate redemption by same user account', () => {
      const result = calculateServerDiscount({
        userId: 'user-used-1',
        userCreatedAt: new Date().toISOString(),
        weLineNumber: '9999999',
        customerPhone: '01200000000',
        plan: SAMPLE_MONTHLY_PLAN,
        existingRedemptions,
      });

      assert.strictEqual(result.isEligible, false);
      assert.ok(result.reasonAr?.includes('لهذا الحساب'));
    });

    test('Blocks duplicate redemption on same WE line number by different account', () => {
      const result = calculateServerDiscount({
        userId: 'user-new-account',
        userCreatedAt: new Date().toISOString(),
        weLineNumber: '3214567', // already redeemed in past
        customerPhone: '01200000000',
        plan: SAMPLE_MONTHLY_PLAN,
        existingRedemptions,
      });

      assert.strictEqual(result.isEligible, false);
      assert.ok(result.reasonAr?.includes('الخط الأرضي'));
    });

    test('Blocks duplicate redemption using same mobile phone number', () => {
      const result = calculateServerDiscount({
        userId: 'user-another-account',
        userCreatedAt: new Date().toISOString(),
        weLineNumber: '8888888',
        customerPhone: '01034027398', // already used
        plan: SAMPLE_MONTHLY_PLAN,
        existingRedemptions,
      });

      assert.strictEqual(result.isEligible, false);
      assert.ok(result.reasonAr?.includes('الهاتف المحمول'));
    });
  });

  describe('3. 7-Day Claim Window Expiry Check', () => {
    test('Allows redemption within 7 days of signup', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

      const result = calculateServerDiscount({
        userId: 'user-valid-window',
        userCreatedAt: twoDaysAgo,
        plan: SAMPLE_MONTHLY_PLAN,
      });

      assert.strictEqual(result.isEligible, true);
    });

    test('Rejects redemption after 7 days have passed since signup', () => {
      const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();

      const result = calculateServerDiscount({
        userId: 'user-expired-window',
        userCreatedAt: eightDaysAgo,
        plan: SAMPLE_MONTHLY_PLAN,
      });

      assert.strictEqual(result.isEligible, false);
      assert.ok(result.reasonAr?.includes('انتهت صلاحية هدية الترحيب'));
    });
  });
});
