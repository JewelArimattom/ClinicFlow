# Repository Inspection Report & Multi-Tenant Architecture Plan

## 1. Current Architecture and Technology Stack
- **Environment:** Node.js v22.19.0, npm 10.9.3, Windows OS.
- **Initial State:** Empty directory (`c:\My\Clinic Management`).
- **Target Stack:**
  - **Framework:** Next.js 14 App Router, React 18, TypeScript (strict mode).
  - **Styling & UI:** Tailwind CSS, Lucide React icons, accessible design system adhering to healthcare aesthetics (clean teal/slate palette `#0d9488`, accessible contrast, clean card geometry).
  - **Database:** Supabase PostgreSQL with Prisma ORM client (`@prisma/client`), complete relational schema with strict foreign keys, indexes, decimal precision, and committed migrations (`prisma/migrations/0_init/migration.sql` & `prisma/supabase_schema.sql`).
  - **Data Access & Tenancy:** Strict tenant isolation layer verifying session clinic memberships; dual-mode runtime that connects seamlessly to Supabase PostgreSQL or falls back to an in-memory transactional mock store when running in offline development.
  - **Authentication:** Role-Based Access Control (RBAC) with JWT session cookies, bcrypt password hashing, and user role scoping (`OWNER`, `ADMIN`, `DOCTOR`, `RECEPTIONIST`, `CASHIER`, `PHARMACIST`, Super Admin).
  - **Form & Validation:** React Hook Form, Zod schema validation.
  - **Financial Precision:** `decimal.js` representation for all billing and accounting (INR).

---

## 2. Existing Working Features
- **Scaffolded Workspace:** Initialized Next.js 14 App Router with TypeScript and Tailwind CSS.
- **Database Schema:** Full PostgreSQL/Supabase schema written and Prisma client generated.
- **Migration Script:** Complete DDL SQL script prepared for 1-click execution in Supabase SQL editor (`prisma/supabase_schema.sql` and `prisma/migrations/0_init/migration.sql`).
- **Environment Configuration:** Configured `.env.example` and `.env` with Supabase pooler/direct connection strings and service keys.

---

## 3. Missing Features (To Be Implemented)
- **Module 1: Public Discovery & Landing:** Homepage (`/`), clinic search (`/search`), specialty filter, how it works, responsive layout.
- **Module 2: Public Clinic Pages & Onboarding:** Public profile (`/clinics/[slug]`, `/clinics/[slug]/doctors`, `/clinics/[slug]/services`), SEO metadata, multi-step onboarding wizard (`/register-clinic`).
- **Module 3: Authentication & Multi-Tenancy:** Secure auth routes (`/login`, `/api/auth/*`), session tokens, role authorization guards, tenant scoping middleware.
- **Module 4: Appointments & Queue Management:** Booking wizard (`/book/[clinicSlug]`), booking confirmation (`/booking/confirmation/[reference]`), patient booking portal (`/my-appointments`), clinic appointment management (`/app/appointments`), live daily token queue (`/app/queue`).
- **Module 5: Billing & Invoicing Engine:** Invoice generation (`/app/billing`, `/app/billing/invoices`), partial payments, UPI/Cash/Card recording, refunds, receipt printing.
- **Module 6: Pharmacy & Batch Inventory:** Medicine catalog (`/app/pharmacy/medicines`), suppliers (`/app/pharmacy/suppliers`), batch management with expiry dates, stock movements, POS checkout with stock deduction, returns.
- **Module 7: Analytics & Reporting:** Real-time KPI cards (`/app/dashboard`), charts (revenue, appointments, top medicines), CSV export (`/app/reports`).
- **Module 8: SaaS Administration:** Platform Super-Admin portal (`/platform-admin`), clinic approval/suspension, subscription tiers (Starter ₹799, Professional ₹1,499, Clinic Plus ₹2,999).
- **Module 9: Notifications & Audit:** Development notification dispatcher (Email/WhatsApp abstraction), audit logging.
- **Module 10: Fictional Seed Data & Automated Test Suite:** Unit and integration tests for tenant isolation, state transitions, financial calculations, and pharmacy sales.

---

## 4. Database Status
- Complete PostgreSQL schema declared in [prisma/schema.prisma](file:///c:/My/Clinic%20Management/prisma/schema.prisma).
- Generated Prisma Client (`v5.22.0`).
- Exported complete Supabase SQL migration script in [prisma/supabase_schema.sql](file:///c:/My/Clinic%20Management/prisma/supabase_schema.sql) and [prisma/migrations/0_init/migration.sql](file:///c:/My/Clinic%20Management/prisma/migrations/0_init/migration.sql).
- Supabase connection details configured in `.env`.

---

## 5. Authentication Status
- Multi-role data model ready (`User`, `ClinicMembership`, `UserRole`, `Session`).
- Ready to build secure password hashing (bcryptjs), JWT token signing, HTTP-only cookie handlers, and session extraction helper.

---

## 6. Current Build and Test Status
- `package.json` dependencies installed cleanly (`npm install` exit code 0).
- `npx prisma generate` executed successfully.
- Production Next.js build validation and automated tests will be run throughout development.

---

## 7. Architectural Guardrails
1. **Tenant Isolation:** Every data query MUST enforce `clinicId` checking from the authenticated user's verified session.
2. **Atomic Inventory & Billing:** Pharmacy sales must atomically check stock, decrement batch stock, write stock movement ledger, and create invoice/payment.
3. **Decimal Safety:** Currency arithmetic uses Decimal calculations (no JS floating point rounding issues).
4. **Idempotent Bookings:** Double booking prevention on doctor schedules with server-side transaction validation.
5. **Dual Mode Persistence:** Automatically uses Supabase PostgreSQL when credentials/connection are active, and falls back to a high-fidelity in-memory transactional database for zero-config local testing.

---

## 8. Prioritized Implementation Plan

| Phase | Description | Deliverables |
|---|---|---|
| **Phase 1: Foundation & Auth** | Shared DB client, seed data, JWT auth, RBAC, tenant context | `src/lib/db.ts`, `src/lib/auth.ts`, `src/lib/session.ts`, auth APIs, `/login` |
| **Phase 2: Public Platform** | Discovery homepage, search, clinic public pages, clinic onboarding | `/`, `/search`, `/clinics/[slug]`, `/register-clinic` |
| **Phase 3: Appointments & Queue** | Online booking flow, confirmation, clinic appointments, token queue | `/book/[clinicSlug]`, `/booking/confirmation/[reference]`, `/app/appointments`, `/app/queue` |
| **Phase 4: Billing & Payments** | Invoice generation, payments (Cash, UPI, Card), receipts, refunds | `/app/billing`, `/app/billing/invoices` |
| **Phase 5: Pharmacy & Inventory** | Medicine catalog, batches, FEFO stock deduction, POS checkout | `/app/pharmacy`, `/app/pharmacy/medicines`, `/app/pharmacy/inventory` |
| **Phase 6: Dashboard & Analytics** | Real-time KPI metrics, charts, date filters, CSV reporting | `/app/dashboard`, `/app/reports` |
| **Phase 7: SaaS Super-Admin** | Multi-tenant clinic management, subscription plans, platform metrics | `/platform-admin`, `/platform-admin/clinics`, `/platform-admin/subscriptions` |
| **Phase 8: Tests & Verification** | Automated tests for tenant isolation, state machine, billing, inventory; Next.js build | `tests/tenant.test.js`, `tests/billing.test.js`, `tests/inventory.test.js`, `npm run build` |
