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
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-primary">
              <HeartPulse className="w-6 h-6" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Sign in to ClinicFlow
            </h1>
            <p className="text-sm text-gray-500">
              Access your clinic dashboard or super-admin portal
            </p>
          </div>

          {/* Demo credentials */}
          <div className="bg-brand-50/40 p-4 rounded-2xl border border-brand-200/60 space-y-3">
            <p className="text-xs font-semibold text-brand-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-600" strokeWidth={2} />
              Demo Quick-Fill:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickDemoLogin(acc.email, acc.pass)}
                  className={`p-2.5 rounded-lg border text-left text-[11px] font-medium transition-all duration-fast focus-ring ${
                    acc.primary
                      ? "border-brand-200 bg-white hover:bg-brand-50 text-gray-700"
                      : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <strong className="block text-gray-900 text-xs">{acc.role}</strong>
                  <span className="text-gray-500">{acc.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Login form */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-card">
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-gray-400" strokeWidth={1.75} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@clinic.in"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all duration-fast"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-400" strokeWidth={1.75} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all duration-fast"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-sm transition-all duration-fast shadow-primary flex items-center justify-center gap-2 mt-2 btn-press focus-ring"
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

            <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
              New clinic owner?{" "}
              <Link href="/register-clinic" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                Register Your Clinic
              </Link>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
            Secure authentication · Data encrypted in transit
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
