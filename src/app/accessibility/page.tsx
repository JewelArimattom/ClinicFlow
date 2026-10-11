import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import { CheckCircle2, Eye, Keyboard, Sparkles, ShieldCheck } from "lucide-react";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export default function AccessibilityPage() {
  return (
    <AnimatedPage>
      <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#182522]">
        <PublicNavbar />
        <main className="flex-1 max-w-[840px] w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div data-animate="fade-down" className="space-y-4 mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4F0] border border-[#C8D2CE] text-xs font-semibold uppercase tracking-wider text-[#07877F]">
              <Sparkles className="w-3.5 h-3.5" />
              Accessibility Commitment
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#182522]">
              Accessibility Statement
            </h1>
            <p className="text-sm text-[#5F6D68]">
              Ensuring seamless healthcare discovery and booking for all users across India
            </p>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-[#182522]">
            <section
              data-animate="fade-up"
              className="bg-white p-6 sm:p-7 rounded-2xl border border-[#C8D2CE] space-y-3 shadow-sm"
            >
              <h2 className="text-lg font-bold text-[#182522] flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-[#07877F]" />
                Keyboard Navigation & Focus Indicators
              </h2>
              <p className="text-[#5F6D68] leading-relaxed">
                ClinicFlow is built from the ground up with full keyboard navigation support. All interactive elements—including appointment calendars, clinic search filters, multi-step registration wizards, and form inputs—feature visible, high-contrast focus rings and accessible ARIA attributes.
              </p>
            </section>

            <section
              data-animate="fade-up"
              data-animate-delay="80"
              className="bg-white p-6 sm:p-7 rounded-2xl border border-[#C8D2CE] space-y-3 shadow-sm"
            >
              <h2 className="text-lg font-bold text-[#182522] flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#07877F]" />
                Contrast, Typography & Screen Readers
              </h2>
              <p className="text-[#5F6D68] leading-relaxed">
                We adhere strictly to WCAG 2.1 AA contrast standards across text, icons, and interactive surfaces. Semantic HTML tags, clear landmark regions, and descriptive labels ensure screen readers convey essential clinical details, doctor availability, and appointment status accurately.
              </p>
            </section>

            <section
              data-animate="fade-up"
              data-animate-delay="160"
              className="bg-white p-6 sm:p-7 rounded-2xl border border-[#C8D2CE] space-y-3 shadow-sm"
            >
              <h2 className="text-lg font-bold text-[#182522] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#07877F]" />
                Reduced Motion & User Preferences
              </h2>
              <p className="text-[#5F6D68] leading-relaxed">
                Our application automatically respects system motion preferences (<code className="bg-[#EAF4F0] px-1.5 py-0.5 rounded text-[#07877F] font-mono text-xs">prefers-reduced-motion</code>). When reduced motion is requested, scroll animations and translations are disabled, rendering content directly into view without delay.
              </p>
            </section>
          </div>
        </main>
        <PublicFooter />
      </div>
    </AnimatedPage>
  );
}
