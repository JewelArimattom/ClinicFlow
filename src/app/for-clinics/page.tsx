import Link from "next/link";
import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import { 
  Calendar, 
  Clock, 
  Receipt, 
  Pill, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  BarChart3,
  Stethoscope,
  Laptop,
  Layers,
  HeartPulse,
  Coins
} from "lucide-react";

export default function ForClinicsPage() {
  const features = [
    {
      icon: Calendar,
      badge: "Front Desk & Scheduling",
      title: "Online Booking & Live Token Queue",
      desc: "Allow patients to book slots from your branded web profile or register walk-ins instantly. Smart daily tokens prevent waiting room overcrowding.",
      bullets: ["Real-time daily queue tracking", "Automatic slot locking & double-booking protection", "Patient SMS/slip reference lookup"]
    },
    {
      icon: Receipt,
      badge: "Revenue & Accounts",
      title: "Consultation Billing & Instant Invoicing",
      desc: "Generate professional GST-ready clinic receipts in seconds. Accept mixed payments across UPI, Cash, and Card with partial settlement tracking.",
      bullets: ["Compliant sequential invoice numbering", "Support for partial payments & balances", "Thermal and A4 slip printing formats"]
    },
    {
      icon: Pill,
      badge: "Dispensary & Stock",
      title: "Pharmacy POS with FEFO Batch Tracking",
      desc: "Manage medicine inventory with automated First-Expiry-First-Out dispatch. Never dispense expired medications or get caught off-guard by stockouts.",
      bullets: ["Expiry warnings & low stock reorder alerts", "Stock movement audit trail", "Integrated POS checkout tied to patient profiles"]
    },
    {
      icon: BarChart3,
      badge: "Clinical Intelligence",
      title: "Actionable Operational Analytics",
      desc: "Gain deep visibility into your daily footfall, revenue trends, top prescribed medicines, and doctor consultation volumes with exportable reports.",
      bullets: ["Revenue & collection summaries", "Doctor-wise appointment distribution", "1-click CSV report export for tax filing"]
    },
    {
      icon: Users,
      badge: "Multi-Role Access",
      title: "Role-Based Staff Access (RBAC)",
      desc: "Give doctors, receptionists, pharmacists, and accountants the exact permissions they need while safeguarding clinic financial privacy.",
      bullets: ["Dedicated views for front desk vs doctors", "Audit logging on patient record edits", "Multi-branch scalability"]
    },
    {
      icon: ShieldCheck,
      badge: "Data Sovereignty",
      title: "Strict Multi-Tenant Isolation",
      desc: "Every clinic operates in its own isolated logical schema with cryptographic token protection and zero cross-tenant data leakage.",
      bullets: ["Encrypted at rest & in transit", "Strict tenant ID scoping on all database queries", "Automated daily cloud backups"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-teal-600 selection:text-white">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative bg-slate-950 text-white py-20 sm:py-28 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(13,148,136,0.25),rgba(255,255,255,0))]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modern Clinical OS for Independent Practices</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Run your clinic with the speed of <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-300">Linear</span> and reliability of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-200">Stripe</span>.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              Say goodbye to messy paper registers, missed appointments, and disjointed pharmacy stock. ClinicFlow unites your reception desk, consultation rooms, and pharmacy into a cohesive, high-speed workspace.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/register-clinic"
                className="py-3.5 px-7 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Start 14-Day Free Trial
              </Link>
              <Link
                href="/pricing"
                className="py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700/80 transition"
              >
                Explore Pricing Plans
              </Link>
              <Link
                href="/login"
                className="py-3.5 px-5 rounded-2xl text-slate-300 hover:text-white font-medium text-sm transition"
              >
                Explore Live Demo &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">40% Less</div>
            <div className="text-xs text-slate-400 mt-1">Patient Waiting Room Idle Time</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">100% FEFO</div>
            <div className="text-xs text-slate-400 mt-1">Pharmacy Expiry Waste Reduction</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">&lt; 15 Sec</div>
            <div className="text-xs text-slate-400 mt-1">Walk-In Patient Check-In Speed</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">Zero</div>
            <div className="text-xs text-slate-400 mt-1">Software Installation Required</div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
        <div>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Architected for Healthcare
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Every tool your clinic staff needs to deliver exceptional care
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Designed hand-in-hand with clinical doctors, receptionists, and pharmacists across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 group-hover:bg-teal-600 text-teal-700 group-hover:text-white flex items-center justify-center transition-colors duration-300 shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      {item.bullets.map((b, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive workflow showcase */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">
              Seamless Patient Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              From online discovery to medicine dispensation in minutes.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 space-y-2">
                <span className="text-teal-400 font-mono text-xs font-bold">01. Discovery</span>
                <p className="text-xs text-slate-300">Patient books doctor slot online or walks in at reception.</p>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 space-y-2">
                <span className="text-teal-400 font-mono text-xs font-bold">02. Front Desk</span>
                <p className="text-xs text-slate-300">Receptionist issues daily queue token in 1 click.</p>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 space-y-2">
                <span className="text-teal-400 font-mono text-xs font-bold">03. Consultation</span>
                <p className="text-xs text-slate-300">Doctor calls token and completes consultation checkup.</p>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 space-y-2">
                <span className="text-teal-400 font-mono text-xs font-bold">04. Billing & POS</span>
                <p className="text-xs text-slate-300">Reception/Pharmacy generates itemized bill with UPI/Cash.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl shadow-teal-900/10">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Ready to modernize your clinic operations?
            </h2>
            <p className="text-teal-100 text-sm leading-relaxed">
              Join leading healthcare practices managing hundreds of patient appointments daily with ClinicFlow.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register-clinic"
              className="px-8 py-3.5 rounded-2xl bg-white text-teal-950 font-bold text-sm shadow-md hover:bg-teal-50 transition-all hover:scale-105"
            >
              Start Free Trial (14 Days)
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3.5 rounded-2xl bg-teal-800 hover:bg-teal-700 text-white font-semibold text-sm border border-teal-600 transition"
            >
              Compare All Plans
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
