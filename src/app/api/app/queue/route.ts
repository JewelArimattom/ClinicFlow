import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { QueueStatus } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.clinicId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    const queue = await db.getQueue(session.clinicId, date);
    return NextResponse.json({ queue });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch queue" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.clinicId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { queueId, status } = body;

    if (!queueId || !status) {
      return NextResponse.json({ error: "queueId and status are required" }, { status: 400 });
    }

    const updated = await db.updateQueueStatus(session.clinicId, queueId, status as QueueStatus);
    return NextResponse.json({ success: true, queueEntry: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update queue entry" }, { status: 500 });
  }
}
