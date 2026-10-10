import Link from "next/link";
import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import { db } from "@/lib/db";
import { Check, ShieldCheck, Sparkles, ArrowRight, HelpCircle, Zap, CheckCircle2 } from "lucide-react";

export default async function PricingPage() {
  const plans = await db.getSubscriptionPlans();

  const faqs = [
    {
      q: "Is there a free trial period?",
      a: "Yes! Every subscription plan includes a full 14-day free trial with zero credit card required up front. You get instant access to the entire clinic management suite."
    },
    {
      q: "Can I upgrade or downgrade as my clinic grows?",
      a: "Absolutely. You can switch plans at any time from your clinic dashboard. Plan upgrades take effect immediately with prorated billing."
    },
    {
      q: "Are GST tax invoices provided for clinic expenses?",
      a: "Yes, all subscription charges are fully GST-compliant with downloadable tax invoices including your clinic's GSTIN."
    },
    {
      q: "What payment methods are supported?",
      a: "We support all major Indian payment methods including UPI (Google Pay, PhonePe, Paytm), Net Banking, RuPay, Visa, and Mastercard credit/debit cards."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-teal-600 selection:text-white">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold tracking-wide">
            <Zap className="w-3.5 h-3.5 text-teal-600" />
            Simple, Transparent Pricing in INR (₹)
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Plans built for single doctors to multi-specialty polyclinics
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Everything you need to digitize patient bookings, daily queues, pharmacy stock, and consultation receipts. No hidden setup fees.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const isPopular = plan.tier === "PROFESSIONAL";

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  isPopular
                    ? "bg-white border-2 border-teal-600 shadow-xl shadow-teal-600/15 ring-4 ring-teal-500/10 md:-translate-y-2"
                    : "bg-white border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-slate-300"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-teal-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Recommended Choice
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {plan.tier === "STARTER" && "Best for individual consultants & solo practitioners."}
                      {plan.tier === "PROFESSIONAL" && "Ideal for busy group clinics & family health centers."}
                      {plan.tier === "CLINIC_PLUS" && "Designed for multi-specialty polyclinics & small hospitals."}
                    </p>

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                        ₹{plan.monthlyPrice}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">/ month</span>
                    </div>

                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-semibold border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Includes {plan.trialDays}-day full free trial
                    </div>
                  </div>

                  {/* Quotas */}
                  <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Doctor Profiles</span>
                      <strong className="text-slate-900 font-bold">{plan.maxDoctors} {plan.maxDoctors === 1 ? "Doctor" : "Doctors"}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Staff Accounts</span>
                      <strong className="text-slate-900 font-bold">{plan.maxStaff} Users</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500 font-medium">Monthly Appointments</span>
                      <strong className="text-slate-900 font-bold">{plan.maxAppointmentsMonthly} Bookings</strong>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                      Everything Included:
                    </span>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <div className="w-4 h-4 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <Link
                    href="/register-clinic"
                    className={`w-full py-3.5 px-4 rounded-2xl text-center text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                      isPopular
                        ? "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/25 hover:shadow-md hover:scale-[1.02]"
                        : "bg-slate-900 hover:bg-slate-800 text-white hover:scale-[1.01]"
                    }`}
                  >
                    <span>Start 14-Day Free Trial</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Isolation Pill */}
        <div className="mt-16 max-w-xl mx-auto text-center space-y-2 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-center gap-2 text-slate-900 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <span>Strict Healthcare Multi-Tenant Isolation</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every clinic tenant is strictly isolated in PostgreSQL with scoped session credentials. We never share patient records or clinical revenue data across practices.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500">Have questions about ClinicFlow plans? We have answers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-2 shadow-sm">
                <h4 className="text-xs font-bold text-slate-900 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
