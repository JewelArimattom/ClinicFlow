"use client";

import { useState, useEffect } from "react";
import { 
  Receipt, 
  PlusCircle, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  RotateCcw, 
  Loader2, 
  Search,
  DollarSign,
  ArrowRight,
  Sparkles,
  Layers,
  Wallet
} from "lucide-react";

export default function ClinicBillingPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Payment modal
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<"CASH" | "UPI" | "CARD">("UPI");
  const [payRef, setPayRef] = useState("");
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);

  // New invoice modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDesc, setNewDesc] = useState("Doctor Consultation");
  const [newPrice, setNewPrice] = useState(400);
  const [newPatientName, setNewPatientName] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  const loadInvoices = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/app/billing/invoices");
      const data = await res.json();
      if (res.ok) {
        setInvoices(data.invoices || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  // Record payment
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    try {
      setIsSubmittingPay(true);
      const res = await fetch("/api/app/billing/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: selectedInvoice.id,
          amount: Number(payAmount),
          method: payMethod,
          reference: payRef,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to record payment");
        return;
      }

      setIsPayModalOpen(false);
      loadInvoices();
    } catch {
      alert("Error occurred while recording payment");
    } finally {
      setIsSubmittingPay(false);
    }
  };

  // Create new consultation invoice
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmittingCreate(true);
      const res = await fetch("/api/app/billing/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CONSULTATION",
          items: [
            {
              description: newDesc,
              quantity: 1,
              unitPrice: Number(newPrice),
              discount: 0,
              taxRate: 0,
            },
          ],
          notes: newNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create invoice");
        return;
      }

      setIsCreateModalOpen(false);
      setNewDesc("Doctor Consultation");
      setNewPrice(400);
      setNewNotes("");
      loadInvoices();
    } catch {
      alert("Error creating invoice");
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (filterStatus !== "ALL" && inv.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const num = inv.invoiceNumber?.toLowerCase() || "";
      const pat = inv.patient?.fullName?.toLowerCase() || "";
      return num.includes(q) || pat.includes(q);
    }
    return true;
  });

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalDue = invoices.reduce((sum, inv) => sum + inv.outstandingAmount, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Consultation Billing & Receipts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Issue sequential GST receipts, register UPI / Cash collections, and reconcile accounts.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm shadow-teal-600/20 hover:shadow-md transition active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Consultation Invoice</span>
        </button>
      </div>

      {/* Financial Snapshot Summary Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Billed</span>
            <span className="text-2xl font-black text-slate-900">₹{totalBilled.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Collected</span>
            <span className="text-2xl font-black text-emerald-600">₹{totalPaid.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Receivables</span>
            <span className="text-2xl font-black text-rose-600">₹{totalDue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search invoice number or patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 bg-slate-50/50"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          {["ALL", "PAID", "PARTIALLY_PAID", "ISSUED", "REFUNDED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] ${
                filterStatus === st
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Patient / Category</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Collected</th>
                <th className="px-6 py-4">Balance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-600" />
                    <span className="font-medium">Loading ledger invoices...</span>
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    No invoices recorded matching this status.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200/60 text-xs">
                        {inv.invoiceNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {new Date(inv.createdAt).toISOString().split("T")[0]}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {inv.patient?.fullName || "Walk-In Patient"}
                      <span className="block text-[10px] text-teal-700 font-semibold">{inv.type}</span>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                      ₹{inv.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-700">
                      ₹{inv.paidAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-bold text-rose-600">
                      ₹{inv.outstandingAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                        inv.status === "PAID" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        inv.status === "PARTIALLY_PAID" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        inv.status === "REFUNDED" ? "bg-slate-100 text-slate-700 border border-slate-200" :
                        "bg-teal-50 text-teal-700 border border-teal-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          inv.status === "PAID" ? "bg-emerald-500" :
                          inv.status === "PARTIALLY_PAID" ? "bg-amber-500" : "bg-teal-500"
                        }`} />
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {inv.outstandingAmount > 0 && (
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setPayAmount(inv.outstandingAmount);
                              setIsPayModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] shadow-sm transition active:scale-95"
                          >
                            Collect Pay
                          </button>
                        )}

                        <button
                          onClick={() => window.print()}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                          title="Print Receipt Slip"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Record Payment */}
      {isPayModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Record Payment: {selectedInvoice.invoiceNumber}
                </h3>
                <p className="text-xs text-slate-500">Post transaction against patient invoice.</p>
              </div>
              <button 
                onClick={() => setIsPayModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="font-semibold text-slate-600">Pending Amount:</span>
                <span className="font-black text-xl text-slate-900">
                  ₹{selectedInvoice.outstandingAmount.toFixed(2)}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Collection Amount (₹) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="1"
                  max={selectedInvoice.outstandingAmount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Payment Method *</label>
                <select
                  value={payMethod}
                  onChange={(e: any) => setPayMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 bg-white"
                >
                  <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                  <option value="CASH">Cash at Counter</option>
                  <option value="CARD">Credit / Debit Card</option>
                  <option value="BANK_TRANSFER">Bank Transfer / NEFT</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Transaction Ref / Counter Note</label>
                <input
                  type="text"
                  placeholder="e.g. UPI Ref # or Cash register id"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPay}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-2 shadow-sm shadow-teal-600/20"
                >
                  {isSubmittingPay ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>Save Receipt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Consultation Invoice */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Create Consultation Invoice</h3>
                <p className="text-xs text-slate-500">Generate receipt for consultation or lab fee.</p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Service Description *</label>
                <input
                  type="text"
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. General OPD Consultation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Consultation Fee (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Internal Notes</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Follow-up consultation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCreate}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-2 shadow-sm shadow-teal-600/20"
                >
                  {isSubmittingCreate ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
                  <span>Generate Invoice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
