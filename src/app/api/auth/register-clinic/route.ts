import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

const registerSchema = z.object({
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  clinicName: z.string().min(2, "Clinic name must be at least 2 characters"),
  clinicType: z.string().default("General Clinic"),
  city: z.string().min(2, "City is required"),
  state: z.string().default("Kerala"),
  address: z.string().min(5, "Address is required"),
  pinCode: z.string().min(6, "Valid 6-digit PIN code required"),
  consultationFee: z.number().default(400),
  slotDurationMinutes: z.number().default(15),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const data = parsed.data;

    // Check if user already exists
    const existingUser = await db.getUserByEmail(data.email);
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists. Please log in." }, { status: 400 });
    }

    // Generate URL-friendly unique slug
    let baseSlug = data.clinicName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    if (!baseSlug) baseSlug = "clinic";

    let slug = baseSlug;
    let counter = 1;
    while (await db.getClinicBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 1. Create User
    const passwordHash = await hashPassword(data.password);
    const user = await db.createUser({
      email: data.email,
      fullName: data.ownerName,
      passwordHash,
      phone: data.phone,
    });

    // 2. Create Clinic
    const clinic = await db.createClinic({
      name: data.clinicName,
      slug,
      clinicType: data.clinicType,
      description: `${data.clinicName} offers trusted healthcare services in ${data.city}.`,
      address: data.address,
      city: data.city,
      state: data.state,
      pinCode: data.pinCode,
      phone: data.phone,
      email: data.email,
      logoUrl: "",
      coverUrl: "",
      brandColor: "#0d9488",
      timezone: "Asia/Kolkata",
      currency: "INR",
      isVerified: true,
      isPublished: true,
      bookingEnabled: true,
      customDomain: null,
      cancellationHours: 2,
      bufferMinutes: 5,
      defaultSlotMinutes: data.slotDurationMinutes,
    });

    // 3. Add Membership
    await db.addClinicMembership(clinic.id, user.id, "OWNER");

    // 4. Create primary doctor profile for the owner
    await db.createDoctor(clinic.id, {
      userId: user.id,
      name: data.ownerName,
      email: data.email,
      phone: data.phone,
      specialtyName: data.clinicType.includes("Dental") ? "Dentistry" : "General Medicine",
      qualifications: "MBBS / Healthcare Specialist",
      consultationFee: data.consultationFee,
      bio: "Chief Medical Officer and clinic consultant.",
      isActive: true,
    });

    // 5. Establish auth session
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      isSuperAdmin: false,
      clinicId: clinic.id,
      clinicSlug: clinic.slug,
      clinicName: clinic.name,
      role: "OWNER",
    });

    return NextResponse.json({
      success: true,
      clinic: {
        id: clinic.id,
        name: clinic.name,
        slug: clinic.slug,
      },
      redirectUrl: "/app/dashboard",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to register clinic" }, { status: 500 });
  }
}
