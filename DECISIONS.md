# Architectural & Design Decisions (DECISIONS.md)

This document records all architectural choices, assumptions, and configuration decisions made for the WE Home Internet Plans Store project, in accordance with Section 0 and Section 1 of the Master Prompt.

---

## 1. Project Identity & Defaults

- **Store Name:** متجر باقات WE للإنترنت المنزلي (WE Home Internet Plans Store).
  - *Rationale:* Clean, professional Arabic branding that reflects the authorized intermediary role without falsely claiming to be Telecom Egypt itself.
- **Audience & Geography:**
  - Egyptian market, individuals seeking high-speed DSL/VDSL fiber home internet plans.
  - Initial default governorate code: `013` (Qalyubia area code as requested in Section 10.1). Configurable dynamically via `site_settings` table to allow other governorates (`02` Cairo/Giza, `03` Alexandria, `045` Beheira, etc.).
- **Direction & Language:**
  - `dir="rtl"` and `lang="ar"` defined globally at the HTML root.
  - Numbers for prices and GB quotas use Latin digits (`0-9`) with tabular numeral spacing (`tabular-nums`) to ensure instant clarity and legibility, as instructed in Section 4.2.

---

## 2. Technology Stack & Rendering Strategy

- **Framework:** Next.js 16 (App Router) + TypeScript + React 19.
  - *Rationale:* Native server-side rendering (SSR) and Static Site Generation (SSG) for blazing-fast First Contentful Paint (FCP) on Egyptian mobile connections. Pre-renders all 34 plan detail pages (`/plans/[slug]`) at build time.
- **Styling:** Tailwind CSS v4 with custom design tokens mapped directly to CSS custom properties in `src/app/globals.css`.
- **Typography:**
  - Headings: `Readex Pro` (Google Fonts, weights 400-700, self-hosted via `next/font/google`, subsetted to Arabic + Latin).
  - Body: `IBM Plex Sans Arabic` (Google Fonts, weights 300-700, self-hosted via `next/font/google`, subsetted to Arabic + Latin).
- **3D Visuals & Fallbacks:**
  - Three.js interactive energy ring scene (`Hero3DScene`) with capped DPR (1.5 max) and an `IntersectionObserver` that completely halts WebGL rendering loop when scrolled out of view.
  - Graceful lightweight SVG fallback (`Hero3DFallback`) triggered on low-end devices, battery-saver modes, or `prefers-reduced-motion`.
- **Smooth Scrolling:**
  - Lenis smooth scroll engine initialized via `SmoothScroll.tsx`, strictly respecting `prefers-reduced-motion` settings.

---

## 3. Data Integrity & Section 7 Catalog Compliance

- **Exact Plans:**
  - All 34 plans from Section 7 are preserved verbatim in `src/lib/constants.ts` and `supabase/seed.sql`.
  - Quotas are strictly explicit (GB/TB). Words like "unlimited", "open", or "unrestricted" are completely banned.
  - The second number next to each family in the original prompt (3 for Super, 2 for Mega/Ultra/Max, 3 TB for Elite) is retained in `tier_note_raw` and **hidden from the public UI** until explicit confirmation from the store owner, as instructed in Section 7.
  - `speed_mbps` is left `NULL` by default and will only render if explicitly populated via the admin dashboard.
- **Pricing & Taxes:**
  - `price_includes_tax`: Stored per plan (default `false` pending accounting decision, clearly noted as "غير شامل ضريبة القيمة المضافة" or configurable via `site_settings`).
  - Orders take an immutable JSON snapshot of the plan (`plan_snapshot`) and prices at the moment of order creation. Future price updates in the catalog never alter existing orders.

---

## 4. Payment Gateway & Manual Transfer Flow

- **Manual Transfer Accounts:**
  - Vodafone Cash: `01034027398`.
  - InstaPay, Etisalat Cash, Orange Cash configured in admin and seed data.
- **60-Minute Expiry Countdown:**
  - Server-enforced timestamp (`expires_at = created_at + 60 minutes`).
  - Circular animated visual countdown with urgency alerts at 10 minutes and 2 minutes remaining.
- **Proof Upload Security:**
  - Strict 5MB file size limit enforced on client and API route (`src/app/api/orders/submit-proof/route.ts`).
  - Stored in a private Supabase Storage bucket (`payment_proofs`) accessible only to authorized operators with short-lived signed URLs.
  - Database constraint `UNIQUE(payment_method_id, transaction_ref)` to prevent re-using proof across multiple orders.

---

## 5. Anti-Abuse & 50% Welcome Discount Safeguards

- **Multi-Vector Validation Engine:**
  - Check 1: User account history (only accounts with 0 completed orders).
  - Check 2: WE Landline number (must never have redeemed the welcome campaign in `discount_redemptions`).
  - Check 3: Verified Egyptian mobile phone number (must never have redeemed the welcome campaign).
  - Check 4: 7-day registration window (expired if account created > 7 days ago).
- **Financial Risk Controls:**
  - Configurable maximum subsidy cap (`max_discount_amount`).
  - Exclude yearly plans option (prevents subsidizing 18 TB yearly plans).
  - Admin dashboard warning banner when welcome discount is active without a ceiling cap.

---

## 6. Backoffice Administration & RBAC Security

- **Role-Based Access Control (4 Tiers):**
  - `super_admin`: Full management of plans, pricing, team members, and global settings.
  - `verifier`: Evaluates proof uploads, approves or rejects payments. No plan or team editing permissions.
  - `support`: Queries customer and order details, requests information without payment approval rights.
  - `auditor`: Read-only access to immutable audit logs and export tools.
- **Immutable Forensic Audit Logging:**
  - Every administrative state change, price modification, or payment approval generates an audit record containing: `actor_id`, `actor_role`, `action`, `target_table`, `target_id`, `changes (delta)`, `ip_address`, and ISO timestamp.
- **Arabic Excel Compatibility:**
  - CSV exports use UTF-8 Byte Order Mark (`\uFEFF`) to prevent character distortion (mojibake) in Egyptian accounting workflows.

---

## 7. Enterprise Security Hardening (Phase 6)

- **HTTP Security Headers (`next.config.ts`):**
  - `Content-Security-Policy`: Restricts scripts, styles, frames, and font origins.
  - `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload`.
  - `X-Frame-Options`: `DENY` (prevents clickjacking attacks).
  - `X-Content-Type-Options`: `nosniff`.
  - `Referrer-Policy`: `origin-when-cross-origin`.
  - `Permissions-Policy`: Blocks unauthorized access to camera, microphone, and geolocation.
- **SEO & Crawling Controls:**
  - `src/app/robots.ts`: Disallows indexing of `/admin/`, `/api/`, `/checkout/`, `/account/`, `/pay/`.
  - `src/app/sitemap.ts`: Automatically indexes the 34 static plan pages and public landing pages.
