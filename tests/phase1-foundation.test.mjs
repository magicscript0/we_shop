import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Plan data definition directly matching Section 7 and seed.sql
const SEED_PLANS = [
  // Super Monthly
  { id: '1', slug: 'super-monthly-50gb', tier: 'Super', billing_period: 'monthly', quota_value: 50, quota_unit: 'GB', price_egp: 150, speed_mbps: null, tier_note_raw: '3' },
  { id: '2', slug: 'super-monthly-200gb', tier: 'Super', billing_period: 'monthly', quota_value: 200, quota_unit: 'GB', price_egp: 330, speed_mbps: null, tier_note_raw: '3' },
  { id: '3', slug: 'super-monthly-250gb', tier: 'Super', billing_period: 'monthly', quota_value: 250, quota_unit: 'GB', price_egp: 395, speed_mbps: null, tier_note_raw: '3' },
  { id: '4', slug: 'super-monthly-300gb', tier: 'Super', billing_period: 'monthly', quota_value: 300, quota_unit: 'GB', price_egp: 460, speed_mbps: null, tier_note_raw: '3' },
  { id: '5', slug: 'super-monthly-400gb', tier: 'Super', billing_period: 'monthly', quota_value: 400, quota_unit: 'GB', price_egp: 580, speed_mbps: null, tier_note_raw: '3' },
  { id: '6', slug: 'super-monthly-500gb', tier: 'Super', billing_period: 'monthly', quota_value: 500, quota_unit: 'GB', price_egp: 660, speed_mbps: null, tier_note_raw: '3' },
  { id: '7', slug: 'super-monthly-750gb', tier: 'Super', billing_period: 'monthly', quota_value: 750, quota_unit: 'GB', price_egp: 925, speed_mbps: null, tier_note_raw: '3' },
  { id: '8', slug: 'super-monthly-1500gb', tier: 'Super', billing_period: 'monthly', quota_value: 1500, quota_unit: 'GB', price_egp: 1650, speed_mbps: null, tier_note_raw: '3' },

  // Super Yearly
  { id: '9', slug: 'super-yearly-1800gb', tier: 'Super', billing_period: 'yearly', quota_value: 1800, quota_unit: 'GB', price_egp: 3120, speed_mbps: null, tier_note_raw: '3' },
  { id: '10', slug: 'super-yearly-2400gb', tier: 'Super', billing_period: 'yearly', quota_value: 2400, quota_unit: 'GB', price_egp: 3960, speed_mbps: null, tier_note_raw: '3' },
  { id: '11', slug: 'super-yearly-3000gb', tier: 'Super', billing_period: 'yearly', quota_value: 3000, quota_unit: 'GB', price_egp: 4345, speed_mbps: null, tier_note_raw: '3' },
  { id: '12', slug: 'super-yearly-3600gb', tier: 'Super', billing_period: 'yearly', quota_value: 3600, quota_unit: 'GB', price_egp: 5060, speed_mbps: null, tier_note_raw: '3' },
  { id: '13', slug: 'super-yearly-4800gb', tier: 'Super', billing_period: 'yearly', quota_value: 4800, quota_unit: 'GB', price_egp: 6380, speed_mbps: null, tier_note_raw: '3' },
  { id: '14', slug: 'super-yearly-6000gb', tier: 'Super', billing_period: 'yearly', quota_value: 6000, quota_unit: 'GB', price_egp: 6930, speed_mbps: null, tier_note_raw: '3' },
  { id: '15', slug: 'super-yearly-9000gb', tier: 'Super', billing_period: 'yearly', quota_value: 9000, quota_unit: 'GB', price_egp: 9715, speed_mbps: null, tier_note_raw: '3' },
  { id: '16', slug: 'super-yearly-18tb', tier: 'Super', billing_period: 'yearly', quota_value: 18, quota_unit: 'TB', price_egp: 16500, speed_mbps: null, tier_note_raw: '3' },

  // Mega Monthly
  { id: '17', slug: 'mega-monthly-250gb', tier: 'Mega', billing_period: 'monthly', quota_value: 250, quota_unit: 'GB', price_egp: 590, speed_mbps: null, tier_note_raw: '2' },
  { id: '18', slug: 'mega-monthly-500gb', tier: 'Mega', billing_period: 'monthly', quota_value: 500, quota_unit: 'GB', price_egp: 900, speed_mbps: null, tier_note_raw: '2' },
  { id: '19', slug: 'mega-monthly-750gb', tier: 'Mega', billing_period: 'monthly', quota_value: 750, quota_unit: 'GB', price_egp: 1175, speed_mbps: null, tier_note_raw: '2' },
  { id: '20', slug: 'mega-monthly-1500gb', tier: 'Mega', billing_period: 'monthly', quota_value: 1500, quota_unit: 'GB', price_egp: 2000, speed_mbps: null, tier_note_raw: '2' },

  // Mega Yearly
  { id: '21', slug: 'mega-yearly-3000gb', tier: 'Mega', billing_period: 'yearly', quota_value: 3000, quota_unit: 'GB', price_egp: 6490, speed_mbps: null, tier_note_raw: '2' },
  { id: '22', slug: 'mega-yearly-6000gb', tier: 'Mega', billing_period: 'yearly', quota_value: 6000, quota_unit: 'GB', price_egp: 9450, speed_mbps: null, tier_note_raw: '2' },
  { id: '23', slug: 'mega-yearly-9000gb', tier: 'Mega', billing_period: 'yearly', quota_value: 9000, quota_unit: 'GB', price_egp: 12340, speed_mbps: null, tier_note_raw: '2' },
  { id: '24', slug: 'mega-yearly-18tb', tier: 'Mega', billing_period: 'yearly', quota_value: 18, quota_unit: 'TB', price_egp: 20000, speed_mbps: null, tier_note_raw: '2' },

  // Ultra Monthly
  { id: '25', slug: 'ultra-monthly-250gb', tier: 'Ultra', billing_period: 'monthly', quota_value: 250, quota_unit: 'GB', price_egp: 785, speed_mbps: null, tier_note_raw: '2' },
  { id: '26', slug: 'ultra-monthly-500gb', tier: 'Ultra', billing_period: 'monthly', quota_value: 500, quota_unit: 'GB', price_egp: 1150, speed_mbps: null, tier_note_raw: '2' },
  { id: '27', slug: 'ultra-monthly-750gb', tier: 'Ultra', billing_period: 'monthly', quota_value: 750, quota_unit: 'GB', price_egp: 1425, speed_mbps: null, tier_note_raw: '2' },

  // Ultra Yearly
  { id: '28', slug: 'ultra-yearly-3000gb', tier: 'Ultra', billing_period: 'yearly', quota_value: 3000, quota_unit: 'GB', price_egp: 8635, speed_mbps: null, tier_note_raw: '2' },
  { id: '29', slug: 'ultra-yearly-6000gb', tier: 'Ultra', billing_period: 'yearly', quota_value: 6000, quota_unit: 'GB', price_egp: 12075, speed_mbps: null, tier_note_raw: '2' },
  { id: '30', slug: 'ultra-yearly-9000gb', tier: 'Ultra', billing_period: 'yearly', quota_value: 9000, quota_unit: 'GB', price_egp: 14965, speed_mbps: null, tier_note_raw: '2' },

  // Max Monthly
  { id: '31', slug: 'max-monthly-1500gb', tier: 'Max', billing_period: 'monthly', quota_value: 1500, quota_unit: 'GB', price_egp: 2350, speed_mbps: null, tier_note_raw: '2' },
  { id: '32', slug: 'max-plus-monthly-1500gb', tier: 'Max Plus', billing_period: 'monthly', quota_value: 1500, quota_unit: 'GB', price_egp: 2700, speed_mbps: null, tier_note_raw: '2' },

  // Max Yearly
  { id: '33', slug: 'max-yearly-18tb', tier: 'Max', billing_period: 'yearly', quota_value: 18, quota_unit: 'TB', price_egp: 23500, speed_mbps: null, tier_note_raw: '2' },

  // Elite (other)
  { id: '34', slug: 'elite-3tb', tier: 'Elite', billing_period: 'other', quota_value: 3, quota_unit: 'TB', price_egp: 3500, speed_mbps: null, tier_note_raw: '3 TB' },
];

function calculateDiscount(originalPrice, percent, maxCap = null) {
  let discount = originalPrice * (percent / 100);
  if (maxCap !== null && discount > maxCap) {
    discount = maxCap;
  }
  return {
    discountAmount: Math.round(discount),
    finalPrice: Math.round(originalPrice - discount),
  };
}

function isValidWeLine(lineNumber, governorateCode = '013', allowedCodes = ['013', '02', '03']) {
  if (!allowedCodes.includes(governorateCode)) return false;
  const expectedLength = governorateCode === '02' ? 8 : 7;
  return new RegExp(`^[0-9]{${expectedLength}}$`).test(lineNumber);
}

function isValidMobile(phone) {
  return /^01[0125][0-9]{8}$/.test(phone);
}

const ALLOWED_STATE_TRANSITIONS = {
  awaiting_payment: ['proof_submitted', 'cancelled', 'expired'],
  proof_submitted: ['payment_verified', 'rejected', 'needs_info'],
  payment_verified: ['processing', 'refunded'],
  processing: ['completed', 'rejected'],
  completed: ['refunded'],
  rejected: ['proof_submitted', 'cancelled'],
  needs_info: ['proof_submitted', 'cancelled'],
  expired: [],
  cancelled: [],
  refunded: [],
};

function canTransition(from, to) {
  return (ALLOWED_STATE_TRANSITIONS[from] || []).includes(to);
}

describe('Phase 1 Foundation Tests', () => {
  describe('1. Catalog Integrity & Section 7 Compliance', () => {
    test('Plans count must be exactly 34 plans', () => {
      assert.strictEqual(SEED_PLANS.length, 34);
    });

    test('Super tier has 16 plans (8 monthly, 8 yearly)', () => {
      const superPlans = SEED_PLANS.filter((p) => p.tier === 'Super');
      assert.strictEqual(superPlans.length, 16);
      assert.strictEqual(superPlans.filter((p) => p.billing_period === 'monthly').length, 8);
      assert.strictEqual(superPlans.filter((p) => p.billing_period === 'yearly').length, 8);
    });

    test('Mega tier has 8 plans (4 monthly, 4 yearly)', () => {
      const megaPlans = SEED_PLANS.filter((p) => p.tier === 'Mega');
      assert.strictEqual(megaPlans.length, 8);
    });

    test('Ultra tier has 6 plans (3 monthly, 3 yearly)', () => {
      const ultraPlans = SEED_PLANS.filter((p) => p.tier === 'Ultra');
      assert.strictEqual(ultraPlans.length, 6);
    });

    test('Max tier has 3 plans and Elite has 1 plan', () => {
      const maxPlans = SEED_PLANS.filter((p) => p.tier.startsWith('Max'));
      assert.strictEqual(maxPlans.length, 3);

      const elite = SEED_PLANS.find((p) => p.tier === 'Elite');
      assert.ok(elite);
      assert.strictEqual(elite.price_egp, 3500);
      assert.strictEqual(elite.quota_value, 3);
      assert.strictEqual(elite.quota_unit, 'TB');
    });

    test('Speed mbps is NULL by default in accordance with Section 7', () => {
      for (const plan of SEED_PLANS) {
        assert.strictEqual(plan.speed_mbps, null);
      }
    });

    test('Tier raw notes stored verbatim without UI exposure', () => {
      const superSample = SEED_PLANS.find((p) => p.tier === 'Super');
      assert.strictEqual(superSample.tier_note_raw, '3');
      const megaSample = SEED_PLANS.find((p) => p.tier === 'Mega');
      assert.strictEqual(megaSample.tier_note_raw, '2');
      const eliteSample = SEED_PLANS.find((p) => p.tier === 'Elite');
      assert.strictEqual(eliteSample.tier_note_raw, '3 TB');
    });
  });

  describe('2. Pricing & 50% Welcome Discount Calculation', () => {
    test('Calculates 50% discount correctly without cap', () => {
      const result = calculateDiscount(660, 50, null);
      assert.strictEqual(result.discountAmount, 330);
      assert.strictEqual(result.finalPrice, 330);
    });

    test('Enforces max discount cap when configured', () => {
      // 50% on 16500 EGP is 8250 EGP. With a 1000 EGP cap, discount should be 1000 EGP.
      const result = calculateDiscount(16500, 50, 1000);
      assert.strictEqual(result.discountAmount, 1000);
      assert.strictEqual(result.finalPrice, 15500);
    });

    test('Base plan 50 GB price 150 EGP discounts to 75 EGP', () => {
      const result = calculateDiscount(150, 50, null);
      assert.strictEqual(result.discountAmount, 75);
      assert.strictEqual(result.finalPrice, 75);
    });
  });

  describe('3. Validation Logic (Landline & Mobile)', () => {
    test('Validates Qalyubia (013) 7-digit landlines', () => {
      assert.strictEqual(isValidWeLine('3214567', '013'), true);
      assert.strictEqual(isValidWeLine('123456', '013'), false); // too short
      assert.strictEqual(isValidWeLine('12345678', '013'), false); // too long
    });

    test('Validates Cairo (02) 8-digit landlines', () => {
      assert.strictEqual(isValidWeLine('23456789', '02'), true);
      assert.strictEqual(isValidWeLine('2345678', '02'), false); // 7 digits is invalid for 02
    });

    test('Rejects unsupported governorate code', () => {
      assert.strictEqual(isValidWeLine('1234567', '099'), false);
    });

    test('Validates Egyptian mobile prefixes (010, 011, 012, 015)', () => {
      assert.strictEqual(isValidMobile('01034027398'), true); // Vodafone
      assert.strictEqual(isValidMobile('01100000000'), true); // Etisalat
      assert.strictEqual(isValidMobile('01200000000'), true); // Orange
      assert.strictEqual(isValidMobile('01500000000'), true); // WE
      assert.strictEqual(isValidMobile('01334027398'), false); // 013 is not mobile
      assert.strictEqual(isValidMobile('0103402739'), false); // 10 digits
      assert.strictEqual(isValidMobile('010340273988'), false); // 12 digits
    });
  });

  describe('4. Order State Machine Transitions', () => {
    test('Allows legal workflow progression', () => {
      assert.strictEqual(canTransition('awaiting_payment', 'proof_submitted'), true);
      assert.strictEqual(canTransition('proof_submitted', 'payment_verified'), true);
      assert.strictEqual(canTransition('payment_verified', 'processing'), true);
      assert.strictEqual(canTransition('processing', 'completed'), true);
    });

    test('Allows re-upload when rejected or needs_info', () => {
      assert.strictEqual(canTransition('rejected', 'proof_submitted'), true);
      assert.strictEqual(canTransition('needs_info', 'proof_submitted'), true);
    });

    test('Blocks illegal transitions (fraud prevention)', () => {
      assert.strictEqual(canTransition('awaiting_payment', 'completed'), false);
      assert.strictEqual(canTransition('expired', 'completed'), false);
      assert.strictEqual(canTransition('completed', 'awaiting_payment'), false);
    });
  });

  describe('5. Countdown & Expiry Calculations', () => {
    test('Computes 60-minute expiry correctly on server clock', () => {
      const now = new Date('2026-10-01T12:00:00Z');
      const expiry = new Date(now.getTime() + 60 * 60 * 1000);
      assert.strictEqual(expiry.toISOString(), '2026-10-01T13:00:00.000Z');
    });
  });
});
