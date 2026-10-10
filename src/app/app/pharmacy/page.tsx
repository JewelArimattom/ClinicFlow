"use client";

import { useState, useEffect } from "react";
import { 
  Pill, 
  PlusCircle, 
  ShoppingCart, 
  Layers, 
  AlertTriangle, 
  Clock, 
  Search, 
  CheckCircle2, 
  Loader2, 
  Trash2,
  Receipt,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Boxes
} from "lucide-react";

export default function ClinicPharmacyPage() {
  const [activeTab, setActiveTab] = useState<"CATALOG" | "BATCHES" | "POS">("POS");
  const [medicines, setMedicines] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [posSearch, setPosSearch] = useState("");

  // POS Cart State
  const [cart, setCart] = useState<Array<{ medicineId: string; name: string; price: number; quantity: number; availableStock: number }>>([]);
  const [posPaymentMethod, setPosPaymentMethod] = useState<"CASH" | "UPI" | "CARD">("CASH");
  const [posPaymentRef, setPosPaymentRef] = useState("");
  const [isSubmittingCheckout, setIsSubmittingCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<any>(null);

  // Add Medicine Modal State
  const [isAddMedModal, setIsAddMedModal] = useState(false);
  const [medName, setMedName] = useState("");
  const [medGeneric, setMedGeneric] = useState("");
  const [medForm, setMedForm] = useState("Tablet");
  const [medStrength, setMedStrength] = useState("");
  const [medSellingPrice, setMedSellingPrice] = useState(50);
  const [medReorder, setMedReorder] = useState(15);
  const [isSavingMed, setIsSavingMed] = useState(false);

  // Receive Batch Modal State
  const [isBatchModal, setIsBatchModal] = useState(false);
  const [selectedMedIdForBatch, setSelectedMedIdForBatch] = useState("");
  const [batchNum, setBatchNum] = useState("");
  const [batchExpiry, setBatchExpiry] = useState("");
  const [batchCost, setBatchCost] = useState(30);
  const [batchSellPrice, setBatchSellPrice] = useState(50);
  const [batchQty, setBatchQty] = useState(50);
  const [isSavingBatch, setIsSavingBatch] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [medRes, batchRes] = await Promise.all([
        fetch("/api/app/pharmacy/medicines"),
        fetch("/api/app/pharmacy/inventory"),
      ]);
      const medData = await medRes.json();
      const batchData = await batchRes.json();

      setMedicines(medData.medicines || []);
      setBatches(batchData.batches || []);
      if (medData.medicines?.length > 0 && !selectedMedIdForBatch) {
        setSelectedMedIdForBatch(medData.medicines[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cart actions
  const addToCart = (med: any) => {
    const existing = cart.find((item) => item.medicineId === med.id);
    const stock = med.totalStock || 0;
    if (stock <= 0) {
      alert("This medicine is currently out of stock");
      return;
    }

    if (existing) {
      if (existing.quantity >= stock) {
        alert("Cannot exceed available stock in cart");
        return;
      }
      setCart(cart.map((item) => item.medicineId === med.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { medicineId: med.id, name: med.name, price: med.sellingPrice, quantity: 1, availableStock: stock }]);
    }
  };

  const removeFromCart = (medicineId: string) => {
    setCart(cart.filter((item) => item.medicineId !== medicineId));
  };

  const updateCartQty = (medicineId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(medicineId);
      return;
    }
    const target = cart.find(i => i.medicineId === medicineId);
    if (!target) return;
    if (newQty > target.availableStock) {
      alert(`Maximum available stock is ${target.availableStock}`);
      return;
    }
    setCart(cart.map(item => item.medicineId === medicineId ? { ...item, quantity: newQty } : item));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Submit POS checkout
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      setIsSubmittingCheckout(true);
      setCheckoutSuccess(null);

      const res = await fetch("/api/app/pharmacy/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({ medicineId: item.medicineId, quantity: item.quantity })),
          paymentMethod: posPaymentMethod,
          paymentReference: posPaymentRef,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to complete sale");
        return;
      }

      setCheckoutSuccess(data);
      setCart([]);
      setPosPaymentRef("");
      loadData();
    } catch {
      alert("Checkout error occurred");
    } finally {
      setIsSubmittingCheckout(false);
    }
  };

  // Add new medicine catalog entry
  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingMed(true);
      const res = await fetch("/api/app/pharmacy/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: medName,
          genericName: medGeneric,
          dosageForm: medForm,
          strength: medStrength,
          sellingPrice: Number(medSellingPrice),
          reorderThreshold: Number(medReorder),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to create medicine");
        return;
      }

      setIsAddMedModal(false);
      setMedName("");
      setMedGeneric("");
      loadData();
    } finally {
      setIsSavingMed(false);
    }
  };

  // Receive new batch
  const handleReceiveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingBatch(true);
      const res = await fetch("/api/app/pharmacy/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicineId: selectedMedIdForBatch,
          batchNumber: batchNum,
          expiryDate: batchExpiry,
          purchaseCost: Number(batchCost),
          sellingPrice: Number(batchSellPrice),
          quantity: Number(batchQty),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to receive batch");
        return;
      }

      setIsBatchModal(false);
      setBatchNum("");
      setBatchExpiry("");
      loadData();
    } finally {
      setIsSavingBatch(false);
    }
  };

  const filteredMedicinesForPos = medicines.filter(m => {
    if (!posSearch) return true;
    const q = posSearch.toLowerCase();
    return m.name.toLowerCase().includes(q) || (m.genericName && m.genericName.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Subtab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pharmacy & Batch Dispensary
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated FEFO batch deductions, stock ledger movements, and POS counter billing.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl text-xs font-bold border border-slate-200/60">
          <button
            onClick={() => setActiveTab("POS")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "POS" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-teal-600" />
            <span>Counter POS</span>
          </button>

          <button
            onClick={() => setActiveTab("CATALOG")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "CATALOG" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-teal-600" />
            <span>Catalog ({medicines.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("BATCHES")}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "BATCHES" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span>FEFO Batches ({batches.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Counter POS Sale Checkout */}
      {activeTab === "POS" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Quick Catalog selector */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Select Medicines</h2>
                <span className="text-[11px] text-slate-400">FEFO automatically deducts nearest expiry batches</span>
              </div>
              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  placeholder="Filter medicines..."
                  value={posSearch}
                  onChange={(e) => setPosSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-slate-50/50"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto p-1">
              {filteredMedicinesForPos.map((med) => {
                const stock = med.totalStock || 0;
                const isOutOfStock = stock <= 0;
                const isLow = stock <= med.reorderThreshold && !isOutOfStock;

                return (
                  <button
                    key={med.id}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => addToCart(med)}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-3 ${
                      isOutOfStock
                        ? "bg-slate-50/70 border-slate-200 opacity-50 cursor-not-allowed"
                        : "bg-white border-slate-200/80 hover:border-teal-500 hover:bg-teal-50/20 hover:shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{med.name}</h4>
                        <span className="text-xs font-black text-teal-700">₹{med.sellingPrice}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block line-clamp-1 mt-0.5">
                        {med.dosageForm} {med.strength && `• ${med.strength}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                      <span className={`font-semibold ${
                        isOutOfStock ? "text-rose-600" : isLow ? "text-amber-600" : "text-slate-500"
                      }`}>
                        {isOutOfStock ? "Out of stock" : `${stock} in stock`}
                      </span>
                      <span className="text-teal-600 font-bold hover:underline">+ Add</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Cart & Checkout Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-teal-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Dispensary Cart ({cart.length})</h3>
                </div>
                {cart.length > 0 && (
                  <button onClick={() => setCart([])} className="text-[11px] text-rose-600 font-semibold hover:underline">
                    Clear Cart
                  </button>
                )}
              </div>

              {checkoutSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1.5 animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>POS Sale Dispatched: #{checkoutSuccess.invoice?.invoiceNumber}</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Stock deduction ledgers written & revenue recorded in billing.
                  </p>
                </div>
              )}

              {cart.length === 0 ? (
                <div className="py-14 text-center text-slate-400 text-xs space-y-2">
                  <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="font-medium">Cart is currently empty.</p>
                  <p className="text-slate-400 text-[11px]">Click items on the left to add medications for dispensing.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div key={item.medicineId} className="pt-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{item.name}</span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                          <span>₹{item.price} each</span>
                          <span className="text-slate-300">•</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.medicineId, item.quantity - 1)}
                              className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center text-xs"
                            >
                              -
                            </button>
                            <span className="font-bold text-slate-800 px-1">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.medicineId, item.quantity + 1)}
                              className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-black text-slate-900 text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.medicineId)}
                          className="text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total and Checkout Submit */}
            <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-slate-100 text-xs">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-600">Total Billed:</span>
                <span className="text-3xl font-black text-slate-900">₹{cartTotal.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tender Method</label>
                  <select
                    value={posPaymentMethod}
                    onChange={(e: any) => setPosPaymentMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 bg-white"
                  >
                    <option value="CASH">Cash at Counter</option>
                    <option value="UPI">UPI (QR / GPay / PhonePe)</option>
                    <option value="CARD">Card POS Terminal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reference / Note</label>
                  <input
                    type="text"
                    placeholder="Optional note"
                    value={posPaymentRef}
                    onChange={(e) => setPosPaymentRef(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingCheckout || cart.length === 0}
                className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubmittingCheckout ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Sale & Deducting Stock...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Sale & Deduct FEFO</span>
                    <Receipt className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW 2: Medicine Catalog Table */}
      {activeTab === "CATALOG" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">
              Master catalog of pharmaceutical formulas and dispensary retail rates.
            </span>
            <button
              onClick={() => setIsAddMedModal(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-teal-600/20 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add New Medicine</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-4">Medicine Name</th>
                  <th className="px-6 py-4">Dosage / Strength</th>
                  <th className="px-6 py-4">Selling Price</th>
                  <th className="px-6 py-4">Total Stock</th>
                  <th className="px-6 py-4">Reorder Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicines.map((m) => {
                  const isLow = (m.totalStock || 0) <= m.reorderThreshold;
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {m.name}
                        {m.genericName && <span className="block text-[11px] text-slate-400 font-normal">{m.genericName}</span>}
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {m.dosageForm} {m.strength && `(${m.strength})`}
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900">
                        ₹{m.sellingPrice}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        <span className={isLow ? "text-amber-600" : "text-emerald-700"}>
                          {m.totalStock || 0} {m.uom || "units"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isLow 
                            ? "bg-amber-50 text-amber-700 border border-amber-200" 
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          {isLow ? `Low (≤ ${m.reorderThreshold})` : "Healthy"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedMedIdForBatch(m.id);
                            setIsBatchModal(true);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 text-[11px] font-bold transition"
                        >
                          + Receive Batch
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: Batches & Expiry (FEFO) */}
      {activeTab === "BATCHES" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">
              Batches automatically ordered by Nearest Expiry Date (First-Expiry-First-Out).
            </span>
            <button
              onClick={() => setIsBatchModal(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-teal-600/20 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Receive New Stock Batch</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-4">Medicine</th>
                  <th className="px-6 py-4">Batch Number</th>
                  <th className="px-6 py-4">Expiry Date</th>
                  <th className="px-6 py-4">Purchase Cost</th>
                  <th className="px-6 py-4">Selling Price</th>
                  <th className="px-6 py-4">Remaining / Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {b.medicine?.name}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs">
                        {b.batchNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md font-bold text-[11px] bg-rose-50 text-rose-700 border border-rose-200">
                        {b.expiryDate}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">
                      ₹{b.purchaseCost}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                      ₹{b.sellingPrice}
                    </td>
                    <td className="px-6 py-4 font-black text-teal-700">
                      {b.currentStock} / {b.quantityReceived}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Medicine */}
      {isAddMedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Medicine to Catalog</h3>
                <p className="text-xs text-slate-500">Create new item in clinical formulary.</p>
              </div>
              <button 
                onClick={() => setIsAddMedModal(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMedicine} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol 650mg"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Generic Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acetaminophen"
                  value={medGeneric}
                  onChange={(e) => setMedGeneric(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dosage Form</label>
                  <select
                    value={medForm}
                    onChange={(e) => setMedForm(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 bg-white"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Injection">Injection</option>
                    <option value="Ointment">Ointment</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Strength</label>
                  <input
                    type="text"
                    placeholder="e.g. 500mg"
                    value={medStrength}
                    onChange={(e) => setMedStrength(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={medSellingPrice}
                    onChange={(e) => setMedSellingPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reorder Alert Qty</label>
                  <input
                    type="number"
                    required
                    value={medReorder}
                    onChange={(e) => setMedReorder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddMedModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingMed}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm shadow-teal-600/20"
                >
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Receive Batch */}
      {isBatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Receive Stock Batch</h3>
                <p className="text-xs text-slate-500">Record incoming supplier batch and expiry date.</p>
              </div>
              <button 
                onClick={() => setIsBatchModal(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReceiveBatch} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Medicine *</label>
                <select
                  value={selectedMedIdForBatch}
                  onChange={(e) => setSelectedMedIdForBatch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 bg-white"
                >
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.dosageForm})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batch Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DL26B04"
                    value={batchNum}
                    onChange={(e) => setBatchNum(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={batchExpiry}
                    onChange={(e) => setBatchExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cost (₹)</label>
                  <input
                    type="number"
                    required
                    value={batchCost}
                    onChange={(e) => setBatchCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sell Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={batchSellPrice}
                    onChange={(e) => setBatchSellPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={batchQty}
                    onChange={(e) => setBatchQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsBatchModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingBatch}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm shadow-teal-600/20"
                >
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
