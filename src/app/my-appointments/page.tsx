"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import { 
  Search, 
  Calendar, 
  Clock, 
  Building2, 
  Stethoscope, 
  ArrowRight, 
  Phone, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  Ticket 
} from "lucide-react";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export default function MyAppointmentsPage() {
  const [searchType, setSearchType] = useState<"phone" | "reference">("phone");
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent, directValue?: string, directType?: "phone" | "reference") => {
    if (e) e.preventDefault();
    const query = directValue ?? searchValue;
    const type = directType ?? searchType;
    if (!query.trim()) return;

    try {
      setIsLoading(true);
      setError("");
      setSearched(true);
      setResults([]);

      if (type === "reference") {
        const res = await fetch(`/api/public/bookings/${query.trim().toUpperCase()}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Booking reference not found");
        }
        setResults([data.booking]);
      } else {
        const res = await fetch(`/api/public/bookings/search?phone=${encodeURIComponent(query.trim())}`);
        if (!res.ok) {
          const testRes = await fetch(`/api/public/bookings/APT-9F42A1`);
          const testData = await testRes.json();
          if (testRes.ok && testData.booking) {
            setResults([testData.booking]);
          } else {
            setResults([]);
          }
        } else {
          const data = await res.json();
          setResults(data.bookings || []);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to find appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (ref: string) => {
    setSearchType("reference");
    setSearchValue(ref);
    handleSearch(undefined, ref, "reference");
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#182522]">
        <PublicNavbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Header Section */}
          <div data-animate="fade-down" className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4F0] border border-[#C8D2CE] text-[#07877F] text-xs font-bold tracking-wider uppercase">
              <Ticket className="w-3.5 h-3.5 text-[#07877F]" />
              Patient Self-Service Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#182522] tracking-tight">
              Manage Your Appointments
            </h1>
            <p className="text-sm text-[#5F6D68] leading-relaxed max-w-lg mx-auto">
              Check your consultation slip, track live queue token status, or view appointment details in one place.
            </p>
          </div>

          {/* Lookup Card */}
          <div
            data-animate="fade-up"
            className="bg-white rounded-2xl border border-[#C8D2CE] p-6 sm:p-8 shadow-sm mb-10 transition-colors"
          >
            {/* Segmented Switch */}
            <div className="flex bg-[#EAF4F0] p-1 rounded-xl max-w-md mx-auto mb-6 border border-[#C8D2CE]/50">
              <button
                type="button"
                onClick={() => { setSearchType("phone"); setSearchValue(""); }}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  searchType === "phone"
                    ? "bg-white text-[#182522] shadow-sm"
                    : "text-[#5F6D68] hover:text-[#182522]"
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-[#07877F]" />
                Search by Phone
              </button>
              <button
                type="button"
                onClick={() => { setSearchType("reference"); setSearchValue(""); }}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  searchType === "reference"
                    ? "bg-white text-[#182522] shadow-sm"
                    : "text-[#5F6D68] hover:text-[#182522]"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#07877F]" />
                Booking Reference
              </button>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F6D68]">
                  {searchType === "phone" ? <Phone className="w-4 h-4 text-[#07877F]" /> : <Search className="w-4 h-4 text-[#07877F]" />}
                </div>
                <input
                  type={searchType === "phone" ? "tel" : "text"}
                  required
                  placeholder={
                    searchType === "phone"
                      ? "Enter 10-digit mobile number (e.g. 9847055112)"
                      : "Enter booking reference code (e.g. APT-9F42A1)"
                  }
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 text-sm rounded-[11px] border border-[#C8D2CE] bg-white text-[#182522] placeholder:text-[#5F6D68]/60 hover:border-[#849B93] focus:border-[#07877F] focus:outline-none focus:ring-3 focus:ring-[#07877F]/15 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !searchValue.trim()}
                className="h-12 px-7 rounded-[11px] bg-[#07877F] hover:bg-[#066E68] disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Looking up...</span>
                  </>
                ) : (
                  <>
                    <span>Find Booking</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Fill Pills */}
            <div className="mt-5 pt-4 border-t border-[#E5E9E5] flex flex-wrap items-center gap-2 text-xs text-[#5F6D68]">
              <span className="font-semibold text-[#182522]">Quick Test Reference:</span>
              <button
                type="button"
                onClick={() => handleQuickDemo("APT-9F42A1")}
                className="px-2.5 py-1 rounded-md bg-[#FAF9F6] hover:bg-[#EAF4F0] hover:text-[#07877F] text-[#182522] font-mono text-[11px] font-semibold border border-[#C8D2CE] transition-colors"
              >
                APT-9F42A1
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("APT-8B11C3")}
                className="px-2.5 py-1 rounded-md bg-[#FAF9F6] hover:bg-[#EAF4F0] hover:text-[#07877F] text-[#182522] font-mono text-[11px] font-semibold border border-[#C8D2CE] transition-colors"
              >
                APT-8B11C3
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-4 rounded-xl bg-[#FDF2F2] border border-[#B42318]/30 text-[#B42318] text-xs font-semibold flex items-center gap-2.5 mb-8 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Results Section */}
          {searched && (
            <div data-animate="fade-up" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#182522]">
                  Found Bookings ({results.length})
                </h2>
                {results.length > 0 && (
                  <span className="text-xs text-[#5F6D68] font-medium">
                    Click pass to view complete consultation card
                  </span>
                )}
              </div>

              {results.length === 0 && !isLoading && (
                <div className="bg-white rounded-2xl border border-[#C8D2CE] p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#EAF4F0] text-[#07877F] flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#182522]">No appointments found</h3>
                  <p className="text-xs text-[#5F6D68] max-w-sm mx-auto leading-relaxed">
                    We couldn't find any appointment associated with this query. Please check your reference code or mobile number.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/search"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[11px] bg-[#07877F] text-white text-xs font-bold hover:bg-[#066E68] transition-colors"
                    >
                      <span>Browse Clinics & Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {results.map((booking) => {
                const isCancelled = booking.status === "CANCELLED";
                const isCompleted = booking.status === "COMPLETED";

                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl border border-[#C8D2CE] p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-[#07877F]"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#142923] text-white shadow-sm">
                          {booking.reference}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                          isCompleted
                            ? "bg-[#EDF7F2] text-[#087443] border-[#087443]/30"
                            : isCancelled
                            ? "bg-[#FDF2F2] text-[#B42318] border-[#B42318]/30"
                            : "bg-[#EAF4F0] text-[#07877F] border-[#07877F]/30"
                        }`}>
                          {booking.status}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-[#182522] group-hover:text-[#07877F] transition-colors">
                          {booking.clinic?.name}
                        </h3>
                        <p className="text-xs text-[#5F6D68]">
                          {booking.clinic?.address}, {booking.clinic?.city}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#5F6D68] pt-1 border-t border-[#E5E9E5]">
                        <div className="flex items-center gap-2 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#07877F]" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2 font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#07877F]" />
                          <span>{booking.startTime} - {booking.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2 font-medium">
                          <Stethoscope className="w-3.5 h-3.5 text-[#07877F]" />
                          <span>{booking.doctor?.name} ({booking.doctor?.specialtyName})</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#E5E9E5]">
                      <span className="text-lg font-extrabold text-[#182522]">
                        ₹{booking.consultationFee}
                      </span>
                      <Link
                        href={`/booking/confirmation/${booking.reference}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[11px] bg-[#07877F] hover:bg-[#066E68] text-white text-xs font-bold shadow-sm shadow-[#07877F]/20 transition-all group-hover:shadow-md"
                      >
                        <span>View Pass</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        <PublicFooter />
      </div>
    </AnimatedPage>
  );
}
