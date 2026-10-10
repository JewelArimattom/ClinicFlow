import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.clinicId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const medicineId = searchParams.get("medicineId") || undefined;

    const batches = await db.getBatches(session.clinicId, medicineId);
    return NextResponse.json({ batches });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch inventory batches" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.clinicId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { medicineId, batchNumber, expiryDate, purchaseCost, sellingPrice, quantity, supplierId } = body;

    if (!medicineId || !batchNumber || !expiryDate || !sellingPrice || !quantity) {
      return NextResponse.json({ error: "Missing required batch receiving fields" }, { status: 400 });
    }

    const batch = await db.receiveStockBatch(session.clinicId, {
      medicineId,
      batchNumber,
      expiryDate,
      purchaseCost: Number(purchaseCost || 0),
      sellingPrice: Number(sellingPrice),
      quantity: Number(quantity),
      supplierId: supplierId || undefined,
    });

    return NextResponse.json({ success: true, batch });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to receive batch" }, { status: 500 });
  }
}
