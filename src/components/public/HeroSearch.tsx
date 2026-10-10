"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

const POPULAR_CITIES = ["Kochi", "Bangalore", "Chennai", "Trivandrum"];

export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (city.trim()) params.set("city", city.trim());
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    params.set("city", selectedCity);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Search Panel Card */}
      <div className="bg-white p-2.5 sm:p-3.5 rounded-2xl border border-gray-200/90 shadow-xl shadow-gray-900/[0.04] transition-all duration-fast hover:border-gray-300">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2">
          {/* Query Field */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" strokeWidth={1.75} />
            </div>
            <input
              type="text"
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Clinic, doctor, or specialty"
              className="w-full h-12 pl-10 pr-3 text-sm text-gray-900 rounded-xl border border-gray-200 bg-gray-50/60 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all duration-fast"
              aria-label="Search by clinic name, doctor name, or medical specialty"
            />
          </div>

          {/* City / PIN Field */}
          <div className="relative sm:w-52">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <MapPin className="w-4 h-4 text-gray-400" strokeWidth={1.75} />
            </div>
            <input
              type="text"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City or PIN code"
              className="w-full h-12 pl-10 pr-3 text-sm text-gray-900 rounded-xl border border-gray-200 bg-gray-50/60 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all duration-fast"
              aria-label="Search by city or postal code"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="h-12 px-5 sm:px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all duration-fast flex items-center justify-center gap-2 shadow-sm hover:shadow-md btn-press flex-shrink-0"
          >
            <span>Search Clinics</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </form>

        {/* Popular Locations */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs overflow-x-auto no-scrollbar pb-0.5">
          <span className="font-medium text-gray-500 flex-shrink-0">Popular:</span>
          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
            {POPULAR_CITIES.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => handleCitySelect(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors duration-fast flex-shrink-0 ${
                  city.toLowerCase() === c.toLowerCase()
                    ? "bg-brand-50 text-brand-700 border border-brand-200"
                    : "bg-gray-50 text-gray-600 border border-gray-200/70 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Benefits */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500 pt-0.5">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" strokeWidth={2} />
          <span>No account required to browse</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" strokeWidth={2} />
          <span>Real availability when provided by the clinic</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" strokeWidth={2} />
          <span>Simple booking</span>
        </span>
      </div>
    </div>
  );
}
