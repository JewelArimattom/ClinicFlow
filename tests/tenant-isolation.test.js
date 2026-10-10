import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { db } from "../src/lib/db.ts";
import { requireTenant, hasRole } from "../src/lib/auth.ts";

describe("Tenant Isolation Tests", () => {
  it("rejects cross-tenant invoice queries", async () => {
    // Clinic A (Aura Health)
    const clinicAInvoices = await db.getInvoices("clinic-aura");
    assert.ok(clinicAInvoices.length > 0, "Clinic A should have invoices");

    // All returned invoices must strictly belong to clinic-aura
    for (const inv of clinicAInvoices) {
      assert.equal(inv.clinicId, "clinic-aura", "Invoice must belong to Clinic A");
    }

    // Clinic B (CareWell Family)
    const clinicBInvoices = await db.getInvoices("clinic-carewell");
    for (const inv of clinicBInvoices) {
      assert.equal(inv.clinicId, "clinic-carewell", "Invoice must belong to Clinic B");
    }
  });

  it("prevents Clinic B from updating Clinic A's appointments", async () => {
    const apts = await db.getAppointments("clinic-aura");
    assert.ok(apts.length > 0);
    const targetApt = apts[0];

    // Attempting to mutate Clinic A's appointment with Clinic B's context must fail
    await assert.rejects(
      async () => {
        await db.updateAppointmentStatus("clinic-carewell", targetApt.id, "CANCELLED");
      },
      /Appointment not found in this clinic/
    );
  });

  it("verifies requireTenant security helper", () => {
    const sessionOwner = {
      userId: "u-1",
      email: "owner@aura.in",
      fullName: "Dr. Rajesh",
      isSuperAdmin: false,
      clinicId: "clinic-aura",
    };

    assert.equal(requireTenant(sessionOwner, "clinic-aura"), true);
    assert.equal(requireTenant(sessionOwner, "clinic-carewell"), false);

    // SuperAdmin should have global elevated access
    const sessionSuperAdmin = {
      userId: "u-admin",
      email: "admin@saas.in",
      fullName: "Super Admin",
      isSuperAdmin: true,
    };
    assert.equal(requireTenant(sessionSuperAdmin, "clinic-aura"), true);
    assert.equal(requireTenant(sessionSuperAdmin, "clinic-carewell"), true);
  });
});
