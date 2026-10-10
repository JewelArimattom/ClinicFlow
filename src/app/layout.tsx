import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ClinicFlow | Find Clinics & Book Doctor Appointments in India",
  description: "Discover trusted clinics and doctors near you. Check real appointment availability and book your consultation in a few simple steps. Manage clinic operations, billing, and pharmacy inventory.",
  keywords: "clinic management software, doctor appointment booking, polyclinic software, pharmacy inventory, queue management system, healthcare India",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "ClinicFlow | Find Clinics & Book Appointments",
    description: "Discover trusted clinics and doctors near you. Book appointments without friction.",
    siteName: "ClinicFlow",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D9488",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white text-foreground antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
