import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { 
  Calendar, 
  Clock, 
  Receipt, 
  Pill, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Users2, 
  ArrowRight, 
  PlusCircle,
  Activity,
  CreditCard,
  Building2,
  Stethoscope,
  Sparkles
} from "lucide-react";

export default async function ClinicDashboardPage() {
  const session = await getSession();
  const clinicId = session?.clinicId!;
  const todayStr = new Date().toISOString().split("T")[0];

  const [appointments, invoices, queue, medicines, batches] = await Promise.all([
    db.getAppointments(clinicId),
    db.getInvoices(clinicId),
    db.getQueue(clinicId, todayStr),
    db.getMedicines(clinicId),
    db.getBatches(clinicId),
  ]);

  // Aggregate metrics
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const waitingPatients = queue.filter(q => q.status === "WAITING");
  const inProgressPatients = queue.filter(q => q.status === "IN_PROGRESS");
  const completedAppointments = todayAppointments.filter(a => a.status === "COMPLETED");

  const todayInvoices = invoices.filter(i => new Date(i.createdAt).toISOString().split("T")[0] === todayStr);
  const todayBilled = todayInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const todayCollected = todayInvoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const totalOutstanding = invoices.reduce((sum, i) => sum + i.outstandingAmount, 0);

  // Pharmacy alerts
  const lowStock = medicines.filter(m => (m.totalStock || 0) <= m.reorderThreshold);
  const now = new Date();
  const threeMonths = new Date();
  threeMonths.setMonth(now.getMonth() + 3);
  const expiringBatches = batches.filter(b => new Date(b.expiryDate) <= threeMonths && b.currentStock > 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Clinical Operations Center
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live System
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time patient queue, front desk registrations, and dispensary cashflow for {todayStr}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/app/appointments"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm shadow-teal-600/20 hover:shadow-md transition active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Book Appointment</span>
          </Link>

          <Link
            href="/app/pharmacy"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm hover:shadow-md transition active:scale-95"
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Pharmacy POS</span>
          </Link>
        </div>
      </div>

      {/* Main KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Appointments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Today&apos;s Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{todayAppointments.length}</span>
              <span className="text-xs text-slate-500 font-medium">scheduled</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {completedAppointments.length} Completed
            </span>
            <span className="text-slate-400 font-medium">{todayAppointments.filter(a => a.status === "CONFIRMED").length} Upcoming</span>
          </div>
        </div>

        {/* Live Waiting Queue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Waiting in Queue</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-600">{waitingPatients.length}</span>
              <span className="text-xs text-slate-500 font-medium">in waiting room</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-teal-700 font-bold">{inProgressPatients.length} In-Consultation</span>
            <Link href="/app/queue" className="text-teal-600 hover:text-teal-700 font-bold flex items-center gap-0.5">
              Queue &rarr;
            </Link>
          </div>
        </div>

        {/* Today's Collections */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Today&apos;s Collected</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">₹{todayCollected.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Billed: ₹{todayBilled.toFixed(0)}</span>
            <span className="text-emerald-700 font-bold">{todayInvoices.length} Invoices</span>
          </div>
        </div>

        {/* Total Outstanding */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Receivables</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-indigo-600">₹{totalOutstanding.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Unsettled dues</span>
            <Link href="/app/billing" className="text-teal-600 hover:text-teal-700 font-bold flex items-center gap-0.5">
              Ledger &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Daily Queue Table + Pharmacy Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Queue & Consultations */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Today&apos;s Active Consultation Queue</h2>
                <p className="text-xs text-slate-500 mt-0.5">Live check-ins and token sequences for front desk dispatch</p>
              </div>
              <Link
                href="/app/queue"
                className="text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-200/80 flex items-center gap-1.5 transition"
              >
                <span>Live Token Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Token</th>
                    <th className="px-6 py-3.5">Patient Name</th>
                    <th className="px-6 py-3.5">Doctor / Service</th>
                    <th className="px-6 py-3.5">Scheduled Time</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {queue.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                        <Users2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        No patients registered in queue yet today. Check-in booked appointments or add walk-ins from the queue page.
                      </td>
                    </tr>
                  ) : (
                    queue.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-6 py-4 font-bold text-slate-900">
                          <span className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center font-mono font-black text-xs">
                            #{entry.tokenNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {entry.patient?.fullName}
                          <span className="block text-[11px] text-slate-400 font-normal">
                            {entry.patient?.phone}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {entry.appointment?.doctor?.name || "General Practice"}
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {entry.appointment?.startTime || "Walk-In"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                            entry.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            entry.status === "IN_PROGRESS" ? "bg-teal-50 text-teal-700 border border-teal-300 animate-pulse" :
                            "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              entry.status === "COMPLETED" ? "bg-emerald-500" :
                              entry.status === "IN_PROGRESS" ? "bg-teal-500" : "bg-amber-500"
                            }`} />
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Pharmacy Inventory & Safety Alerts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Low Stock Alerts */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Low Stock Alert ({lowStock.length})</h3>
              </div>
              <Link href="/app/pharmacy" className="text-xs text-teal-600 font-bold hover:underline">
                Catalog &rarr;
              </Link>
            </div>

            {lowStock.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">All catalog items are stocked safely above minimum thresholds.</p>
            ) : (
              <div className="space-y-2.5">
                {lowStock.map((med) => (
                  <div key={med.id} className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">{med.name}</span>
                      <span className="text-[11px] text-slate-500">{med.dosageForm} • Threshold: {med.reorderThreshold}</span>
                    </div>
                    <span className="font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg text-[11px]">
                      {med.totalStock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Near Expiry Batches Alert */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900">Near-Expiry Batches ({expiringBatches.length})</h3>
              </div>
              <Link href="/app/pharmacy" className="text-xs text-teal-600 font-bold hover:underline">
                Batches &rarr;
              </Link>
            </div>

            {expiringBatches.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">No inventory batches expiring within the next 90 days.</p>
            ) : (
              <div className="space-y-2.5">
                {expiringBatches.map((b) => (
                  <div key={b.id} className="p-3 rounded-2xl bg-rose-50/60 border border-rose-200/70 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">{b.medicine?.name}</span>
                      <span className="text-[11px] text-slate-500">Batch #{b.batchNumber} • Qty: {b.currentStock}</span>
                    </div>
                    <span className="font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-lg text-[11px]">
                      Exp: {b.expiryDate}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
