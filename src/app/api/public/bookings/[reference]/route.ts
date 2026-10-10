import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { reference: string } }) {
  try {
    const { reference } = params;
    const appointment = await db.getAppointmentByReference(reference);

    if (!appointment) {
      return NextResponse.json({ error: "Booking reference not found" }, { status: 404 });
    }

    return NextResponse.json({
      booking: {
        id: appointment.id,
        reference: appointment.reference,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        consultationFee: appointment.consultationFee,
        reason: appointment.reason,
        createdAt: appointment.createdAt,
        cancelledAt: appointment.cancelledAt,
        cancellationReason: appointment.cancellationReason,
        clinic: {
          id: appointment.clinic?.id,
          name: appointment.clinic?.name,
          slug: appointment.clinic?.slug,
          address: appointment.clinic?.address,
          city: appointment.clinic?.city,
          phone: appointment.clinic?.phone,
        },
        doctor: {
          id: appointment.doctor?.id,
          name: appointment.doctor?.name,
          specialtyName: appointment.doctor?.specialtyName,
          qualifications: appointment.doctor?.qualifications,
        },
        patient: {
          fullName: appointment.patient?.fullName,
          phone: appointment.patient?.phone ? `+91 ******${appointment.patient.phone.slice(-4)}` : "",
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch booking details" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { reference: string } }) {
  try {
    const { reference } = params;
    const body = await req.json();
    const { action, reason } = body; // action: 'CANCEL'

    const appointment = await db.getAppointmentByReference(reference);
    if (!appointment) {
      return NextResponse.json({ error: "Booking reference not found" }, { status: 404 });
    }

    if (action === "CANCEL") {
      if (appointment.status === "CANCELLED" || appointment.status === "COMPLETED") {
        return NextResponse.json({ error: `Cannot cancel an appointment that is already ${appointment.status.toLowerCase()}.` }, { status: 400 });
      }

      const updated = await db.updateAppointmentStatus(
        appointment.clinicId,
        appointment.id,
        "CANCELLED",
        reason || "Patient requested cancellation"
      );

      return NextResponse.json({ success: true, status: updated.status });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update booking" }, { status: 500 });
  }
}
