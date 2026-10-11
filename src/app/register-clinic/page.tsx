"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import {
  User,
  Building2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Mail,
  Phone,
  Lock,
  MapPin,
  IndianRupee,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { FormInput } from "@/components/ui/FormInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { FormSelect } from "@/components/ui/FormSelect";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { FormSection } from "@/components/ui/FormSection";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export default function RegisterClinicPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form Fields — Step 1: Owner Details
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Form Fields — Step 2: Clinic Profile
  const [clinicName, setClinicName] = useState("");
  const [clinicType, setClinicType] = useState("Polyclinic & Family Practice");
  const [city, setCity] = useState("Kochi");
  const [state, setState] = useState("Kerala");
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");

  // Form Fields — Step 3: Operations
  const [consultationFee, setConsultationFee] = useState<number | string>(400);
  const [slotDurationMinutes, setSlotDurationMinutes] = useState<number>(15);

  // Validation errors per step
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const stepsList = [
    { id: 1, label: "Owner Details", description: "Admin account" },
    { id: 2, label: "Clinic Profile", description: "Practice & location" },
    { id: 3, label: "Operations", description: "Consultation & fees" },
  ];

  // Client-side step validation
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!ownerName.trim()) {
        newErrors.ownerName = "Full name is required";
      }
      if (!email.trim()) {
        newErrors.email = "Work email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!phone.trim()) {
        newErrors.phone = "Mobile number is required";
      } else if (phone.replace(/\D/g, "").length < 10) {
        newErrors.phone = "Enter a valid 10-digit mobile number";
      }
      if (!password) {
        newErrors.password = "Password is required";
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
      }
    } else if (currentStep === 2) {
      if (!clinicName.trim()) {
        newErrors.clinicName = "Clinic name is required";
      }
      if (!city.trim()) {
        newErrors.city = "City is required";
      }
      if (!state.trim()) {
        newErrors.state = "State is required";
      }
      if (!address.trim()) {
        newErrors.address = "Street address is required";
      }
      if (!pinCode.trim()) {
        newErrors.pinCode = "PIN code is required";
      } else if (!/^\d{6}$/.test(pinCode.trim())) {
        newErrors.pinCode = "Enter a valid 6-digit postal PIN code";
      }
    } else if (currentStep === 3) {
      if (consultationFee === "" || Number(consultationFee) < 0) {
        newErrors.consultationFee = "Please specify a valid consultation fee";
      }
      if (!slotDurationMinutes || slotDurationMinutes <= 0) {
        newErrors.slotDurationMinutes = "Please choose a valid slot duration";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3));
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setServerError("");
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    try {
      setIsLoading(true);
      setServerError("");

      const res = await fetch("/api/auth/register-clinic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerName: ownerName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          clinicName: clinicName.trim(),
          clinicType,
          city: city.trim(),
          state: state.trim(),
          address: address.trim(),
          pinCode: pinCode.trim(),
          consultationFee: Number(consultationFee),
          slotDurationMinutes: Number(slotDurationMinutes),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register clinic. Please check your information.");
      }

      setRegistrationSuccess(true);
      setTimeout(() => {
        router.push(data.redirectUrl || "/app/dashboard");
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setServerError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#182522]">
        <PublicNavbar />

        <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Header Banner */}
          <div data-animate="fade-down" className="text-center max-w-xl mx-auto space-y-2.5 mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF4F0] text-[#07877F] text-xs font-bold border border-[#C8D2CE]/60">
              <Sparkles className="w-3.5 h-3.5 text-[#07877F]" />
              <span>Practice Onboarding</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#182522] tracking-tight">
              Bring your clinic to ClinicFlow.
            </h1>
            <p className="text-sm text-[#5F6D68] leading-relaxed">
              Set up your clinic profile and appointment preferences in a few simple steps.
            </p>
          </div>

          {/* Stepper Card */}
          <div
            data-animate="fade-up"
            className="bg-white rounded-2xl border border-[#C8D2CE] p-5 sm:p-7 shadow-sm mb-6"
          >
            <StepIndicator
              steps={stepsList}
              currentStep={step}
              onStepClick={(id) => {
                if (id < step) {
                  setStep(id);
                  setErrors({});
                }
              }}
            />
          </div>

          {/* Form Container */}
          <div
            data-animate="fade-up"
            className="bg-white rounded-2xl border border-[#C8D2CE] shadow-[0_2px_8px_rgba(24,37,34,0.04)] overflow-hidden transition-all duration-200"
          >
            {/* Server Error Alert */}
            {serverError && (
              <div
                role="alert"
                className="m-6 sm:m-8 p-4 rounded-xl bg-[#FDF2F2] border border-[#B42318]/30 text-[#B42318] text-xs font-semibold flex items-start gap-3 animate-fadeIn"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">{serverError}</div>
              </div>
            )}

            {/* Success Notification Alert */}
            {registrationSuccess && (
              <div
                role="status"
                className="m-6 sm:m-8 p-4 rounded-xl bg-[#EDF7F2] border border-[#087443]/30 text-[#087443] text-xs font-semibold flex items-center gap-3 animate-fadeIn"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <div>
                  Registration successful! Preparing your clinic dashboard workspace...
                </div>
              </div>
            )}

            <form
              onSubmit={step === 3 ? handleSubmit : handleNextStep}
              noValidate
              className="p-6 sm:p-9 space-y-6"
            >
              {/* STEP 1: Owner Details */}
              {step === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <FormSection
                    title="Who will manage this clinic?"
                    description="Create the primary administrator account for your clinic practice."
                    icon={<User className="w-4 h-4" />}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <FormInput
                          label="Full Name"
                          id="ownerName"
                          name="ownerName"
                          required
                          value={ownerName}
                          onChange={(e) => {
                            setOwnerName(e.target.value);
                            if (errors.ownerName) setErrors((prev) => ({ ...prev, ownerName: "" }));
                          }}
                          placeholder="Dr. Rajesh Menon"
                          error={errors.ownerName}
                          helperText="This name will appear on the practice administrative dashboard."
                          icon={<User className="w-4 h-4" strokeWidth={1.8} />}
                        />
                      </div>

                      <FormInput
                        label="Work Email"
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        placeholder="doctor@clinic.in"
                        error={errors.email}
                        helperText="Used for clinic authentication and ledger reports."
                        icon={<Mail className="w-4 h-4" strokeWidth={1.8} />}
                      />

                      <FormInput
                        label="Mobile Number"
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                        }}
                        placeholder="9895012345"
                        error={errors.phone}
                        helperText="For security verification & OTP notifications."
                        icon={<Phone className="w-4 h-4" strokeWidth={1.8} />}
                      />

                      <div className="sm:col-span-2">
                        <PasswordInput
                          label="Account Password"
                          id="password"
                          name="password"
                          required
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                          }}
                          placeholder="Create a secure password"
                          error={errors.password}
                          helperText="Must be at least 6 characters with a combination of letters and numbers."
                        />
                      </div>
                    </div>
                  </FormSection>
                </div>
              )}

              {/* STEP 2: Clinic Profile */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <FormSection
                    title="Clinic Information"
                    description="Tell us about your medical center or specialized practice."
                    icon={<Building2 className="w-4 h-4" />}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <FormInput
                          label="Clinic Name"
                          id="clinicName"
                          name="clinicName"
                          required
                          value={clinicName}
                          onChange={(e) => {
                            setClinicName(e.target.value);
                            if (errors.clinicName) setErrors((prev) => ({ ...prev, clinicName: "" }));
                          }}
                          placeholder="e.g. Aura Health Polyclinic & Diagnostic Centre"
                          error={errors.clinicName}
                          helperText="Your official clinic title displayed on public booking pages."
                          icon={<Building2 className="w-4 h-4" strokeWidth={1.8} />}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <FormSelect
                          label="Clinic Practice Type"
                          id="clinicType"
                          name="clinicType"
                          value={clinicType}
                          onChange={(e) => setClinicType(e.target.value)}
                          options={[
                            { value: "Polyclinic & Family Practice", label: "Polyclinic & Family Practice" },
                            { value: "General Practice Clinic", label: "General Practice Clinic" },
                            { value: "Specialty Medical Centre", label: "Specialty Medical Centre" },
                            { value: "Dental Clinic", label: "Dental Clinic" },
                            { value: "Pediatric Care Centre", label: "Pediatric Care Centre" },
                            { value: "Cardiology & Heart Care", label: "Cardiology & Heart Care" },
                            { value: "Orthopedic & Sports Medicine", label: "Orthopedic & Sports Medicine" },
                            { value: "Dermatology & Cosmetology", label: "Dermatology & Cosmetology" },
                          ]}
                        />
                      </div>
                    </div>
                  </FormSection>

                  <FormSection
                    title="Location Details"
                    description="Physical clinic address where patients will attend appointments."
                    icon={<MapPin className="w-4 h-4" />}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <FormInput
                          label="Physical Street Address"
                          id="address"
                          name="address"
                          required
                          value={address}
                          onChange={(e) => {
                            setAddress(e.target.value);
                            if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
                          }}
                          placeholder="Building, Landmark, Street Name"
                          error={errors.address}
                          icon={<MapPin className="w-4 h-4" strokeWidth={1.8} />}
                        />
                      </div>

                      <FormInput
                        label="City"
                        id="city"
                        name="city"
                        required
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
                        }}
                        placeholder="Kochi"
                        error={errors.city}
                      />

                      <FormInput
                        label="State / Province"
                        id="state"
                        name="state"
                        required
                        value={state}
                        onChange={(e) => {
                          setState(e.target.value);
                          if (errors.state) setErrors((prev) => ({ ...prev, state: "" }));
                        }}
                        placeholder="Kerala"
                        error={errors.state}
                      />

                      <div className="sm:col-span-2">
                        <FormInput
                          label="Postal PIN Code"
                          id="pinCode"
                          name="pinCode"
                          required
                          maxLength={6}
                          value={pinCode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setPinCode(val);
                            if (errors.pinCode) setErrors((prev) => ({ ...prev, pinCode: "" }));
                          }}
                          placeholder="682031"
                          error={errors.pinCode}
                          helperText="6-digit Indian Postal Code for accurate geo-location matching."
                        />
                      </div>
                    </div>
                  </FormSection>
                </div>
              )}

              {/* STEP 3: Operational Settings */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <FormSection
                    title="Set up your clinic operations."
                    description="Configure baseline consultation parameters. Individual doctor slots and timings can be configured anytime later."
                    icon={<Clock className="w-4 h-4" />}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Default Consultation Fee (₹)"
                        id="consultationFee"
                        name="consultationFee"
                        type="number"
                        min={0}
                        required
                        value={consultationFee}
                        onChange={(e) => {
                          setConsultationFee(e.target.value);
                          if (errors.consultationFee)
                            setErrors((prev) => ({ ...prev, consultationFee: "" }));
                        }}
                        placeholder="400"
                        error={errors.consultationFee}
                        helperText="Base doctor fee shown on your public booking profile."
                        icon={<IndianRupee className="w-4 h-4" strokeWidth={1.8} />}
                      />

                      <FormSelect
                        label="Default Slot Duration"
                        id="slotDurationMinutes"
                        name="slotDurationMinutes"
                        value={slotDurationMinutes}
                        onChange={(e) => setSlotDurationMinutes(Number(e.target.value))}
                        helperText="Standard consultation window for booking slots."
                        options={[
                          { value: 10, label: "10 minutes (Express follow-up)" },
                          { value: 15, label: "15 minutes (Standard OPD)" },
                          { value: 20, label: "20 minutes (Comprehensive)" },
                          { value: 30, label: "30 minutes (Specialized consultation)" },
                          { value: 45, label: "45 minutes (Dental / Minor procedure)" },
                        ]}
                      />
                    </div>

                    {/* Instant Setup Information Box */}
                    <div className="mt-4 p-4 sm:p-5 rounded-xl bg-[#EAF4F0] border border-[#C8D2CE] text-[#142923] text-xs leading-relaxed space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-[#07877F]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Instant Workspace & Public URL Generation</span>
                      </div>
                      <p className="text-[#5F6D68]">
                        Upon completing registration, your clinic management workspace and dedicated public booking URL (
                        <code className="bg-white px-2 py-0.5 rounded font-mono text-[#07877F] border border-[#C8D2CE]">
                          /clinics/[your-clinic-slug]
                        </code>
                        ) will be activated immediately with real-time token calling and queue capabilities.
                      </p>
                    </div>
                  </FormSection>
                </div>
              )}

              {/* Step Navigation Controls */}
              <div className="pt-6 border-t border-[#E5E9E5] flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isLoading}
                    className="h-11 sm:h-12 px-5 sm:px-6 rounded-[11px] border border-[#C8D2CE] bg-white text-xs sm:text-sm font-bold text-[#182522] hover:bg-[#FAF9F6] hover:border-[#849B93] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#07877F] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="text-xs sm:text-sm text-[#5F6D68] hover:text-[#07877F] font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>Already registered? Sign in</span>
                  </Link>
                )}

                {step < 3 ? (
                  <button
                    type="submit"
                    className="h-11 sm:h-12 px-7 sm:px-8 rounded-[11px] bg-[#07877F] hover:bg-[#066E68] text-white text-xs sm:text-sm font-bold shadow-sm shadow-[#07877F]/20 hover:shadow-md transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-3 focus-visible:ring-[#07877F]/30"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading || registrationSuccess}
                    className="h-11 sm:h-12 px-8 sm:px-9 rounded-[11px] bg-[#07877F] hover:bg-[#066E68] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#07877F]/25 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-3 focus-visible:ring-[#07877F]/30"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Clinic Workspace...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Bottom Security Note */}
          <div className="mt-8 text-center text-xs text-[#5F6D68] flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#07877F]" />
            <span>256-bit encrypted SSL connection · HIPAA & ABDM Compliant Architecture</span>
          </div>
        </main>

        <PublicFooter />
      </div>
    </AnimatedPage>
  );
}
