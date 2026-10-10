import {
  Calendar,
  Users,
  ReceiptText,
  Pill,
  Clock,
  CheckCircle2,
  Activity,
  ArrowUpRight,
} from "lucide-react";

export function ClinicDashboardPreview() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Subtle background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/20 to-teal-500/10 rounded-2xl blur-xl opacity-75 pointer-events-none" />

      {/* Main Dashboard Card */}
      <div className="relative rounded-2xl bg-[#111A2E] border border-white/10 shadow-2xl p-4 sm:p-5 text-white overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <p className="text-xs font-semibold text-gray-200">City Wellness Center</p>
              <p className="text-[11px] text-gray-400">Reception & Front Desk View</p>
            </div>
          </div>
          <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-brand-300">
            Preview Demo
          </span>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4">
          {/* Stat 1: Appointments */}
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px]">Today&apos;s Bookings</span>
              <Calendar className="w-3.5 h-3.5 text-brand-400" strokeWidth={1.75} />
            </div>
            <p className="text-lg font-bold text-white tracking-tight">18</p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-0.5">
              <span>4 upcoming</span>
            </p>
          </div>

          {/* Stat 2: Queue */}
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px]">Active Queue</span>
              <Users className="w-3.5 h-3.5 text-brand-400" strokeWidth={1.75} />
            </div>
            <p className="text-lg font-bold text-white tracking-tight">Token #12</p>
            <p className="text-[10px] text-brand-300">Serving now</p>
          </div>

          {/* Stat 3: Revenue (hidden on smallest screens to reduce vertical space) */}
          <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px]">Collections</span>
              <ReceiptText className="w-3.5 h-3.5 text-brand-400" strokeWidth={1.75} />
            </div>
            <p className="text-lg font-bold text-white tracking-tight">₹8,400</p>
            <p className="text-[10px] text-gray-400">GST billing sync</p>
          </div>
        </div>

        {/* Live Patient Flow Preview */}
        <div className="space-y-2 pt-1 pb-3">
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-brand-400" />
              Patient Queue Status
            </span>
            <span className="text-[10px] text-gray-500">Live feed</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between p-2 rounded-lg bg-brand-500/10 border border-brand-500/20 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-brand-500 text-gray-950 font-bold text-[10px]">#12</span>
                <div>
                  <p className="font-semibold text-white text-[11px]">Rahul Verma</p>
                  <p className="text-[10px] text-gray-400">Dr. Anjali Rao · In Consultation</p>
                </div>
              </div>
              <span className="text-[10px] font-medium text-brand-300 bg-brand-500/20 px-2 py-0.5 rounded">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] text-xs">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-bold text-[10px]">#13</span>
                <div>
                  <p className="font-medium text-gray-200 text-[11px]">Deepa Nair</p>
                  <p className="text-[10px] text-gray-400">Dr. Arjun Menon · Waiting at reception</p>
                </div>
              </div>
              <span className="text-[10px] text-gray-400">Next</span>
            </div>
          </div>
        </div>

        {/* Pharmacy & Stock Alert Pill */}
        <div className="mt-1 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-2 truncate">
            <Pill className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" strokeWidth={1.75} />
            <span className="truncate">Dispensary: 14 prescriptions dispensed today</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium flex-shrink-0 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Healthy
          </span>
        </div>
      </div>
    </div>
  );
}
