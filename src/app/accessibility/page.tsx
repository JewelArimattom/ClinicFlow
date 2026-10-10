import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import { CheckCircle2, Eye, Keyboard, Sparkles } from "lucide-react";

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />
      <main className="flex-1 max-w-[840px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="space-y-4 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-xs font-semibold uppercase tracking-wider text-brand-700">
            <Sparkles className="w-3.5 h-3.5" />
            Accessibility Commitment
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Accessibility Statement
          </h1>
          <p className="text-sm text-gray-500">
            Ensuring seamless healthcare discovery and booking for all users
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-gray-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-brand-600" />
              Keyboard Navigation & Focus
            </h2>
            <p>
              ClinicFlow is designed with full keyboard navigation support. All interactive elements—including appointment calendars, search filters, and form inputs—feature visible, high-contrast focus rings and accessible ARIA attributes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-600" />
              Contrast & Screen Readers
            </h2>
            <p>
              We adhere to WCAG 2.1 AA contrast ratios across text, icons, and interactive surfaces. Semantic HTML tags, clear landmark regions, and descriptive alt text ensure screen readers convey essential clinical details and status indicators accurately.
            </p>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
