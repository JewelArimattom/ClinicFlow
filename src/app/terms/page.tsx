import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { FileText, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />
      <AnimatedPage>
      <main className="flex-1 max-w-[840px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="space-y-4 mb-8">
          <div data-animate="fade-up" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-xs font-semibold uppercase tracking-wider text-brand-700">
            <FileText className="w-3.5 h-3.5" />
            Terms of Use
          </div>
          <h1 data-animate="fade-up" data-animate-delay="100" className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Terms of Service
          </h1>
          <p data-animate="fade-up" data-animate-delay="200" className="text-sm text-gray-500">
            Effective as of October 2026 · Guidelines for patients and healthcare practices
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-gray-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">
              1. Platform Purpose & Medical Disclaimer
            </h2>
            <p>
              ClinicFlow provides booking discovery, appointment coordination, and workflow management software for outpatient clinics. ClinicFlow is <strong>not</strong> an emergency medical service. For urgent medical emergencies, patients must immediately contact emergency response services or visit the nearest hospital emergency room.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">
              2. Patient Appointments & Cancellations
            </h2>
            <p>
              When a booking is confirmed through ClinicFlow, the allocated clinic reserves clinical time for your consultation. If you cannot attend your scheduled consultation, please cancel or reschedule through your booking link promptly so the slot can be released for other patients.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">
              3. Clinic Responsibilities
            </h2>
            <p>
              Practices registered on the platform are responsible for maintaining accurate doctor availability, valid medical licensing, consultation pricing, and fulfilling booked appointments in accordance with applicable healthcare regulations.
            </p>
          </section>
        </div>
      </main>
      </AnimatedPage>
      <PublicFooter />
    </div>
  );
}
