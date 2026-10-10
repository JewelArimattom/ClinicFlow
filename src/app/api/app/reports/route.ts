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
    const format = searchParams.get("format"); // 'csv' or json

    const todayStr = new Date().toISOString().split("T")[0];
    const clinicId = session.clinicId;

    const [appointments, invoices, payments, medicines, batches] = await Promise.all([
      db.getAppointments(clinicId),
      db.getInvoices(clinicId),
      db.getInvoices(clinicId).then(invs => invs.flatMap(i => i.payments || [])),
      db.getMedicines(clinicId),
      db.getBatches(clinicId),
    ]);

    // Financial KPI aggregation
    const todayInvoices = invoices.filter(i => new Date(i.createdAt).toISOString().split("T")[0] === todayStr);
    const todayPayments = payments.filter(p => new Date(p.createdAt).toISOString().split("T")[0] === todayStr);

    const todayBilled = todayInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const todayCollected = todayPayments.filter(p => p.status === "SUCCESS").reduce((sum, p) => sum + p.amount, 0);
    const outstandingTotal = invoices.reduce((sum, i) => sum + i.outstandingAmount, 0);

    // Payment method breakdown
    const methodTotals: Record<string, number> = { CASH: 0, UPI: 0, CARD: 0, OTHER: 0 };
    payments.forEach(p => {
      if (p.status === "SUCCESS") {
        methodTotals[p.method] = (methodTotals[p.method] || 0) + p.amount;
      }
    });

    // Pharmacy alerts
    const lowStockMedicines = medicines.filter(m => (m.totalStock || 0) <= m.reorderThreshold);
    const now = new Date();
    const threeMonthsAhead = new Date();
    threeMonthsAhead.setMonth(now.getMonth() + 3);
    const expiringBatches = batches.filter(b => new Date(b.expiryDate) <= threeMonthsAhead && b.currentStock > 0);

    // Appointments breakdown
    const todayAppts = appointments.filter(a => a.date === todayStr);
    const apptStatusCounts = {
      total: todayAppts.length,
      confirmed: todayAppts.filter(a => a.status === "CONFIRMED").length,
      waiting: todayAppts.filter(a => a.status === "WAITING").length,
      inProgress: todayAppts.filter(a => a.status === "IN_PROGRESS").length,
      completed: todayAppts.filter(a => a.status === "COMPLETED").length,
      cancelled: todayAppts.filter(a => a.status === "CANCELLED").length,
    };

    if (format === "csv") {
      // Generate CSV output
      const csvHeader = "InvoiceNumber,Date,Type,Status,TotalAmount,PaidAmount,OutstandingAmount\n";
      const csvRows = invoices.map(i => 
        `"${i.invoiceNumber}","${new Date(i.createdAt).toISOString().split("T")[0]}","${i.type}","${i.status}",${i.totalAmount},${i.paidAmount},${i.outstandingAmount}`
      ).join("\n");
      
      return new NextResponse(csvHeader + csvRows, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="clinic-billing-report-${todayStr}.csv"`,
        },
      });
    }

    return NextResponse.json({
      summary: {
        todayBilled: Number(todayBilled.toFixed(2)),
        todayCollected: Number(todayCollected.toFixed(2)),
        outstandingTotal: Number(outstandingTotal.toFixed(2)),
        appointmentsToday: apptStatusCounts,
        lowStockCount: lowStockMedicines.length,
        expiringBatchesCount: expiringBatches.length,
      },
      paymentMethods: methodTotals,
      lowStockMedicines: lowStockMedicines.map(m => ({
        id: m.id,
        name: m.name,
        stock: m.totalStock,
        reorderThreshold: m.reorderThreshold,
      })),
      expiringBatches: expiringBatches.map(b => ({
        id: b.id,
        medicineName: b.medicine?.name,
        batchNumber: b.batchNumber,
        expiryDate: b.expiryDate,
        currentStock: b.currentStock,
      })),
      recentInvoices: invoices.slice(0, 5),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate report" }, { status: 500 });
  }
}
