export type UserRole = 'customer' | 'support' | 'verifier' | 'admin' | 'owner';

export type OrderStatus =
  | 'awaiting_payment'
  | 'proof_submitted'
  | 'payment_verified'
  | 'processing'
  | 'completed'
  | 'rejected'
  | 'needs_info'
  | 'expired'
  | 'cancelled'
  | 'refunded';

export type QuotaUnit = 'GB' | 'TB';
export type BillingPeriod = 'monthly' | 'yearly' | 'other';
export type PlanTier = 'Super' | 'Mega' | 'Ultra' | 'Max' | 'Max Plus' | 'Elite';

export interface Plan {
  id: string;
  slug: string;
  tier: PlanTier;
  tier_label_ar: string;
  billing_period: BillingPeriod;
  quota_value: number;
  quota_unit: QuotaUnit;
  price_egp: number;
  speed_mbps: number | null;
  tier_note_raw: string | null;
  badge: string | null;
  is_active: boolean;
  sort_order: number;
  price_includes_tax: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentMethod {
  id: string;
  key: 'vodafone_cash' | 'instapay' | 'etisalat_cash' | 'orange_cash' | string;
  label_ar: string;
  sub_label?: string;
  badge?: string | null;
  account_value?: string;
  account_holder_name?: string;
  instructions_md?: string;
  fee_note: string;
  min_amount: number;
  max_amount: number;
  is_enabled: boolean;
  sort_order: number;
}

export interface Campaign {
  id: string;
  slug: string;
  name_ar: string;
  percent: number;
  max_discount_amount: number | null;
  claim_window_days: number;
  starts_at: string;
  ends_at: string | null;
  is_active: boolean;
  eligible_plan_ids: string[] | null;
  exclude_yearly: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  plan_id: string;
  status: OrderStatus;
  we_line_number: string;
  line_governorate_code: string;
  customer_phone: string;
  price_original: number;
  discount_amount: number;
  price_final: number;
  net_amount?: number;
  vat_rate?: number;
  vat_amount?: number;
  rounding_adjustment?: number;
  total_due?: number;
  campaign_id: string | null;
  plan_snapshot: {
    tier: string;
    tier_label_ar: string;
    quota_value: number;
    quota_unit: QuotaUnit;
    billing_period: BillingPeriod;
    price_egp: number;
    slug: string;
  };
  offer_snapshot?: {
    percent: number;
    max_discount_amount: number | null;
    name_ar?: string;
  } | null;
  expires_at: string;
  payment_method_id: string | null;
  internal_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentProof {
  id: string;
  order_id: string;
  user_id: string;
  payment_method_id: string;
  sender_phone_or_ref: string;
  transaction_ref: string;
  amount_sent: number;
  file_path: string;
  file_hash?: string | null;
  file_size_bytes?: number | null;
  review_status: 'pending' | 'approved' | 'rejected' | 'needs_info';
  reviewer_id?: string | null;
  reject_reason?: string | null;
  reviewer_notes?: string | null;
  submitted_at: string;
  reviewed_at?: string | null;
}

export interface UserProfile {
  id: string;
  full_name: string;
  phone_number: string | null;
  phone_verified: boolean;
  governorate_code: string;
  saved_we_lines: string[];
  is_blocked: boolean;
  block_reason?: string | null;
  created_at: string;
}

export interface FAQItem {
  id: string;
  question_ar: string;
  answer_ar: string;
  category: string;
  sort_order: number;
  is_published: boolean;
}

export interface SiteBanner {
  id: string;
  title_ar: string;
  subtitle_ar: string;
  badge_ar?: string | null;
  link_url?: string | null;
  button_text_ar: string;
  sort_order: number;
  is_active: boolean;
}
