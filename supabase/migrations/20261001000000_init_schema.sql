-- =============================================================================
-- Migration: 20261001000000_init_schema.sql
-- Description: Core schema for WE Home Internet Plans Store
-- Author: Engineering Team
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. ENUMS & DOMAINS
-- -----------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('customer', 'support', 'verifier', 'admin', 'owner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status_type AS ENUM (
        'awaiting_payment',
        'proof_submitted',
        'payment_verified',
        'processing',
        'completed',
        'rejected',
        'needs_info',
        'expired',
        'cancelled',
        'refunded'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE quota_unit_type AS ENUM ('GB', 'TB');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE billing_period_type AS ENUM ('monthly', 'yearly', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE proof_review_status_type AS ENUM ('pending', 'approved', 'rejected', 'needs_info');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -----------------------------------------------------------------------------
-- 2. USER PROFILES & ROLES
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT '',
    phone_number VARCHAR(15) DEFAULT NULL,
    phone_verified BOOLEAN DEFAULT FALSE,
    governorate_code VARCHAR(4) DEFAULT '013',
    saved_we_lines JSONB DEFAULT '[]'::jsonb,
    is_blocked BOOLEAN DEFAULT FALSE,
    block_reason TEXT DEFAULT NULL,
    suspicion_flags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role_type NOT NULL DEFAULT 'customer',
    assigned_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_roles UNIQUE (user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone_number);

-- -----------------------------------------------------------------------------
-- 3. PLANS CATALOG (Section 7)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    tier VARCHAR(50) NOT NULL, -- Super, Mega, Ultra, Max, Max Plus, Elite
    tier_label_ar VARCHAR(50) NOT NULL, -- سوبر, ميجا, ألترا, ماكس, ماكس بلس, إليت
    billing_period billing_period_type NOT NULL DEFAULT 'monthly',
    quota_value NUMERIC(10, 2) NOT NULL,
    quota_unit quota_unit_type NOT NULL DEFAULT 'GB',
    price_egp NUMERIC(10, 2) NOT NULL,
    speed_mbps INTEGER DEFAULT NULL,
    tier_note_raw TEXT DEFAULT NULL,
    badge VARCHAR(50) DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    price_includes_tax BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_plans_tier_active ON public.plans(tier, is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_plans_period ON public.plans(billing_period);

-- -----------------------------------------------------------------------------
-- 4. PAYMENT METHODS (Section 10.4)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(50) NOT NULL UNIQUE, -- vodafone_cash, instapay, etisalat_cash, orange_cash
    label_ar VARCHAR(100) NOT NULL,
    account_value VARCHAR(150) NOT NULL,
    account_holder_name VARCHAR(150) NOT NULL,
    instructions_md TEXT NOT NULL,
    fee_note TEXT NOT NULL DEFAULT 'يجب تحويل المبلغ بالكامل شاملاً أي رسوم تحويل خاصة بمحفظتك.',
    min_amount NUMERIC(10, 2) DEFAULT 50.00,
    max_amount NUMERIC(10, 2) DEFAULT 30000.00,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 5. CAMPAIGNS & DISCOUNTS (Section 9)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name_ar VARCHAR(150) NOT NULL,
    percent NUMERIC(5, 2) NOT NULL DEFAULT 50.00,
    max_discount_amount NUMERIC(10, 2) DEFAULT NULL, -- NULL means no cap (triggers admin warning)
    claim_window_days INTEGER NOT NULL DEFAULT 7,
    starts_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    ends_at TIMESTAMPTZ DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    eligible_plan_ids UUID[] DEFAULT NULL, -- NULL means all plans
    exclude_yearly BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 6. ORDERS & ORDER STATE MACHINE (Section 10)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(32) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE RESTRICT,
    status order_status_type NOT NULL DEFAULT 'awaiting_payment',
    
    -- Home internet line details
    we_line_number VARCHAR(15) NOT NULL,
    line_governorate_code VARCHAR(4) NOT NULL DEFAULT '013',
    customer_phone VARCHAR(15) NOT NULL,
    
    -- Immutable Price Snapshot at Order Creation
    price_original NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    price_final NUMERIC(10, 2) NOT NULL,
    campaign_id UUID REFERENCES public.campaigns(id),
    plan_snapshot JSONB NOT NULL,
    
    -- Server-Enforced Expiry (Section 10.2: 60-Minute Countdown)
    expires_at TIMESTAMPTZ NOT NULL,
    payment_method_id UUID REFERENCES public.payment_methods(id),
    
    internal_notes TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_orders_user_status ON public.orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_status_expires ON public.orders(status, expires_at);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_we_line ON public.orders(we_line_number);

-- -----------------------------------------------------------------------------
-- 7. ORDER EVENTS (AUDIT TRAIL)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.order_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES auth.users(id),
    actor_role VARCHAR(50) NOT NULL DEFAULT 'system',
    from_status order_status_type,
    to_status order_status_type NOT NULL,
    note TEXT DEFAULT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_order_events_order ON public.order_events(order_id, created_at);

-- -----------------------------------------------------------------------------
-- 8. PAYMENT PROOFS (Section 10.1 & 14)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.payment_proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    payment_method_id UUID NOT NULL REFERENCES public.payment_methods(id),
    
    sender_phone_or_ref VARCHAR(100) NOT NULL,
    transaction_ref VARCHAR(100) NOT NULL,
    amount_sent NUMERIC(10, 2) NOT NULL,
    
    file_path TEXT NOT NULL,
    file_hash VARCHAR(64) DEFAULT NULL,
    file_size_bytes INTEGER DEFAULT NULL,
    
    review_status proof_review_status_type NOT NULL DEFAULT 'pending',
    reviewer_id UUID REFERENCES auth.users(id),
    reject_reason TEXT DEFAULT NULL,
    reviewer_notes TEXT DEFAULT NULL,
    
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    reviewed_at TIMESTAMPTZ DEFAULT NULL,
    
    -- Prevent transaction reuse fraud (Section 13)
    CONSTRAINT uq_payment_proof_transaction UNIQUE (payment_method_id, transaction_ref)
);

CREATE INDEX IF NOT EXISTS idx_payment_proofs_status ON public.payment_proofs(review_status, submitted_at);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_order ON public.payment_proofs(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_file_hash ON public.payment_proofs(file_hash);

-- -----------------------------------------------------------------------------
-- 9. COUPON REDEMPTIONS (Anti-abuse tracking - Section 9)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    we_line_number VARCHAR(15) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    discount_applied NUMERIC(10, 2) NOT NULL,
    redeemed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    
    -- Enforce one redemption per line and per user for a campaign
    CONSTRAINT uq_coupon_line_campaign UNIQUE (campaign_id, we_line_number),
    CONSTRAINT uq_coupon_user_campaign UNIQUE (campaign_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_line ON public.coupon_redemptions(we_line_number);

-- -----------------------------------------------------------------------------
-- 10. SITE CONTENT: BANNERS & FAQS (Section 12.8)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ar VARCHAR(200) NOT NULL,
    subtitle_ar TEXT DEFAULT '',
    badge_ar VARCHAR(50) DEFAULT NULL,
    link_url TEXT DEFAULT NULL,
    button_text_ar VARCHAR(50) DEFAULT 'اشترك الآن',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_ar TEXT NOT NULL,
    answer_ar TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 11. SITE SETTINGS & CONFIGURATION (Section 12.9)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    description TEXT DEFAULT NULL,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 12. NOTIFICATIONS & SUPPORT (Section 11)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title_ar VARCHAR(200) NOT NULL,
    message_ar TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'order_update',
    link_url TEXT DEFAULT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read, created_at);

CREATE TABLE IF NOT EXISTS public.support_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(15) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',
    assigned_to UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 13. AUDIT LOGS (Section 12.11)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id),
    actor_role VARCHAR(50) NOT NULL DEFAULT 'system',
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(100) NOT NULL,
    target_id UUID DEFAULT NULL,
    old_values JSONB DEFAULT NULL,
    new_values JSONB DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON public.audit_logs(target_table, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at);

-- -----------------------------------------------------------------------------
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Security helper function to check user role
CREATE OR REPLACE FUNCTION public.current_user_has_role(required_role user_role_type)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND (role = required_role OR role = 'owner')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin_or_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() 
          AND role IN ('support', 'verifier', 'admin', 'owner')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin_or_staff());

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Public Catalog Policies (Plans, Payment Methods, Banners, FAQs)
CREATE POLICY "Anyone can view active plans" ON public.plans
    FOR SELECT USING (is_active = TRUE OR public.is_admin_or_staff());

CREATE POLICY "Staff can manage plans" ON public.plans
    FOR ALL USING (public.is_admin_or_staff());

CREATE POLICY "Anyone can view enabled payment methods" ON public.payment_methods
    FOR SELECT USING (is_enabled = TRUE OR public.is_admin_or_staff());

CREATE POLICY "Staff can manage payment methods" ON public.payment_methods
    FOR ALL USING (public.is_admin_or_staff());

CREATE POLICY "Anyone can view active banners" ON public.banners
    FOR SELECT USING (is_active = TRUE OR public.is_admin_or_staff());

CREATE POLICY "Staff can manage banners" ON public.banners
    FOR ALL USING (public.is_admin_or_staff());

CREATE POLICY "Anyone can view published FAQs" ON public.faqs
    FOR SELECT USING (is_published = TRUE OR public.is_admin_or_staff());

CREATE POLICY "Staff can manage FAQs" ON public.faqs
    FOR ALL USING (public.is_admin_or_staff());

CREATE POLICY "Anyone can view active campaigns" ON public.campaigns
    FOR SELECT USING (is_active = TRUE OR public.is_admin_or_staff());

-- Orders Policies
CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_staff());

CREATE POLICY "Users can create their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can update orders" ON public.orders
    FOR UPDATE USING (public.is_admin_or_staff());

-- Order Events Policies
CREATE POLICY "Users can view events for their own orders" ON public.order_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_events.order_id 
              AND (orders.user_id = auth.uid() OR public.is_admin_or_staff())
        )
    );

CREATE POLICY "Staff can insert order events" ON public.order_events
    FOR INSERT WITH CHECK (public.is_admin_or_staff() OR auth.uid() IS NOT NULL);

-- Payment Proofs Policies
CREATE POLICY "Users can view their own payment proofs" ON public.payment_proofs
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_staff());

CREATE POLICY "Users can insert their own payment proof" ON public.payment_proofs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can review payment proofs" ON public.payment_proofs
    FOR UPDATE USING (public.is_admin_or_staff());

-- Notifications Policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can mark own notifications read" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Site Settings Policies
CREATE POLICY "Anyone can view public settings" ON public.site_settings
    FOR SELECT USING (TRUE);

CREATE POLICY "Admin can manage settings" ON public.site_settings
    FOR ALL USING (public.is_admin_or_staff());

-- Audit Logs Policies
CREATE POLICY "Admin can view audit logs" ON public.audit_logs
    FOR SELECT USING (public.is_admin_or_staff());

-- Automatic User Profile Creation Trigger on Auth Sign-Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone_number)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        new.raw_user_meta_data->>'phone_number'
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'customer')
    ON CONFLICT (user_id, role) DO NOTHING;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
