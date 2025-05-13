import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ error: "Unauthenticated user!" }, { status: 401 })
    }

    const clientId: string = req.url.split('/')[5]

    const clientDetail = await prisma.client.findUnique({
        where: {
            id: clientId
        },
        select: {
            name: true,
            city: true,
            address: true,
            telephone: true,
            status: true
        }
    })

    const workOrders = await prisma.workOrder.findMany({
        where: {
            clientId: clientId
        },
        select: {
            workOrderNumber: true,
            worker: true,
            itemDescription: true,
            status: true,
            id: true
        },
        orderBy: {
            estimatedFinishDate: "desc"
        }
    })

    const invoices = await prisma.invoice.findMany({
        where: {
            clientId: clientId
        },
        orderBy: {
            createdDate: "desc"
        }
    })

    return NextResponse.json({ success: true, clientDetail, workOrders, invoices }, { status: 200 })
}

export async function PUT(req: NextRequest) {
    const { userId } = await auth()
    const data = await req.formData()

    const clientId: string = req.url.split('/')[5]

    if (!userId) {
        return NextResponse.json({ error: "Unauthenticated user." }, { status: 401 })
    }

    if (data.get("status") == "") {
        const updateClient = await prisma.client.update({
            where: {
                id: clientId
            },
            data: {
               name: data.get("name") as string,
               city: data.get("city") as string,
               address: data.get("address") as string,
               telephone: data.get("telephone") as string
            }
        })

        return NextResponse.json({ success: true, message: "Data klien telah berhasil diperbaharui. Silahkan muat ulang halaman ini." }, { status: 200 })
    }

    const status = data.get("status") == "ACTIVE" ? "INACTIVE" : "ACTIVE"

    const updateClientStatus = await prisma.client.update({
        where: {
            id: clientId
        }, data: {
            status: status
        }
    })

    return NextResponse.json({ success: true, message: `${status == "ACTIVE" ? "Klien berhasil diaktifkan. Silahkan muat ulang halaman ini untuk melihat perubahan." : "Klien berhasil dinonaktifkan. Silahkan muat ulang halaman ini untuk melihat perubahan."}`}, { status: 200 })
}