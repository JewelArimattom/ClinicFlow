import Link from "next/link";
import { HeartPulse } from "lucide-react";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1220] text-gray-400 text-sm border-t border-white/10">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group focus-ring rounded-lg"
              aria-label="ClinicFlow Home"
            >
              <div className="w-8 h-8 rounded-[10px] bg-brand-600 flex items-center justify-center text-white shadow-sm group-hover:bg-brand-500 transition-colors duration-fast">
                <HeartPulse className="w-[18px] h-[18px]" strokeWidth={2.25} />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Clinic<span className="text-brand-400">Flow</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Helping patients discover clinics and helping practices manage everyday operations.
            </p>
          </div>

          {/* Column 2: For Patients */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">
              For Patients
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/search"
                  className="inline-block py-1 text-gray-400 hover:text-white transition-colors duration-fast"
                >
                  Find Clinics
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="inline-block py-1 text-gray-400 hover:text-white transition-colors duration-fast"
                >
                  Specialties
                </Link>
              </li>
              <li>
                <Link
                  href="/my-appointments"
                  className="inline-block py-1 text-gray-400 hover:text-white transition-colors duration-fast"
                >
                  My Appointments
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-block py-1 text-gray-400 hover:text-white transition-colors duration-fast"
                >
                  Booking Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Clinics */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">
              For Clinics
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/register-clinic"
                  className="inline-block py-1 text-brand-400 hover:text-brand-300 font-medium transition-colors duration-fast"
                >
                  Register Your Clinic
                </Link>
              </li>
              <li>
                <Link
                  href="/for-clinics"
                  className="inline-block py-1 text-gray-400 hover:text-white transition-colors duration-fast"
                >
                  Clinic Management
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="inline-block py-1 text-gray-400 hover:text-white transition-colors duration-fast"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="inline-block py-1 text-gray-400 hover:text-white transition-colors duration-fast"
                >
                  Staff Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Information */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">
              Information
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="inline-block py-1 text-gray-400 hover:text-white transition-colors duration-fast"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="inline-block py-1 text-gray-400 hover:text-white transition-colors duration-fast"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-block py-1 text-gray-400 hover:text-white transition-colors duration-fast"
                >
                  Contact and Support
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="inline-block py-1 text-gray-400 hover:text-white transition-colors duration-fast"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <p>© {currentYear} ClinicFlow Technologies. Built for healthcare practices in India.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors duration-fast">
              Privacy
            </Link>
            <span className="text-gray-700">·</span>
            <Link href="/terms" className="hover:text-gray-400 transition-colors duration-fast">
              Terms
            </Link>
            <span className="text-gray-700">·</span>
            <Link href="/accessibility" className="hover:text-gray-400 transition-colors duration-fast">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
