import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import {
  HeartPulse,
  LayoutDashboard,
  CalendarDays,
  ListOrdered,
  ReceiptText,
  Pill,
  ChartNoAxesCombined,
  Settings2,
  ExternalLink,
  Building2,
  Bell,
  Menu,
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

const NAV_ITEMS = [
  { href: "/app/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/app/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/app/queue", label: "Live Queue", icon: ListOrdered },
  { href: "/app/billing", label: "Billing & Invoices", icon: ReceiptText },
  { href: "/app/pharmacy", label: "Pharmacy & Stock", icon: Pill },
  { href: "/app/reports", label: "Analytics & Reports", icon: ChartNoAxesCombined },
  { href: "/app/settings", label: "Settings", icon: Settings2 },
];

export default async function ClinicAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.isSuperAdmin && !session.clinicId) {
    redirect("/platform-admin");
  }

  const clinicName = session.clinicName || "Clinic Portal";
  const clinicSlug = session.clinicSlug || "";
  const roleName = session.role || (session.isSuperAdmin ? "SUPER ADMIN" : "STAFF");

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-[260px] bg-gray-950 text-gray-400 flex-col justify-between hidden md:flex flex-shrink-0">
        <div>
          {/* Brand */}
          <div className="h-16 px-5 flex items-center gap-2.5 border-b border-white/5">
            <div className="w-8 h-8 rounded-[8px] bg-brand-500 flex items-center justify-center text-white">
              <HeartPulse className="w-[16px] h-[16px]" strokeWidth={2.25} />
            </div>
            <div>
              <span className="font-bold text-white text-[15px] tracking-tight">ClinicFlow</span>
              <span className="block text-[10px] text-brand-400 font-semibold uppercase tracking-wider">Workspace</span>
            </div>
          </div>

          {/* Tenant badge */}
          <div className="p-3.5 mx-3 my-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider block">Active Clinic</span>
            <p className="text-xs font-bold text-white line-clamp-1">{clinicName}</p>
            {clinicSlug && (
              <Link
                href={`/clinics/${clinicSlug}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-400 hover:text-brand-300 pt-0.5 transition-colors"
              >
                View Public Page
                <ExternalLink className="w-3 h-3" strokeWidth={1.75} />
              </Link>
            )}
          </div>

          {/* Nav */}
          <nav className="px-3 space-y-0.5 text-[13px] font-medium" aria-label="Dashboard navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-fast focus-ring"
              >
                <item.icon className="w-[18px] h-[18px] text-gray-500" strokeWidth={1.75} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User section */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs font-bold text-white truncate">{session.fullName}</p>
              <span className="text-[10px] font-semibold text-brand-400 bg-brand-950/80 px-1.5 py-0.5 rounded border border-brand-900/60 inline-block">
                {roleName}
              </span>
            </div>
            <LogoutButton />
          </div>

          {session.isSuperAdmin && (
            <Link
              href="/platform-admin"
              className="mt-3 block text-center py-1.5 px-2 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 text-[11px] font-bold hover:bg-indigo-900 transition-colors focus-ring"
            >
              Super-Admin Portal
            </Link>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile brand (shown when sidebar hidden) */}
            <div className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <HeartPulse className="w-3.5 h-3.5" strokeWidth={2.25} />
              </div>
              <span className="font-bold text-gray-900 text-sm">ClinicFlow</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <Building2 className="w-4 h-4 text-brand-600" strokeWidth={1.75} />
              <span className="text-gray-900 font-bold">{clinicName}</span>
              <span className="text-gray-300">·</span>
              <span className="text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/60 font-medium text-[11px]">
                INR (₹)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {clinicSlug && (
              <Link
                href={`/clinics/${clinicSlug}`}
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors focus-ring"
              >
                Public Page
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
              </Link>
            )}

            <Link
              href="/app/queue"
              className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all duration-fast btn-press focus-ring"
            >
              Live Queue
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
