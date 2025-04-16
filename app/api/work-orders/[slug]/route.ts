import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = req.url

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
            }
        }
    })

    if (workOrder == null) {
        return NextResponse.json({ success: false }, { status: 404 })
    }

    return NextResponse.json({ success: true, workOrder }, { status: 200 })
}

export async function PUT(req: NextRequest) {
    const data: any = await req.formData()

    console.log(data)

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
            worker: data.get("worker"),
            clientId: clientId?.id,
            notes: data.get("notes"),
            itemDescription: data.get("itemDescription"),
            quantity: parseInt(data.get("quantity")),
            price: parseInt(data.get("price")),
            shippingPrice: parseInt(data.get("shippingPrice")),
            packingPrice: parseInt(data.get("packingPrice"))
        }
    })

    return NextResponse.json({ success: true, message: "Data baru telah berhasil disimpan. Silahkan kembali ke halaman detail SPK." }, { status: 201 })
}