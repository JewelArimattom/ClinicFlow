import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { 
  HeartPulse, 
  Building2, 
  CreditCard, 
  Layers, 
  BarChart3, 
  ArrowLeft,
  ShieldCheck,
  LogOut,
  Sparkles
} from "lucide-react";
import { LogoutButton } from "../app/LogoutButton";

export default async function PlatformAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Strict server-side superadmin access guard
  if (!session || !session.isSuperAdmin) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Super Admin Dark Sidebar */}
      <aside className="w-64 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between hidden md:flex flex-shrink-0">
        <div>
          {/* Logo & Platform Tag */}
          <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-teal-500/20">
              <HeartPulse className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-black text-white text-base tracking-tight">ClinicFlow</span>
              <span className="block text-[10px] text-teal-400 font-bold uppercase tracking-widest">Platform Admin</span>
            </div>
          </div>

          <div className="p-4 mx-4 my-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-xs space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Access Scope</span>
            <p className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" /> Platform Super-Admin
            </p>
          </div>

          <nav className="px-3 space-y-1 text-xs font-semibold">
            <Link
              href="/platform-admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-800 text-white font-bold transition shadow-sm"
            >
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span>Global Operations</span>
            </Link>

            <Link
              href="/app/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800/60 text-slate-400 hover:text-white transition"
            >
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Clinic Workspace</span>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white py-1.5 px-2 rounded-lg hover:bg-slate-800 transition font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </Link>
          <div className="pt-2 border-t border-slate-800/60">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main SuperAdmin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Multi-Tenant Fleet Command</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono font-medium">{session.email}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/30 px-2 py-0.5 rounded-full">
              Superadmin
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
