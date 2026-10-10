import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const clinic = await db.getClinicBySlug(slug);

    if (!clinic || !clinic.isPublished) {
      return NextResponse.json({ error: "Clinic not found or not currently published" }, { status: 404 });
    }

    const doctors = await db.getDoctors(clinic.id);

    return NextResponse.json({
      clinic,
      doctors: doctors.map(d => ({
        id: d.id,
        name: d.name,
        specialtyName: d.specialtyName,
        qualifications: d.qualifications,
        consultationFee: d.consultationFee,
        bio: d.bio,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch clinic details" }, { status: 500 });
  }
}
