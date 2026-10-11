import Link from "next/link";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#182522] text-[#EAF4F0] text-xs sm:text-sm border-t border-[#2C3D39]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
          {/* Column 1: Brand & Identity (Full width on mobile, 4 cols on desktop) */}
          <div className="col-span-2 lg:col-span-4 space-y-2.5 sm:space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#07877F] rounded-md"
              aria-label="ClinicFlow Home"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#07877F] flex items-center justify-center text-white shadow-sm">
                <svg
                  width="16"
                  height="16"
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
              <span className="text-[16px] sm:text-[17px] tracking-[-0.015em] font-bold text-white">
                Clinic<span className="text-[#07877F] font-semibold">Flow</span>
              </span>
            </Link>

            <p className="text-[#EAF4F0]/70 text-xs leading-relaxed max-w-sm">
              Connecting patients with verified neighborhood clinics & providing intuitive operations software for Indian medical practices.
            </p>

            <p className="hidden sm:block text-[11px] text-[#EAF4F0]/40">
              Practices active in Kochi · Bengaluru · Chennai · Mumbai
            </p>
          </div>

          {/* Column 2: Patient Navigation */}
          <div className="col-span-1 lg:col-span-3">
            <p className="font-bold text-white mb-2 text-[11px] sm:text-[12px] uppercase tracking-wider">
              For Patients
            </p>
            <ul className="space-y-1.5 text-xs sm:text-[13px]">
              <li>
                <Link
                  href="/search"
                  className="text-[#EAF4F0]/70 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Find Clinics
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-[#EAF4F0]/70 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Specialties
                </Link>
              </li>
              <li>
                <Link
                  href="/my-appointments"
                  className="text-[#EAF4F0]/70 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  My Appointments
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#EAF4F0]/70 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Booking Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Clinic Owners */}
          <div className="col-span-1 lg:col-span-3">
            <p className="font-bold text-white mb-2 text-[11px] sm:text-[12px] uppercase tracking-wider">
              For Clinics
            </p>
            <ul className="space-y-1.5 text-xs sm:text-[13px]">
              <li>
                <Link
                  href="/register-clinic"
                  className="text-[#52B1A2] hover:text-[#92CEC3] font-semibold transition-colors duration-150 inline-block py-0.5"
                >
                  Register Clinic
                </Link>
              </li>
              <li>
                <Link
                  href="/for-clinics"
                  className="text-[#EAF4F0]/70 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Practice Platform
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-[#EAF4F0]/70 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-[#EAF4F0]/70 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Portal Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Standards (Desktop only, or compact bar) */}
          <div className="hidden lg:block lg:col-span-2">
            <p className="font-bold text-white mb-2 text-[11px] sm:text-[12px] uppercase tracking-wider">
              Information
            </p>
            <ul className="space-y-1.5 text-xs sm:text-[13px]">
              <li>
                <Link
                  href="/privacy"
                  className="text-[#EAF4F0]/70 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-[#EAF4F0]/70 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="text-[#EAF4F0]/70 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Accessibility
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#EAF4F0]/70 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Compact Bottom Bar */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-[#2C3D39] flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-[12px] text-[#EAF4F0]/50 gap-2 sm:gap-4 text-center sm:text-left">
          <p>© {currentYear} ClinicFlow Technologies. Built for healthcare in India.</p>
          <div className="flex items-center gap-3 text-[11px]">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <span className="text-[#2C3D39]" aria-hidden="true">·</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <span className="text-[#2C3D39]" aria-hidden="true">·</span>
            <Link href="/accessibility" className="hover:text-white transition-colors">
              Accessibility
            </Link>
            <span className="text-[#2C3D39]" aria-hidden="true">·</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
