import Link from "next/link";
import Image from "next/image";
import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import { SpecialtyIcon } from "@/components/ui/SpecialtyIcon";
import { HeroSearch } from "@/components/public/HeroSearch";
import { ClinicDashboardPreview } from "@/components/public/ClinicDashboardPreview";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { db } from "@/lib/db";
import {
  MapPin,
  ArrowRight,
  ChevronRight,
  Clock,
  Calendar,
  CheckCircle2,
  Stethoscope,
  Users,
  Receipt,
  Pill,
  Sparkles,
  Search,
  Shield,
} from "lucide-react";

// Curated clinic images with consistent photographic treatment
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
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#182522]">
      <PublicNavbar />

      <AnimatedPage>
        {/* ================================================================
            HERO SECTION — Premium Healthcare Discovery
            ================================================================ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F0FAF8] via-[#FAF9F5] to-[#FAF9F5] pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
          {/* Subtle decorative gradient orb */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(8,127,120,0.06)_0%,transparent_70%)] pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(8,127,120,0.04)_0%,transparent_70%)] pointer-events-none" aria-hidden="true" />

          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-5">
                {/* Trust Indicators */}
                <div
                  data-animate="fade-up"
                  className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#087F78]/15 text-[#087F78] shadow-[0_1px_4px_rgba(8,127,120,0.08)]"
                >
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Trusted healthcare discovery
                    </span>
                  </span>
                  <span className="w-px h-3 bg-[#087F78]/20" aria-hidden="true" />
                  <span className="text-[10.5px] font-medium text-[#087F78]/70">
                    {clinics.length}+ clinics listed
                  </span>
                </div>

                {/* Headline */}
                <h1
                  data-animate="fade-up"
                  data-animate-delay="100"
                  className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[54px] font-extrabold tracking-[-0.03em] text-[#182522] leading-[1.08] max-w-[580px]"
                >
                  Find the right doctor,{" "}
                  <span className="bg-gradient-to-r from-[#087F78] to-[#0A9D94] bg-clip-text text-transparent">
                    right in your neighbourhood
                  </span>
                </h1>

                {/* Supporting Copy */}
                <p
                  data-animate="fade-up"
                  data-animate-delay="180"
                  className="text-[15px] sm:text-[17px] text-[#66736F] leading-[1.7] max-w-[520px]"
                >
                  Search clinics by specialty, check real-time doctor availability, and book your appointment — all in under a minute.
                </p>

                {/* Search Panel */}
                <div data-animate="fade-up" data-animate-delay="260" className="pt-1 max-w-xl">
                  <HeroSearch />
                </div>

                {/* Quick Stats */}
                <div
                  data-animate="fade-up"
                  data-animate-delay="340"
                  className="flex items-center gap-6 pt-2 text-[12px] text-[#66736F]"
                >
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#087F78]" strokeWidth={2} />
                    <span className="font-medium">Verified practices</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#087F78]" strokeWidth={2} />
                    <span className="font-medium">Instant booking</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#087F78]" strokeWidth={2} />
                    <span className="font-medium">No hidden fees</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Image */}
              <div className="lg:col-span-5 relative mt-4 lg:mt-0">
                <div
                  data-animate="fade-left"
                  data-animate-delay="200"
                  className="relative"
                >
                  {/* Main Image Container */}
                  <div className="relative rounded-2xl overflow-hidden bg-[#E9F1EB] shadow-[0_8px_32px_rgba(8,127,120,0.12)] border border-[#087F78]/10">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src="/images/hero-doctor.jpg"
                        alt="Doctor conducting a medical consultation with a patient in an Indian clinical practice"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                      {/* Subtle overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#182522]/20 via-transparent to-transparent" />
                    </div>

                    {/* Floating info badge */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-white/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-white/50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#087F78] flex items-center justify-center">
                          <Stethoscope className="w-4 h-4 text-white" strokeWidth={2} />
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-[#182522]">Verified Practices</p>
                          <p className="text-[10.5px] text-[#66736F]">Published doctor schedules</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                        <span className="text-[10.5px] font-semibold text-[#22C55E]">Live</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION A — BROWSE BY SPECIALTY
            ================================================================ */}
        <section id="specialties" className="py-14 sm:py-18 bg-[#FAF9F5] border-b border-[#E5E5DF]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <h2 data-animate="fade-up" className="text-2xl sm:text-3xl font-bold tracking-tight text-[#182522]">
                  Find care for what matters to you.
                </h2>
                <p data-animate="fade-up" data-animate-delay="80" className="text-sm text-[#66736F] mt-1.5">
                  Explore doctor availability across specialties supported by local clinics
                </p>
              </div>
              <Link
                href="/search"
                data-animate="fade-up"
                data-animate-delay="120"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#087F78] hover:text-[#066761] transition-colors"
              >
                <span>View all specialties</span>
                <ChevronRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {specialties.map((spec, i) => (
                <Link
                  key={spec.id}
                  href={`/search?specialty=${spec.slug}`}
                  data-animate="fade-up"
                  data-animate-delay={String(i * 60)}
                  className="group p-4 rounded-xl border border-[#E5E5DF] bg-white hover:bg-[#087F78] hover:border-[#087F78] transition-all duration-200 flex flex-col items-center text-center space-y-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#087F78] hover:shadow-[0_4px_16px_rgba(8,127,120,0.15)] hover:-translate-y-0.5"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#FAF9F5] group-hover:bg-white/20 text-[#182522] group-hover:text-white flex items-center justify-center transition-all duration-200 border border-[#E5E5DF]/60 group-hover:border-white/20">
                    <SpecialtyIcon slug={spec.slug} name={spec.name} className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <span className="text-[12.5px] font-semibold text-[#182522] group-hover:text-white line-clamp-1 transition-colors duration-200">
                    {spec.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION B — DISCOVER NEARBY CLINICS
            ================================================================ */}
        <section className="py-14 sm:py-18 bg-white border-b border-[#E5E5DF]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <p data-animate="fade-up" className="text-[11px] font-bold uppercase tracking-wider text-[#087F78] mb-1">
                  Local Practices
                </p>
                <h2 data-animate="fade-up" data-animate-delay="60" className="text-2xl sm:text-3xl font-bold tracking-tight text-[#182522]">
                  Discover clinics in your neighbourhood
                </h2>
                <p data-animate="fade-up" data-animate-delay="120" className="text-sm text-[#66736F] mt-1.5">
                  Practices with published doctor schedules and transparent consultation fees
                </p>
              </div>
              <Link
                href="/search"
                data-animate="fade-up"
                data-animate-delay="150"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#087F78] hover:text-[#066761] transition-colors"
              >
                <span>Browse all {clinics.length} clinics</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>

            {featuredClinics.length === 0 ? (
              <div data-animate="fade-in" className="p-12 text-center rounded-xl border border-[#E5E5DF] bg-[#FAF9F5]">
                <p className="text-sm font-semibold text-[#182522]">No clinics currently published</p>
                <p className="text-xs text-[#66736F] mt-1">Check back shortly or register a new clinic practice.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredClinics.map((clinic, i) => (
                  <article
                    key={clinic.id}
                    data-animate="fade-up"
                    data-animate-delay={String(i * 100)}
                    className="group bg-white rounded-xl border border-[#E5E5DF] overflow-hidden flex flex-col transition-all duration-300 shadow-[0_1px_3px_rgba(24,37,34,0.03)] hover:shadow-[0_12px_32px_-8px_rgba(8,127,120,0.12)] hover:border-[#087F78]/30 hover:-translate-y-1"
                  >
                    {/* Clinic Image — zoom on hover */}
                    <div className="relative aspect-[16/10] bg-[#FAF9F5] overflow-hidden">
                      <Image
                        src={CLINIC_IMAGES[clinic.imageIndex]}
                        alt={`Interior of ${clinic.name}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#182522] bg-white/95 backdrop-blur-sm border border-[#E5E5DF] px-2.5 py-1 rounded shadow-sm">
                          {clinic.clinicType}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-[16px] font-bold text-[#182522] leading-snug group-hover:text-[#087F78] transition-colors duration-200">
                          {clinic.name}
                        </h3>
                        <p className="text-[12.5px] text-[#66736F] line-clamp-2 mt-1 leading-relaxed">
                          {clinic.description}
                        </p>

                        <div className="mt-3.5 space-y-1.5 text-[12px] text-[#66736F]">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#66736F]/70 flex-shrink-0" strokeWidth={1.75} />
                            <span className="line-clamp-1">{clinic.address}, {clinic.city}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Stethoscope className="w-3.5 h-3.5 text-[#66736F]/70 flex-shrink-0" strokeWidth={1.75} />
                            <span>
                              {clinic.doctors.length} Doctor{clinic.doctors.length !== 1 ? "s" : ""} on schedule
                            </span>
                          </div>
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="text-[12px] font-medium text-[#182522]">
                              Consultation from <strong className="font-bold text-[#087F78]">₹{clinic.minFee}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Doctor tags */}
                        {clinic.doctors.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-[#E5E5DF]/70 flex flex-wrap gap-1.5">
                            {clinic.doctors.slice(0, 2).map((d) => (
                              <span
                                key={d.id}
                                className="text-[11px] px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#E5E5DF] text-[#182522] font-medium"
                              >
                                {d.name}
                              </span>
                            ))}
                            {clinic.doctors.length > 2 && (
                              <span className="text-[11px] px-1.5 py-0.5 rounded text-[#66736F]">
                                +{clinic.doctors.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="mt-5 pt-3.5 border-t border-[#E5E5DF] grid grid-cols-2 gap-2">
                        <Link
                          href={`/clinics/${clinic.slug}`}
                          className="py-2 px-3 rounded-md border border-[#E5E5DF] hover:border-[#182522] text-center text-[12.5px] font-medium text-[#182522] hover:bg-[#FAF9F5] transition-colors"
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/book/${clinic.slug}`}
                          className="py-2 px-3 rounded-md bg-[#087F78] hover:bg-[#066761] text-center text-[12.5px] font-semibold text-white transition-colors shadow-sm"
                        >
                          Book Visit
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ================================================================
            SECTION C — PATIENT FLOW (GRADIENT TIMELINE DESIGN)
            ================================================================ */}
        <section className="relative py-16 sm:py-20 bg-gradient-to-br from-[#087F78] via-[#0A6B65] to-[#064E4A] overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} aria-hidden="true" />
          
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-xl mx-auto mb-14">
              <p data-animate="fade-up" className="text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0] mb-2">
                Patient Flow
              </p>
              <h2 data-animate="fade-up" data-animate-delay="60" className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                How ClinicFlow works
              </h2>
              <p data-animate="fade-up" data-animate-delay="120" className="text-[14px] sm:text-[15px] text-white/65 mt-2 leading-relaxed">
                Three simple steps designed to respect your time and provide full transparency
              </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Connecting line (desktop) */}
              <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-px bg-gradient-to-r from-white/10 via-white/25 to-white/10" aria-hidden="true" />

              {/* Step 1 */}
              <div data-animate="fade-up" data-animate-delay="0" className="relative p-7 rounded-2xl bg-white/[0.07] backdrop-blur-sm border border-white/[0.12] hover:bg-white/[0.12] transition-all duration-300 hover:border-white/[0.2] group">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#A7F3D0]/15 text-[#A7F3D0] flex items-center justify-center group-hover:bg-[#A7F3D0]/25 transition-colors">
                    <Search className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <span className="text-[28px] font-black text-white/15 leading-none">01</span>
                </div>
                <h3 className="text-[17px] font-bold text-white mb-2">Discover a clinic</h3>
                <p className="text-[13px] text-white/60 leading-relaxed">
                  Search practices by locality, medical specialty, or clinic name to find trusted doctors near you.
                </p>
              </div>

              {/* Step 2 */}
              <div data-animate="fade-up" data-animate-delay="140" className="relative p-7 rounded-2xl bg-white/[0.07] backdrop-blur-sm border border-white/[0.12] hover:bg-white/[0.12] transition-all duration-300 hover:border-white/[0.2] group">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#FDE68A]/15 text-[#FDE68A] flex items-center justify-center group-hover:bg-[#FDE68A]/25 transition-colors">
                    <Clock className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <span className="text-[28px] font-black text-white/15 leading-none">02</span>
                </div>
                <h3 className="text-[17px] font-bold text-white mb-2">Choose your slot</h3>
                <p className="text-[13px] text-white/60 leading-relaxed">
                  Select an open consultation slot from real-time doctor schedules without making phone calls.
                </p>
              </div>

              {/* Step 3 */}
              <div data-animate="fade-up" data-animate-delay="280" className="relative p-7 rounded-2xl bg-white/[0.07] backdrop-blur-sm border border-white/[0.12] hover:bg-white/[0.12] transition-all duration-300 hover:border-white/[0.2] group">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#C4B5FD]/15 text-[#C4B5FD] flex items-center justify-center group-hover:bg-[#C4B5FD]/25 transition-colors">
                    <CheckCircle2 className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <span className="text-[28px] font-black text-white/15 leading-none">03</span>
                </div>
                <h3 className="text-[17px] font-bold text-white mb-2">Visit with confidence</h3>
                <p className="text-[13px] text-white/60 leading-relaxed">
                  Receive an immediate digital reference code and check in seamlessly at the clinic.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION D — FOR CLINIC OWNERS (DARK PREMIUM SECTION)
            ================================================================ */}
        <section className="relative py-16 sm:py-20 bg-[#182522] overflow-hidden">
          {/* Accent gradient */}
          <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-[#087F78]/10 to-transparent pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(8,127,120,0.12)_0%,transparent_70%)] pointer-events-none" aria-hidden="true" />

          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6">
                <div data-animate="fade-up">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#A7F3D0] bg-[#A7F3D0]/10 border border-[#A7F3D0]/20 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
                    <Building2Icon />
                    For Clinic Practice Owners
                  </span>
                </div>

                <h2
                  data-animate="fade-up"
                  data-animate-delay="80"
                  className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-white tracking-tight leading-[1.15]"
                >
                  Spend less time managing.{" "}
                  <span className="bg-gradient-to-r from-[#5EEAD4] to-[#A7F3D0] bg-clip-text text-transparent">
                    More time caring.
                  </span>
                </h2>

                <p
                  data-animate="fade-up"
                  data-animate-delay="160"
                  className="text-[15px] text-white/60 leading-relaxed max-w-lg"
                >
                  ClinicFlow equips your front desk and clinicians with practical operations software: online scheduling, token-based queues, billing and pharmacy inventory.
                </p>

                {/* Capability Cards */}
                <div data-animate="fade-up" data-animate-delay="240" className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-[#5EEAD4]/10 text-[#5EEAD4] flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <span className="text-[13px] font-medium text-white/85">Doctor appointment schedules</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-[#FDE68A]/10 text-[#FDE68A] flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <span className="text-[13px] font-medium text-white/85">Real-time token queue</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-[#C4B5FD]/10 text-[#C4B5FD] flex items-center justify-center flex-shrink-0">
                      <Receipt className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <span className="text-[13px] font-medium text-white/85">Invoicing & payment tracking</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-[#FDA4AF]/10 text-[#FDA4AF] flex items-center justify-center flex-shrink-0">
                      <Pill className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <span className="text-[13px] font-medium text-white/85">Pharmacy stock & expiry tracking</span>
                  </div>
                </div>

                {/* Actions */}
                <div data-animate="fade-up" data-animate-delay="320" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                  <Link
                    href="/register-clinic"
                    className="py-3 px-6 rounded-lg bg-gradient-to-r from-[#087F78] to-[#0A9D94] hover:from-[#066761] hover:to-[#087F78] text-white font-semibold text-center text-[13.5px] transition-all shadow-[0_2px_12px_rgba(8,127,120,0.3)] hover:shadow-[0_4px_20px_rgba(8,127,120,0.4)] flex items-center justify-center gap-2"
                  >
                    Register Your Clinic
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </Link>
                  <Link
                    href="/for-clinics"
                    className="py-3 px-6 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/90 font-medium text-center text-[13.5px] border border-white/[0.12] hover:border-white/[0.2] transition-all"
                  >
                    Explore Platform
                  </Link>
                </div>
              </div>

              {/* Right Column: Dashboard Preview */}
              <div className="lg:col-span-5" data-animate="fade-left" data-animate-delay="200">
                <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/[0.08]">
                  <ClinicDashboardPreview />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION E — FOOTER
            ================================================================ */}
        <PublicFooter />
      </AnimatedPage>
    </div>
  );
}

/* Inline Building2 icon for the badge */
function Building2Icon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" />
    </svg>
  );
}
