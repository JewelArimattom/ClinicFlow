// Core TypeScript definitions for Multi-Tenant Clinic Management SaaS

export type UserRole = 
  | 'OWNER' 
  | 'ADMIN' 
  | 'DOCTOR' 
  | 'RECEPTIONIST' 
  | 'CASHIER' 
  | 'PHARMACIST';

export type AppointmentStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'CHECKED_IN' 
  | 'WAITING' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'NO_SHOW';

export type QueueStatus = 
  | 'WAITING' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'SKIPPED';

export type InvoiceStatus = 
  | 'DRAFT' 
  | 'ISSUED' 
  | 'PAID' 
  | 'PARTIALLY_PAID' 
  | 'VOID' 
  | 'REFUNDED';

export type InvoiceType = 
  | 'CONSULTATION' 
  | 'PHARMACY' 
  | 'COMBINED';

export type PaymentMethod = 
  | 'CASH' 
  | 'UPI' 
  | 'CARD' 
  | 'BANK_TRANSFER' 
  | 'OTHER';

export type PaymentStatus = 
  | 'SUCCESS' 
  | 'REFUNDED' 
  | 'VOID';

export type StockMovementType = 
  | 'PURCHASE_RECEIPT' 
  | 'SALE' 
  | 'SALE_RETURN' 
  | 'PURCHASE_RETURN' 
  | 'ADJUSTMENT_DAMAGE' 
  | 'ADJUSTMENT_EXPIRED' 
  | 'AUDIT_CORRECTION';

export type SubscriptionTier = 
  | 'STARTER' 
  | 'PROFESSIONAL' 
  | 'CLINIC_PLUS';

export type SubscriptionStatus = 
  | 'TRIAL' 
  | 'ACTIVE' 
  | 'PAST_DUE' 
  | 'GRACE_PERIOD' 
  | 'SUSPENDED' 
  | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  isSuperAdmin: boolean;
  emailVerified?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  clinicType: string;
  description?: string | null;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  email: string;
  logoUrl?: string | null;
  coverUrl?: string | null;
  brandColor: string;
  timezone: string;
  currency: string;
  isVerified: boolean;
  isPublished: boolean;
  bookingEnabled: boolean;
  customDomain?: string | null;
  cancellationHours: number;
  bufferMinutes: number;
  defaultSlotMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClinicMembership {
  id: string;
  clinicId: string;
  userId: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Specialty {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
}

export interface Doctor {
  id: string;
  clinicId: string;
  userId?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  specialtyId?: string | null;
  specialtyName: string;
  qualifications: string;
  registrationNumber?: string | null;
  consultationFee: number;
  bio?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  dayOfWeek: number; // 0 = Sun, 1 = Mon ...
  startTime: string; // "09:00"
  endTime: string;   // "13:00"
  slotDurationMinutes: number;
  maxPatientsPerSlot: number;
  isDayOff: boolean;
}

export interface Patient {
  id: string;
  clinicId: string;
  fullName: string;
  phone: string;
  email?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  bloodGroup?: string | null;
  address?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  clinicId: string;
  patientId: string;
  doctorId: string;
  reference: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  consultationFee: number;
  reason?: string | null;
  staffNotes?: string | null;
  bookedOnline: boolean;
  cancellationReason?: string | null;
  cancelledAt?: Date | null;
  rescheduledFromId?: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Joined fields for UI convenience
  patient?: Patient;
  doctor?: Doctor;
  clinic?: Clinic;
}

export interface QueueEntry {
  id: string;
  clinicId: string;
  appointmentId?: string | null;
  patientId: string;
  tokenNumber: number;
  date: string; // YYYY-MM-DD
  status: QueueStatus;
  checkedInAt: Date;
  startedAt?: Date | null;
  completedAt?: Date | null;
  estimatedWaitMins: number;

  patient?: Patient;
  appointment?: Appointment;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  totalPrice: number;
  medicineId?: string | null;
  batchId?: string | null;
}

export interface Payment {
  id: string;
  clinicId: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string | null;
  status: PaymentStatus;
  notes?: string | null;
  recordedByUserId?: string | null;
  createdAt: Date;
}

export interface Refund {
  id: string;
  clinicId: string;
  paymentId: string;
  invoiceId: string;
  amount: number;
  reason: string;
  authorizedByUserId?: string | null;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  clinicId: string;
  patientId?: string | null;
  appointmentId?: string | null;
  invoiceNumber: string;
  type: InvoiceType;
  status: InvoiceStatus;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;

  items?: InvoiceItem[];
  payments?: Payment[];
  patient?: Patient | null;
}

export interface Medicine {
  id: string;
  clinicId: string;
  name: string;
  brand?: string | null;
  genericName?: string | null;
  categoryId?: string | null;
  dosageForm: string;
  strength?: string | null;
  barcode?: string | null;
  uom: string;
  purchasePrice: number;
  sellingPrice: number;
  reorderThreshold: number;
  taxPercent: number;
  isPrescriptionRequired: boolean;
  isActive: boolean;
  totalStock?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryBatch {
  id: string;
  clinicId: string;
  medicineId: string;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  purchaseCost: number;
  sellingPrice: number;
  quantityReceived: number;
  currentStock: number;
  supplierId?: string | null;
  receivedDate: string;
  createdAt: Date;
  updatedAt: Date;

  medicine?: Medicine;
  supplier?: Supplier;
}

export interface Supplier {
  id: string;
  clinicId: string;
  name: string;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  gstin?: string | null;
  notes?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockMovement {
  id: string;
  clinicId: string;
  medicineId: string;
  batchId?: string | null;
  type: StockMovementType;
  quantity: number;
  balanceAfter: number;
  referenceType?: string | null;
  referenceId?: string | null;
  reason?: string | null;
  recordedByUserId?: string | null;
  createdAt: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  monthlyPrice: number;
  annualPrice: number;
  trialDays: number;
  maxDoctors: number;
  maxStaff: number;
  maxAppointmentsMonthly: number;
  features: string[];
  isActive: boolean;
}

export interface ClinicSubscription {
  id: string;
  clinicId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEndsAt?: Date | null;
  cancelledAt?: Date | null;
  suspensionReason?: string | null;
  createdAt: Date;
  updatedAt: Date;

  plan?: SubscriptionPlan;
}

export interface SessionPayload {
  userId: string;
  email: string;
  fullName: string;
  isSuperAdmin: boolean;
  clinicId?: string;
  clinicSlug?: string;
  clinicName?: string;
  role?: UserRole;
}
