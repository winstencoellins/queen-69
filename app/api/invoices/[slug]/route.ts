import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = req.url

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

    return NextResponse.json({ success: true, invoice }, { status: 200 })
}