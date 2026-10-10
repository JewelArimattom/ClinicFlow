import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Helper to generate time slots with duration
function generateTimeSlots(startHour: number, endHour: number, intervalMinutes: number): string[] {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += intervalMinutes) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date"); // YYYY-MM-DD

    if (!doctorId || !date) {
      return NextResponse.json({ error: "doctorId and date are required" }, { status: 400 });
    }

    const clinic = await db.getClinicBySlug(slug);
    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    const doctor = await db.getDoctorById(doctorId);
    if (!doctor || doctor.clinicId !== clinic.id) {
      return NextResponse.json({ error: "Doctor not found at this clinic" }, { status: 404 });
    }

    // Default morning & evening clinic shifts
    const morningSlots = generateTimeSlots(9, 13, clinic.defaultSlotMinutes || 15);
    const eveningSlots = generateTimeSlots(16, 20, clinic.defaultSlotMinutes || 15);
    const allScheduleSlots = [...morningSlots, ...eveningSlots];

    // Fetch existing booked appointments on this date
    const existingAppointments = await db.getAppointments(clinic.id, { date, doctorId });
    const bookedStartTimes = new Set(
      existingAppointments
        .filter(a => a.status !== "CANCELLED")
        .map(a => a.startTime)
    );

    const slotDuration = clinic.defaultSlotMinutes || 15;
    const availableSlots = allScheduleSlots.map(timeStr => {
      const [h, m] = timeStr.split(":").map(Number);
      const endTotalM = h * 60 + m + slotDuration;
      const endH = String(Math.floor(endTotalM / 60)).padStart(2, "0");
      const endM = String(endTotalM % 60).padStart(2, "0");
      const endTime = `${endH}:${endM}`;

      const isAvailable = !bookedStartTimes.has(timeStr);

      return {
        startTime: timeStr,
        endTime,
        isAvailable,
      };
    });

    return NextResponse.json({
      date,
      doctorId,
      slotDurationMinutes: slotDuration,
      slots: availableSlots,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to check availability" }, { status: 500 });
  }
}
