import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ error: "Unauthenticated user." }, { status: 401 })
    }

    const employees = await prisma.employee.findMany()

    return NextResponse.json({ success: true, employees }, { status: 200 })
}

export async function POST(req: NextRequest) {
    const { userId } = await auth()
    const data: any = await req.formData()

    if (!userId) {
        return NextResponse.json({ error: "Unauthenticated user." }, { status: 401 })
    }


    const createEmployee = await prisma.employee.create({
        data: {
            name: data.get("name"),
            role: data.get("role"),
            birthday: data.get("birthday") + "T00:00:00.000Z",
            phone: data.get("tel"),
            gender: data.get("gender")
        }
    })

    return NextResponse.json({ success: true, message: "Karyawan baru telah berhasil ditambahkan. Silahkan muat ulang halaman ini." }, { status: 201 })
}