import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
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

    return NextResponse.json({ success: true, workOrder }, { status: 200 })
}