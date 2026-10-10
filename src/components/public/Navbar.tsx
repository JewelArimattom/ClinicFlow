"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  CalendarDays,
  LogIn,
  PlusCircle,
  Menu,
  X,
  HeartPulse,
  Building2,
  ChevronRight,
} from "lucide-react";

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/search", label: "Find Clinics", icon: Search },
    { href: "/search", label: "Specialties", icon: HeartPulse, query: "?specialty=" },
    { href: "/my-appointments", label: "My Appointments", icon: CalendarDays },
    { href: "/for-clinics", label: "For Clinics", icon: Building2 },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-normal ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-200/80 shadow-xs"
          : "bg-white border-b border-transparent"
      }`}
    >
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-ring rounded-lg"
          aria-label="ClinicFlow Home"
        >
          <div className="w-9 h-9 rounded-[10px] bg-brand-600 flex items-center justify-center text-white shadow-sm group-hover:bg-brand-700 transition-colors duration-fast">
            <HeartPulse className="w-[18px] h-[18px]" strokeWidth={2.25} />
          </div>
          <span className="text-[1.15rem] tracking-tight font-bold text-gray-900">
            Clinic<span className="text-brand-600">Flow</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 text-[13px] font-medium text-gray-600" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.query ? link.href + link.query : link.href}
                className={`px-3 py-2 rounded-lg transition-colors duration-fast focus-ring ${
                  isActive
                    ? "text-brand-700 bg-brand-50"
                    : "hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/login"
            className="text-[13px] font-semibold text-gray-700 hover:text-gray-900 px-3.5 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-fast focus-ring flex items-center gap-1.5"
          >
            <LogIn className="w-4 h-4 text-gray-400" strokeWidth={1.75} />
            Sign In
          </Link>
          <Link
            href="/register-clinic"
            className="text-[13px] font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-lg shadow-sm transition-all duration-fast focus-ring flex items-center gap-1.5 btn-press"
          >
            <PlusCircle className="w-4 h-4" strokeWidth={1.75} />
            Register Clinic
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors focus-ring"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" strokeWidth={1.75} />
          ) : (
            <Menu className="w-5 h-5" strokeWidth={1.75} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 animate-fade-in">
          <nav className="max-w-container mx-auto px-4 pb-4 pt-1 space-y-0.5" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.query ? link.href + link.query : link.href}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-brand-700 bg-brand-50"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {link.icon && <link.icon className="w-4 h-4 text-gray-400" strokeWidth={1.75} />}
                    {link.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300" strokeWidth={1.75} />
                </Link>
              );
            })}

            <div className="pt-3 mt-2 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href="/login"
                className="text-center font-medium text-gray-700 py-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register-clinic"
                className="text-center font-semibold text-white bg-brand-600 hover:bg-brand-700 py-2.5 rounded-lg shadow-sm text-sm transition-colors btn-press"
              >
                Register Your Clinic
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
