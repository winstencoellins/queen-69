import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { userId } = await auth()
    const url = req.url

    if (!userId) {
        return NextResponse.json({ error: "Unauthenticated user." }, { status: 401 })
    }

    const invoice = await prisma.invoice.findUnique({
        where: {
            id: url.split("/")[5]
        },
        include: {
            workOrder: true
        }
    })

    if (invoice == null) {
        return NextResponse.json({ success: false }, { status: 404 })
    }

    const client = await prisma.client.findUnique({
        where: {
            id: invoice.clientId
        },
        select: {
            name: true,
            address: true,
            telephone: true
        }
    })

    const workOrders = await prisma.workOrder.findMany({
        where: {
            clientId: invoice.clientId,
            status: "COMPLETED",
            availability: "AVAILABLE"
        }
    })

    return NextResponse.json({ success: true, invoice, client, workOrders }, { status: 200 })
}

export async function PUT(req: NextRequest) {
    const { userId } = await auth()
    const data: any = await req.formData()

    if (!userId) {
        return NextResponse.json({ error: "Unauthenticated user." }, { status: 401 })
    }

    const invoiceExist = await prisma.invoice.findUnique({
        where: {
            id: data.get("id")
        },
        select: {
            id: true
        }
    })

    if (invoiceExist == null) {
        return NextResponse.json({ message: "Invoice tidak ditemukan" }, { status: 404 })
    }

    if (data.get("status") == "") {
        const updateInvoice = await prisma.invoice.update({
            where: {
                id: invoiceExist.id
            },
            data: {
                invoiceNumber: data.get("invoiceNumber"),
                packingPrice: parseInt(data.get("packingPrice")),
                shippingPrice: parseInt(data.get("shippingPrice"))
            }
        })
    
        const removedWorkOrder = JSON.parse(data.get("removeWorkOrder"))
        const addedWorkOrder = JSON.parse(data.get("addWorkOrder"))
    
        if (Object.keys(removedWorkOrder).length != 0) {
            for (const key of Object.keys(removedWorkOrder)) {
                const updateToAvailableWorkOrder = await prisma.workOrder.update({
                    where: {
                        id: key
                    },
                    data: {
                        availability: "AVAILABLE",
                        invoiceNumber: null
                    }
                })
            }
        }
    
        if (Object.keys(addedWorkOrder).length != 0) {
            for (const key of Object.keys(addedWorkOrder)) {
                const updateToUnavailableWorkOrder = await prisma.workOrder.update({
                    where: {
                        id: key
                    },
                    data: {
                        availability: "UNAVAILABLE",
                        invoiceNumber: data.get("invoiceNumber")
                    }
                })
            }
        }
        
        return NextResponse.json({ success: true, message: "Data invoice telah berhasil diperbaharui. Silahkan kembali ke halaman list invoice." }, { status: 201 })
    }

    const updateInvoiceStatus = await prisma.invoice.update({
        where: {
            id: data.get("id")
        },
        data: {
            status: data.get("status")
        }
    })

    return NextResponse.json({ success: true, message: "Status Invoice telah berhasil diperbaharui. Silahkan kembali ke halaman list invoice." }, { status: 201 })
}