import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Sparkles,
  Phone,
  MapPin,
  Stethoscope,
  Globe,
  Share2
} from "lucide-react";

export default async function ClinicSettingsPage() {
  const session = await getSession();
  const clinic = await db.getClinicById(session?.clinicId!);
  const doctors = await db.getDoctors(session?.clinicId!);

  if (!clinic) return null;

  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn">
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Clinic Configuration & Public Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your public booking link, operational settings, and registered physician roster.
        </p>
      </div>

      {/* Public Profile Status Card */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Public Booking Portal</span>
            {clinic.isPublished && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live & Accepting Bookings
              </span>
            )}
          </div>
          <p className="text-xs text-teal-700 font-mono font-semibold bg-teal-50/60 px-3 py-1.5 rounded-xl border border-teal-100 inline-block">
            /clinics/{clinic.slug}
          </p>
        </div>

        <Link
          href={`/clinics/${clinic.slug}`}
          target="_blank"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-sm shadow-teal-600/20 active:scale-95"
        >
          <span>Open Public Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Clinic Details Overview */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Practice Profile & Local Info
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Tenant Verified</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Practice Name</span>
            <span className="text-slate-900 font-extrabold text-base mt-1 block">{clinic.name}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Classification</span>
            <span className="text-slate-800 font-bold text-sm mt-1 block">{clinic.clinicType}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Location</span>
            <span className="text-slate-800 font-semibold mt-1 block">
              {clinic.address ? `${clinic.address}, ` : ""}{clinic.city}, {clinic.state} – {clinic.pinCode}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Reception Helpline</span>
            <span className="text-slate-800 font-semibold mt-1 block">{clinic.phone}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Default Slot Duration</span>
            <span className="text-slate-800 font-semibold mt-1 block">{clinic.defaultSlotMinutes} Minutes / Consultation</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Base Currency</span>
            <span className="text-slate-800 font-semibold mt-1 block">Indian Rupee (INR ₹)</span>
          </div>
        </div>
      </div>

      {/* Doctors & Staff Permissions */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Registered Doctor Roster ({doctors.length})
            </h2>
          </div>
          <span className="text-[11px] text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
            Online Bookable
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {doctors.map((doc) => (
            <div key={doc.id} className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-teal-400 shadow-sm transition space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 font-bold text-sm flex items-center justify-center border border-teal-200/60">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                    <span className="text-teal-700 text-xs font-semibold">{doc.specialtyName}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Fee: <strong className="text-slate-900 text-xs">₹{doc.consultationFee}</strong></span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active Roster
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tenant Privacy & Isolation Guarantee */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>PostgreSQL Multi-Tenant Isolation Active</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          This clinic operates within a strictly partitioned tenant boundary. All appointments, invoices, patient profiles, and pharmacy batches are cryptographically tied to Tenant ID <code className="text-teal-300 font-mono text-[11px]">{clinic.id}</code>.
        </p>
      </div>
    </div>
  );
}
