import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const bookingSchema = z.object({
  clinicSlug: z.string(),
  doctorId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid start time format (HH:MM)"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid end time format (HH:MM)"),
  patientName: z.string().min(2, "Full name is required"),
  patientPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  patientEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  reason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { clinicSlug, doctorId, date, startTime, endTime, patientName, patientPhone, patientEmail, reason } = parsed.data;

    const clinic = await db.getClinicBySlug(clinicSlug);
    if (!clinic || !clinic.bookingEnabled) {
      return NextResponse.json({ error: "Online bookings are currently unavailable for this clinic." }, { status: 400 });
    }

    const doctor = await db.getDoctorById(doctorId);
    if (!doctor || doctor.clinicId !== clinic.id) {
      return NextResponse.json({ error: "Selected doctor was not found at this clinic." }, { status: 404 });
    }

    // Server-side check for concurrent booking collision
    const isAvailable = await db.checkSlotAvailability(clinic.id, doctor.id, date, startTime);
    if (!isAvailable) {
      return NextResponse.json({ 
        error: "This time slot was just booked by another patient. Please select an alternate slot." 
      }, { status: 409 });
    }

    // Find or create patient record within clinic tenant
    const patient = await db.findOrCreatePatient(clinic.id, {
      fullName: patientName,
      phone: patientPhone,
      email: patientEmail || undefined,
    });

    // Create appointment atomically
    const appointment = await db.createAppointment({
      clinicId: clinic.id,
      patientId: patient.id,
      doctorId: doctor.id,
      date,
      startTime,
      endTime,
      consultationFee: doctor.consultationFee,
      reason,
      bookedOnline: true,
    });

    return NextResponse.json({
      success: true,
      reference: appointment.reference,
      appointment: {
        id: appointment.id,
        reference: appointment.reference,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        consultationFee: appointment.consultationFee,
        clinicName: clinic.name,
        clinicAddress: clinic.address,
        doctorName: doctor.name,
        specialtyName: doctor.specialtyName,
        patientName: patient.fullName,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create booking" }, { status: 500 });
  }
}
