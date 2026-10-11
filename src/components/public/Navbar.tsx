"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  CalendarDays,
  Building2,
  Stethoscope,
  Menu,
  X,
  CreditCard,
  ArrowRight,
} from "lucide-react";

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change or ESC key
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/search", label: "Find Clinics", icon: Search },
    { href: "/search", label: "Specialties", icon: Stethoscope },
    { href: "/my-appointments", label: "My Appointments", icon: CalendarDays },
    { href: "/for-clinics", label: "For Clinics", icon: Building2 },
    { href: "/pricing", label: "Pricing", icon: CreditCard },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
          scrolled
            ? "bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E5E9E5] shadow-[0_1px_3px_rgba(24,37,34,0.03)]"
            : "bg-[#FAF9F6] border-b border-[#E5E9E5]"
        }`}
      >
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between">
          {/* Brand Mark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#07877F] focus-visible:ring-offset-2 rounded-md"
            aria-label="ClinicFlow Home"
          >
            <div className="w-9 h-9 rounded-lg bg-[#07877F] flex items-center justify-center text-white transition-all group-hover:shadow-[0_2px_8px_rgba(7,135,127,0.35)]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                {/* Heart outline */}
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="rgba(255,255,255,0.2)"
                  stroke="white"
                  strokeWidth="1.5"
                />
                {/* Medical cross inside */}
                <rect x="10.5" y="7" width="3" height="9" rx="0.75" fill="white" />
                <rect x="8" y="9.5" width="8" height="3" rx="0.75" fill="white" />
              </svg>
            </div>
            <span className="text-[17px] tracking-[-0.015em] font-bold text-[#182522]">
              Clinic<span className="font-semibold text-[#07877F]">Flow</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1 text-[13.5px] font-medium text-[#5F6D68]"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#07877F] ${
                    isActive
                      ? "text-[#182522] font-semibold bg-[#EAF4F0]"
                      : "text-[#5F6D68] hover:text-[#182522] hover:bg-[#EAF4F0]/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Account Actions */}
          <div className="hidden lg:flex items-center gap-2.5">
            <Link
              href="/login"
              className="text-[13px] font-medium text-[#182522] hover:text-[#07877F] px-3 py-1.5 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#07877F]"
            >
              Sign In
            </Link>
            <span className="w-px h-4 bg-[#E5E9E5]" aria-hidden="true" />
            <Link
              href="/register-clinic"
              className="text-[13px] font-semibold text-[#182522] bg-white border border-[#C8D2CE] hover:border-[#07877F] hover:bg-[#EAF4F0] px-3.5 py-1.5 rounded-md transition-all shadow-[0_1px_2px_rgba(24,37,34,0.04)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#07877F] active:translate-y-[0.5px]"
            >
              Register Clinic
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-[#182522] hover:text-[#07877F] rounded-md hover:bg-[#EAF4F0]/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#07877F]"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-[#182522]/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="fixed inset-y-0 right-0 max-w-[320px] w-full bg-[#FAF9F6] border-l border-[#E5E9E5] shadow-xl flex flex-col justify-between p-6 z-10 animate-fade-in">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E9E5]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#07877F] flex items-center justify-center text-white">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        fill="rgba(255,255,255,0.2)"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                      <rect x="10.5" y="7" width="3" height="9" rx="0.75" fill="white" />
                      <rect x="8" y="9.5" width="8" height="3" rx="0.75" fill="white" />
                    </svg>
                  </div>
                  <span className="text-[16px] font-bold text-[#182522]">
                    Clinic<span className="text-[#07877F]">Flow</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#5F6D68] hover:text-[#182522] rounded-md hover:bg-[#EAF4F0] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#07877F]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" strokeWidth={1.75} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1" aria-label="Mobile menu navigation">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[#EAF4F0] text-[#07877F] font-semibold"
                          : "text-[#5F6D68] hover:text-[#182522] hover:bg-[#EAF4F0]/50"
                      }`}
                    >
                      <link.icon className="w-4 h-4 text-[#5F6D68]" strokeWidth={1.75} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Account Actions in Drawer */}
            <div className="pt-6 border-t border-[#E5E9E5] space-y-2.5">
              <Link
                href="/login"
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-md text-sm font-medium text-[#182522] bg-white border border-[#C8D2CE] hover:bg-[#FAF9F6] transition-colors text-center"
              >
                Sign In
              </Link>
              <Link
                href="/register-clinic"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-[#07877F] hover:bg-[#066E68] transition-colors shadow-sm text-center"
              >
                <span>Register Clinic</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
              <p className="text-[11px] text-[#5F6D68] text-center pt-2">
                Healthcare practices across India
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
