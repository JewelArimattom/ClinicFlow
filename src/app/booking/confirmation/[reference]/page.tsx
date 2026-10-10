import { notFound } from "next/navigation";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import { db } from "@/lib/db";
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Stethoscope, 
  Receipt, 
  Printer, 
  ArrowLeft,
  XCircle,
  AlertTriangle,
  QrCode,
  Share2,
  Building2,
  Phone,
  ShieldCheck
} from "lucide-react";
import { CancelBookingButton } from "./CancelButton";
import { PrintButton } from "./PrintButton";

export default async function BookingConfirmationPage({
  params,
}: {
  params: { reference: string };
}) {
  const appointment = await db.getAppointmentByReference(params.reference);
  if (!appointment) {
    notFound();
  }

  const isCancelled = appointment.status === "CANCELLED";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-brand-teal selection:text-white">
      <PublicNavbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb / Back link */}
        <div className="mb-6 flex items-center justify-between no-print">
          <Link
            href={`/clinics/${appointment.clinic?.slug || ""}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Clinic Profile
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Pass
            </span>
          </div>
        </div>

        {/* Digital Ticket / Pass Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-900/5 overflow-hidden transition-all duration-300">
          
          {/* Header Banner */}
          <div className={`p-8 sm:p-10 text-center relative overflow-hidden ${
            isCancelled 
              ? "bg-gradient-to-b from-rose-600 to-rose-700 text-white" 
              : "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white"
          }`}>
            {/* Background accent glow */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 ${
              isCancelled ? "bg-rose-400" : "bg-teal-400"
            }`} />

            <div className="relative z-10 space-y-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-inner transition-transform duration-300 hover:scale-105 ${
                isCancelled ? "bg-white/20 text-white" : "bg-teal-500/20 text-teal-300 border border-teal-400/30"
              }`}>
                {isCancelled ? (
                  <XCircle className="w-9 h-9" />
                ) : (
                  <CheckCircle2 className="w-9 h-9" />
                )}
              </div>

              <div>
                <span className={`text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${
                  isCancelled 
                    ? "bg-rose-900/50 text-rose-200 border border-rose-400/20" 
                    : "bg-teal-900/60 text-teal-300 border border-teal-500/30"
                }`}>
                  {isCancelled ? "Booking Cancelled" : "Appointment Confirmed"}
                </span>
                
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3">
                  Booking Slip
                </h1>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-1 leading-relaxed">
                  {isCancelled 
                    ? "This visit schedule has been cancelled. You can book a new slot anytime."
                    : "Please present this booking reference at the reception desk for instant check-in."
                  }
                </p>
              </div>

              {/* Reference Card Pill */}
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/15 shadow-sm mt-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">Token / Ref:</span>
                <span className="text-lg font-mono font-black text-white tracking-widest">
                  {appointment.reference}
                </span>
              </div>
            </div>
          </div>

          {/* Ticket Perforation visual */}
          <div className="relative flex items-center justify-between px-4 py-1 bg-slate-100/60 border-y border-dashed border-slate-300">
            <div className="w-4 h-4 rounded-full bg-slate-50 -ml-6 border-r border-slate-200" />
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span>clinicflow digital token</span>
              <span>•</span>
              <span>{appointment.date}</span>
            </div>
            <div className="w-4 h-4 rounded-full bg-slate-50 -mr-6 border-l border-slate-200" />
          </div>

          {/* Ticket Body */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Primary Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/80 p-6 rounded-2xl border border-slate-200/70">
              
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Scheduled Date & Time
                </span>
                <p className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  {appointment.date}
                </p>
                <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  {appointment.startTime} – {appointment.endTime}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Attending Doctor
                </span>
                <p className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  {appointment.doctor?.name || "Consultant"}
                </p>
                <p className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md inline-block">
                  {appointment.doctor?.specialtyName || "General Practice"}
                </p>
              </div>

              <div className="space-y-1.5 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Clinic Location
                </span>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  {appointment.clinic?.name}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed pl-6">
                  {appointment.clinic?.address}, {appointment.clinic?.city}
                </p>
              </div>

              <div className="space-y-1.5 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Consultation Fee
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-900">
                    ₹{appointment.consultationFee}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    (Standard Fee)
                  </span>
                </div>
                <p className="text-[11px] text-teal-700 font-medium flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5" />
                  Pay at clinic desk (Cash / UPI / Card)
                </p>
              </div>

            </div>

            {/* Patient Information Section */}
            <div className="border border-slate-200/70 rounded-2xl p-6 space-y-3 bg-white">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" />
                Patient Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">Full Name</span>
                  <span className="text-sm font-bold text-slate-900">{appointment.patient?.fullName || "Patient"}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">Contact Number</span>
                  <span className="text-sm font-bold text-slate-900">
                    {appointment.patient?.phone ? `+91 ******${appointment.patient.phone.slice(-4)}` : "Verified Patient"}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">Visit Purpose</span>
                  <span className="text-sm font-medium text-slate-800">
                    {appointment.reason || "General Consultation"}
                  </span>
                </div>
              </div>
            </div>

            {/* Clinic Arrival Advisory */}
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <p className="font-bold">Important Instructions for Visit</p>
                <p className="text-amber-800/90 leading-relaxed text-[11px]">
                  Please arrive 10-15 minutes prior to your time slot ({appointment.startTime}) to complete desk check-in. If you need to reschedule or cannot make it, please cancel in advance to free up the queue for other patients.
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <PrintButton />
                <Link
                  href="/my-appointments"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition inline-flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  My Appointments
                </Link>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {!isCancelled && (
                  <CancelBookingButton reference={appointment.reference} />
                )}
                <Link
                  href="/search"
                  className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 shadow-sm shadow-teal-600/20 transition inline-flex items-center justify-center gap-1.5"
                >
                  Book Another Visit
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
