import Link from "next/link";
import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { db } from "@/lib/db";
import { Check, ShieldCheck, ArrowRight, HelpCircle, CheckCircle2 } from "lucide-react";

export default async function PricingPage() {
  const plans = await db.getSubscriptionPlans();

  const faqs = [
    {
      q: "Is there a free trial period?",
      a: "Yes. Every subscription plan includes a 14-day free trial with zero payment required up front. You get immediate access to all features to test with your clinic staff."
    },
    {
      q: "Can I upgrade or downgrade as my clinic grows?",
      a: "Yes. You can switch plans at any time from your platform settings. Upgrades take effect immediately with prorated billing."
    },
    {
      q: "Are GST tax invoices provided for clinic expenses?",
      a: "Yes. All subscription billing is fully GST-compliant with downloadable tax invoices containing your clinic's legal name and GSTIN."
    },
    {
      q: "What payment methods are supported?",
      a: "We support major Indian payment methods including UPI (Google Pay, PhonePe, Paytm), Net Banking, RuPay, Visa, and Mastercard."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#182522]">
      <PublicNavbar />

      <AnimatedPage>
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div data-animate="fade-up" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#E9F1EB] text-[#087F78] text-[11px] font-bold uppercase tracking-wider border border-[#E5E5DF]">
            <span>Transparent Pricing in INR (₹)</span>
          </div>
          <h1 data-animate="fade-up" data-animate-delay="100" className="text-3xl sm:text-4xl font-extrabold text-[#182522] tracking-tight">
            Plans built for solo practices to polyclinics
          </h1>
          <p data-animate="fade-up" data-animate-delay="200" className="text-[#66736F] text-sm sm:text-base leading-relaxed">
            Everything you need to manage patient bookings, daily queues, pharmacy stock, and consultation receipts. No hidden setup fees.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => {
            const isPopular = plan.tier === "PROFESSIONAL";

            return (
              <div
                key={plan.id}
                className={`rounded-xl p-7 flex flex-col justify-between transition-colors relative bg-white border ${
                  isPopular
                    ? "border-[#087F78] shadow-[0_4px_16px_rgba(8,127,120,0.08)]"
                    : "border-[#E5E5DF] shadow-[0_1px_3px_rgba(24,37,34,0.03)]"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded bg-[#087F78] text-white text-[10.5px] font-semibold uppercase tracking-wider shadow-sm">
                    Most Popular
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#182522]">{plan.name}</h3>
                    <p className="text-xs text-[#66736F] mt-1">
                      {plan.tier === "STARTER" && "Best for individual consultants & solo practitioners."}
                      {plan.tier === "PROFESSIONAL" && "Ideal for group clinics & family health practices."}
                      {plan.tier === "CLINIC_PLUS" && "Designed for polyclinics & multi-specialty centers."}
                    </p>

                    <div className="mt-5 flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#182522] tracking-tight">
                        ₹{plan.monthlyPrice}
                      </span>
                      <span className="text-xs text-[#66736F] font-medium">/ month</span>
                    </div>

                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-[#087F78] bg-[#E9F1EB] px-2.5 py-1 rounded font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#087F78]" />
                      Includes {plan.trialDays}-day full free trial
                    </div>
                  </div>

                  {/* Quotas */}
                  <div className="pt-4 border-t border-[#E5E5DF]/70 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#E5E5DF]/40">
                      <span className="text-[#66736F]">Doctor Profiles</span>
                      <strong className="text-[#182522] font-semibold">{plan.maxDoctors} {plan.maxDoctors === 1 ? "Doctor" : "Doctors"}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E5E5DF]/40">
                      <span className="text-[#66736F]">Staff Accounts</span>
                      <strong className="text-[#182522] font-semibold">{plan.maxStaff} Users</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#66736F]">Monthly Appointments</span>
                      <strong className="text-[#182522] font-semibold">{plan.maxAppointmentsMonthly} Bookings</strong>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="pt-4 border-t border-[#E5E5DF]/70 space-y-2.5">
                    <span className="text-[11px] font-bold text-[#182522] uppercase tracking-wider block">
                      Included Capabilities:
                    </span>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#182522]">
                        <Check className="w-3.5 h-3.5 text-[#087F78] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-7 pt-5 border-t border-[#E5E5DF]">
                  <Link
                    href="/register-clinic"
                    className={`w-full py-2.5 px-4 rounded-md text-center text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                      isPopular
                        ? "bg-[#087F78] hover:bg-[#066761] text-white shadow-sm"
                        : "bg-[#182522] hover:bg-[#2C3D39] text-white"
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

        {/* Security & Isolation Strip */}
        <div data-animate="scale-up" className="mt-14 max-w-xl mx-auto text-center space-y-2 p-6 rounded-xl bg-white border border-[#E5E5DF]">
          <div className="flex items-center justify-center gap-2 text-[#182522] font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-[#087F78]" />
            <span>Strict Healthcare Multi-Tenant Isolation</span>
          </div>
          <p className="text-xs text-[#66736F] leading-relaxed">
            Every clinic tenant is strictly isolated in PostgreSQL with scoped session credentials. We never share patient records or clinical revenue data across practices.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 data-animate="fade-up" className="text-xl font-bold text-[#182522]">Frequently Asked Questions</h2>
            <p data-animate="fade-up" data-animate-delay="80" className="text-xs text-[#66736F]">Common questions regarding ClinicFlow subscription plans</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-[#E5E5DF] space-y-2">
                <h4 className="text-xs font-bold text-[#182522] flex items-start gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-[#087F78] flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h4>
                <p className="text-xs text-[#66736F] leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      </AnimatedPage>

      <PublicFooter />
    </div>
  );
}
