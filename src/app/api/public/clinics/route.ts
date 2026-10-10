import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || undefined;
    const specialtySlug = searchParams.get("specialty") || undefined;
    const query = searchParams.get("q") || undefined;

    const clinics = await db.getClinics({ city, specialtySlug, query, publishedOnly: true });

    // Attach doctors count and primary specialties for discovery cards
    const clinicsWithMeta = await Promise.all(
      clinics.map(async (c) => {
        const doctors = await db.getDoctors(c.id);
        const specialties = Array.from(new Set(doctors.map(d => d.specialtyName)));
        const minFee = doctors.length > 0 ? Math.min(...doctors.map(d => d.consultationFee)) : null;

        return {
          id: c.id,
          name: c.name,
          slug: c.slug,
          clinicType: c.clinicType,
          description: c.description,
          address: c.address,
          city: c.city,
          state: c.state,
          pinCode: c.pinCode,
          phone: c.phone,
          brandColor: c.brandColor,
          isVerified: c.isVerified,
          bookingEnabled: c.bookingEnabled,
          doctorsCount: doctors.length,
          specialties,
          minConsultationFee: minFee,
        };
      })
    );

    return NextResponse.json({ clinics: clinicsWithMeta });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch clinics" }, { status: 500 });
  }
}
