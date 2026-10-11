import {
  Calendar,
  Users,
  ReceiptText,
  Clock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

export function ClinicDashboardPreview() {
  return (
    <div className="w-full max-w-lg mx-auto lg:max-w-none">
      {/* Product Interface Card */}
      <div className="rounded-xl bg-white border border-[#E5E5DF] shadow-[0_4px_16px_rgba(24,37,34,0.06)] overflow-hidden">
        {/* Workspace Window Header */}
        <div className="bg-[#FAF9F5] px-4 py-3 border-b border-[#E5E5DF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#087F78]" aria-hidden="true" />
            <div>
              <p className="text-[12.5px] font-semibold text-[#182522]">Metro Polyclinic — Front Desk</p>
              <p className="text-[10.5px] text-[#66736F]">Live Daily Schedule & Token Queue</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#087F78] bg-[#E9F1EB] px-2 py-0.5 rounded">
            Live Workspace
          </span>
        </div>

        {/* 3 Metric Tiles */}
        <div className="p-4 grid grid-cols-3 gap-2.5 border-b border-[#E5E5DF] bg-white">
          <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E5DF]/70">
            <div className="flex items-center justify-between text-[#66736F]">
              <span className="text-[11px] font-medium">Appointments</span>
              <Calendar className="w-3.5 h-3.5 text-[#087F78]" strokeWidth={1.75} />
            </div>
            <p className="text-[17px] font-bold text-[#182522] mt-1">18 Today</p>
            <p className="text-[10px] text-[#087F78] font-medium">3 checked-in</p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E5DF]/70">
            <div className="flex items-center justify-between text-[#66736F]">
              <span className="text-[11px] font-medium">Queue</span>
              <Users className="w-3.5 h-3.5 text-[#087F78]" strokeWidth={1.75} />
            </div>
            <p className="text-[17px] font-bold text-[#182522] mt-1">Token #12</p>
            <p className="text-[10px] text-[#66736F]">Consultation in progress</p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E5DF]/70">
            <div className="flex items-center justify-between text-[#66736F]">
              <span className="text-[11px] font-medium">Billing</span>
              <ReceiptText className="w-3.5 h-3.5 text-[#087F78]" strokeWidth={1.75} />
            </div>
            <p className="text-[17px] font-bold text-[#182522] mt-1">₹8,400</p>
            <p className="text-[10px] text-[#15803D] font-medium">All settled</p>
          </div>
        </div>

        {/* Live Appointments Feed */}
        <div className="p-4 space-y-2.5 bg-white">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#66736F]">
            Today&apos;s Consultation Schedule
          </p>

          <div className="space-y-1.5">
            {[
              {
                time: "10:30 AM",
                patient: "Anjali Menon",
                doctor: "Dr. Rajesh Nair (Cardiology)",
                status: "In Progress",
                token: "Token #12",
                statusColor: "bg-[#E9F1EB] text-[#087F78] border-[#087F78]/30",
              },
              {
                time: "11:00 AM",
                patient: "Karthik Pillai",
                doctor: "Dr. Lakshmi V. (Pediatrics)",
                status: "Checked In",
                token: "Token #13",
                statusColor: "bg-[#FAF9F5] text-[#182522] border-[#E5E5DF]",
              },
              {
                time: "11:30 AM",
                patient: "Sara Thomas",
                doctor: "Dr. Rajesh Nair (Cardiology)",
                status: "Confirmed",
                token: "Token #14",
                statusColor: "bg-white text-[#66736F] border-[#E5E5DF]",
              },
            ].map((apt) => (
              <div
                key={apt.token}
                className="p-2.5 rounded-lg border border-[#E5E5DF] flex items-center justify-between text-xs transition-colors hover:bg-[#FAF9F5]"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#182522]">{apt.patient}</span>
                    <span className="text-[10px] font-medium text-[#66736F] bg-[#FAF9F5] px-1.5 py-0.2 rounded border border-[#E5E5DF]">
                      {apt.token}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#66736F]">{apt.doctor}</p>
                </div>

                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-[11px] font-medium text-[#182522]">{apt.time}</span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded border ${apt.statusColor}`}
                  >
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-4 py-2.5 bg-[#FAF9F5] border-t border-[#E5E5DF] flex items-center justify-between text-[11px] text-[#66736F]">
          <span>Includes digital queue & WhatsApp confirmations</span>
          <span className="font-medium text-[#087F78]">Multi-Doctor Support</span>
        </div>
      </div>
    </div>
  );
}
