"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import {
  HeartPulse,
  LogIn,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
  User,
  Lock,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
        throw new Error(data.error || "Authentication failed");
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
  };

  const demoAccounts = [
    { email: "owner@aurahealth.in", pass: "Clinic@123", role: "Clinic Owner", desc: "Aura Health (Kochi)", primary: true },
    { email: "admin@clinicflow.in", pass: "Admin@123", role: "Super-Admin", desc: "Platform Owner", primary: true },
    { email: "reception@aurahealth.in", pass: "Clinic@123", role: "Receptionist", desc: "Token Queue", primary: false },
    { email: "pharma@aurahealth.in", pass: "Clinic@123", role: "Pharmacist", desc: "Batches & POS", primary: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#182522]">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-6">
          {/* Header */}
          <div className="text-center space-y-2.5">
            <div className="w-10 h-10 rounded-md bg-[#087F78] text-white flex items-center justify-center mx-auto shadow-sm">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2v20M2 12h20" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#182522] tracking-tight">
              Sign in to ClinicFlow
            </h1>
            <p className="text-xs text-[#66736F]">
              Access your clinic workspace or administrative console
            </p>
          </div>

          {/* Demo credentials */}
          <div className="bg-[#E9F1EB] p-4 rounded-xl border border-[#E5E5DF] space-y-2.5">
            <p className="text-xs font-semibold text-[#182522] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#087F78]" strokeWidth={2} />
              Demo Quick-Fill Accounts:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickDemoLogin(acc.email, acc.pass)}
                  className="p-2.5 rounded-lg border border-[#E5E5DF] bg-white hover:bg-[#FAF9F5] text-left text-[11px] font-medium transition-colors text-[#182522]"
                >
                  <strong className="block text-[#182522] text-xs font-semibold">{acc.role}</strong>
                  <span className="text-[#66736F]">{acc.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Login form */}
          <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E5E5DF] shadow-[0_1px_3px_rgba(24,37,34,0.03)]">
            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-[#182522] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-[#66736F]" strokeWidth={1.75} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@clinic.in"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border border-[#E5E5DF] bg-[#FAF9F5] text-[#182522] placeholder:text-[#66736F]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F78]/20 focus:border-[#087F78] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-[#182522] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-[#66736F]" strokeWidth={1.75} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border border-[#E5E5DF] bg-[#FAF9F5] text-[#182522] placeholder:text-[#66736F]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F78]/20 focus:border-[#087F78] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-[#087F78] hover:bg-[#066761] disabled:opacity-50 text-white font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 mt-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#087F78]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#E5E5DF]/70 text-center text-xs text-[#66736F]">
              New clinic practice?{" "}
              <Link href="/register-clinic" className="font-semibold text-[#087F78] hover:underline transition-colors">
                Register Your Clinic
              </Link>
            </div>
          </div>

          <div className="text-center text-xs text-[#66736F] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#087F78]" strokeWidth={1.75} />
            <span>Secure multi-tenant authentication · Encrypted in transit</span>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
