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
    const { invoiceId, amount, method, reference, notes } = body;

    if (!invoiceId || !amount || !method) {
      return NextResponse.json({ error: "invoiceId, amount, and method are required" }, { status: 400 });
    }

    const result = await db.recordPayment(session.clinicId, {
      invoiceId,
      amount: Number(amount),
      method,
      reference,
      notes,
      recordedByUserId: session.userId,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to record payment" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.clinicId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { paymentId, reason } = body;

    if (!paymentId || !reason) {
      return NextResponse.json({ error: "paymentId and reason are required for a refund" }, { status: 400 });
    }

    const result = await db.recordRefund(session.clinicId, {
      paymentId,
      reason,
      authorizedByUserId: session.userId,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process refund" }, { status: 500 });
  }
}
