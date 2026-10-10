# ClinicFlow — Multi-Tenant Clinic Management & Patient Booking SaaS

A production-oriented Clinic Management SaaS Platform engineered for independent clinics, polyclinics, and diagnostic practices in India. Built with Next.js App Router, TypeScript, Tailwind CSS, Prisma ORM, and Supabase PostgreSQL.

---

## 🌟 Architecture & Three Integrated Experiences

ClinicFlow seamlessly connects three distinct user experiences across a single unified source of truth and strict tenant isolation:

1. **Patient-Facing Discovery Platform**
   - Search clinics by city (Kochi, Bangalore, Chennai), doctor, condition, and medical specialty.
   - Public clinic profiles (`/clinics/[slug]`) with published doctors, fees, and operational hours.
   - Frictionless appointment booking (`/book/[clinicSlug]`) without forcing upfront account creation.
   - Real-time slot availability calculation and concurrency-safe double-booking prevention.
   - Booking confirmation (`/booking/confirmation/[reference]`) and self-service booking portal (`/my-appointments`).

2. **Clinic Management Application (`/app/*`)**
   - Role-Based Access Control (`OWNER`, `ADMIN`, `DOCTOR`, `RECEPTIONIST`, `CASHIER`, `PHARMACIST`).
   - Daily sequential token queue (`/app/queue`) with desk status and call-in workflows.
   - Appointment calendar and walk-in scheduling (`/app/appointments`).
   - Consultation billing & receipt printing (`/app/billing`) with Cash, UPI, and Card splits.
   - Pharmacy inventory & POS checkout (`/app/pharmacy`) with batch-level FEFO tracking and atomic stock deduction.
   - Operational analytics and CSV report exports (`/app/reports`).

3. **SaaS Super-Admin Portal (`/platform-admin`)**
   - Platform-wide clinic tenant management and subscription monitoring.
   - Live MRR (Monthly Recurring Revenue) calculations.
   - One-click account activation and suspension.
   - Configurable subscription tiers (Starter ₹799, Professional ₹1,499, Clinic Plus ₹2,999).

---

## 🗄️ Database & Supabase Integration

ClinicFlow supports **Supabase PostgreSQL** natively via Prisma ORM:

### Supabase Connection Configuration (`.env`)
```bash
# Supabase Transaction Pooler (port 6543) for application queries
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase Direct Connection (port 5432) for Prisma migrations
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Supabase Project Credentials
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 1-Click Supabase SQL Setup
A complete, committed SQL migration script is available in:
- `prisma/supabase_schema.sql`
- `prisma/migrations/0_init/migration.sql`

You can copy and execute this file directly in the **Supabase Dashboard SQL Editor** to initialize all tables, foreign keys, unique constraints, and indexes.

### Resilient Hybrid Mode
For local development before connecting to a live Supabase project, ClinicFlow includes a high-fidelity transactional repository layer that allows all pages, APIs, bookings, invoices, and POS checkouts to run out of the box with zero external configuration!

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Run Automated Tests
```bash
npm test
```
Runs unit tests covering tenant isolation, double booking prevention, invoice arithmetic, and pharmacy FEFO deduction.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Demo Credentials

Use these fictional accounts to evaluate role-specific workflows at `/login`:

| Role | Email | Password | Landing Page |
|---|---|---|---|
| **SaaS Super-Admin** | `admin@clinicflow.in` | `Admin@123` | `/platform-admin` |
| **Clinic Owner** | `owner@aurahealth.in` | `Clinic@123` | `/app/dashboard` |
| **Receptionist** | `reception@aurahealth.in` | `Clinic@123` | `/app/appointments` |
| **Pharmacist** | `pharma@aurahealth.in` | `Clinic@123` | `/app/pharmacy` |
