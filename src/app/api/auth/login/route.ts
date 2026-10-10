import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const user = await db.getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Determine clinic context
    const memberships = await db.getUserMemberships(user.id);
    const primaryMembership = memberships[0];

    const sessionPayload = {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      isSuperAdmin: user.isSuperAdmin,
      clinicId: primaryMembership?.clinicId,
      clinicSlug: primaryMembership?.clinic?.slug,
      clinicName: primaryMembership?.clinic?.name,
      role: primaryMembership?.role,
    };

    await setSessionCookie(sessionPayload);

    let redirectUrl = "/app/dashboard";
    if (user.isSuperAdmin) {
      redirectUrl = "/platform-admin";
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isSuperAdmin: user.isSuperAdmin,
        role: primaryMembership?.role,
        clinicName: primaryMembership?.clinic?.name,
      },
      redirectUrl,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Authentication error" }, { status: 500 });
  }
}
