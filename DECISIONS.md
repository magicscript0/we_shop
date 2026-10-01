# Architectural & Design Decisions (DECISIONS.md)

This document records all architectural choices, assumptions, and configuration decisions made for the WE Home Internet Plans Store project, in accordance with Section 0 and Section 1 of the Master Prompt.

---

## 1. Project Identity & Defaults

- **Store Name:** متجر وي لخدمات الإنترنت المنزلي (WE Home Internet Store).
  - *Rationale:* Clean, professional Arabic branding that reflects the authorized intermediary role without falsely claiming to be Telecom Egypt itself.
- **Audience & Geography:**
  - Egyptian market, individuals seeking high-speed DSL/VDSL fiber home internet plans.
  - Initial default governorate code: `013` (Qalyubia area code as requested in Section 10.1). Configurable dynamically via `site_settings` table to allow other governorates (`02` Cairo/Giza, `03` Alexandria, `045` Beheira, etc.).
- **Direction & Language:**
  - `dir="rtl"` and `lang="ar"` defined globally at the HTML root.
  - Numbers for prices and GB quotas use Latin digits (`0-9`) with tabular numeral spacing (`tabular-nums`) to ensure instant clarity and legibility, as instructed in Section 4.2.

---

## 2. Technology Stack

- **Framework:** Next.js 16 (App Router) + TypeScript + React 19.
  - *Rationale:* Native server-side rendering (SSR) for blazing-fast First Contentful Paint (FCP) on Egyptian 4G/mobile connections. Full support for React Server Components and nested layouts.
- **Styling:** Tailwind CSS v4 with custom design tokens mapped directly to CSS custom properties.
- **Typography:**
  - Headings: `Readex Pro` (Google Fonts, self-hosted via `next/font/google`, subsetted to Arabic + Latin).
  - Body: `IBM Plex Sans Arabic` (Google Fonts, self-hosted via `next/font/google`, subsetted to Arabic + Latin).
  - Fallbacks: Cairo, Tajawal, system-ui.
- **Animation & Motion:**
  - `framer-motion` for declarative micro-interactions, layout transitions, and interactive states.
  - Respects `prefers-reduced-motion` project-wide.
- **Database & Storage:**
  - Supabase (PostgreSQL 15+, Auth, Storage, Realtime).
  - Row Level Security (RLS) enabled on 100% of tables.
  - Private Storage bucket `payment_proofs` with signed URLs (15-minute expiry) for admin review only.

---

## 3. Data Integrity & Catalog Assumptions

- **Exact Plans:**
  - All 34 plans from Section 7 are preserved verbatim in `supabase/seed.sql`.
  - Quotas are strictly explicit (GB/TB). Words like "unlimited", "open", or "unrestricted" are completely banned.
  - The second number next to each family in the original prompt (3 for Super, 2 for Mega/Ultra/Max, 3 TB for Elite) is retained in `tier_note_raw` and **hidden from the public UI** until explicit confirmation from the store owner, as instructed in Section 7.
  - `speed_mbps` is left `NULL` by default and will only render if populated via the admin dashboard.
- **Pricing & Taxes:**
  - `price_includes_tax`: Stored per plan (default `false` pending accounting decision, clearly noted as "غير شامل ضريبة القيمة المضافة" or configurable via `site_settings`).
  - Orders take an immutable JSON snapshot of the plan (`plan_snapshot`) and prices at the moment of order creation. Future price updates in the catalog never alter existing orders.

---

## 4. Payment Gateway & Manual Verification

- **Payment Methods:**
  - Vodafone Cash: Seeded with `01034027398`.
  - InstaPay, Etisalat Cash, Orange Cash: Initial placeholder records provided in seed migration with configurable account numbers/addresses to be finalized by the owner in Phase 5 / Section 18.
- **Order State Machine:**
  - `awaiting_payment` -> `proof_submitted` -> `payment_verified` -> `processing` -> `completed`.
  - Edge states: `rejected`, `needs_info`, `expired`, `cancelled`, `refunded`.
  - Transition constraints enforced at the database/API level with full audit trail in `order_events`.
- **Anti-Fraud & Duplicate Prevention:**
  - Database constraint `UNIQUE (payment_method, transaction_ref)` stops transaction ID reuse across any orders.
  - 60-minute countdown is computed strictly on the server (`expires_at = created_at + 60 minutes`) and synchronized with server time.

---

## 5. Welcome Discount (50% Off First Order)

- Stored in the `campaigns` table (`is_active = true`, `percent = 50`, `claim_window_days = 7`).
- Consumed only when payment is verified (`payment_verified`), not merely upon order submission.
- Tracked via `coupon_redemptions` table with unique line, phone number, and user constraints to prevent multi-account abuse.
