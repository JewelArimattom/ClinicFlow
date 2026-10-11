import Link from "next/link";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#182522] text-[#E9F1EB] text-sm border-t border-[#2C3D39]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Column 1: Brand & Identity */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#087F78] rounded-md"
              aria-label="ClinicFlow Home"
            >
              <div className="w-8 h-8 rounded-lg bg-[#087F78] flex items-center justify-center text-white">
                <svg
                  width="18"
                  height="18"
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
              <span className="text-[17px] tracking-[-0.015em] font-bold text-white">
                Clinic<span className="text-[#087F78] font-semibold">Flow</span>
              </span>
            </Link>

            <p className="text-[#E9F1EB]/75 text-[13px] leading-relaxed max-w-sm">
              Connecting patients with trusted neighborhood clinics and providing medical practices with intuitive operations software across India.
            </p>

            <div className="pt-1 text-[12px] text-[#E9F1EB]/50">
              <span>Practices in Kochi · Bangalore · Chennai · Trivandrum</span>
            </div>
          </div>

          {/* Column 2: Patient Navigation */}
          <div className="lg:col-span-3">
            <p className="font-semibold text-white mb-3 text-[12px] uppercase tracking-wider">
              For Patients
            </p>
            <ul className="space-y-2 text-[13px]">
              <li>
                <Link
                  href="/search"
                  className="text-[#E9F1EB]/75 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Find Neighborhood Clinics
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-[#E9F1EB]/75 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Browse Medical Specialties
                </Link>
              </li>
              <li>
                <Link
                  href="/my-appointments"
                  className="text-[#E9F1EB]/75 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Manage My Appointments
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#E9F1EB]/75 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Patient Booking Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Clinic Owner Navigation */}
          <div className="lg:col-span-3">
            <p className="font-semibold text-white mb-3 text-[12px] uppercase tracking-wider">
              For Clinic Owners
            </p>
            <ul className="space-y-2 text-[13px]">
              <li>
                <Link
                  href="/register-clinic"
                  className="text-[#52B1A2] hover:text-[#92CEC3] font-medium transition-colors duration-150 inline-block py-0.5"
                >
                  Register Your Clinic
                </Link>
              </li>
              <li>
                <Link
                  href="/for-clinics"
                  className="text-[#E9F1EB]/75 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Clinic Management Platform
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-[#E9F1EB]/75 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Subscription Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-[#E9F1EB]/75 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Staff Portal Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Standards */}
          <div className="lg:col-span-2">
            <p className="font-semibold text-white mb-3 text-[12px] uppercase tracking-wider">
              Information
            </p>
            <ul className="space-y-2 text-[13px]">
              <li>
                <Link
                  href="/privacy"
                  className="text-[#E9F1EB]/75 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-[#E9F1EB]/75 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="text-[#E9F1EB]/75 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Accessibility
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#E9F1EB]/75 hover:text-white transition-colors duration-150 inline-block py-0.5"
                >
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#2C3D39] flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#E9F1EB]/50 gap-3">
          <p>© {currentYear} ClinicFlow Technologies. Built for healthcare practices in India.</p>
          <div className="flex items-center gap-4">
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
          </div>
        </div>
      </div>
    </footer>
  );
}
