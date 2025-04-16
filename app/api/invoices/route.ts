import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const data: any = await req.formData()
    
    const workOrders = JSON.parse(data.get("workOrders"))

    const invoiceExist = await prisma.invoice.findUnique({
        where: {
            invoiceNumber: data.get("invoiceNumber")
        }
    })

    if (invoiceExist != null) {
        return NextResponse.json({ success: false, message: "Nomor Invoice ini telah tersedia. Silahkan gunakan nomor invoice yang lain." }, { status: 409 })
    }

    const createInvoice = await prisma.invoice.create({
        data: {
            invoiceNumber: data.get("invoiceNumber"),
        }
    })

    console.log(createInvoice)

    for (const id in workOrders) {
        const updateWorkOrderAvailability = await prisma.workOrder.update({
            where: {
                id: id
            },
            data: {
                availability: "UNAVAILABLE",
                invoiceNumber: data.get("invoiceNumber")
            }
        })
    }

    return NextResponse.json({ success: true }, { status: 201 })
}