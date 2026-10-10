import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import { SpecialtyIcon } from "@/components/ui/SpecialtyIcon";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { db } from "@/lib/db";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  BadgeCheck,
  Calendar,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  ChevronLeft,
} from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const clinic = await db.getClinicBySlug(params.slug);
  if (!clinic) return { title: "Clinic Not Found" };
  return {
    title: `${clinic.name} - Doctors & Online Appointment Booking | ClinicFlow`,
    description: `${clinic.description} Located at ${clinic.address}, ${clinic.city}. Book doctor consultation appointments online.`,
  };
}

export default async function PublicClinicProfilePage({ params }: { params: { slug: string } }) {
  const clinic = await db.getClinicBySlug(params.slug);
  if (!clinic || !clinic.isPublished) {
    notFound();
  }

  const doctors = await db.getDoctors(clinic.id);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      {/* Cover image + clinic header */}
      <section className="relative">
        {/* Cover image */}
        <div className="relative h-48 sm:h-56 lg:h-64 bg-gray-100">
          <Image
            src="/images/clinic-reception.jpg"
            alt={`${clinic.name} clinic`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent" />
        </div>

        {/* Clinic info overlay */}
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-20 pb-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-elevated p-5 sm:p-6">
              {/* Breadcrumb */}
              <Link
                href="/search"
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-brand-600 mb-4 transition-colors focus-ring rounded"
              >
                <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} /> Back to search
              </Link>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                      {clinic.clinicType}
                    </span>
                    {clinic.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                        <BadgeCheck className="w-3 h-3" strokeWidth={2} /> Verified
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                    {clinic.name}
                  </h1>

                  <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
                    {clinic.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-600" strokeWidth={1.75} />
                      {clinic.address}, {clinic.city} - {clinic.pinCode}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-brand-600" strokeWidth={1.75} />
                      {clinic.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-brand-600" strokeWidth={1.75} />
                      {clinic.email}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Link
                    href={`/book/${clinic.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-primary transition-all duration-fast w-full md:w-auto btn-press focus-ring"
                  >
                    <Calendar className="w-4 h-4" strokeWidth={2} />
                    Book Appointment
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="flex-1 max-w-container w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Doctors */}
          <div className="lg:col-span-8 space-y-5">
            <ScrollReveal>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                    Consulting Doctors ({doctors.length})
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Specialists available for in-clinic consultation
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="space-y-4">
              {doctors.map((doctor) => (
                <ScrollReveal key={doctor.id}>
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-card hover:shadow-elevated transition-shadow duration-normal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0">
                        <SpecialtyIcon name={doctor.specialtyName} className="w-6 h-6" strokeWidth={1.75} />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-gray-900">{doctor.name}</h3>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-brand-50 text-brand-800 border border-brand-200/60">
                            {doctor.specialtyName}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 font-medium">{doctor.qualifications}</p>
                        {doctor.registrationNumber && (
                          <p className="text-[11px] text-gray-400">Reg: {doctor.registrationNumber}</p>
                        )}
                        {doctor.bio && (
                          <p className="text-xs text-gray-500 pt-0.5 line-clamp-2 leading-relaxed">{doctor.bio}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 gap-3 flex-shrink-0">
                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-gray-400 block">Consultation</span>
                        <span className="text-xl font-bold text-gray-900">₹{doctor.consultationFee}</span>
                      </div>
                      <Link
                        href={`/book/${clinic.slug}?doctorId=${doctor.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all duration-fast btn-press focus-ring"
                      >
                        Book Slot
                        <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-5">
            {/* Clinic Hours */}
            <ScrollReveal>
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-card space-y-4">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                  <Clock className="w-4 h-4 text-brand-600" strokeWidth={1.75} />
                  <h3>Clinic Hours</h3>
                </div>
                <div className="space-y-0 text-xs">
                  {[
                    { day: "Monday – Friday", time: "09:00 AM – 08:00 PM", active: true },
                    { day: "Saturday", time: "09:00 AM – 05:00 PM", active: true },
                    { day: "Sunday", time: "Closed (Emergency Only)", active: false },
                  ].map((row) => (
                    <div key={row.day} className="flex justify-between py-2.5 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-700">{row.day}</span>
                      <span className={`font-semibold ${row.active ? "text-gray-900" : "text-red-500"}`}>
                        {row.time}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-[11px] text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
                  <strong>Booking Policy:</strong> Online slots are confirmed immediately. Walk-in tokens are also allocated at the front desk.
                </div>
              </div>
            </ScrollReveal>

            {/* Location */}
            <ScrollReveal>
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-card space-y-4">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                  <MapPin className="w-4 h-4 text-brand-600" strokeWidth={1.75} />
                  <h3>Location</h3>
                </div>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <p className="font-semibold text-gray-800">{clinic.name}</p>
                  <p>{clinic.address}</p>
                  <p>{clinic.city}, {clinic.state} - {clinic.pinCode}</p>
                  <p className="pt-1 text-brand-700 font-medium">Helpline: {clinic.phone}</p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.name + " " + clinic.address + " " + clinic.city)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors focus-ring"
                >
                  Open in Google Maps
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
                </a>
              </div>
            </ScrollReveal>

            {/* Trust badge */}
            <ScrollReveal>
              <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-200/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-800">
                  <ShieldCheck className="w-4 h-4 text-brand-600" strokeWidth={1.75} />
                  <span>Healthcare Facility</span>
                </div>
                <p className="text-[11px] text-brand-900/70 leading-relaxed">
                  Registered medical practice with verified doctor registrations. Digital invoices and prescriptions provided.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
