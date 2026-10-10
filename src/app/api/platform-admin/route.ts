import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.isSuperAdmin) {
      return NextResponse.json({ error: "Access denied. Platform Super-Admin privileges required." }, { status: 403 });
    }

    const metrics = await db.getPlatformMetrics();
    return NextResponse.json({ metrics });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load platform metrics" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.isSuperAdmin) {
      return NextResponse.json({ error: "Access denied. Platform Super-Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const { clinicId, status, reason } = body;

    if (!clinicId || !status) {
      return NextResponse.json({ error: "clinicId and status are required" }, { status: 400 });
    }

    const result = await db.updateClinicStatus(clinicId, status, reason);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update clinic status" }, { status: 500 });
  }
}
