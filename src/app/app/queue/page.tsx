"use client";

import { useState, useEffect } from "react";
import { 
  Users2, 
  Play, 
  CheckCircle2, 
  SkipForward, 
  Clock, 
  Loader2, 
  Calendar, 
  ArrowRight,
  Tv,
  Volume2,
  Stethoscope,
  Sparkles,
  Phone
} from "lucide-react";

export default function ClinicQueuePage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const loadQueue = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/app/queue?date=${date}`);
      const data = await res.json();
      if (res.ok) {
        setQueue(data.queue || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [date]);

  const handleUpdateStatus = async (queueId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/app/queue", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queueId, status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update queue");
        return;
      }

      loadQueue();
    } catch {
      alert("Error updating queue");
    }
  };

  const currentlyServing = queue.find((q) => q.status === "IN_PROGRESS");
  const waitingEntries = queue.filter((q) => q.status === "WAITING");
  const completedEntries = queue.filter((q) => q.status === "COMPLETED");

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Date Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Daily Live Token Board
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
              Live Queue
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sequential patient tokens and consultation dispatch control for {date}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
          />
        </div>
      </div>

      {/* Currently Serving Big Spotlight Card */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-teal-900/60 px-3.5 py-1 rounded-full border border-teal-500/30">
            <Tv className="w-3.5 h-3.5" /> Now In Doctor Consultation
          </span>

          {currentlyServing ? (
            <div className="pt-1">
              <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                Token #{currentlyServing.tokenNumber}
              </h2>
              <p className="text-xl font-extrabold text-teal-300 mt-1">
                {currentlyServing.patient?.fullName}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                  Doctor: <strong className="text-slate-200">{currentlyServing.appointment?.doctor?.name || "General OPD"}</strong>
                </span>
                {currentlyServing.patient?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-teal-400" />
                    {currentlyServing.patient.phone}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="pt-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-300">
                Desk Available / Waiting for Next Call
              </h2>
              <p className="text-xs text-slate-400 mt-1.5">
                {waitingEntries.length > 0
                  ? `Next patient in line is Token #${waitingEntries[0].tokenNumber} (${waitingEntries[0].patient?.fullName})`
                  : "No patients currently waiting in the clinic queue."}
              </p>
            </div>
          )}
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {currentlyServing ? (
            <button
              onClick={() => handleUpdateStatus(currentlyServing.id, "COMPLETED")}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Consultation Done</span>
            </button>
          ) : waitingEntries.length > 0 ? (
            <button
              onClick={() => handleUpdateStatus(waitingEntries[0].id, "IN_PROGRESS")}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-teal-400/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>Call Token #{waitingEntries[0].tokenNumber}</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Waiting List Queue Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users2 className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">
              Patients in Waiting Room ({waitingEntries.length})
            </h2>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            {completedEntries.length} Finished Consultations
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-600" />
              <span className="font-medium">Loading live queue status...</span>
            </div>
          ) : waitingEntries.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs space-y-2">
              <Users2 className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-medium">No patients currently in the waiting room.</p>
              <p className="text-slate-400 text-[11px]">To add a patient, check in an appointment from the Appointments tab.</p>
            </div>
          ) : (
            waitingEntries.map((item, idx) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-slate-200/80 hover:border-teal-400 bg-white hover:bg-teal-50/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-11 h-11 rounded-2xl bg-teal-50 group-hover:bg-teal-600 text-teal-800 group-hover:text-white font-black text-base flex items-center justify-center font-mono border border-teal-200/80 transition-colors">
                      #{item.tokenNumber}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.patient?.fullName}</h4>
                      <span className="text-[11px] text-slate-400 font-normal block">{item.patient?.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Consulting:</span>
                    <strong className="text-slate-800">{item.appointment?.doctor?.name || "General OPD"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Wait:</span>
                    <span className="font-semibold text-teal-700">~{(idx + 1) * 15} minutes</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => handleUpdateStatus(item.id, "IN_PROGRESS")}
                    className="py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-teal-600/20 transition active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5" /> Call In
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(item.id, "SKIPPED")}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <SkipForward className="w-3.5 h-3.5" /> Skip
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
