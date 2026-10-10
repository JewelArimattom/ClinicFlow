"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import {
  User,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Phone,
  Stethoscope,
  Mail,
} from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialtyName: string;
  qualifications: string;
  consultationFee: number;
}

interface Slot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export default function BookingFlowPage({ params }: { params: { clinicSlug: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDoctorId = searchParams.get("doctorId") || "";

  const [clinic, setClinic] = useState<any>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctorId);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [reason, setReason] = useState("");

  const [isLoadingClinic, setIsLoadingClinic] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadClinic() {
      try {
        setIsLoadingClinic(true);
        const res = await fetch(`/api/public/clinics/${params.clinicSlug}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Clinic not found");
        setClinic(data.clinic);
        setDoctors(data.doctors || []);
        if (!selectedDoctorId && data.doctors?.length > 0) {
          setSelectedDoctorId(data.doctors[0].id);
        }
      } catch (err: any) {
        setErrorMessage(err.message);
      } finally {
        setIsLoadingClinic(false);
      }
    }
    loadClinic();
  }, [params.clinicSlug]);

  useEffect(() => {
    if (!selectedDoctorId || !selectedDate || !clinic) return;
    async function loadSlots() {
      try {
        setIsLoadingSlots(true);
        setSelectedSlot(null);
        setErrorMessage("");
        const res = await fetch(
          `/api/public/clinics/${params.clinicSlug}/availability?doctorId=${selectedDoctorId}&date=${selectedDate}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not fetch slots");
        setSlots(data.slots || []);
      } catch (err: any) {
        setErrorMessage(err.message);
      } finally {
        setIsLoadingSlots(false);
      }
    }
    loadSlots();
  }, [params.clinicSlug, selectedDoctorId, selectedDate, clinic]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMessage("Please choose a time slot");
      return;
    }
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const res = await fetch("/api/public/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicSlug: params.clinicSlug,
          doctorId: selectedDoctorId,
          date: selectedDate,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          patientName,
          patientPhone,
          patientEmail,
          reason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to confirm booking");
      router.push(`/booking/confirmation/${data.reference}`);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  const upcomingDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayNum = d.getDate();
    const month = d.toLocaleDateString("en-US", { month: "short" });
    return { dateStr, dayName, dayNum, month, isToday: i === 0 };
  });

  // Step tracking
  const currentStep = !selectedDoctorId ? 1 : !selectedSlot ? (selectedDate ? 3 : 2) : !patientName ? 4 : 5;

  if (isLoadingClinic) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
            <p className="text-sm font-medium text-gray-500">Loading booking schedule...</p>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <Link
          href={`/clinics/${params.clinicSlug}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-brand-600 transition-colors mb-5 focus-ring rounded"
        >
          <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} /> Back to {clinic?.name || "Clinic"}
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden">
          {/* Header */}
          <div className="p-5 sm:p-6 bg-gray-950 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
                  Appointment Booking
                </p>
                <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {clinic?.name}
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  {clinic?.address}, {clinic?.city}
                </p>
              </div>
              {selectedDoctor && (
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-right">
                  <span className="text-[11px] text-gray-400 block">Fee</span>
                  <span className="text-xl font-bold text-brand-400">₹{selectedDoctor.consultationFee}</span>
                </div>
              )}
            </div>

            {/* Step indicator */}
            <div className="mt-5 flex items-center gap-1">
              {["Doctor", "Date", "Slot", "Details"].map((label, i) => (
                <div key={label} className="flex-1">
                  <div className={`h-1 rounded-full transition-colors ${i + 1 <= currentStep ? "bg-brand-400" : "bg-white/10"}`} />
                  <span className={`text-[10px] mt-1 block ${i + 1 <= currentStep ? "text-brand-400" : "text-white/30"}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="mx-5 mt-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleBookingSubmit} className="p-5 sm:p-6 space-y-7">
            {/* Step 1: Doctor */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900">
                1. Select Doctor
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {doctors.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className={`p-4 rounded-xl border text-left transition-all duration-fast flex items-start gap-3 focus-ring ${
                      selectedDoctorId === doc.id
                        ? "border-brand-600 bg-brand-50/50 ring-2 ring-brand-600/15"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      selectedDoctorId === doc.id ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      <Stethoscope className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{doc.name}</h4>
                      <p className="text-xs text-brand-700 font-medium">{doc.specialtyName}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">₹{doc.consultationFee} · {doc.qualifications}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Date */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-900">
                2. Select Date
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {upcomingDates.map((item) => (
                  <button
                    key={item.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`py-3 px-2 rounded-xl border text-center transition-all duration-fast flex flex-col items-center justify-center focus-ring ${
                      selectedDate === item.dateStr
                        ? "border-brand-600 bg-brand-600 text-white shadow-primary"
                        : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    <span className="text-[10px] font-semibold uppercase">{item.dayName}</span>
                    <span className="text-base font-bold my-0.5">{item.dayNum}</span>
                    <span className="text-[10px]">{item.month}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Time Slots */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-gray-900">
                  3. Select Time Slot
                </label>
                {isLoadingSlots && (
                  <span className="text-xs text-brand-600 flex items-center gap-1 font-medium">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2} /> Checking...
                  </span>
                )}
              </div>

              {slots.length === 0 && !isLoadingSlots ? (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center text-xs text-gray-500">
                  No slots available for this date. Please select another date.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-52 overflow-y-auto p-0.5">
                  {slots.map((s) => (
                    <button
                      key={s.startTime}
                      type="button"
                      disabled={!s.isAvailable}
                      onClick={() => setSelectedSlot(s)}
                      className={`py-2.5 px-2 rounded-lg text-xs font-semibold border transition-all duration-fast focus-ring ${
                        !s.isAvailable
                          ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed line-through"
                          : selectedSlot?.startTime === s.startTime
                          ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                          : "bg-white text-gray-800 border-gray-200 hover:border-brand-400 hover:bg-brand-50/30"
                      }`}
                    >
                      {s.startTime}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 4: Patient details */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-bold text-gray-900">
                4. Patient Information
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="patientName" className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-gray-400" strokeWidth={1.75} />
                    </div>
                    <input
                      id="patientName"
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Ramesh Nair"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all duration-fast"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="patientPhone" className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="w-4 h-4 text-gray-400" strokeWidth={1.75} />
                    </div>
                    <input
                      id="patientPhone"
                      type="tel"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="e.g. 9845012345"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all duration-fast"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="patientEmail" className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-gray-400" strokeWidth={1.75} />
                    </div>
                    <input
                      id="patientEmail"
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="For booking confirmation"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all duration-fast"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Reason for Visit <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="reason"
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Fever, Blood pressure check"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all duration-fast"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0" strokeWidth={1.75} />
                <span>Instant confirmation. Pay ₹{selectedDoctor?.consultationFee || 400} at the clinic.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !selectedSlot || !patientName || !patientPhone}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-primary transition-all duration-fast flex items-center justify-center gap-2 btn-press focus-ring"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    Confirm Appointment
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
