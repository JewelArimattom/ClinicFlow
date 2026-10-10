import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { db } from "../src/lib/db.ts";

describe("Appointments & Queue State Machine Tests", () => {
  it("prevents double-booking collision on the same doctor and slot", async () => {
    const testDate = "2026-11-20";
    const testTime = "11:15";

    // 1. First booking succeeds
    const apt1 = await db.createAppointment({
      clinicId: "clinic-aura",
      patientId: "pat-1",
      doctorId: "doc-rajesh",
      date: testDate,
      startTime: testTime,
      endTime: "11:30",
      consultationFee: 400,
    });
    assert.ok(apt1.reference);

    // 2. Second booking on identical slot must be rejected
    await assert.rejects(
      async () => {
        await db.createAppointment({
          clinicId: "clinic-aura",
          patientId: "pat-2",
          doctorId: "doc-rajesh",
          date: testDate,
          startTime: testTime,
          endTime: "11:30",
          consultationFee: 400,
        });
      },
      /is no longer available/
    );
  });

  it("enforces permitted status transitions and rejects illegal transitions", async () => {
    const apt = await db.createAppointment({
      clinicId: "clinic-aura",
      patientId: "pat-1",
      doctorId: "doc-deepa",
      date: "2026-11-25",
      startTime: "12:00",
      endTime: "12:15",
      consultationFee: 500,
    });

    assert.equal(apt.status, "CONFIRMED");

    // CONFIRMED -> CHECKED_IN is allowed
    const checkedIn = await db.updateAppointmentStatus("clinic-aura", apt.id, "CHECKED_IN");
    assert.equal(checkedIn.status, "CHECKED_IN");

    // CHECKED_IN -> WAITING is allowed
    const waiting = await db.updateAppointmentStatus("clinic-aura", apt.id, "WAITING");
    assert.equal(waiting.status, "WAITING");

    // WAITING -> IN_PROGRESS is allowed
    const inProgress = await db.updateAppointmentStatus("clinic-aura", apt.id, "IN_PROGRESS");
    assert.equal(inProgress.status, "IN_PROGRESS");

    // IN_PROGRESS -> COMPLETED is allowed
    const completed = await db.updateAppointmentStatus("clinic-aura", apt.id, "COMPLETED");
    assert.equal(completed.status, "COMPLETED");

    // COMPLETED -> CANCELLED is ILLEGAL and must be rejected
    await assert.rejects(
      async () => {
        await db.updateAppointmentStatus("clinic-aura", apt.id, "CANCELLED");
      },
      /Invalid status transition/
    );
  });
});
