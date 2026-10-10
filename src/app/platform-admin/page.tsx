"use client";

import { useState, useEffect } from "react";
import { 
  Building2, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  PauseCircle, 
  PlayCircle, 
  Loader2, 
  Sparkles,
  TrendingUp,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink
} from "lucide-react";

export default function PlatformAdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/platform-admin");
      const json = await res.json();
      if (res.ok) {
        setMetrics(json.metrics);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (clinicId: string, status: "ACTIVE" | "SUSPENDED" | "TRIAL") => {
    try {
      setActionLoading(clinicId);
      const reason = status === "SUSPENDED" ? prompt("Please enter suspension reason:") : "Admin updated status";
      if (status === "SUSPENDED" && !reason) return;

      const res = await fetch("/api/platform-admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicId, status, reason }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update clinic status");
        return;
      }

      loadData();
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading || !metrics) {
    return (
      <div className="py-24 text-center text-slate-400 text-xs space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-400" />
        <span className="font-semibold text-slate-300 block">Loading SaaS platform infrastructure telemetry...</span>
      </div>
    );
  }

  // Calculate MRR from active plans
  const mrr = metrics.clinics.reduce((acc: number, c: any) => {
    if (c.subscription?.status === "ACTIVE") {
      const plan = metrics.plans.find((p: any) => p.id === c.subscription?.planId);
      return acc + (plan?.monthlyPrice || 0);
    }
    return acc;
  }, 0);

  const filteredClinics = metrics.clinics.filter((c: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Multi-Tenant Fleet Telemetry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-tenant health, MRR subscription run-rate, and isolated PostgreSQL schemas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Platform Operational
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Clinic Tenants</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{metrics.totalClinics}</span>
            <span className="text-xs text-slate-400 font-medium">registered</span>
          </div>
          <span className="text-[11px] text-teal-400 font-bold block pt-2 border-t border-slate-800">
            {metrics.activeClinics} Active Subscriptions
          </span>
        </div>

        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-3">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Evaluation Trials</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400">{metrics.trialClinics}</span>
            <span className="text-xs text-slate-400 font-medium">clinics</span>
          </div>
          <span className="text-[11px] text-slate-400 block pt-2 border-t border-slate-800">
            14-day free access tier
          </span>
        </div>

        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-3">
          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">Platform MRR</span>
          <div>
            <span className="text-3xl font-black text-white">₹{mrr.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <span className="text-[11px] text-slate-400 block pt-2 border-t border-slate-800">
            Monthly recurring run-rate
          </span>
        </div>

        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Network Invoices</span>
          <div>
            <span className="text-3xl font-black text-white">{metrics.totalInvoices}</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold block pt-2 border-t border-slate-800">
            ₹{metrics.totalCollected.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} settled
          </span>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-xl space-y-4">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white">Registered Clinic Tenants</h2>
            <p className="text-xs text-slate-400 mt-0.5">{metrics.clinics.length} total active database instances</p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search clinic or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Clinic Tenant</th>
                <th className="px-6 py-4">City / State</th>
                <th className="px-6 py-4">Public URL</th>
                <th className="px-6 py-4">Subscription Status</th>
                <th className="px-6 py-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredClinics.map((c: any) => {
                const subStatus = c.subscription?.status || "TRIAL";
                const isWorking = actionLoading === c.id;

                return (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-bold text-white">
                      {c.name}
                      <span className="block text-[11px] text-slate-400 font-normal">{c.clinicType}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">
                      {c.city}, {c.state}
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-teal-400">
                      <a 
                        href={`/clinics/${c.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        <span>/clinics/{c.slug}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                        subStatus === "ACTIVE" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" :
                        subStatus === "SUSPENDED" ? "bg-rose-950 text-rose-400 border border-rose-800" :
                        "bg-amber-950 text-amber-400 border border-amber-800"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          subStatus === "ACTIVE" ? "bg-emerald-400" :
                          subStatus === "SUSPENDED" ? "bg-rose-400" : "bg-amber-400"
                        }`} />
                        {subStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isWorking ? (
                        <Loader2 className="w-4 h-4 animate-spin ml-auto text-teal-400" />
                      ) : subStatus === "SUSPENDED" ? (
                        <button
                          onClick={() => handleUpdateStatus(c.id, "ACTIVE")}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition"
                        >
                          Restore Access
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(c.id, "SUSPENDED")}
                          className="px-3 py-1.5 rounded-xl border border-rose-800 text-rose-400 hover:bg-rose-950 font-bold text-[11px] transition"
                        >
                          Suspend Tenant
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription Plans Configuration */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-7 space-y-5">
        <div>
          <h2 className="text-base font-bold text-white">Active Subscription Products</h2>
          <p className="text-xs text-slate-400 mt-0.5">Tier entitlements configured in system billing catalog</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.plans.map((p: any) => (
            <div key={p.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-white text-sm">{p.name}</span>
                <span className="font-black text-teal-400 text-lg">₹{p.monthlyPrice}/mo</span>
              </div>
              <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span>Max Doctors:</span>
                  <strong className="text-slate-200">{p.maxDoctors}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Staff Seats:</span>
                  <strong className="text-slate-200">{p.maxStaff}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Quota:</span>
                  <strong className="text-slate-200">{p.maxAppointmentsMonthly} Bookings</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
