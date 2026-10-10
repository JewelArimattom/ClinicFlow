import Link from "next/link";
import Image from "next/image";
import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SpecialtyIcon } from "@/components/ui/SpecialtyIcon";
import { HeroSearch } from "@/components/public/HeroSearch";
import { ClinicDashboardPreview } from "@/components/public/ClinicDashboardPreview";
import { db } from "@/lib/db";
import {
  Search,
  MapPin,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Calendar,
  Clock3,
  CalendarCheck,
  Hospital,
  Users,
  ReceiptText,
  Pill,
  ShieldCheck,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

// Illustrative clinic images for cards — used as demo placeholders
const CLINIC_IMAGES = [
  "/images/clinic-reception.jpg",
  "/images/clinic-dental.jpg",
  "/images/clinic-pediatric.jpg",
  "/images/clinic-modern.jpg",
];

export default async function HomePage() {
  const [clinics, specialties] = await Promise.all([
    db.getClinics({ publishedOnly: true }),
    db.getSpecialties(),
  ]);

  const featuredClinics = await Promise.all(
    clinics.slice(0, 6).map(async (c, i) => {
      const doctors = await db.getDoctors(c.id);
      const minFee = doctors.length > 0 ? Math.min(...doctors.map((d) => d.consultationFee)) : 400;
      return { ...c, doctors, minFee, imageIndex: i % CLINIC_IMAGES.length };
    })
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      {/* ================================================================
          HERO SECTION — Premium Editorial Healthcare Layout
          ================================================================ */}
      <section className="relative overflow-hidden bg-white pt-8 pb-14 sm:pt-12 sm:pb-16 lg:pt-14 lg:pb-20 border-b border-gray-100">
        {/* Soft white background with subtle teal-tinted radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-15%,rgba(20,184,166,0.08),rgba(255,255,255,0))] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-200/50 to-transparent pointer-events-none" />

        <div className="relative max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left column: Eyebrow + Headline + Copy + Search Panel */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow Label */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/70 text-xs font-semibold uppercase tracking-wider text-brand-700">
                  <Sparkles className="w-3 h-3 text-brand-600" />
                  HEALTHCARE, CLOSER TO HOME
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] xl:text-[62px] font-extrabold tracking-tight text-gray-900 leading-[1.08] max-w-xl">
                Better care{" "}
                <span className="text-brand-600">starts closer.</span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-[520px]">
                Discover trusted clinics and doctors near you. Check appointment availability and book your visit in just a few simple steps.
              </p>

              {/* Integrated Search Panel */}
              <div className="pt-1 max-w-xl">
                <HeroSearch />
              </div>
            </div>

            {/* Right column: Healthcare Image + Single Floating Example Card */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl shadow-gray-900/10 ring-1 ring-gray-900/5 aspect-[16/10] sm:aspect-[4/3]">
                <Image
                  src="/images/hero-doctor.jpg"
                  alt="A doctor consulting with a patient in a modern healthcare clinic"
                  fill
                  className="object-cover transition-transform duration-slow hover:scale-[1.02]"
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>

              {/* Single compact illustrative card — clearly labelled sample preview */}
              <div className="hidden sm:flex absolute -bottom-3 -left-3 lg:-bottom-4 lg:-left-4 bg-white/95 backdrop-blur-md rounded-xl lg:rounded-2xl shadow-xl border border-gray-200/80 px-4 py-3 items-center gap-3 ring-1 ring-black/5">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0">
                  <CalendarCheck className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-gray-900">Appointment Confirmed</p>
                    <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      Sample
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">Instant digital reservation token</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          TRUST STRIP
          ================================================================ */}
      <ScrollReveal>
        <section className="py-8 bg-gray-50/50 border-b border-gray-100">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { icon: Hospital, label: "Discover clinics", desc: "Browse verified practices" },
                { icon: Clock3, label: "Check availability", desc: "Real-time slot updates" },
                { icon: Calendar, label: "Book appointments", desc: "Instant confirmation" },
                { icon: ShieldCheck, label: "Secure bookings", desc: "Data privacy first" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-[18px] h-[18px] text-brand-700" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ================================================================
          SPECIALTIES GRID
          ================================================================ */}
      <ScrollReveal>
        <section className="py-14 bg-white border-b border-gray-100">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-section text-gray-900">Explore by Specialty</h2>
                <p className="text-sm text-gray-500 mt-1.5">Find doctors by their area of expertise</p>
              </div>
              <Link
                href="/search"
                className="hidden sm:flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors duration-fast"
              >
                View all <ChevronRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {specialties.map((spec) => (
                <Link
                  key={spec.id}
                  href={`/search?specialty=${spec.slug}`}
                  className="group p-4 rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-elevated bg-white transition-all duration-normal flex flex-col items-center text-center space-y-2.5 card-hover focus-ring"
                >
                  <div className="w-11 h-11 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all duration-normal">
                    <SpecialtyIcon slug={spec.slug} name={spec.name} className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-brand-700 line-clamp-1 transition-colors duration-fast">
                    {spec.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Mobile "View all" */}
            <div className="mt-4 sm:hidden text-center">
              <Link
                href="/search"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600"
              >
                View all specialties <ChevronRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ================================================================
          FEATURED CLINICS
          ================================================================ */}
      <ScrollReveal>
        <section className="py-14 bg-gray-50/50 border-b border-gray-100">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1.5">Featured Clinics</p>
                <h2 className="text-section text-gray-900">Clinics Open for Bookings</h2>
                <p className="text-sm text-gray-500 mt-1.5">
                  Browse practices with published schedules and real-time availability
                </p>
              </div>
              <Link
                href="/search"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
              >
                Browse all {clinics.length} clinics <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredClinics.map((clinic) => (
                <article
                  key={clinic.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col card-hover focus-ring"
                >
                  {/* Clinic image */}
                  <div className="relative aspect-[16/9] bg-gray-100">
                    <Image
                      src={CLINIC_IMAGES[clinic.imageIndex]}
                      alt={`Illustrative image for ${clinic.name}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                    />
                    {/* Type badge */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-white bg-gray-900/70 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        {clinic.clinicType}
                      </span>
                    </div>
                    {clinic.isVerified && (
                      <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-white bg-brand-600/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <BadgeCheck className="w-3 h-3" strokeWidth={2} /> Verified
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-base font-bold text-gray-900 leading-snug">
                      {clinic.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {clinic.description}
                    </p>

                    <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" strokeWidth={1.75} />
                        <span className="line-clamp-1">{clinic.address}, {clinic.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" strokeWidth={1.75} />
                        <span>{clinic.doctors.length} Doctor{clinic.doctors.length !== 1 ? "s" : ""} available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ReceiptText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" strokeWidth={1.75} />
                        <span>
                          From <strong className="text-gray-800 font-semibold">₹{clinic.minFee}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Doctor pills */}
                    {clinic.doctors.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
                        {clinic.doctors.slice(0, 2).map((d) => (
                          <span key={d.id} className="text-[11px] px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200/60 text-gray-600 font-medium">
                            {d.name}
                          </span>
                        ))}
                        {clinic.doctors.length > 2 && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200/60 text-gray-500">
                            +{clinic.doctors.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-4 bg-gray-50/50 border-t border-gray-100 grid grid-cols-2 gap-2">
                    <Link
                      href={`/clinics/${clinic.slug}`}
                      className="py-2.5 px-3 rounded-xl border border-gray-300 text-center text-xs font-semibold text-gray-700 hover:bg-white hover:border-gray-400 transition-all duration-fast btn-press focus-ring"
                    >
                      View Clinic
                    </Link>
                    <Link
                      href={`/book/${clinic.slug}`}
                      className="py-2.5 px-3 rounded-xl bg-brand-600 text-center text-xs font-semibold text-white hover:bg-brand-700 shadow-sm transition-all duration-fast btn-press focus-ring"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ================================================================
          HOW BOOKING WORKS
          ================================================================ */}
      <ScrollReveal>
        <section className="py-14 bg-white border-b border-gray-100">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-lg mx-auto mb-12">
              <h2 className="text-section text-gray-900">How Booking Works</h2>
              <p className="text-sm text-gray-500 mt-2">
                Transparent booking designed to save your waiting time
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                {
                  num: "1",
                  title: "Find a Clinic",
                  desc: "Search by locality, specialty, or clinic name to find doctors near you.",
                  icon: Search,
                },
                {
                  num: "2",
                  title: "Pick a Time Slot",
                  desc: "Live schedule shows real available slots — no phone calls needed.",
                  icon: Clock3,
                },
                {
                  num: "3",
                  title: "Confirm Booking",
                  desc: "Receive an instant booking reference code. Cancel or reschedule anytime.",
                  icon: CalendarCheck,
                },
                {
                  num: "4",
                  title: "Visit the Clinic",
                  desc: "Show your reference at the reception desk to skip the wait.",
                  icon: CheckCircle2,
                },
              ].map((step) => (
                <div key={step.num} className="relative text-center sm:text-left space-y-3">
                  <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
                    <span className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200/60 text-brand-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {step.num}
                    </span>
                    <step.icon className="w-5 h-5 text-gray-400" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-[15px]">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ================================================================
          CLINIC OWNER CTA — Seamless Deep Navy Workspace Transition
          ================================================================ */}
      <ScrollReveal>
        <section className="py-16 sm:py-20 bg-[#0B1220] text-white relative overflow-hidden">
          {/* Subtle teal glow / gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_20%,rgba(13,148,136,0.12),rgba(11,18,32,0))] pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-px bg-white/10 pointer-events-none" />

          <div className="relative max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Eyebrow + Headline + Copy + 3 Benefits + CTAs */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full inline-block">
                    FOR CLINIC OWNERS
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white tracking-tight leading-[1.15]">
                  Your clinic.{" "}
                  <span className="text-brand-400">Better connected.</span>
                </h2>

                <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-lg">
                  Manage appointments, patient queues, billing, and pharmacy inventory from one simple workspace.
                </p>

                {/* 3 Compact Benefit Indicators */}
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-xs font-medium text-gray-200">
                    <Calendar className="w-3.5 h-3.5 text-brand-400" strokeWidth={1.75} />
                    Appointment management
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-xs font-medium text-gray-200">
                    <ReceiptText className="w-3.5 h-3.5 text-brand-400" strokeWidth={1.75} />
                    Billing and payments
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-xs font-medium text-gray-200">
                    <Pill className="w-3.5 h-3.5 text-brand-400" strokeWidth={1.75} />
                    Pharmacy inventory
                  </span>
                </div>

                {/* Balanced Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Link
                    href="/register-clinic"
                    className="py-3 px-6 rounded-xl bg-brand-500 hover:bg-brand-400 text-gray-950 font-semibold text-center text-sm transition-all duration-fast shadow-md shadow-brand-500/20 btn-press focus-ring"
                  >
                    Register Your Clinic
                  </Link>
                  <Link
                    href="/for-clinics"
                    className="py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-center text-sm border border-white/15 transition-all duration-fast btn-press focus-ring"
                  >
                    Explore Clinic Features
                  </Link>
                </div>
              </div>

              {/* Right Column: Dashboard Preview Panel */}
              <div className="lg:col-span-5">
                <ClinicDashboardPreview />
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <PublicFooter />
    </div>
  );
}
