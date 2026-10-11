import Link from "next/link";
import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { 
  Calendar, 
  Clock, 
  Receipt, 
  Pill, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  BarChart3,
  CheckCircle2,
} from "lucide-react";

export default function ForClinicsPage() {
  const capabilities = [
    {
      icon: Calendar,
      badge: "Front Desk & Scheduling",
      title: "Online Booking & Live Token Queue",
      desc: "Allow patients to book slots from your clinic profile or register walk-ins instantly. Smart daily tokens prevent waiting room overcrowding.",
      bullets: ["Real-time daily queue tracking", "Automatic slot locking & double-booking prevention", "Digital booking reference lookup"]
    },
    {
      icon: Receipt,
      badge: "Billing & Accounts",
      title: "Consultation Invoicing & Fast Receipts",
      desc: "Generate professional receipts in seconds. Accept mixed payments across UPI, Cash, and Card with partial settlement tracking.",
      bullets: ["Compliant sequential invoice numbering", "Support for partial payments & balances", "Thermal and standard slip printing formats"]
    },
    {
      icon: Pill,
      badge: "Pharmacy & Dispensary",
      title: "Inventory & FEFO Batch Tracking",
      desc: "Manage medicine inventory with automated First-Expiry-First-Out dispatch. Track batch numbers, expiry dates, and unit prices accurately.",
      bullets: ["Expiry warnings & low stock reorder alerts", "Stock movement audit trail", "Integrated POS checkout tied to patient profiles"]
    },
    {
      icon: BarChart3,
      badge: "Practice Reports",
      title: "Actionable Operational Analytics",
      desc: "Gain visibility into your daily patient volume, revenue trends, top prescribed medicines, and doctor consultation counts with exportable reports.",
      bullets: ["Revenue & collection summaries", "Doctor-wise appointment distribution", "CSV report export for practice accounting"]
    },
    {
      icon: Users,
      badge: "Staff Roles",
      title: "Role-Based Staff Access (RBAC)",
      desc: "Give doctors, receptionists, pharmacists, and cashiers the exact permissions they need while safeguarding clinic financial privacy.",
      bullets: ["Dedicated views for front desk vs doctors", "Audit logging on patient record edits", "Secure multi-staff collaboration"]
    },
    {
      icon: ShieldCheck,
      badge: "Data Privacy",
      title: "Strict Multi-Tenant Isolation",
      desc: "Every clinic operates in its own isolated logical schema with cryptographic token protection and zero cross-tenant data leakage.",
      bullets: ["Encrypted at rest & in transit", "Strict clinic ID scoping on all database queries", "Automated PostgreSQL database backups"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#182522]">
      <PublicNavbar />

      <AnimatedPage>

      {/* Hero Section */}
      <section className="relative bg-[#FAF9F5] py-14 sm:py-20 border-b border-[#E5E5DF]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <div data-animate="fade-up" className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E9F1EB] text-[#087F78] text-[11px] font-bold uppercase tracking-wider border border-[#E5E5DF]">
              <span>Clinic Practice Platform</span>
            </div>

            <h1 data-animate="fade-up" data-animate-delay="100" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#182522] leading-[1.14]">
              Spend less time managing appointments. More time caring for patients.
            </h1>

            <p data-animate="fade-up" data-animate-delay="200" className="text-[15px] sm:text-[17px] text-[#66736F] leading-relaxed max-w-2xl">
              ClinicFlow unites your reception desk, doctor consultation rooms, and in-house dispensary into an intuitive, reliable operations platform built specifically for healthcare practices in India.
            </p>

            <div data-animate="fade-up" data-animate-delay="300" className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/register-clinic"
                className="py-3 px-6 rounded-md bg-[#087F78] hover:bg-[#066761] text-white font-semibold text-sm shadow-sm transition-colors"
              >
                Register Your Clinic
              </Link>
              <Link
                href="/pricing"
                className="py-3 px-5 rounded-md bg-white hover:bg-[#FAF9F5] text-[#182522] font-medium text-sm border border-[#E5E5DF] hover:border-[#182522] transition-colors"
              >
                View Pricing Plans
              </Link>
              <Link
                href="/login"
                className="py-3 px-4 text-sm font-medium text-[#66736F] hover:text-[#182522] transition-colors"
              >
                Staff Portal Sign In &rarr;
              </Link>
            </div>
          </div>

          {/* Operational Facts */}
          <div className="mt-14 pt-8 border-t border-[#E5E5DF] grid grid-cols-2 md:grid-cols-4 gap-6" data-animate="stagger-children">
            <div data-animate="fade-up" data-animate-delay="0">
              <div className="text-xl sm:text-2xl font-bold text-[#182522]">Live Token Queue</div>
              <div className="text-xs text-[#66736F] mt-0.5">Reduces patient waiting room congestion</div>
            </div>
            <div data-animate="fade-up" data-animate-delay="100">
              <div className="text-xl sm:text-2xl font-bold text-[#087F78]">FEFO Inventory</div>
              <div className="text-xs text-[#66736F] mt-0.5">Automated expiry & batch tracking</div>
            </div>
            <div data-animate="fade-up" data-animate-delay="200">
              <div className="text-xl sm:text-2xl font-bold text-[#182522]">Instant Invoicing</div>
              <div className="text-xs text-[#66736F] mt-0.5">Support for UPI, Cash, and Card split billing</div>
            </div>
            <div data-animate="fade-up" data-animate-delay="300">
              <div className="text-xl sm:text-2xl font-bold text-[#087F78]">Zero Setup Required</div>
              <div className="text-xs text-[#66736F] mt-0.5">Runs on modern web browsers on desktop & tablet</div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div>
          <div className="max-w-2xl mb-12">
            <p data-animate="fade-up" className="text-[11px] font-bold uppercase tracking-wider text-[#087F78] mb-1">
              Purpose-Built Capabilities
            </p>
            <h2 data-animate="fade-up" data-animate-delay="80" className="text-2xl sm:text-3xl font-bold text-[#182522] tracking-tight">
              Tools for every role in your healthcare practice
            </h2>
            <p data-animate="fade-up" data-animate-delay="160" className="text-sm text-[#66736F] mt-1.5">
              Engineered to support clinical doctors, receptionists, cashiers, and pharmacists with high reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl border border-[#E5E5DF] p-6 flex flex-col justify-between hover:border-[#182522]/30 transition-colors shadow-[0_1px_3px_rgba(24,37,34,0.03)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#E9F1EB] text-[#087F78] flex items-center justify-center">
                      <item.icon className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <span className="text-[11px] font-semibold text-[#66736F] bg-[#FAF9F5] border border-[#E5E5DF] px-2.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#182522] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-[#66736F] mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E5E5DF]/70 space-y-2">
                  {item.bullets.map((b) => (
                    <div key={b} className="flex items-start gap-2 text-xs text-[#182522]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#087F78] flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div data-animate="scale-up" className="p-8 sm:p-12 rounded-xl bg-[#E9F1EB] border border-[#E5E5DF] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <h2 className="text-2xl font-bold text-[#182522]">
              Ready to streamline your practice operations?
            </h2>
            <p className="text-sm text-[#66736F] leading-relaxed">
              Register your clinic in minutes. Add doctors, configure consultation timings, and start taking patient appointments immediately.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/register-clinic"
              className="py-3 px-6 rounded-md bg-[#087F78] hover:bg-[#066761] text-white font-semibold text-sm shadow-sm transition-colors"
            >
              Register Your Clinic
            </Link>
          </div>
        </div>
      </main>

      </AnimatedPage>

      <PublicFooter />
    </div>
  );
}
