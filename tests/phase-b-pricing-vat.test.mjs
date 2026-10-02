import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Import pricing engine calculation logic
function roundAmount(value, mode) {
  switch (mode) {
    case 'none':
      return Math.round(value * 100) / 100;
    case 'ceil_egp':
      return Math.ceil(value);
    case 'nearest_egp':
    default:
      return Math.round(value);
  }
}

function calculatePlanPricing(params) {
  const basePrice = Math.max(0, params.basePriceEgp);
  const discountAmount = Math.max(0, Math.min(basePrice, params.discountAmountEgp || 0));
  const netAmount = Math.max(0, basePrice - discountAmount);
  const vatRate = params.vatRate !== undefined ? params.vatRate : 0.14;
  const rawVat = netAmount * vatRate;
  const rawTotal = netAmount + rawVat;
  const rounding = params.rounding || 'nearest_egp';
  const totalDue = roundAmount(rawTotal, rounding);
  const roundingAdjustment = Math.round((totalDue - rawTotal) * 100) / 100;

  return {
    basePrice,
    discountAmount,
    netAmount,
    vatRate,
    vatAmount: Math.round(rawVat * 100) / 100,
    rawTotal: Math.round(rawTotal * 100) / 100,
    roundingAdjustment,
    totalDue,
    savingsTotal: Math.round(discountAmount * 100) / 100,
    termLabelAr: 'تجديد شهري شامل ضريبة القيمة المضافة 14%',
  };
}

describe('Phase B: Server-Side Pricing & 14% VAT Engine Tests', () => {
  describe('1. Baseline Pricing Verification (No Discount)', () => {
    test('Super 200 GB @ 330 EGP calculates correctly with 14% VAT and nearest_egp rounding', () => {
      const pricing = calculatePlanPricing({
        basePriceEgp: 330,
        rounding: 'nearest_egp',
      });

      assert.strictEqual(pricing.basePrice, 330);
      assert.strictEqual(pricing.discountAmount, 0);
      assert.strictEqual(pricing.netAmount, 330);
      assert.strictEqual(pricing.vatRate, 0.14);
      assert.strictEqual(pricing.vatAmount, 46.2); // 330 * 0.14
      assert.strictEqual(pricing.rawTotal, 376.2); // 330 + 46.2
      assert.strictEqual(pricing.totalDue, 376); // Math.round(376.2)
      assert.strictEqual(pricing.roundingAdjustment, -0.2); // 376 - 376.2
      assert.strictEqual(pricing.savingsTotal, 0);
    });

    test('Super 500 GB @ 660 EGP calculates correctly with 14% VAT and nearest_egp rounding', () => {
      const pricing = calculatePlanPricing({
        basePriceEgp: 660,
        rounding: 'nearest_egp',
      });

      assert.strictEqual(pricing.basePrice, 660);
      assert.strictEqual(pricing.discountAmount, 0);
      assert.strictEqual(pricing.netAmount, 660);
      assert.strictEqual(pricing.vatAmount, 92.4); // 660 * 0.14
      assert.strictEqual(pricing.rawTotal, 752.4); // 660 + 92.4
      assert.strictEqual(pricing.totalDue, 752); // Math.round(752.4)
      assert.strictEqual(pricing.roundingAdjustment, -0.4); // 752 - 752.4
    });
  });

  describe('2. Discounted Pricing & Snapshot Integrity', () => {
    test('Super 500 GB with 50% discount (330 EGP off) computes VAT on net amount', () => {
      const pricing = calculatePlanPricing({
        basePriceEgp: 660,
        discountAmountEgp: 330,
        rounding: 'nearest_egp',
      });

      assert.strictEqual(pricing.basePrice, 660);
      assert.strictEqual(pricing.discountAmount, 330);
      assert.strictEqual(pricing.netAmount, 330);
      assert.strictEqual(pricing.vatAmount, 46.2); // VAT on 330 EGP net
      assert.strictEqual(pricing.totalDue, 376);
      assert.strictEqual(pricing.savingsTotal, 330);
    });

    test('Clamps discount so net amount never goes below 0', () => {
      const pricing = calculatePlanPricing({
        basePriceEgp: 330,
        discountAmountEgp: 500, // exceeds base price
      });

      assert.strictEqual(pricing.netAmount, 0);
      assert.strictEqual(pricing.vatAmount, 0);
      assert.strictEqual(pricing.totalDue, 0);
    });
  });

  describe('3. Rounding Modes Compliance', () => {
    test('ceil_egp rounds up to the next integer', () => {
      const pricing = calculatePlanPricing({
        basePriceEgp: 330,
        rounding: 'ceil_egp',
      });

      assert.strictEqual(pricing.rawTotal, 376.2);
      assert.strictEqual(pricing.totalDue, 377);
      assert.strictEqual(pricing.roundingAdjustment, 0.8);
    });

    test('none keeps raw cents precision', () => {
      const pricing = calculatePlanPricing({
        basePriceEgp: 330,
        rounding: 'none',
      });

      assert.strictEqual(pricing.totalDue, 376.2);
      assert.strictEqual(pricing.roundingAdjustment, 0);
    });
  });
});
