import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
    const { userId } = await auth()
    const url = req.url

    if (!userId) {
        return NextResponse.json({ error: "Unauthenticated user." }, { status: 401 })
    }

    const employee = await prisma.employee.findUnique({
        where: {
            id: url.split("/")[5]
        }
    })

    if (employee == null) {
        return NextResponse.json({ message: "Karyawan tidak ditemukan." }, { status: 404 })
    }

    return NextResponse.json({ employee }, { status: 200 })
}

export async function PUT(req: NextRequest) {
    const { userId } = await auth()
    const data: any = await req.formData()

    if (!userId) {
        return NextResponse.json({ error: "Unauthenticated user." }, { status: 401 })
    }

    const updateEmployee = await prisma.employee.update({
        where: {
            id: data.get("id")
        },
        data: {
           name: data.get("name"),
           role: data.get("role"),
           birthday: data.get("birthday") + "T00:00:00.000Z",
           gender: data.get("gender"),
           phone: data.get("tel") 
        }
    })

    return NextResponse.json({ success: true, message: "Informasi karyawan telah berhasil diperbaharui. Silahkan kembali ke halaman daftar karyawan." }, { status: 201 })
}