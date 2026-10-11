"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import { 
  Building2, 
  User, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  Mail,
  Phone,
  Lock,
  MapPin,
  IndianRupee,
  Layers,
  HeartPulse
} from "lucide-react";

export default function RegisterClinicPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form Fields
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [clinicName, setClinicName] = useState("");
  const [clinicType, setClinicType] = useState("Polyclinic & Family Practice");
  const [city, setCity] = useState("Kochi");
  const [state, setState] = useState("Kerala");
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");

  const [consultationFee, setConsultationFee] = useState(400);
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(15);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");

      const res = await fetch("/api/auth/register-clinic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerName,
          email,
          phone,
          password,
          clinicName,
          clinicType,
          city,
          state,
          address,
          pinCode,
          consultationFee: Number(consultationFee),
          slotDurationMinutes: Number(slotDurationMinutes),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register clinic");
      }

      router.push(data.redirectUrl || "/app/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#182522]">
      <PublicNavbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-xl border border-[#E5E5DF] shadow-[0_1px_3px_rgba(24,37,34,0.03)] overflow-hidden transition-colors">
          
          {/* Header */}
          <div className="p-7 sm:p-8 bg-[#182522] text-white border-b border-[#2C3D39]">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#087F78]/20 text-[#52B1A2] text-[11px] font-semibold uppercase tracking-wider border border-[#087F78]/40">
                <span>14-Day Free Trial</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Register Your Clinic
              </h1>
              <p className="text-xs text-[#E9F1EB]/75 max-w-md leading-relaxed">
                Set up your public booking profile, live queue engine, and billing ledger in under 3 minutes.
              </p>

              {/* Stepper Progress */}
              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-[#2C3D39] text-xs font-semibold">
                <div className={`flex items-center gap-2 ${step >= 1 ? "text-[#52B1A2]" : "text-[#66736F]"}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                    step >= 1 ? "bg-[#087F78] text-white" : "bg-[#2C3D39] text-[#66736F]"
                  }`}>
                    {step > 1 ? "✓" : "1"}
                  </span>
                  <span>Owner</span>
                </div>

                <div className={`flex items-center gap-2 ${step >= 2 ? "text-[#52B1A2]" : "text-[#66736F]"}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                    step >= 2 ? "bg-[#087F78] text-white" : "bg-[#2C3D39] text-[#66736F]"
                  }`}>
                    {step > 2 ? "✓" : "2"}
                  </span>
                  <span>Profile</span>
                </div>

                <div className={`flex items-center gap-2 ${step >= 3 ? "text-[#52B1A2]" : "text-[#66736F]"}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                    step >= 3 ? "bg-[#087F78] text-white" : "bg-[#2C3D39] text-[#66736F]"
                  }`}>
                    3
                  </span>
                  <span>Operations</span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="m-6 sm:m-8 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form 
            onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }} 
            className="p-6 sm:p-10 space-y-6"
          >
            {/* Step 1: Owner Details */}
            {step === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-600" />
                    Doctor or Clinic Administrator Details
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">This person will hold primary owner permissions for the clinic account.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Menon"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="doctor@clinic.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mobile Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="9895012345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Account Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Clinic Information */}
            {step === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-teal-600" />
                    Clinic Location & Practice Details
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">This information will be displayed on your public booking profile.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Clinic Name *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aura Health Polyclinic"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Clinic Practice Type
                  </label>
                  <select
                    value={clinicType}
                    onChange={(e) => setClinicType(e.target.value)}
                    className="w-full px-3.5 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 bg-white"
                  >
                    <option value="Polyclinic & Family Practice">Polyclinic & Family Practice</option>
                    <option value="General Practice Clinic">General Practice Clinic</option>
                    <option value="Specialty Medical Centre">Specialty Medical Centre</option>
                    <option value="Dental Clinic">Dental Clinic</option>
                    <option value="Pediatric Care Centre">Pediatric Care Centre</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kochi"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="682031"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full px-3.5 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Physical Street Address *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Street, Landmark, Locality"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Operational Settings */}
            {step === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600" />
                    Operational Settings & Consultation Fees
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Configure default consultation settings. You can fine-tune individual doctor timings later.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Default Consultation Fee (₹)
                    </label>
                    <div className="relative">
                      <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        required
                        min={0}
                        value={consultationFee}
                        onChange={(e) => setConsultationFee(Number(e.target.value))}
                        className="w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Slot Duration (Minutes)
                    </label>
                    <select
                      value={slotDurationMinutes}
                      onChange={(e) => setSlotDurationMinutes(Number(e.target.value))}
                      className="w-full px-3.5 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 bg-white"
                    >
                      <option value={10}>10 minutes</option>
                      <option value={15}>15 minutes (Standard)</option>
                      <option value={20}>20 minutes</option>
                      <option value={30}>30 minutes</option>
                    </select>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-900 text-xs leading-relaxed space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-teal-950">
                    <HeartPulse className="w-4 h-4 text-teal-600" />
                    <span>Instant Workspace Activation</span>
                  </div>
                  <p className="text-teal-800">
                    Upon completing registration, your clinic management workspace and public booking URL (<code className="bg-white/80 px-1.5 py-0.5 rounded font-mono text-teal-900 font-semibold">/clinics/[your-slug]</code>) will be created immediately.
                  </p>
                </div>
              </div>
            )}

            {/* Step Navigation Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Already have an account? Sign in &rarr;
                </Link>
              )}

              {step < 3 ? (
                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm shadow-teal-600/20 hover:shadow-md transition flex items-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/25 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Workspace...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
