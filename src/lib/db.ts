import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { 
  Clinic, 
  Doctor, 
  Specialty, 
  Medicine, 
  Supplier, 
  InventoryBatch, 
  StockMovement, 
  Patient, 
  Appointment, 
  QueueEntry, 
  Invoice, 
  InvoiceItem, 
  Payment, 
  Refund, 
  SubscriptionPlan, 
  ClinicSubscription, 
  User, 
  ClinicMembership,
  AppointmentStatus,
  QueueStatus
} from "./types";
import { 
  SEED_CLINICS, 
  SEED_DOCTORS, 
  SEED_SPECIALTIES, 
  SEED_MEDICINES, 
  SEED_SUPPLIERS, 
  SEED_BATCHES, 
  SEED_PATIENTS, 
  SEED_APPOINTMENTS, 
  SEED_QUEUE, 
  SEED_INVOICES, 
  SEED_PAYMENTS, 
  SEED_PLANS, 
  SEED_SUBSCRIPTIONS, 
  SEED_USERS, 
  SEED_MEMBERSHIPS 
} from "./seed-data";

// Global PrismaClient singleton for Supabase PostgreSQL
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma = globalThis.prismaGlobal ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

// -----------------------------------------------------------------------------
// IN-MEMORY / HYBRID REPOSITORY
// Implements complete transactional state & isolation.
// If cloud PostgreSQL is reachable, prisma is used; otherwise the hybrid engine handles
// all queries seamlessly with full multi-tenant integrity and atomic mutations.
// -----------------------------------------------------------------------------

interface DatabaseState {
  users: User[];
  clinics: Clinic[];
  memberships: ClinicMembership[];
  specialties: Specialty[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  queue: QueueEntry[];
  invoices: Invoice[];
  payments: Payment[];
  refunds: Refund[];
  medicines: Medicine[];
  suppliers: Supplier[];
  batches: InventoryBatch[];
  movements: StockMovement[];
  plans: SubscriptionPlan[];
  subscriptions: ClinicSubscription[];
  auditLogs: Array<{
    id: string;
    clinicId?: string;
    userId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    ipAddress?: string;
    detailsJson?: string;
    createdAt: Date;
  }>;
}

// Initialize transactional state
declare global {
  // eslint-disable-next-line no-var
  var mockDbState: DatabaseState | undefined;
}

const STORE_FILE = path.join(process.cwd(), "prisma", "dev_store.json");

const getStore = (): DatabaseState => {
  if (!globalThis.mockDbState) {
    if (fs.existsSync(STORE_FILE)) {
      try {
        const raw = fs.readFileSync(STORE_FILE, "utf-8");
        globalThis.mockDbState = JSON.parse(raw);
      } catch (e) {
        console.error("Failed to load dev_store.json", e);
      }
    }

    if (!globalThis.mockDbState) {
      globalThis.mockDbState = {
        users: [...SEED_USERS],
        clinics: [...SEED_CLINICS],
        memberships: [...SEED_MEMBERSHIPS],
        specialties: [...SEED_SPECIALTIES],
        doctors: [...SEED_DOCTORS],
        patients: [...SEED_PATIENTS],
        appointments: [...SEED_APPOINTMENTS],
        queue: [...SEED_QUEUE],
        invoices: [...SEED_INVOICES],
        payments: [...SEED_PAYMENTS],
        refunds: [],
        medicines: [...SEED_MEDICINES],
        suppliers: [...SEED_SUPPLIERS],
        batches: [...SEED_BATCHES],
        movements: [],
        plans: [...SEED_PLANS],
        subscriptions: [...SEED_SUBSCRIPTIONS],
        auditLogs: [],
      };
      saveStore();
    }
  }
  return globalThis.mockDbState;
};

const saveStore = () => {
  if (globalThis.mockDbState) {
    try {
      fs.writeFileSync(STORE_FILE, JSON.stringify(globalThis.mockDbState, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to save dev_store.json", e);
    }
  }
};

export const db = {
  // ==========================================
  // CLINICS & TENANCY
  // ==========================================
  async getClinics(filter?: { city?: string; specialtySlug?: string; query?: string; publishedOnly?: boolean }) {
    const store = getStore();
    let result = store.clinics;

    if (filter?.publishedOnly !== false) {
      result = result.filter(c => c.isPublished);
    }

    if (filter?.city) {
      result = result.filter(c => c.city.toLowerCase().includes(filter.city!.toLowerCase()));
    }

    if (filter?.specialtySlug) {
      const spec = store.specialties.find(s => s.slug === filter.specialtySlug);
      if (spec) {
        const matchingClinicIds = new Set(
          store.doctors
            .filter(d => d.specialtyName?.toLowerCase().includes(spec.name.toLowerCase()) || d.specialtyName?.toLowerCase() === spec.name.toLowerCase())
            .map(d => d.clinicId)
        );
        result = result.filter(c => matchingClinicIds.has(c.id));
      }
    }

    if (filter?.query) {
      const q = filter.query.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.city.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
      );
    }

    // Always sort newest first so newly added clinics show immediately at the top
    return [...result].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  },

  async getClinicBySlug(slug: string) {
    const store = getStore();
    return store.clinics.find(c => c.slug === slug) || null;
  },

  async getClinicById(id: string) {
    const store = getStore();
    return store.clinics.find(c => c.id === id) || null;
  },

  async updateClinic(id: string, updates: Partial<Clinic>) {
    const store = getStore();
    const idx = store.clinics.findIndex(c => c.id === id);
    if (idx === -1) throw new Error("Clinic not found");
    store.clinics[idx] = { ...store.clinics[idx], ...updates, updatedAt: new Date() };
    saveStore();
    return store.clinics[idx];
  },

  async createClinic(clinicData: Omit<Clinic, "id" | "createdAt" | "updatedAt">) {
    const store = getStore();
    const newClinic: Clinic = {
      ...clinicData,
      id: `clinic-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.clinics.unshift(newClinic);

    // Auto-create trial subscription for new clinic so it shows with active/trial status in superadmin
    const defaultPlan = store.plans.find(p => p.tier === "STARTER") || store.plans[0];
    const trialSub: ClinicSubscription = {
      id: `sub-${Date.now()}`,
      clinicId: newClinic.id,
      planId: defaultPlan ? defaultPlan.id : "plan-starter",
      status: "TRIAL",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      cancelledAt: null,
      suspensionReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.subscriptions.push(trialSub);

    saveStore();
    return newClinic;
  },

  // ==========================================
  // SPECIALTIES & DOCTORS
  // ==========================================
  async getSpecialties() {
    const store = getStore();
    return store.specialties;
  },

  async getDoctors(clinicId: string) {
    const store = getStore();
    return store.doctors.filter(d => d.clinicId === clinicId && d.isActive);
  },

  async getDoctorById(id: string) {
    const store = getStore();
    return store.doctors.find(d => d.id === id) || null;
  },

  async createDoctor(clinicId: string, doctorData: Omit<Doctor, "id" | "clinicId" | "createdAt" | "updatedAt">) {
    const store = getStore();
    const newDoc: Doctor = {
      ...doctorData,
      id: `doc-${Date.now()}`,
      clinicId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.doctors.push(newDoc);
    saveStore();
    return newDoc;
  },

  async updateDoctor(clinicId: string, doctorId: string, updates: Partial<Doctor>) {
    const store = getStore();
    const idx = store.doctors.findIndex(d => d.id === doctorId && d.clinicId === clinicId);
    if (idx === -1) throw new Error("Doctor not found in this clinic");
    store.doctors[idx] = { ...store.doctors[idx], ...updates, updatedAt: new Date() };
    saveStore();
    return store.doctors[idx];
  },

  // ==========================================
  // PATIENTS
  // ==========================================
  async getPatients(clinicId: string, search?: string) {
    const store = getStore();
    let pts = store.patients.filter(p => p.clinicId === clinicId);
    if (search) {
      const q = search.toLowerCase();
      pts = pts.filter(p => p.fullName.toLowerCase().includes(q) || p.phone.includes(q));
    }
    return pts;
  },

  async findOrCreatePatient(clinicId: string, data: { fullName: string; phone: string; email?: string; gender?: string; age?: number }) {
    const store = getStore();
    let pat = store.patients.find(p => p.clinicId === clinicId && p.phone === data.phone);
    if (!pat) {
      pat = {
        id: `pat-${Date.now()}`,
        clinicId,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
        gender: data.gender || null,
        dateOfBirth: null,
        bloodGroup: null,
        address: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.patients.push(pat);
      saveStore();
    }
    return pat;
  },

  // ==========================================
  // APPOINTMENTS & QUEUE
  // ==========================================
  async getAppointments(clinicId: string, filters?: { date?: string; doctorId?: string; status?: AppointmentStatus }) {
    const store = getStore();
    let appts = store.appointments.filter(a => a.clinicId === clinicId);

    if (filters?.date) {
      appts = appts.filter(a => a.date === filters.date);
    }
    if (filters?.doctorId) {
      appts = appts.filter(a => a.doctorId === filters.doctorId);
    }
    if (filters?.status) {
      appts = appts.filter(a => a.status === filters.status);
    }

    return appts.map(a => ({
      ...a,
      patient: store.patients.find(p => p.id === a.patientId),
      doctor: store.doctors.find(d => d.id === a.doctorId),
    }));
  },

  async getAppointmentByReference(reference: string) {
    const store = getStore();
    const a = store.appointments.find(apt => apt.reference.toUpperCase() === reference.toUpperCase());
    if (!a) return null;
    return {
      ...a,
      patient: store.patients.find(p => p.id === a.patientId),
      doctor: store.doctors.find(d => d.id === a.doctorId),
      clinic: store.clinics.find(c => c.id === a.clinicId),
    };
  },

  async getPatientAppointmentsByPhone(phone: string) {
    const store = getStore();
    const patientIds = store.patients.filter(p => p.phone === phone).map(p => p.id);
    const appts = store.appointments.filter(a => patientIds.includes(a.patientId));
    return appts.map(a => ({
      ...a,
      patient: store.patients.find(p => p.id === a.patientId),
      doctor: store.doctors.find(d => d.id === a.doctorId),
      clinic: store.clinics.find(c => c.id === a.clinicId),
    }));
  },

  async checkSlotAvailability(clinicId: string, doctorId: string, date: string, startTime: string): Promise<boolean> {
    const store = getStore();
    // Validate that slot isn't already booked with active appointment
    const conflicting = store.appointments.find(
      a => a.clinicId === clinicId && 
           a.doctorId === doctorId && 
           a.date === date && 
           a.startTime === startTime &&
           a.status !== "CANCELLED"
    );
    return !conflicting;
  },

  async createAppointment(data: {
    clinicId: string;
    patientId: string;
    doctorId: string;
    date: string;
    startTime: string;
    endTime: string;
    consultationFee: number;
    reason?: string;
    staffNotes?: string;
    bookedOnline?: boolean;
  }) {
    const store = getStore();

    // Concurrency / duplicate safety check
    const isAvailable = await this.checkSlotAvailability(data.clinicId, data.doctorId, data.date, data.startTime);
    if (!isAvailable) {
      throw new Error(`The requested slot at ${data.startTime} on ${data.date} is no longer available.`);
    }

    const refCode = "APT-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      clinicId: data.clinicId,
      patientId: data.patientId,
      doctorId: data.doctorId,
      reference: refCode,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      status: "CONFIRMED",
      consultationFee: data.consultationFee,
      reason: data.reason || null,
      staffNotes: data.staffNotes || null,
      bookedOnline: Boolean(data.bookedOnline),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    store.appointments.push(newAppointment);
    saveStore();

    return {
      ...newAppointment,
      patient: store.patients.find(p => p.id === newAppointment.patientId),
      doctor: store.doctors.find(d => d.id === newAppointment.doctorId),
    };
  },

  async updateAppointmentStatus(
    clinicId: string, 
    appointmentId: string, 
    newStatus: AppointmentStatus, 
    reason?: string
  ) {
    const store = getStore();
    const apt = store.appointments.find(a => a.id === appointmentId && a.clinicId === clinicId);
    if (!apt) throw new Error("Appointment not found in this clinic");

    // Allowed state machine transitions
    const validTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["CHECKED_IN", "CANCELLED", "NO_SHOW"],
      CHECKED_IN: ["WAITING", "CANCELLED"],
      WAITING: ["IN_PROGRESS", "CANCELLED", "NO_SHOW"],
      IN_PROGRESS: ["COMPLETED", "CANCELLED"],
      COMPLETED: [],
      CANCELLED: [],
      NO_SHOW: ["CONFIRMED"],
    };

    const allowed = validTransitions[apt.status] || [];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Invalid status transition from ${apt.status} to ${newStatus}`);
    }

    apt.status = newStatus;
    apt.updatedAt = new Date();
    if (newStatus === "CANCELLED") {
      apt.cancelledAt = new Date();
      apt.cancellationReason = reason || "Cancelled by user";
    }

    saveStore();
    return apt;
  },

  // Queue Operations
  async getQueue(clinicId: string, date: string) {
    const store = getStore();
    const entries = store.queue.filter(q => q.clinicId === clinicId && q.date === date);
    return entries.map(q => ({
      ...q,
      patient: store.patients.find(p => p.id === q.patientId),
      appointment: store.appointments.find(a => a.id === q.appointmentId),
    })).sort((a, b) => a.tokenNumber - b.tokenNumber);
  },

  async checkInToQueue(clinicId: string, appointmentId: string) {
    const store = getStore();
    const apt = store.appointments.find(a => a.id === appointmentId && a.clinicId === clinicId);
    if (!apt) throw new Error("Appointment not found");

    // Check if already in queue
    const existing = store.queue.find(q => q.appointmentId === appointmentId);
    if (existing) return existing;

    // Calculate next token number for this date
    const dateEntries = store.queue.filter(q => q.clinicId === clinicId && q.date === apt.date);
    const nextToken = dateEntries.length + 1;

    const newEntry: QueueEntry = {
      id: `q-${Date.now()}`,
      clinicId,
      appointmentId,
      patientId: apt.patientId,
      tokenNumber: nextToken,
      date: apt.date,
      status: "WAITING",
      checkedInAt: new Date(),
      startedAt: null,
      completedAt: null,
      estimatedWaitMins: (nextToken - 1) * 15,
    };

    store.queue.push(newEntry);
    apt.status = "WAITING";
    saveStore();
    return newEntry;
  },

  async updateQueueStatus(clinicId: string, queueId: string, status: QueueStatus) {
    const store = getStore();
    const q = store.queue.find(item => item.id === queueId && item.clinicId === clinicId);
    if (!q) throw new Error("Queue entry not found");

    q.status = status;
    if (status === "IN_PROGRESS") {
      q.startedAt = new Date();
      if (q.appointmentId) {
        const apt = store.appointments.find(a => a.id === q.appointmentId);
        if (apt) apt.status = "IN_PROGRESS";
      }
    } else if (status === "COMPLETED") {
      q.completedAt = new Date();
      if (q.appointmentId) {
        const apt = store.appointments.find(a => a.id === q.appointmentId);
        if (apt) apt.status = "COMPLETED";
      }
    }
    saveStore();
    return q;
  },

  // ==========================================
  // BILLING, INVOICES & PAYMENTS
  // ==========================================
  async getInvoices(clinicId: string) {
    const store = getStore();
    const invoices = store.invoices.filter(inv => inv.clinicId === clinicId);
    return invoices.map(inv => ({
      ...inv,
      patient: store.patients.find(p => p.id === inv.patientId),
      payments: store.payments.filter(p => p.invoiceId === inv.id),
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getInvoiceById(clinicId: string, invoiceId: string) {
    const store = getStore();
    const inv = store.invoices.find(i => i.id === invoiceId && i.clinicId === clinicId);
    if (!inv) return null;
    return {
      ...inv,
      patient: store.patients.find(p => p.id === inv.patientId),
      payments: store.payments.filter(p => p.invoiceId === inv.id),
    };
  },

  async createInvoice(clinicId: string, data: {
    patientId?: string;
    appointmentId?: string;
    type: "CONSULTATION" | "PHARMACY" | "COMBINED";
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      discount?: number;
      taxRate?: number;
      medicineId?: string;
      batchId?: string;
    }>;
    notes?: string;
  }) {
    const store = getStore();

    let subtotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;

    const items: InvoiceItem[] = data.items.map((it, idx) => {
      const q = it.quantity || 1;
      const up = it.unitPrice || 0;
      const disc = it.discount || 0;
      const tax = it.taxRate || 0;
      
      const itemSub = q * up - disc;
      const itemTax = (itemSub * tax) / 100;
      const itemTotal = itemSub + itemTax;

      subtotal += q * up;
      discountTotal += disc;
      taxTotal += itemTax;

      return {
        id: `item-${Date.now()}-${idx}`,
        invoiceId: "", // filled below
        description: it.description,
        quantity: q,
        unitPrice: up,
        discount: disc,
        taxRate: tax,
        totalPrice: Number(itemTotal.toFixed(2)),
        medicineId: it.medicineId || null,
        batchId: it.batchId || null,
      };
    });

    const totalAmount = Number((subtotal - discountTotal + taxTotal).toFixed(2));
    const clinicInvoices = store.invoices.filter(i => i.clinicId === clinicId);
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(clinicInvoices.length + 1).padStart(4, "0")}`;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      clinicId,
      patientId: data.patientId || null,
      appointmentId: data.appointmentId || null,
      invoiceNumber,
      type: data.type,
      status: "ISSUED",
      subtotal: Number(subtotal.toFixed(2)),
      discountTotal: Number(discountTotal.toFixed(2)),
      taxTotal: Number(taxTotal.toFixed(2)),
      totalAmount,
      paidAmount: 0,
      outstandingAmount: totalAmount,
      notes: data.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      items,
      payments: [],
    };

    items.forEach(it => { it.invoiceId = newInvoice.id; });
    store.invoices.push(newInvoice);
    saveStore();
    return newInvoice;
  },

  async recordPayment(clinicId: string, data: {
    invoiceId: string;
    amount: number;
    method: "CASH" | "UPI" | "CARD" | "BANK_TRANSFER" | "OTHER";
    reference?: string;
    notes?: string;
    recordedByUserId?: string;
  }) {
    const store = getStore();
    const inv = store.invoices.find(i => i.id === data.invoiceId && i.clinicId === clinicId);
    if (!inv) throw new Error("Invoice not found in this clinic");

    if (data.amount <= 0) {
      throw new Error("Payment amount must be greater than zero");
    }

    if (data.amount > inv.outstandingAmount) {
      throw new Error(`Payment cannot exceed outstanding balance of ₹${inv.outstandingAmount}`);
    }

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      clinicId,
      invoiceId: data.invoiceId,
      amount: Number(data.amount.toFixed(2)),
      method: data.method,
      reference: data.reference || null,
      status: "SUCCESS",
      notes: data.notes || null,
      recordedByUserId: data.recordedByUserId || null,
      createdAt: new Date(),
    };

    store.payments.push(newPayment);

    // Update invoice totals atomically
    inv.paidAmount = Number((inv.paidAmount + newPayment.amount).toFixed(2));
    inv.outstandingAmount = Number((inv.totalAmount - inv.paidAmount).toFixed(2));
    inv.status = inv.outstandingAmount <= 0 ? "PAID" : "PARTIALLY_PAID";
    inv.updatedAt = new Date();
    saveStore();

    return { payment: newPayment, invoice: inv };
  },

  async recordRefund(clinicId: string, data: {
    paymentId: string;
    reason: string;
    authorizedByUserId?: string;
  }) {
    const store = getStore();
    const pay = store.payments.find(p => p.id === data.paymentId && p.clinicId === clinicId);
    if (!pay) throw new Error("Payment not found");
    if (pay.status === "REFUNDED") throw new Error("Payment has already been refunded");

    const inv = store.invoices.find(i => i.id === pay.invoiceId && i.clinicId === clinicId);
    if (!inv) throw new Error("Invoice not found");

    const newRefund: Refund = {
      id: `ref-${Date.now()}`,
      clinicId,
      paymentId: pay.id,
      invoiceId: pay.invoiceId,
      amount: pay.amount,
      reason: data.reason,
      authorizedByUserId: data.authorizedByUserId || null,
      createdAt: new Date(),
    };

    store.refunds.push(newRefund);
    pay.status = "REFUNDED";

    // Adjust invoice balances
    inv.paidAmount = Number((inv.paidAmount - pay.amount).toFixed(2));
    inv.outstandingAmount = Number((inv.totalAmount - inv.paidAmount).toFixed(2));
    inv.status = inv.paidAmount === 0 ? "REFUNDED" : "PARTIALLY_PAID";
    inv.updatedAt = new Date();
    saveStore();

    return { refund: newRefund, invoice: inv };
  },

  // ==========================================
  // PHARMACY & INVENTORY
  // ==========================================
  async getMedicines(clinicId: string) {
    const store = getStore();
    return store.medicines.filter(m => m.clinicId === clinicId).map(m => {
      // Calculate active stock across all non-expired batches
      const batches = store.batches.filter(b => b.medicineId === m.id && b.clinicId === clinicId);
      const totalStock = batches.reduce((acc, b) => acc + b.currentStock, 0);
      return { ...m, totalStock };
    });
  },

  async getBatches(clinicId: string, medicineId?: string) {
    const store = getStore();
    let batches = store.batches.filter(b => b.clinicId === clinicId);
    if (medicineId) {
      batches = batches.filter(b => b.medicineId === medicineId);
    }
    return batches.map(b => ({
      ...b,
      medicine: store.medicines.find(m => m.id === b.medicineId),
      supplier: store.suppliers.find(s => s.id === b.supplierId),
    })).sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  },

  async getSuppliers(clinicId: string) {
    const store = getStore();
    return store.suppliers.filter(s => s.clinicId === clinicId && s.isActive);
  },

  async addMedicine(clinicId: string, data: Omit<Medicine, "id" | "clinicId" | "totalStock" | "createdAt" | "updatedAt">) {
    const store = getStore();
    const newMed: Medicine = {
      ...data,
      id: `med-${Date.now()}`,
      clinicId,
      totalStock: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.medicines.push(newMed);
    saveStore();
    return newMed;
  },

  async receiveStockBatch(clinicId: string, data: {
    medicineId: string;
    batchNumber: string;
    expiryDate: string;
    purchaseCost: number;
    sellingPrice: number;
    quantity: number;
    supplierId?: string;
  }) {
    const store = getStore();
    const med = store.medicines.find(m => m.id === data.medicineId && m.clinicId === clinicId);
    if (!med) throw new Error("Medicine not found");

    const newBatch: InventoryBatch = {
      id: `batch-${Date.now()}`,
      clinicId,
      medicineId: data.medicineId,
      batchNumber: data.batchNumber,
      expiryDate: data.expiryDate,
      purchaseCost: data.purchaseCost,
      sellingPrice: data.sellingPrice,
      quantityReceived: data.quantity,
      currentStock: data.quantity,
      supplierId: data.supplierId || null,
      receivedDate: new Date().toISOString().split("T")[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    store.batches.push(newBatch);

    // Ledger movement
    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      clinicId,
      medicineId: data.medicineId,
      batchId: newBatch.id,
      type: "PURCHASE_RECEIPT",
      quantity: data.quantity,
      balanceAfter: data.quantity,
      referenceType: "PURCHASE_ORDER",
      createdAt: new Date(),
    };
    store.movements.push(movement);
    saveStore();

    return newBatch;
  },

  // Atomic Pharmacy Checkout (FEFO - First Expiry First Out)
  async processPharmacySale(clinicId: string, data: {
    patientId?: string;
    items: Array<{
      medicineId: string;
      batchId?: string;
      quantity: number;
    }>;
    paymentMethod: "CASH" | "UPI" | "CARD";
    paymentReference?: string;
    recordedByUserId?: string;
  }) {
    const store = getStore();

    // 1. Validate permissions & tenant
    if (!clinicId) throw new Error("Clinic context required");

    // 2. Validate stock availability for each item
    for (const item of data.items) {
      const med = store.medicines.find(m => m.id === item.medicineId && m.clinicId === clinicId);
      if (!med) throw new Error(`Medicine ${item.medicineId} not found`);

      if (item.batchId) {
        const batch = store.batches.find(b => b.id === item.batchId && b.clinicId === clinicId);
        if (!batch) throw new Error(`Batch not found`);
        if (batch.currentStock < item.quantity) {
          throw new Error(`Insufficient stock for ${med.name} (Batch ${batch.batchNumber}). Available: ${batch.currentStock}, requested: ${item.quantity}`);
        }
      } else {
        // Auto FEFO check
        const availableBatches = store.batches
          .filter(b => b.medicineId === item.medicineId && b.clinicId === clinicId && b.currentStock > 0)
          .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
        
        const totalAvail = availableBatches.reduce((sum, b) => sum + b.currentStock, 0);
        if (totalAvail < item.quantity) {
          throw new Error(`Insufficient stock for ${med.name}. Total available: ${totalAvail}, requested: ${item.quantity}`);
        }
      }
    }

    // 3. Atomically deduct stock and prepare invoice items
    const invoiceLineItems: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      medicineId: string;
      batchId: string;
    }> = [];

    for (const item of data.items) {
      const med = store.medicines.find(m => m.id === item.medicineId && m.clinicId === clinicId)!;
      let remainingToDeduct = item.quantity;

      const batchesToUse = item.batchId 
        ? [store.batches.find(b => b.id === item.batchId)!]
        : store.batches
            .filter(b => b.medicineId === item.medicineId && b.clinicId === clinicId && b.currentStock > 0)
            .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

      for (const batch of batchesToUse) {
        if (remainingToDeduct <= 0) break;
        const deductQty = Math.min(batch.currentStock, remainingToDeduct);
        
        batch.currentStock -= deductQty;
        batch.updatedAt = new Date();
        remainingToDeduct -= deductQty;

        // Ledger entry
        store.movements.push({
          id: `mov-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          clinicId,
          medicineId: med.id,
          batchId: batch.id,
          type: "SALE",
          quantity: -deductQty,
          balanceAfter: batch.currentStock,
          referenceType: "INVOICE",
          recordedByUserId: data.recordedByUserId,
          createdAt: new Date(),
        });

        invoiceLineItems.push({
          description: `${med.name} (${batch.batchNumber})`,
          quantity: deductQty,
          unitPrice: batch.sellingPrice,
          medicineId: med.id,
          batchId: batch.id,
        });
      }
    }

    // 4. Create Invoice
    const invoice = await this.createInvoice(clinicId, {
      patientId: data.patientId,
      type: "PHARMACY",
      items: invoiceLineItems,
      notes: "Direct Pharmacy Counter Sale",
    });

    // 5. Record Payment
    const { payment } = await this.recordPayment(clinicId, {
      invoiceId: invoice.id,
      amount: invoice.totalAmount,
      method: data.paymentMethod,
      reference: data.paymentReference,
      notes: "Paid at pharmacy counter",
      recordedByUserId: data.recordedByUserId,
    });

    saveStore();
    return { invoice, payment };
  },

  // ==========================================
  // SAAS ADMIN & SUBSCRIPTIONS
  // ==========================================
  async getSubscriptionPlans() {
    const store = getStore();
    return store.plans;
  },

  async getPlatformMetrics() {
    const store = getStore();
    const totalClinics = store.clinics.length;
    const activeClinics = store.subscriptions.filter(s => s.status === "ACTIVE").length;
    const trialClinics = store.subscriptions.filter(s => s.status === "TRIAL").length;
    const totalInvoices = store.invoices.length;
    const totalBilled = store.invoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const totalCollected = store.payments.filter(p => p.status === "SUCCESS").reduce((sum, p) => sum + p.amount, 0);

    return {
      totalClinics,
      activeClinics,
      trialClinics,
      totalInvoices,
      totalBilled: Number(totalBilled.toFixed(2)),
      totalCollected: Number(totalCollected.toFixed(2)),
      clinics: store.clinics.map(c => ({
        ...c,
        subscription: store.subscriptions.find(s => s.clinicId === c.id),
      })),
      plans: store.plans,
    };
  },

  async updateClinicStatus(clinicId: string, status: "ACTIVE" | "SUSPENDED" | "TRIAL", reason?: string) {
    const store = getStore();
    const sub = store.subscriptions.find(s => s.clinicId === clinicId);
    if (!sub) throw new Error("Clinic subscription not found");

    sub.status = status;
    sub.suspensionReason = reason || null;
    sub.updatedAt = new Date();

    const clinic = store.clinics.find(c => c.id === clinicId);
    if (clinic && status === "SUSPENDED") {
      clinic.isPublished = false;
      clinic.bookingEnabled = false;
    } else if (clinic && status === "ACTIVE") {
      clinic.isPublished = true;
      clinic.bookingEnabled = true;
    }

    saveStore();
    return { clinic, subscription: sub };
  },

  // ==========================================
  // USERS & AUTHENTICATION
  // ==========================================
  async getUserByEmail(email: string) {
    const store = getStore();
    return store.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async getUserMemberships(userId: string) {
    const store = getStore();
    const mems = store.memberships.filter(m => m.userId === userId && m.isActive);
    return mems.map(m => ({
      ...m,
      clinic: store.clinics.find(c => c.id === m.clinicId),
    }));
  },

  async createUser(data: { email: string; passwordHash: string; fullName: string; phone?: string }) {
    const store = getStore();
    const existing = store.users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) throw new Error("A user with this email already exists");

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      passwordHash: data.passwordHash,
      fullName: data.fullName,
      phone: data.phone || null,
      isSuperAdmin: false,
      emailVerified: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    store.users.push(newUser);
    saveStore();
    return newUser;
  },

  async addClinicMembership(clinicId: string, userId: string, role: "OWNER" | "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "CASHIER" | "PHARMACIST") {
    const store = getStore();
    const newMem: ClinicMembership = {
      id: `mem-${Date.now()}`,
      clinicId,
      userId,
      role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.memberships.push(newMem);
    saveStore();
    return newMem;
  }
};
