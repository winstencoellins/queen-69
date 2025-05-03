import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { userId } = await auth()
    const url = req.url

    if (!userId) {
        return NextResponse.json({ error: "Unauthenticated user" }, { status: 401 })
    }

    const workOrder = await prisma.workOrder.findUnique({
        where: {
            id: url.split("/")[5]
        },
        include: {
            client: {
                select: {
                    id: true,
                    name: true,
                    address: true,
                    telephone: true
                }
            },
            worker: {
                select: {
                    name: true
                }
            }
        }
    })

    if (workOrder == null) {
        return NextResponse.json({ success: false }, { status: 404 })
    }

    return NextResponse.json({ success: true, workOrder }, { status: 200 })
}

export async function PUT(req: NextRequest) {
    const { userId } = await auth()
    const data: any = await req.formData()

    if (!userId) {
        return NextResponse.json({ error: "Unauthenticated user" }, { status: 401 })
    }

    const workOrderExist = await prisma.workOrder.findUnique({
        where: {
            id: data.get("id")
        }
    })

    if (workOrderExist == null) {
        return NextResponse.json({ success: false }, { status: 404 })
    }

    if (data.get("status") != "") {
        const updateWorkOrderStatus = await prisma.workOrder.update({
            where: {
                id: data.get("id")
            },
            data: {
                status: data.get("status")
            }
        })

        return NextResponse.json({ success: true, message: "Status SPK telah berhasil diperbaharui. Silahkan muat ulang halaman ini." }, { status: 201 })
    }

    const clientId = await prisma.client.findUnique({
        where: {
            name: data.get("client")
        },
        select: {
            id: true
        }
    })

    const updateWorkOrder = await prisma.workOrder.update({
        where: {
            id: data.get("id")
        },
        data: {
            workOrderNumber: data.get("workOrderNumber"),
            estimatedFinishDate: data.get("estimatedFinishDate") + "T00:00:00.000Z",
            workerId: data.get("workerId"),
            clientId: clientId?.id,
            notes: data.get("notes"),
            itemDescription: data.get("itemDescription"),
            quantity: parseInt(data.get("quantity")),
            price: parseInt(data.get("price")),
        }
    })

    return NextResponse.json({ success: true, message: "Data baru telah berhasil disimpan. Silahkan kembali ke halaman detail SPK." }, { status: 201 })
}