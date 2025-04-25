import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const workOrders = await prisma.workOrder.findMany({
        select: {
            client: {
                select: {
                    name: true,
                    telephone: true
                }
            },
            status: true,
            estimatedFinishDate: true,
            id: true,
            workOrderNumber: true,
            itemDescription: true,
            notes: true,
            price: true,
            quantity: true,
            availability: true
        },
        orderBy: [
            {
                estimatedFinishDate: "asc"
            }
        ]
    })

    return NextResponse.json({ workOrders }, { status: 200 })
}


export async function POST(req: NextRequest) {
    const data: any = await req.formData()

    const workOrderExist = await prisma.workOrder.findUnique({
        where: {
            workOrderNumber: data.get("workOrderNumber")
        }
    })

    if (workOrderExist != null) {
        return NextResponse.json({ success: false, message: "# SPK telah tersedia. Silahkan menggunakan # SPK yang berbeda." }, { status: 409 })
    }

    const clientId: any = await prisma.client.findFirst({
        where: {
            name: data.get("client")
        },
        select: {
            id: true
        }
    })

    const createWorkOrder = await prisma.workOrder.create({
        data: {
            workOrderNumber: data.get("workOrderNumber"),
            estimatedFinishDate: data.get("estimatedFinishDate") + "T00:00:00.000Z",
            workerId: data.get("workerId"),
            clientId: clientId.id,
            notes: data.get("notes"),
            itemDescription: data.get("itemDescription"),
            quantity: parseInt(data.get("quantity")),
            price: parseInt(data.get("price")),
        }
    })

    return NextResponse.json({ success: true, message: "Surat Perintah Kerja yang baru telah berhasil dibuat. Silahkan kembali ke halaman list SPK." }, { status: 201 })
}