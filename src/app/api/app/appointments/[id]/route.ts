import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AppointmentStatus } from "@/lib/types";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || !session.clinicId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { status, reason } = body;

    if (!status) {
      return NextResponse.json({ error: "Target status is required" }, { status: 400 });
    }

    // Verify appointment belongs to this tenant
    const updated = await db.updateAppointmentStatus(
      session.clinicId,
      id,
      status as AppointmentStatus,
      reason
    );

    // If marked checked in, auto enroll in daily queue
    if (status === "CHECKED_IN") {
      await db.checkInToQueue(session.clinicId, id);
    }

    return NextResponse.json({ success: true, appointment: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update appointment status" }, { status: 400 });
  }
}
