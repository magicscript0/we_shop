/**
 * Central Pricing Engine - Single Source of Truth for WE Store (Change 2)
 *
 * Implements the exact pricing specification:
 * base        = plan.price_egp
 * discount    = min(base * offer.percent / 100, offer.max_discount_amount ?? Infinity)
 * net         = base - discount
 * vat         = net * (vat_rate / 100) (when prices_include_vat = false)
 * total_raw   = net + vat
 * total_due   = round(total_raw, rounding_mode)
 *
 * Used uniformly across: Plan cards, Plan details page, Checkout, Payment Gateway,
 * Order creation, Invoices/Receipts, Emails, and Admin Dashboard.
 */

export type RoundingMode = 'nearest_egp' | 'up_egp' | 'none';
export type CardPriceDisplay = 'before_vat' | 'after_vat';

export interface PricingSettings {
  vat_rate: number; // default 14%
  prices_include_vat: boolean; // default false
  rounding_mode: RoundingMode; // default 'nearest_egp'
  card_price_display: CardPriceDisplay; // default 'before_vat'
  currency_label: string; // default 'ج.م'
}

export const DEFAULT_PRICING_SETTINGS: PricingSettings = {
  vat_rate: 14,
  prices_include_vat: false,
  rounding_mode: 'nearest_egp',
  card_price_display: 'before_vat',
  currency_label: 'ج.م',
};

export interface PricingOfferInput {
  percent: number;
  max_discount_amount?: number | null;
  is_eligible: boolean;
  name_ar?: string;
}

export interface PricingBreakdown {
  base_price: number;
  discount_amount: number;
  net_amount: number;
  vat_rate: number;
  vat_amount: number;
  total_raw: number;
  total_due: number;
  rounding_adjustment: number;
  prices_include_vat: boolean;
  rounding_mode: RoundingMode;
  currency_label: string;
  has_offer: boolean;
  offer_percent: number;
  // Formatted string representations for immediate UI rendering
  formatted_base: string;
  formatted_discount: string;
  formatted_net: string;
  formatted_vat: string;
  formatted_rounding: string;
  formatted_total_due: string;
}

/**
 * Applies rounding rule to the raw total price
 */
export function applyRounding(amount: number, mode: RoundingMode): number {
  switch (mode) {
    case 'nearest_egp':
      return Math.round(amount);
    case 'up_egp':
      return Math.ceil(amount);
    case 'none':
    default:
      // Return 2 decimal places precision without rounding whole pounds
      return Number(amount.toFixed(2));
  }
}

/**
 * Format currency amount with tabular numerals
 */
export function formatPriceEgp(amount: number, currency: string = 'ج.م'): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} ${currency}`;
}

/**
 * Computes exact pricing breakdown for any plan under current settings
 */
export function calculatePlanPricing(
  basePrice: number,
  offer?: PricingOfferInput | null,
  customSettings?: Partial<PricingSettings>
): PricingBreakdown {
  const settings: PricingSettings = {
    ...DEFAULT_PRICING_SETTINGS,
    ...customSettings,
  };

  const base = Math.max(0, basePrice);
  const vatRate = Math.max(0, settings.vat_rate);

  // 1. Discount calculation
  let discount = 0;
  let hasOffer = false;
  let offerPercent = 0;

  if (offer && offer.is_eligible && offer.percent > 0) {
    hasOffer = true;
    offerPercent = offer.percent;
    const rawDiscount = base * (offer.percent / 100);
    discount =
      offer.max_discount_amount !== null &&
      offer.max_discount_amount !== undefined &&
      offer.max_discount_amount > 0
        ? Math.min(rawDiscount, offer.max_discount_amount)
        : rawDiscount;
  }

  // 2. Net amount after discount
  const net = Math.max(0, base - discount);

  // 3. VAT calculation
  let vat = 0;
  let totalRaw = 0;

  if (settings.prices_include_vat) {
    // If base price already includes VAT, extract the VAT component:
    // net = totalRaw; vat = net * (vatRate / (100 + vatRate))
    totalRaw = net;
    vat = net * (vatRate / (100 + vatRate));
  } else {
    // Standard Egyptian exclusive catalog price:
    vat = net * (vatRate / 100);
    totalRaw = net + vat;
  }

  // 4. Rounding adjustment
  const totalDue = applyRounding(totalRaw, settings.rounding_mode);
  const roundingAdjustment = Number((totalDue - totalRaw).toFixed(2));

  const curr = settings.currency_label;

  return {
    base_price: Number(base.toFixed(2)),
    discount_amount: Number(discount.toFixed(2)),
    net_amount: Number(net.toFixed(2)),
    vat_rate: vatRate,
    vat_amount: Number(vat.toFixed(2)),
    total_raw: Number(totalRaw.toFixed(2)),
    total_due: totalDue,
    rounding_adjustment: roundingAdjustment,
    prices_include_vat: settings.prices_include_vat,
    rounding_mode: settings.rounding_mode,
    currency_label: curr,
    has_offer: hasOffer,
    offer_percent: offerPercent,
    formatted_base: formatPriceEgp(base, curr),
    formatted_discount: formatPriceEgp(discount, curr),
    formatted_net: formatPriceEgp(net, curr),
    formatted_vat: formatPriceEgp(vat, curr),
    formatted_rounding: formatPriceEgp(roundingAdjustment, curr),
    formatted_total_due: formatPriceEgp(totalDue, curr),
  };
}
