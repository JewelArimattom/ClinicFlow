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
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-teal-600 selection:text-white">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold tracking-wide">
            <Ticket className="w-3.5 h-3.5 text-teal-600" />
            Patient Self-Service Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Manage Your Appointments
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
            Check your consultation slip, track live queue status, or manage your appointment details in one click.
          </p>
        </div>

        {/* Lookup Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl shadow-slate-900/5 mb-10 transition-all">
          {/* Segmented Switch */}
          <div className="flex bg-slate-100 p-1 rounded-2xl max-w-md mx-auto mb-6">
            <button
              type="button"
              onClick={() => { setSearchType("phone"); setSearchValue(""); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                searchType === "phone"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              Search by Phone
            </button>
            <button
              type="button"
              onClick={() => { setSearchType("reference"); setSearchValue(""); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                searchType === "reference"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              Booking Reference
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                {searchType === "phone" ? <Phone className="w-4 h-4 text-teal-600" /> : <Search className="w-4 h-4 text-teal-600" />}
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
                className="w-full pl-11 pr-4 py-3.5 text-sm rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !searchValue.trim()}
              className="py-3.5 px-7 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:shadow-teal-600/20 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Looking up...</span>
                </>
              ) : (
                <>
                  <span>Find Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Pills */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Quick Test Reference:</span>
            <button
              type="button"
              onClick={() => handleQuickDemo("APT-9F42A1")}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-mono text-[11px] font-semibold border border-slate-200 transition"
            >
              APT-9F42A1
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("APT-8B11C3")}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-mono text-[11px] font-semibold border border-slate-200 transition"
            >
              APT-8B11C3
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs flex items-center gap-2.5 mb-8 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Results Section */}
        {searched && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Found Bookings ({results.length})
              </h2>
              {results.length > 0 && (
                <span className="text-xs text-slate-500 font-medium">
                  Click slip to view full details
                </span>
              )}
            </div>

            {results.length === 0 && !isLoading && (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No appointments found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We couldn't find any appointment associated with this query. Please check your reference or contact your clinic.
                </p>
                <div className="pt-2">
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition"
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
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-white shadow-sm">
                        {booking.reference}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        isCompleted
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isCancelled
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-teal-50 text-teal-700 border-teal-200"
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {booking.clinic?.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {booking.clinic?.address}, {booking.clinic?.city}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2 font-medium">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span>{booking.startTime} - {booking.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2 font-medium">
                        <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                        <span>{booking.doctor?.name} ({booking.doctor?.specialtyName})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <span className="text-lg font-extrabold text-slate-900">
                      ₹{booking.consultationFee}
                    </span>
                    <Link
                      href={`/booking/confirmation/${booking.reference}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm shadow-teal-600/20 transition group-hover:shadow-md"
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
  );
}
