"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Download, 
  Receipt, 
  CreditCard, 
  AlertTriangle, 
  Clock, 
  Loader2,
  Calendar,
  Wallet,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default function ClinicReportsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/app/reports");
        const json = await res.json();
        setData(json);
      } finally {
        setIsLoading(false);
      }
    }
    loadReports();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="py-24 text-center text-slate-400 text-xs space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600" />
        <span className="font-semibold text-slate-600 block">Compiling clinic financial reconciliation...</span>
      </div>
    );
  }

  const { summary, paymentMethods, lowStockMedicines, expiringBatches, recentInvoices } = data;

  const upiCollected = paymentMethods.UPI || 0;
  const cashCollected = paymentMethods.CASH || 0;
  const cardCollected = paymentMethods.CARD || 0;
  const totalCollectedSum = (upiCollected + cashCollected + cardCollected) || summary.todayCollected || 1;

  const upiPct = Math.round((upiCollected / totalCollectedSum) * 100);
  const cashPct = Math.round((cashCollected / totalCollectedSum) * 100);
  const cardPct = Math.max(0, 100 - upiPct - cashPct);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with CSV Export action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Financial & Operational Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time reconciliation of collections, outstanding receivables, tender breakdowns, and audit registers.
          </p>
        </div>

        <a
          href="/api/app/reports?format=csv"
          download
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm hover:shadow-md transition active:scale-95"
        >
          <FileSpreadsheet className="w-4 h-4 text-teal-400" />
          <span>Export Invoices (.CSV)</span>
        </a>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Today&apos;s Billed Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">₹{summary.todayBilled.toLocaleString("en-IN")}</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100">
            Total consultation & pharmacy charges
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">Realized Collections</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-emerald-600">₹{summary.todayCollected.toLocaleString("en-IN")}</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium pt-2 border-t border-slate-100">
            Funds received at front desk & POS
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider block">Outstanding Receivables</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-indigo-600">₹{summary.outstandingTotal.toLocaleString("en-IN")}</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100">
            Unsettled balances across open invoices
          </p>
        </div>
      </div>

      {/* Payment Tender Distribution & Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment Methods Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Payment Tender Distribution
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Realized funds segmented by channel</p>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-700 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> UPI (GPay / PhonePe / QR)
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-900 font-bold">₹{upiCollected.toLocaleString("en-IN")}</span>
                    <span className="text-[10px] text-slate-400">({upiPct}%)</span>
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-teal-500 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.max(5, upiPct)}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-700 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Cash at Counter
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-900 font-bold">₹{cashCollected.toLocaleString("en-IN")}</span>
                    <span className="text-[10px] text-slate-400">({cashPct}%)</span>
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.max(5, cashPct)}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-700 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Card / POS Terminal
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-900 font-bold">₹{cardCollected.toLocaleString("en-IN")}</span>
                    <span className="text-[10px] text-slate-400">({cardPct}%)</span>
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.max(5, cardPct)}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span>Reconciled across both OPD appointments & pharmacy sales counters.</span>
          </div>
        </div>

        {/* Recent Invoices Ledger */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Ledger Entries
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Most recent transactions posted</p>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Audit Trail</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Invoice #</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentInvoices.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs">
                        {inv.invoiceNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">{inv.type}</td>
                    <td className="px-4 py-3.5 font-black text-slate-900">₹{inv.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        inv.status === "PAID" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${inv.status === "PAID" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
