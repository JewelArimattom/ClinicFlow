import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { db } from "../src/lib/db.ts";

describe("Billing & Financial Integrity Tests", () => {
  it("accurately calculates invoice totals with multiple line items", async () => {
    const inv = await db.createInvoice("clinic-aura", {
      type: "CONSULTATION",
      items: [
        { description: "Specialist Consultation", quantity: 1, unitPrice: 500, discount: 50, taxRate: 0 },
        { description: "ECG Test", quantity: 1, unitPrice: 300, discount: 0, taxRate: 18 },
      ],
      notes: "Test Financial Calculation",
    });

    // Item 1: 1 * 500 - 50 = 450
    // Item 2: 1 * 300 + 18% (54) = 354
    // Subtotal: 800, Discount: 50, Tax: 54, Total: 804
    assert.equal(inv.subtotal, 800);
    assert.equal(inv.discountTotal, 50);
    assert.equal(inv.taxTotal, 54);
    assert.equal(inv.totalAmount, 804);
    assert.equal(inv.outstandingAmount, 804);
    assert.equal(inv.status, "ISSUED");
  });

  it("handles partial payment correctly and prevents overpayment", async () => {
    const inv = await db.createInvoice("clinic-aura", {
      type: "CONSULTATION",
      items: [{ description: "Follow-up", quantity: 1, unitPrice: 600, discount: 0, taxRate: 0 }],
    });

    // 1. Partial payment of ₹250
    const { invoice: partialInv } = await db.recordPayment("clinic-aura", {
      invoiceId: inv.id,
      amount: 250,
      method: "UPI",
      reference: "UPI/TEST1234",
    });

    assert.equal(partialInv.paidAmount, 250);
    assert.equal(partialInv.outstandingAmount, 350);
    assert.equal(partialInv.status, "PARTIALLY_PAID");

    // 2. Reject overpayment (attempting to pay ₹500 when only ₹350 is due)
    await assert.rejects(
      async () => {
        await db.recordPayment("clinic-aura", {
          invoiceId: inv.id,
          amount: 500,
          method: "CASH",
        });
      },
      /Payment cannot exceed outstanding balance/
    );

    // 3. Complete payment of remaining ₹350
    const { invoice: fullyPaidInv } = await db.recordPayment("clinic-aura", {
      invoiceId: inv.id,
      amount: 350,
      method: "CASH",
    });

    assert.equal(fullyPaidInv.paidAmount, 600);
    assert.equal(fullyPaidInv.outstandingAmount, 0);
    assert.equal(fullyPaidInv.status, "PAID");
  });
});
