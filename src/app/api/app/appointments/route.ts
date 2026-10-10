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
    const date = searchParams.get("date") || undefined;
    const doctorId = searchParams.get("doctorId") || undefined;

    const appointments = await db.getAppointments(session.clinicId, { date, doctorId });
    return NextResponse.json({ appointments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.clinicId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { patientName, patientPhone, doctorId, date, startTime, consultationFee, reason, staffNotes, isWalkIn } = body;

    if (!patientName || !patientPhone || !doctorId || !date || !startTime) {
      return NextResponse.json({ error: "Missing required appointment fields" }, { status: 400 });
    }

    const doctor = await db.getDoctorById(doctorId);
    if (!doctor || doctor.clinicId !== session.clinicId) {
      return NextResponse.json({ error: "Doctor not found in this clinic" }, { status: 404 });
    }

    // Auto-calculate end time (+15 mins)
    const [h, m] = startTime.split(":").map(Number);
    const endMinutes = h * 60 + m + 15;
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;

    // Concurrency check
    const isAvailable = await db.checkSlotAvailability(session.clinicId, doctorId, date, startTime);
    if (!isAvailable) {
      return NextResponse.json({ error: "Selected time slot is already booked" }, { status: 409 });
    }

    const patient = await db.findOrCreatePatient(session.clinicId, {
      fullName: patientName,
      phone: patientPhone,
    });

    const appointment = await db.createAppointment({
      clinicId: session.clinicId,
      patientId: patient.id,
      doctorId,
      date,
      startTime,
      endTime,
      consultationFee: consultationFee || doctor.consultationFee,
      reason,
      staffNotes,
      bookedOnline: false,
    });

    // If walk-in, immediately add to live queue
    if (isWalkIn) {
      await db.checkInToQueue(session.clinicId, appointment.id);
    }

    return NextResponse.json({ success: true, appointment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create appointment" }, { status: 500 });
  }
}
