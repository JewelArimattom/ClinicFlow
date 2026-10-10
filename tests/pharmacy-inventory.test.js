import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { db } from "../src/lib/db.ts";

describe("Pharmacy Inventory & FEFO Checkout Tests", () => {
  it("atomically deducts inventory stock and issues paid invoice", async () => {
    // 1. Add fresh medicine
    const med = await db.addMedicine("clinic-aura", {
      name: "Amoxicillin 250mg",
      brand: "Mankind",
      dosageForm: "Capsule",
      sellingPrice: 40,
      reorderThreshold: 10,
      uom: "Strip",
      purchasePrice: 25,
      taxPercent: 0,
      isPrescriptionRequired: true,
      isActive: true,
    });

    // 2. Receive batch with 20 units
    const batch = await db.receiveStockBatch("clinic-aura", {
      medicineId: med.id,
      batchNumber: "AMX-TEST-01",
      expiryDate: "2027-01-01",
      purchaseCost: 25,
      sellingPrice: 40,
      quantity: 20,
    });
    assert.equal(batch.currentStock, 20);

    // 3. Process sale of 5 units
    const saleResult = await db.processPharmacySale("clinic-aura", {
      items: [{ medicineId: med.id, quantity: 5 }],
      paymentMethod: "CASH",
    });

    // Invoice should equal 5 * 40 = ₹200
    assert.equal(saleResult.invoice.totalAmount, 200);
    assert.equal(saleResult.invoice.status, "PAID");

    // Batch stock should now be 15
    const updatedBatches = await db.getBatches("clinic-aura", med.id);
    const targetBatch = updatedBatches.find(b => b.id === batch.id);
    assert.equal(targetBatch.currentStock, 15);
  });

  it("prevents sale when requested quantity exceeds available stock", async () => {
    const med = await db.addMedicine("clinic-aura", {
      name: "Rare Antidote",
      dosageForm: "Vial",
      sellingPrice: 1000,
      reorderThreshold: 1,
      uom: "Vial",
      purchasePrice: 800,
      taxPercent: 0,
      isPrescriptionRequired: true,
      isActive: true,
    });

    // Only 2 vials in stock
    await db.receiveStockBatch("clinic-aura", {
      medicineId: med.id,
      batchNumber: "RARE-01",
      expiryDate: "2027-06-01",
      purchaseCost: 800,
      sellingPrice: 1000,
      quantity: 2,
    });

    // Attempting to buy 5 vials must fail atomically
    await assert.rejects(
      async () => {
        await db.processPharmacySale("clinic-aura", {
          items: [{ medicineId: med.id, quantity: 5 }],
          paymentMethod: "UPI",
        });
      },
      /Insufficient stock/
    );
  });
});
