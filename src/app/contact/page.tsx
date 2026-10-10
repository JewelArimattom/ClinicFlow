import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import { HelpCircle, Mail, MessageSquare, PhoneCall } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />
      <main className="flex-1 max-w-[840px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="space-y-4 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-xs font-semibold uppercase tracking-wider text-brand-700">
            <HelpCircle className="w-3.5 h-3.5" />
            Support & Help
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Contact & Support
          </h1>
          <p className="text-sm text-gray-500">
            Assistance for patients booking appointments and clinics managing workflows
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Patient Booking Support</h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Need help finding your booking reference, rescheduling a slot, or confirming your clinic visit? You can also manage bookings directly through the patient portal.
            </p>
            <div className="pt-2">
              <a
                href="/my-appointments"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
              >
                Go to My Appointments →
              </a>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Clinic Onboarding & Inquiries</h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Healthcare providers looking to integrate queue tokens, billing, or multi-doctor scheduling can register a clinic directly or reach out for technical assistance.
            </p>
            <div className="pt-2">
              <a
                href="/register-clinic"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
              >
                Register Your Practice →
              </a>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
