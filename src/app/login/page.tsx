"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  CalendarCheck,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
  User,
  Mail,
  Lock,
} from "lucide-react";
import { FormInput } from "@/components/ui/FormInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please verify your credentials.");
      }
      router.push(data.redirectUrl || "/app/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage("");
  };

  const demoAccounts = [
    { email: "owner@aurahealth.in", pass: "Clinic@123", role: "Owner" },
    { email: "admin@clinicflow.in", pass: "Admin@123", role: "Admin" },
    { email: "reception@aurahealth.in", pass: "Clinic@123", role: "Desk" },
    { email: "pharma@aurahealth.in", pass: "Clinic@123", role: "Pharma" },
  ];

  return (
    <AnimatedPage>
      <div className="h-[100dvh] w-full flex flex-col lg:flex-row bg-[#FAF9F6] text-[#182522] overflow-hidden">
        {/* Left Panel — ClinicFlow Brand Experience (Desktop only, 42% width) */}
        <div
          data-animate="fade-right"
          className="hidden lg:flex lg:w-[42%] xl:w-[40%] bg-[#142923] text-white flex-col justify-between p-8 xl:p-10 relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div
            className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#07877F]/20 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#07877F]/15 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#07877F] rounded-lg"
              aria-label="ClinicFlow Home"
            >
              <div className="w-8 h-8 rounded-lg bg-[#07877F] text-white flex items-center justify-center shadow-md shadow-[#07877F]/30 group-hover:bg-[#066E68] transition-colors">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  <path d="M12 5v6m-3-3h6" />
                </svg>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Clinic<span className="text-[#52B1A2]">Flow</span>
              </span>
            </Link>
          </div>

          {/* Compact Left Messaging */}
          <div className="relative z-10 my-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#07877F]/20 text-[#52B1A2] text-[11px] font-semibold border border-[#07877F]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#52B1A2] animate-pulse" />
              Unified Healthcare Workspace
            </div>

            <h1 className="text-2xl xl:text-3xl font-extrabold text-white leading-tight tracking-tight">
              Better care starts with better connections.
            </h1>

            <p className="text-xs xl:text-sm text-[#C8D2CE] leading-relaxed">
              Discover trusted clinics, manage appointments, and streamline patient flow for Indian medical practices.
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#07877F]/25 text-[#52B1A2] flex items-center justify-center flex-shrink-0 border border-[#07877F]/30">
                  <Compass className="w-3.5 h-3.5" strokeWidth={2} />
                </div>
                <div className="text-xs">
                  <strong className="text-white font-semibold block">Find nearby healthcare providers</strong>
                  <span className="text-[#849B93]">Verified specialties and consultation fees.</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#07877F]/25 text-[#52B1A2] flex items-center justify-center flex-shrink-0 border border-[#07877F]/30">
                  <CalendarCheck className="w-3.5 h-3.5" strokeWidth={2} />
                </div>
                <div className="text-xs">
                  <strong className="text-white font-semibold block">Live queue & token management</strong>
                  <span className="text-[#849B93]">Real-time token calls and instant updates.</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#07877F]/25 text-[#52B1A2] flex items-center justify-center flex-shrink-0 border border-[#07877F]/30">
                  <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2} />
                </div>
                <div className="text-xs">
                  <strong className="text-white font-semibold block">Digital billing & prescriptions</strong>
                  <span className="text-[#849B93]">Encrypted HIPAA/ABDM-compatible records.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Left Footer */}
          <div className="relative z-10 pt-4 border-t border-[#2B3C38] text-[11px] text-[#849B93] flex items-center justify-between">
            <span>© 2026 ClinicFlow Inc.</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-[#52B1A2]" />
              <span>Encrypted Transit</span>
            </div>
          </div>
        </div>

        {/* Right Panel — Compact, Non-Scrolling Login View */}
        <div
          data-animate="fade-left"
          className="flex-1 flex flex-col justify-between p-5 sm:p-7 lg:p-10 xl:p-12 h-full overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            {/* Mobile logo on top */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#07877F] text-white flex items-center justify-center shadow-sm">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    <path d="M12 5v6m-3-3h6" />
                  </svg>
                </div>
                <span className="font-extrabold text-base tracking-tight text-[#182522]">
                  Clinic<span className="text-[#07877F]">Flow</span>
                </span>
              </Link>
            </div>

            <Link
              href="/"
              className="hidden lg:inline-flex text-xs font-semibold text-[#5F6D68] hover:text-[#07877F] transition-colors items-center gap-1"
            >
              ← Back to Home
            </Link>

            <Link
              href="/register-clinic"
              className="text-xs font-bold text-[#07877F] hover:text-[#066E68] hover:underline transition-colors"
            >
              Register Clinic
            </Link>
          </div>

          {/* Centered Compact Form (fits 100% inside viewport) */}
          <div className="max-w-[400px] w-full mx-auto my-auto space-y-4 py-2">
            {/* Title */}
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#07877F] bg-[#EAF4F0] px-2 py-0.5 rounded inline-block">
                Portal Sign In
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#182522] tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs text-[#5F6D68]">
                Sign in to continue to your ClinicFlow workspace.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                role="alert"
                className="p-2.5 rounded-lg bg-[#FDF2F2] border border-[#B42318]/30 text-[#B42318] text-xs font-medium flex items-center gap-2 animate-fadeIn"
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
                <span className="truncate">{errorMessage}</span>
              </div>
            )}

            {/* Compact Quick-Fill Row */}
            <div className="bg-white p-2.5 rounded-xl border border-[#C8D2CE] space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#182522]">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-[#07877F]" />
                  Quick-Fill Demo:
                </span>
                <span className="text-[10px] text-[#5F6D68] font-normal">Click to fill</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleQuickDemoLogin(acc.email, acc.pass)}
                    className="py-1 px-1 rounded-md border border-[#C8D2CE] bg-[#FAF9F6] hover:bg-[#EAF4F0] hover:border-[#07877F] text-center text-[10px] font-bold text-[#182522] transition-colors"
                  >
                    {acc.role}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-[#182522] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F6D68]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@clinic.in"
                    className="w-full h-11 pl-9 pr-3 text-sm bg-white border border-[#C8D2CE] hover:border-[#849B93] focus:border-[#07877F] focus:outline-none focus:ring-2 focus:ring-[#07877F]/15 rounded-xl transition-colors text-[#182522]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="text-xs font-semibold text-[#182522]">

                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      alert("Password reset instructions will be sent to your verified clinic email.")
                    }
                    className="text-[11px] font-semibold text-[#5F6D68] hover:text-[#07877F] transition-colors"
                  >
                    Forgot?
                  </button>
                </div>
                <PasswordInput
                  id="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="h-11 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-[#07877F] hover:bg-[#066E68] text-white font-bold text-sm transition-all duration-150 shadow-sm flex items-center justify-center gap-2 mt-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#07877F] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                  </>
                )}
              </button>
            </form>

            {/* Registration Callout */}
            <div className="pt-2 text-center text-xs text-[#5F6D68]">
              <span>Need a clinic workspace? </span>
              <Link
                href="/register-clinic"
                className="font-bold text-[#07877F] hover:text-[#066E68] hover:underline transition-colors"
              >
                Register Clinic
              </Link>
            </div>
          </div>

          {/* Bottom security strip */}
          <div className="text-center text-[11px] text-[#5F6D68] flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#07877F]" strokeWidth={1.8} />
            <span>Encrypted HIPAA/ABDM-compatible session</span>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
