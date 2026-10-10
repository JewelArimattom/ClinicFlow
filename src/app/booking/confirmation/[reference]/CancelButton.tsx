"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle, Loader2 } from "lucide-react";

export function CancelBookingButton({ reference }: { reference: string }) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    const confirmed = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmed) return;

    try {
      setIsCancelling(true);
      const res = await fetch(`/api/public/bookings/${reference}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CANCEL", reason: "Cancelled by patient" }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to cancel booking");
        return;
      }

      router.refresh();
    } catch {
      alert("Error occurred while cancelling");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isCancelling}
      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-semibold transition flex items-center justify-center gap-1.5"
    >
      {isCancelling ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <XCircle className="w-3.5 h-3.5" />
      )}
      <span>Cancel Visit</span>
    </button>
  );
}
