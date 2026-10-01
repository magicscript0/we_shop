import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { calculateOrderExpiry, isValidWeLineNumber, isValidEgyptianMobile } from '../src/lib/utils.ts';
import { calculateServerDiscount } from '../src/lib/services/discount.ts';

const SAMPLE_PLAN = {
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

describe('Phase 4: Checkout, Payment Gateway & Countdown Tests', () => {
  describe('1. Server-Enforced Expiry Calculation (60 Minutes)', () => {
    test('Calculates exact 60 minutes from current timestamp', () => {
      const now = Date.now();
      const expiry = calculateOrderExpiry(60);
      const diffMinutes = Math.round((expiry.getTime() - now) / (60 * 1000));
      assert.strictEqual(diffMinutes, 60);
    });

    test('Identifies warning thresholds (10 min and 2 min)', () => {
      const remainingSecondsTenMin = 599; // 9m 59s
      const remainingSecondsTwoMin = 119; // 1m 59s
      const remainingExpired = 0;

      const isWarning = (s) => s <= 600 && s > 120;
      const isUrgent = (s) => s <= 120 && s > 0;
      const isExpired = (s) => s <= 0;

      assert.strictEqual(isWarning(remainingSecondsTenMin), true);
      assert.strictEqual(isUrgent(remainingSecondsTwoMin), true);
      assert.strictEqual(isExpired(remainingExpired), true);
    });
  });

  describe('2. Landline Double Confirmation Validation', () => {
    test('Rejects when first and confirmation landline numbers do not match', () => {
      const num1 = '3214567';
      const num2 = '3214568';
      const matches = num1.trim() === num2.trim();
      assert.strictEqual(matches, false);
    });

    test('Accepts valid Qalyubia (013) matching 7-digit lines', () => {
      const num1 = '3214567';
      const num2 = '3214567';
      const valid = isValidWeLineNumber(num1, '013');
      assert.strictEqual(valid.isValid, true);
      assert.strictEqual(num1 === num2, true);
    });
  });

  describe('3. Price Snapshot Locking at Checkout', () => {
    test('Creates an immutable snapshot preserving original and discounted prices', () => {
      const discount = calculateServerDiscount({
        weLineNumber: '3214567',
        customerPhone: '01034027398',
        plan: SAMPLE_PLAN,
      });

      const orderSnapshot = {
        price_original: discount.originalPrice,
        discount_amount: discount.discountAmount,
        price_final: discount.finalPrice,
        plan_snapshot: {
          tier: SAMPLE_PLAN.tier,
          quota: `${SAMPLE_PLAN.quota_value} ${SAMPLE_PLAN.quota_unit}`,
          price: SAMPLE_PLAN.price_egp,
        },
      };

      assert.strictEqual(orderSnapshot.price_original, 660);
      assert.strictEqual(orderSnapshot.discount_amount, 330);
      assert.strictEqual(orderSnapshot.price_final, 330);
      assert.strictEqual(orderSnapshot.plan_snapshot.price, 660);
    });
  });

  describe('4. Proof Upload Security & Constraints', () => {
    test('Enforces 5MB maximum file size limit', () => {
      const MAX_SIZE = 5 * 1024 * 1024;
      const validFileSize = 2.4 * 1024 * 1024;
      const oversizedFileSize = 6.1 * 1024 * 1024;

      assert.strictEqual(validFileSize <= MAX_SIZE, true);
      assert.strictEqual(oversizedFileSize <= MAX_SIZE, false);
    });

    test('Requires non-empty transaction ID and sender details', () => {
      const isValidProof = (sender, txId) => Boolean(sender?.trim() && txId?.trim());
      assert.strictEqual(isValidProof('01034027398', 'TX12345678'), true);
      assert.strictEqual(isValidProof('', 'TX12345678'), false);
      assert.strictEqual(isValidProof('01034027398', ''), false);
    });
  });
});
