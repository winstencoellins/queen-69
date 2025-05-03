import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ error: "Unauthenticated user." }, { status: 401 })
    }

    const invoices = await prisma.invoice.findMany({
        select: {
            id: true,
            invoiceNumber: true,
            createdBy: true,
            createdDate: true,
            status: true
        }
    })

    return NextResponse.json({ success: true, invoices }, { status: 200 })
}

export async function POST(req: NextRequest) {
    const { userId } = await auth()
    const data: any = await req.formData()

    if (!userId) {
        return NextResponse.json({ error: "Unauthenticated user." }, { status: 401 })
    }

    const workOrders = JSON.parse(data.get("workOrders"))

    const invoiceExist = await prisma.invoice.findUnique({
        where: {
            invoiceNumber: data.get("invoiceNumber")
        }
    })

    if (invoiceExist != null) {
        return NextResponse.json({ success: false, message: "Nomor Invoice ini telah tersedia. Silahkan gunakan nomor invoice yang lain." }, { status: 409 })
    }

    const clientId: any = await prisma.client.findUnique({
        where: {
            name: data.get("clientName")
        },
        select: {
            id: true
        }
    })

    const createInvoice = await prisma.invoice.create({
        data: {
            invoiceNumber: data.get("invoiceNumber"),
            packingPrice: parseInt(data.get("packingPrice")),
            shippingPrice: parseInt(data.get("shippingPrice")),
            clientId: clientId?.id,
            createdBy: data.get("user")
        }
    })

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

    return NextResponse.json({ success: true, message: "Invoice telah berhasil dibuat. Silahkan kembali ke halaman list invoice." }, { status: 201 })
}