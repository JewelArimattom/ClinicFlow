import Link from "next/link";
import Image from "next/image";
import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { SpecialtyIcon } from "@/components/ui/SpecialtyIcon";
import { db } from "@/lib/db";
import {
  Search,
  MapPin,
  Hospital,
  BadgeCheck,
  Users,
  ReceiptText,
  Filter,
  ArrowLeft,
  ArrowRight,
  X,
} from "lucide-react";

const CLINIC_IMAGES = [
  "/images/clinic-reception.jpg",
  "/images/clinic-dental.jpg",
  "/images/clinic-pediatric.jpg",
  "/images/clinic-modern.jpg",
];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; city?: string; specialty?: string };
}) {
  const query = searchParams.q || "";
  const city = searchParams.city || "";
  const specialtySlug = searchParams.specialty || "";

  const [allClinics, specialties] = await Promise.all([
    db.getClinics({ query, city, specialtySlug, publishedOnly: true }),
    db.getSpecialties(),
  ]);

  const clinics = await Promise.all(
    allClinics.map(async (c, i) => {
      const doctors = await db.getDoctors(c.id);
      const minFee = doctors.length > 0 ? Math.min(...doctors.map((d) => d.consultationFee)) : 400;
      return { ...c, doctors, minFee, imageIndex: i % CLINIC_IMAGES.length };
    })
  );

  const activeFilters = [query, city, specialtySlug].filter(Boolean);
  const activeSpecialty = specialties.find((s) => s.slug === specialtySlug);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#182522]">
      <PublicNavbar />

      <AnimatedPage>
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E5E5DF] shadow-[0_1px_3px_rgba(24,37,34,0.03)] mb-6">
          <form method="GET" action="/search" className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-[#66736F]" strokeWidth={1.75} />
              </div>
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search clinic name or condition..."
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-[#E5E5DF] bg-[#FAF9F5] text-[#182522] placeholder:text-[#66736F]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F78]/20 focus:border-[#087F78] transition-colors"
                aria-label="Search query"
              />
            </div>

            <div className="sm:col-span-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MapPin className="w-4 h-4 text-[#66736F]" strokeWidth={1.75} />
              </div>
              <input
                type="text"
                name="city"
                defaultValue={city}
                placeholder="City (e.g. Kochi, Bangalore)"
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-[#E5E5DF] bg-[#FAF9F5] text-[#182522] placeholder:text-[#66736F]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#087F78]/20 focus:border-[#087F78] transition-colors"
                aria-label="City filter"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[#087F78] hover:bg-[#066761] text-white font-semibold text-sm transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#087F78]"
              >
                Search Clinics
              </button>
            </div>
          </form>

          {/* Specialty filter chips */}
          <div className="mt-4 pt-4 border-t border-[#E5E5DF]/70 flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 text-xs">
            <span className="font-semibold text-[#182522] flex items-center gap-1.5 flex-shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#66736F]" strokeWidth={1.75} /> Specialty:
            </span>
            <Link
              href={`/search?city=${city}&q=${query}`}
              className={`px-3 py-1.5 rounded-full border transition-colors flex-shrink-0 ${
                !specialtySlug
                  ? "bg-[#087F78] text-white border-[#087F78] font-semibold shadow-sm"
                  : "bg-white text-[#66736F] border-[#E5E5DF] hover:border-[#087F78] hover:text-[#087F78]"
              }`}
            >
              All
            </Link>
            {specialties.map((s) => (
              <Link
                key={s.id}
                href={`/search?city=${city}&q=${query}&specialty=${s.slug}`}
                className={`px-3 py-1.5 rounded-full border transition-colors flex-shrink-0 inline-flex items-center gap-1.5 ${
                  specialtySlug === s.slug
                    ? "bg-[#087F78] text-white border-[#087F78] font-semibold shadow-sm"
                    : "bg-white text-[#66736F] border-[#E5E5DF] hover:border-[#087F78] hover:text-[#087F78]"
                }`}
              >
                <SpecialtyIcon slug={s.slug} name={s.name} className="w-3 h-3" strokeWidth={2} />
                {s.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Active filter chips + Results count */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              {clinics.length} {clinics.length === 1 ? "Clinic" : "Clinics"}
              {city && (
                <span className="font-normal text-gray-500"> in <span className="text-brand-700 font-semibold">{city}</span></span>
              )}
              {activeSpecialty && (
                <span className="font-normal text-gray-500"> · <span className="text-brand-700 font-semibold">{activeSpecialty.name}</span></span>
              )}
            </h1>
          </div>
          {activeFilters.length > 0 && (
            <Link
              href="/search"
              className="text-xs font-medium text-gray-500 hover:text-brand-600 transition-colors flex items-center gap-1 flex-shrink-0"
            >
              <X className="w-3 h-3" strokeWidth={2} /> Clear all
            </Link>
          )}
        </div>

        {/* Results */}
        {clinics.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md mx-auto my-8 space-y-4 shadow-card">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto">
              <Hospital className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">No clinics found</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              We couldn&apos;t find clinics matching your search. Try a broader location like &quot;Kochi&quot; or &quot;Bangalore&quot;.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-all btn-press focus-ring"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} /> View all clinics
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {clinics.map((clinic) => (
              <article
                key={clinic.id}
                className="bg-white rounded-xl border border-[#E5E5DF] overflow-hidden flex flex-col hover:border-[#182522]/30 transition-colors shadow-[0_1px_3px_rgba(24,37,34,0.03)]"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] bg-[#FAF9F5]">
                  <Image
                    src={CLINIC_IMAGES[clinic.imageIndex]}
                    alt={`Photograph of ${clinic.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#182522] bg-white/95 backdrop-blur-sm border border-[#E5E5DF] px-2.5 py-1 rounded">
                      {clinic.clinicType}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-[16px] font-bold text-[#182522] leading-snug">
                      {clinic.name}
                    </h2>
                    <p className="text-[12.5px] text-[#66736F] line-clamp-2 mt-1 leading-relaxed">
                      {clinic.description}
                    </p>

                    <div className="mt-3.5 space-y-1.5 text-[12px] text-[#66736F]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#66736F]/70 flex-shrink-0" strokeWidth={1.75} />
                        <span className="line-clamp-1">{clinic.address}, {clinic.city} - {clinic.pinCode}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-[#66736F]/70 flex-shrink-0" strokeWidth={1.75} />
                        <span>{clinic.doctors.length} Doctor{clinic.doctors.length !== 1 ? "s" : ""} on schedule</span>
                      </div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[12px] font-medium text-[#182522]">
                          Consultation from <strong className="font-bold text-[#087F78]">₹{clinic.minFee}</strong>
                        </span>
                      </div>
                    </div>

                    {clinic.doctors.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#E5E5DF]/70 flex flex-wrap gap-1.5">
                        {clinic.doctors.map((d) => (
                          <span
                            key={d.id}
                            className="text-[11px] px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#E5E5DF] text-[#182522] font-medium"
                          >
                            {d.name} ({d.specialtyName})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
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
      </main>
      </AnimatedPage>

      <PublicFooter />
    </div>
  );
}
