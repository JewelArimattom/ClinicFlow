"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-sm"
    >
      <Printer className="w-3.5 h-3.5 text-slate-500" />
      <span>Print Slip</span>
    </button>
  );
}
