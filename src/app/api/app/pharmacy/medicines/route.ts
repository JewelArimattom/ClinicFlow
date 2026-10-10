import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.clinicId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const medicines = await db.getMedicines(session.clinicId);
    return NextResponse.json({ medicines });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch medicines" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.clinicId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, brand, genericName, dosageForm, strength, barcode, uom, purchasePrice, sellingPrice, reorderThreshold, taxPercent, isPrescriptionRequired } = body;

    if (!name || !sellingPrice) {
      return NextResponse.json({ error: "Medicine name and selling price are required" }, { status: 400 });
    }

    const medicine = await db.addMedicine(session.clinicId, {
      name,
      brand: brand || null,
      genericName: genericName || null,
      dosageForm: dosageForm || "Tablet",
      strength: strength || null,
      barcode: barcode || null,
      uom: uom || "Strip",
      purchasePrice: Number(purchasePrice || 0),
      sellingPrice: Number(sellingPrice),
      reorderThreshold: Number(reorderThreshold || 10),
      taxPercent: Number(taxPercent || 0),
      isPrescriptionRequired: Boolean(isPrescriptionRequired),
      isActive: true,
    });

    return NextResponse.json({ success: true, medicine });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create medicine" }, { status: 500 });
  }
}
