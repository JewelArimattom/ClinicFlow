"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ArrowRight } from "lucide-react";

// Cities with actual clinic practices in the application database
const POPULAR_LOCATIONS = [
  { name: "Kochi", label: "Kochi, Kerala" },
  { name: "Bangalore", label: "Bangalore, Karnataka" },
  { name: "Chennai", label: "Chennai, Tamil Nadu" },
  { name: "Trivandrum", label: "Trivandrum, Kerala" },
];

export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (city.trim()) params.set("city", city.trim());
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleLocationClick = (locName: string) => {
    setCity(locName);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    params.set("city", locName);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full space-y-3.5">
      {/* Search Panel */}
      <div className="bg-white rounded-xl border border-[#E5E5DF] shadow-[0_2px_8px_rgba(24,37,34,0.04)] p-2 sm:p-2.5 transition-colors">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0"
          role="search"
          aria-label="Find clinics and doctors"
        >
          {/* Field 1: Query */}
          <div className="flex-1 px-3 py-1.5 md:py-2">
            <label
              htmlFor="search-query"
              className="block text-[11px] font-semibold uppercase tracking-wider text-[#66736F] mb-0.5"
            >
              Clinic, Doctor or Specialty
            </label>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#66736F] mr-2.5 flex-shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <input
                id="search-query"
                type="text"
                name="q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g. Dental Care, Dr. Nair, Cardiology"
                className="w-full text-[14px] text-[#182522] placeholder:text-[#66736F]/60 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Desktop Divider */}
          <div className="hidden md:block w-px h-10 bg-[#E5E5DF] mx-1 self-center" aria-hidden="true" />

          {/* Field 2: Location */}
          <div className="md:w-60 px-3 py-1.5 md:py-2 border-t md:border-t-0 border-[#E5E5DF]/60 pt-2 md:pt-1.5">
            <label
              htmlFor="search-city"
              className="block text-[11px] font-semibold uppercase tracking-wider text-[#66736F] mb-0.5"
            >
              City or Locality
            </label>
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-[#66736F] mr-2.5 flex-shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <input
                id="search-city"
                type="text"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Kochi, Bangalore"
                className="w-full text-[14px] text-[#182522] placeholder:text-[#66736F]/60 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-1 md:pt-0 md:pl-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto h-12 md:h-11 px-6 rounded-lg bg-[#087F78] hover:bg-[#066761] text-white text-[13.5px] font-semibold transition-all duration-150 flex items-center justify-center gap-2 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#087F78] focus-visible:ring-offset-2 active:translate-y-[0.5px] flex-shrink-0"
            >
              <span>{isSubmitting ? "Finding..." : "Find Clinics"}</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>

      {/* Popular Locations Links */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] text-[#66736F] px-1">
        <span className="font-medium text-[#182522]">Popular locations:</span>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          {POPULAR_LOCATIONS.map((loc, idx) => (
            <span key={loc.name} className="inline-flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleLocationClick(loc.name)}
                className="text-[#182522] hover:text-[#087F78] hover:underline underline-offset-4 decoration-[#087F78]/50 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#087F78] rounded"
              >
                {loc.name}
              </button>
              {idx < POPULAR_LOCATIONS.length - 1 && (
                <span className="text-[#E5E5DF] select-none" aria-hidden="true">
                  /
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
