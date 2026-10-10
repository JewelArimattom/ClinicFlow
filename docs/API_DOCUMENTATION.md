# ClinicFlow REST API Documentation

This document describes the request/response contracts for public patient endpoints, clinic management endpoints, and SaaS super-admin endpoints.

---

## 1. Public Discovery & Booking Endpoints

### `GET /api/public/clinics`
Returns verified clinics with location and doctor rollups.
- **Query Parameters:**
  - `q`: Free-text search (clinic name or address)
  - `city`: Locality or city filter (e.g. `Kochi`)
  - `specialty`: Specialty slug filter (e.g. `pediatrics`)
- **Response:**
  ```json
  {
    "clinics": [
      {
        "id": "clinic-aura",
        "name": "Aura Health Polyclinic & Diagnostics",
        "slug": "aura-health",
        "city": "Kochi",
        "doctorsCount": 3,
        "specialties": ["General Medicine", "Pediatrics", "Dermatology"],
        "minConsultationFee": 400
      }
    ]
  }
  ```

### `GET /api/public/clinics/[slug]/availability`
Returns computed slots for a doctor on a specific date.
- **Query Parameters:** `doctorId`, `date` (`YYYY-MM-DD`)
- **Response:**
  ```json
  {
    "date": "2026-10-15",
    "doctorId": "doc-rajesh",
    "slotDurationMinutes": 15,
    "slots": [
      { "startTime": "09:00", "endTime": "09:15", "isAvailable": true },
      { "startTime": "09:15", "endTime": "09:30", "isAvailable": false }
    ]
  }
  ```

### `POST /api/public/bookings`
Books an appointment atomically with double-booking collision protection.
- **Request Body:**
  ```json
  {
    "clinicSlug": "aura-health",
    "doctorId": "doc-rajesh",
    "date": "2026-10-15",
    "startTime": "09:30",
    "endTime": "09:45",
    "patientName": "Aarav Kumar",
    "patientPhone": "9845012345",
    "patientEmail": "aarav@gmail.com",
    "reason": "Fever & Cough"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "reference": "APT-9F42A1",
    "appointment": { ... }
  }
  ```

### `GET /api/public/bookings/[reference]`
Looks up booking status with sanitized patient information.

### `PATCH /api/public/bookings/[reference]`
Allows cancellation of booking.
- **Request Body:** `{ "action": "CANCEL", "reason": "Patient requested" }`

---

## 2. Authentication Endpoints

### `POST /api/auth/login`
Authenticates user, verifies bcrypt hash, and sets HTTP-only JWT session cookie.
- **Request Body:** `{ "email": "owner@aurahealth.in", "password": "Clinic@123" }`

### `POST /api/auth/logout`
Clears session cookie and returns `{ "success": true }`.

### `POST /api/auth/register-clinic`
Registers owner account, creates clinic instance, assigns 14-day Starter trial, and creates default doctor profile.

---

## 3. Clinic Management Endpoints (`/api/app/*`)

*All `/api/app/*` routes require a valid session cookie and enforce strict tenant matching (`clinicId`).*

### `GET /api/app/appointments`
Returns appointments for current tenant by date or doctor filter.

### `POST /api/app/appointments`
Receptionist creates scheduled or walk-in appointment. Walk-ins automatically receive token and enter `/api/app/queue`.

### `PATCH /api/app/appointments/[id]`
Transitions appointment status (`CHECKED_IN`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).

### `GET /api/app/queue` & `PATCH /api/app/queue`
Manages daily token queue sequence, call-ins, and completions.

### `GET /api/app/billing/invoices` & `POST /api/app/billing/invoices`
Issues consultation or pharmacy invoices with decimal INR amounts.

### `POST /api/app/billing/payments`
Records payments with Tender type (`CASH`, `UPI`, `CARD`, `BANK_TRANSFER`) and reference notes.

### `GET /api/app/pharmacy/medicines` & `POST /api/app/pharmacy/medicines`
Maintains catalog, selling prices, UOM, and reorder thresholds.

### `GET /api/app/pharmacy/inventory` & `POST /api/app/pharmacy/inventory`
Tracks batch-level inventory with expiry dates and purchase costs.

### `POST /api/app/pharmacy/sales`
Atomic counter checkout that validates stock, deducts via FEFO (First Expiry First Out), creates invoice, and records payment.

### `GET /api/app/reports`
Aggregates financial KPIs, payment tender breakdown, and produces downloadable CSV export (`?format=csv`).

---

## 4. SaaS Super-Admin Endpoints (`/api/platform-admin`)

*Guarded by `isSuperAdmin: true`.*

### `GET /api/platform-admin`
Returns cross-tenant metrics: total clinics, active clinics, trial clinics, MRR, invoices, and subscription plans.

### `PATCH /api/platform-admin`
Activates or suspends a clinic instance (`{ "clinicId": "...", "status": "SUSPENDED", "reason": "..." }`).
