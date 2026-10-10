"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  PlusCircle, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Play, 
  Receipt, 
  Loader2,
  Stethoscope,
  AlertCircle,
  Phone,
  User,
  ArrowRight,
  Globe
} from "lucide-react";

export default function ClinicAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchQuery, setSearchQuery] = useState("");

  // New appointment modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("10:00");
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load appointments
  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/app/appointments?date=${selectedDate}`);
      const data = await res.json();
      if (res.ok) {
        setAppointments(data.appointments || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  // Load doctors for modal
  useEffect(() => {
    async function loadDocs() {
      const apptRes = await fetch("/api/app/appointments");
      const apptData = await apptRes.json();
      if (apptData.appointments?.length > 0) {
        const uniqueDocs = Array.from(new Set(apptData.appointments.map((a: any) => JSON.stringify(a.doctor))))
          .filter(Boolean)
          .map((d: any) => JSON.parse(d));
        setDoctors(uniqueDocs);
        if (uniqueDocs.length > 0 && !doctorId) {
          setDoctorId(uniqueDocs[0].id);
        }
      }
    }
    loadDocs();
  }, []);

  // Handle appointment status transition
  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/app/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update status");
        return;
      }

      loadAppointments();
    } catch {
      alert("Error occurred while updating status");
    }
  };

  // Create new appointment
  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMsg("");

      const res = await fetch("/api/app/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName,
          patientPhone,
          doctorId,
          date,
          startTime,
          reason,
          isWalkIn,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create appointment");
      }

      setIsModalOpen(false);
      setPatientName("");
      setPatientPhone("");
      setReason("");
      loadAppointments();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (filterStatus !== "ALL" && a.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const name = a.patient?.fullName?.toLowerCase() || "";
      const phone = a.patient?.phone || "";
      const ref = a.reference?.toLowerCase() || "";
      return name.includes(q) || phone.includes(q) || ref.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Appointment Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Schedule walk-ins, check in booked patients, and progress consultation statuses.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm shadow-teal-600/20 hover:shadow-md transition active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Appointment / Walk-in</span>
        </button>
      </div>

      {/* Filter and Date Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Filter by Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-slate-50/50"
            />
          </div>

          <div className="flex-1 sm:flex-initial">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Search Patient / Ref
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Name, phone, reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-slate-50/50"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          {["ALL", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((st) => (
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

      {/* Appointments Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Time Slot</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Fee</th>
                <th className="px-6 py-4 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-600" />
                    <span className="font-medium">Loading appointments...</span>
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No appointments found matching this criteria for {selectedDate}.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200/60 font-mono text-xs">
                        {apt.reference}
                      </span>
                      {apt.bookedOnline && (
                        <span className="inline-flex items-center gap-0.5 ml-2 text-[10px] text-teal-700 font-sans font-bold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
                          <Globe className="w-2.5 h-2.5" /> Online
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {apt.patient?.fullName}
                      <span className="block text-[11px] text-slate-400 font-normal">{apt.patient?.phone}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {apt.doctor?.name}
                      <span className="block text-[10px] text-teal-700 font-semibold">{apt.doctor?.specialtyName}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="font-bold text-slate-900">{apt.startTime} – {apt.endTime}</span>
                      {apt.reason && <span className="block text-[11px] text-slate-400 truncate max-w-[140px]">{apt.reason}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                        apt.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        apt.status === "IN_PROGRESS" ? "bg-teal-50 text-teal-700 border border-teal-300 animate-pulse" :
                        apt.status === "CHECKED_IN" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        apt.status === "CANCELLED" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                        "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          apt.status === "COMPLETED" ? "bg-emerald-500" :
                          apt.status === "IN_PROGRESS" ? "bg-teal-500" :
                          apt.status === "CHECKED_IN" ? "bg-amber-500" :
                          apt.status === "CANCELLED" ? "bg-rose-500" : "bg-slate-400"
                        }`} />
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                      ₹{apt.consultationFee}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Check-In Action (adds to queue) */}
                        {apt.status === "CONFIRMED" && (
                          <button
                            onClick={() => handleStatusChange(apt.id, "CHECKED_IN")}
                            className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] shadow-sm transition active:scale-95"
                            title="Check in patient to queue"
                          >
                            Check In
                          </button>
                        )}

                        {/* Start Consultation */}
                        {(apt.status === "CHECKED_IN" || apt.status === "WAITING") && (
                          <button
                            onClick={() => handleStatusChange(apt.id, "IN_PROGRESS")}
                            className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] shadow-sm transition active:scale-95"
                          >
                            Start Visit
                          </button>
                        )}

                        {/* Complete Consultation */}
                        {apt.status === "IN_PROGRESS" && (
                          <button
                            onClick={() => handleStatusChange(apt.id, "COMPLETED")}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm transition active:scale-95"
                          >
                            Complete
                          </button>
                        )}

                        {/* Cancel Action */}
                        {apt.status !== "COMPLETED" && apt.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleStatusChange(apt.id, "CANCELLED")}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Cancel appointment"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* Shortcut to Invoice */}
                        <Link
                          href="/app/billing"
                          className="p-1.5 rounded-xl text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition"
                          title="Open Billing"
                        >
                          <Receipt className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Appointment / Walk-in */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200/80 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Book Patient Appointment</h3>
                <p className="text-xs text-slate-500">Record a new consultation or register a walk-in patient.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Anjali Nair"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="9895012345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Consulting Doctor *</label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 bg-white"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialtyName}) - ₹{d.consultationFee}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Time Slot</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Reason for Consultation</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Skin rash, BP check"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                />
              </div>

              {/* Walk-in checkbox */}
              <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="walkInCheck"
                  checked={isWalkIn}
                  onChange={(e) => setIsWalkIn(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <label htmlFor="walkInCheck" className="text-xs font-bold text-teal-950 cursor-pointer">
                  Immediate Walk-In (auto-issue token and enroll in live queue)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-2 shadow-sm shadow-teal-600/20"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
                  <span>Confirm Appointment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
