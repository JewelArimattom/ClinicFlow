# Deployment, Security & Operational Guide

## 1. Supabase PostgreSQL Setup Guide

ClinicFlow connects to **Supabase** via PostgreSQL connection pooler and Prisma ORM.

### Step 1: Create a Supabase Project
1. Log in to [Supabase Console](https://supabase.com).
2. Create a new project (e.g. `clinicflow-prod`) and choose an Indian or nearby AWS region (e.g., `ap-south-1` Mumbai).
3. Save your database password securely.

### Step 2: Configure Database URLs in `.env`
Under **Project Settings → Database → Connection string**:
1. Copy the **Transaction Pooler** string (port `6543`) into `DATABASE_URL` (append `?pgbouncer=true`).
2. Copy the **Direct Connection** string (port `5432`) into `DIRECT_URL`.

Example:
```env
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
```

### Step 3: Run Database Migrations
Run either:
```bash
npx prisma db push
```
Or execute the raw SQL migration in the **Supabase Dashboard SQL Editor** using `prisma/supabase_schema.sql`.

---

## 2. Security & Compliance Checklist

- [x] **Strict Tenant Scoping:** All queries enforce authenticated `clinicId`. No client-supplied tenant ID is trusted blindly.
- [x] **Secure Sessions:** Sessions use HTTP-only, SameSite=Lax JWT cookies signed with a 32+ character secret.
- [x] **Password Protection:** Passwords hashed with bcryptjs (work factor 10).
- [x] **Data Protection:** Patient telephone numbers on public booking confirmation slips are masked (`+91 ******1234`).
- [x] **SQL Injection Prevention:** Parameterized queries handled by Prisma ORM and strict Zod runtime schemas.
- [x] **Double-Booking Concurrency Safe:** Server-side transaction validation verifies slot vacancy before committing appointments.
- [x] **FEFO Stock Safety:** Negative stock is prohibited; sales validate real physical batch availability before deducting.

---

## 3. Database Backup & Restore Guide

### Supabase Automated Backups
Supabase projects include point-in-time recovery (PITR) and daily automated snapshots.

### Manual Backup (Logical Dump)
To perform an on-demand logical backup of the clinic database:
```bash
pg_dump --clean --if-exists --no-owner --no-privileges -h aws-0-ap-south-1.pooler.supabase.com -U postgres.[project-ref] -d postgres -F c -f clinicflow_backup_$(date +%Y%m%d).dump
```

### Restore Procedure
To restore from a backup archive:
```bash
pg_restore -h aws-0-ap-south-1.pooler.supabase.com -U postgres.[project-ref] -d postgres --clean --no-owner clinicflow_backup_20261010.dump
```
