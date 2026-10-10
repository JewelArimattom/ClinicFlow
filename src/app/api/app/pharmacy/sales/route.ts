import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.clinicId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { patientId, items, paymentMethod, paymentReference } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart cannot be empty" }, { status: 400 });
    }

    // Process sale through atomic transaction method
    const result = await db.processPharmacySale(session.clinicId, {
      patientId: patientId || undefined,
      items: items.map((it: any) => ({
        medicineId: it.medicineId,
        batchId: it.batchId || undefined,
        quantity: Number(it.quantity || 1),
      })),
      paymentMethod: paymentMethod || "CASH",
      paymentReference,
      recordedByUserId: session.userId,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to complete pharmacy sale" }, { status: 400 });
  }
}
