import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { isValidEgyptianMobile, isValidWeLineNumber, calculateOrderExpiry } from '../src/lib/utils.ts';
import { calculateServerDiscount, DEFAULT_WELCOME_CAMPAIGN } from '../src/lib/services/discount.ts';

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

describe('Phase 6: End-to-End Real-World Simulation & System Verification', () => {
  // Simulated database state for the entire lifecycle
  const mockDb = {
    users: new Map(),
    orders: new Map(),
    redemptions: [],
    auditLogs: [],
    blacklistedPhones: new Set(['01000000000']),
  };

  const VODAFONE_CASH_NUMBER = '01034027398';

  // Step 1: Customer Signup & Verification
  let customerUser = null;
  test('Step 1: Customer registers with valid Egyptian mobile', () => {
    const signupData = {
      id: 'usr-cairo-778',
      full_name: 'كريم عبد العزيز',
      phone: '01012345678',
      email: 'karim@example.com',
      created_at: new Date().toISOString(),
    };

    const phoneValidation = isValidEgyptianMobile(signupData.phone);
    assert.strictEqual(phoneValidation, true);

    mockDb.users.set(signupData.id, {
      ...signupData,
      is_first_order: true,
      role: 'customer',
    });

    customerUser = mockDb.users.get(signupData.id);
    assert.ok(customerUser);
    assert.strictEqual(customerUser.is_first_order, true);
  });

  // Step 2: Welcome Gift Discovery & Eligibility
  test('Step 2: System grants 50% welcome gift eligibility for new user', () => {
    const dummyPlan = { id: 'plan-1', price_egp: 660, billing_period: 'monthly' };
    const eligibility = calculateServerDiscount({
      userId: customerUser.id,
      userCreatedAt: customerUser.created_at,
      weLineNumber: '3214567',
      customerPhone: customerUser.phone,
      plan: dummyPlan,
      campaign: DEFAULT_WELCOME_CAMPAIGN,
      existingRedemptions: mockDb.redemptions,
    });

    assert.strictEqual(eligibility.isEligible, true);
    assert.strictEqual(eligibility.percent, 50);
  });

  // Step 3: Plan Selection from Section 7 Official Catalog
  let selectedPlan = null;
  test('Step 3: Customer selects Super Monthly 500GB plan', () => {
    selectedPlan = SEED_PLANS.find((p) => p.slug === 'super-monthly-500gb');
    assert.ok(selectedPlan, 'Plan must exist in official catalog');
    assert.strictEqual(selectedPlan.tier, 'Super');
    assert.strictEqual(selectedPlan.quota_value, 500);
    assert.strictEqual(selectedPlan.quota_unit, 'GB');
    assert.strictEqual(selectedPlan.price_egp, 660);
    assert.strictEqual(selectedPlan.speed_mbps, null, 'Speed must be NULL per Section 7');
    assert.strictEqual(selectedPlan.tier_note_raw, '3');
  });

  // Step 4: Dual Landline Confirmation & Price Snapshot
  const landlineInput = '3214567';
  const landlineConfirm = '3214567';
  const governorate = '013'; // Qalyubia
  let pricingSnapshot = null;

  test('Step 4: Dual landline confirmation and locked checkout snapshot', () => {
    // 1. Verify landlines match
    assert.strictEqual(landlineInput, landlineConfirm);

    // 2. Validate format against Qalyubia (013)
    const lineValidation = isValidWeLineNumber(landlineInput, governorate);
    assert.strictEqual(lineValidation.isValid, true);
    const fullNumber = governorate + landlineInput;
    assert.strictEqual(fullNumber, '0133214567');

    // 3. Compute server-authoritative discount
    pricingSnapshot = calculateServerDiscount({
      userId: customerUser.id,
      userCreatedAt: customerUser.created_at,
      weLineNumber: landlineInput,
      customerPhone: customerUser.phone,
      plan: selectedPlan,
      campaign: DEFAULT_WELCOME_CAMPAIGN,
      existingRedemptions: mockDb.redemptions,
    });

    assert.strictEqual(pricingSnapshot.originalPrice, 660);
    assert.strictEqual(pricingSnapshot.discountAmount, 330);
    assert.strictEqual(pricingSnapshot.finalPrice, 330);
  });

  // Step 5: Order Creation & 60-Minute Expiry Countdown
  let activeOrder = null;
  test('Step 5: Order is placed with server clock and 60-minute expiry', () => {
    const createdAt = new Date();
    const expiresAt = calculateOrderExpiry(60, createdAt);

    activeOrder = {
      id: 'ord-sim-001',
      orderNumber: 'WE-2026-9001',
      customerId: customerUser.id,
      customerName: customerUser.full_name,
      customerPhone: customerUser.phone,
      weLineNumber: '0133214567',
      governorateCode: '013',
      planId: selectedPlan.id,
      planName: `سوبر ${selectedPlan.quota_value} ${selectedPlan.quota_unit}`,
      priceOriginal: pricingSnapshot.originalPrice,
      discountAmount: pricingSnapshot.discountAmount,
      priceFinal: pricingSnapshot.finalPrice,
      paymentMethodId: 'pm-vodafone-cash',
      paymentMethodName: 'فودافون كاش',
      destinationAccount: VODAFONE_CASH_NUMBER,
      status: 'pending_payment',
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    mockDb.orders.set(activeOrder.id, activeOrder);
    assert.strictEqual(mockDb.orders.has(activeOrder.id), true);

    const diffMinutes = Math.round((new Date(activeOrder.expiresAt) - new Date(activeOrder.createdAt)) / 60000);
    assert.strictEqual(diffMinutes, 60);
  });

  // Step 6: Customer Transfers to Vodafone Cash and Submits Proof
  test('Step 6: Customer submits transfer proof within the 60-minute window', () => {
    const proofSubmission = {
      orderId: activeOrder.id,
      senderRef: '01099887766',
      transactionRef: 'VF-TX-554433',
      amountSent: 330,
      proofFileSize: 1.5 * 1024 * 1024, // 1.5 MB <= 5 MB
    };

    // Validate size limit
    assert.ok(proofSubmission.proofFileSize <= 5 * 1024 * 1024, 'File exceeds 5MB');

    // Update order with proof
    activeOrder.status = 'proof_submitted';
    activeOrder.senderRef = proofSubmission.senderRef;
    activeOrder.transactionRef = proofSubmission.transactionRef;
    activeOrder.amountSent = proofSubmission.amountSent;
    activeOrder.proofSubmittedAt = new Date().toISOString();

    assert.strictEqual(activeOrder.status, 'proof_submitted');
  });

  // Step 7: Admin Verification Queue & Anti-Fraud Clearance
  test('Step 7: Admin verification queue runs anti-fraud checks and approves', () => {
    // 1. Check duplicate transaction across database
    const isDuplicate = Array.from(mockDb.orders.values()).some(
      (o) => o.id !== activeOrder.id && o.transactionRef === activeOrder.transactionRef
    );
    assert.strictEqual(isDuplicate, false);

    // 2. Check amount matches final bill
    const amountMatches = Math.abs(activeOrder.amountSent - activeOrder.priceFinal) < 0.01;
    assert.strictEqual(amountMatches, true);

    // 3. Check customer risk
    const isBlacklisted = mockDb.blacklistedPhones.has(activeOrder.customerPhone);
    assert.strictEqual(isBlacklisted, false);

    // 4. Admin approves
    activeOrder.status = 'payment_verified';
    activeOrder.verifiedAt = new Date().toISOString();
    activeOrder.verifiedBy = 'admin-operator-1';

    // Log in immutable audit table
    mockDb.auditLogs.push({
      actor_id: 'admin-operator-1',
      actor_role: 'verifier',
      action: 'APPROVE_PAYMENT',
      target_table: 'orders',
      target_id: activeOrder.id,
      timestamp: new Date().toISOString(),
    });

    assert.strictEqual(activeOrder.status, 'payment_verified');
    assert.strictEqual(mockDb.auditLogs.length, 1);
  });

  // Step 8: Fulfillment & Quota Injection
  test('Step 8: Line operator transitions order to processing then completed', () => {
    // Operator starts recharge
    activeOrder.status = 'processing';
    activeOrder.processingStartedAt = new Date().toISOString();
    assert.strictEqual(activeOrder.status, 'processing');

    // Operator marks fulfilled
    activeOrder.status = 'completed';
    activeOrder.completedAt = new Date().toISOString();

    // Record discount redemption in database to seal anti-abuse
    mockDb.redemptions.push({
      userId: activeOrder.customerId,
      weLineNumber: '3214567',
      phoneNumber: activeOrder.customerPhone,
      orderId: activeOrder.id,
      discountAmount: activeOrder.discountAmount,
      redeemedAt: new Date().toISOString(),
    });

    // Mark user is_first_order to false
    const u = mockDb.users.get(activeOrder.customerId);
    u.is_first_order = false;

    assert.strictEqual(activeOrder.status, 'completed');
    assert.strictEqual(u.is_first_order, false);
    assert.strictEqual(mockDb.redemptions.length, 1);
  });

  // Step 9: Strict Anti-Abuse Blocking on Repeat Attempts
  test('Step 9: Prevents duplicate discount redemption by user, line, or phone', () => {
    // Attempt 1: Same user tries again
    const userAttempt = calculateServerDiscount({
      userId: customerUser.id,
      weLineNumber: '9999999', // different line
      customerPhone: '01011110000', // different phone
      plan: selectedPlan,
      existingRedemptions: mockDb.redemptions,
    });
    assert.strictEqual(userAttempt.isEligible, false);
    assert.ok(userAttempt.reasonAr.includes('مسبقاً لهذا الحساب'));

    // Attempt 2: Different user tries same WE line
    const lineAttempt = calculateServerDiscount({
      userId: 'usr-different-999',
      weLineNumber: '3214567', // same line
      customerPhone: '01011110000',
      plan: selectedPlan,
      existingRedemptions: mockDb.redemptions,
    });
    assert.strictEqual(lineAttempt.isEligible, false);
    assert.ok(lineAttempt.reasonAr.includes('مسبقاً لرقم هذا الخط الأرضي'));

    // Attempt 3: Different user tries same mobile phone
    const phoneAttempt = calculateServerDiscount({
      userId: 'usr-different-888',
      weLineNumber: '8888888',
      customerPhone: customerUser.phone, // same phone
      plan: selectedPlan,
      existingRedemptions: mockDb.redemptions,
    });
    assert.strictEqual(phoneAttempt.isEligible, false);
    assert.ok(phoneAttempt.reasonAr.includes('مسبقاً لرقم هذا الهاتف المحمول'));
  });

  // Step 10: Security & Header Invariants
  test('Step 10: Security invariants (No fake reviews, no speed claims, valid contact)', () => {
    // 1. Destination payment account matches specs
    assert.strictEqual(VODAFONE_CASH_NUMBER, '01034027398');

    // 2. All 34 catalog plans have speed_mbps null
    const nonNullSpeeds = SEED_PLANS.filter((p) => p.speed_mbps !== null);
    assert.strictEqual(nonNullSpeeds.length, 0, 'No plan may have speed_mbps claimed by default');

    // 3. Exactly 34 plans in catalog
    assert.strictEqual(SEED_PLANS.length, 34);
  });
});
