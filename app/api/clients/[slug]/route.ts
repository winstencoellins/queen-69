import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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

    return NextResponse.json({ success: true, clientDetail }, { status: 200 })
}

export async function PUT(req: NextRequest) {
    const data = await req.formData()

    console.log(data.get("status"))
    const clientId: string = req.url.split('/')[5]

    const clientExist = await prisma.client.findFirst({
        where: {
            name: data.get('name') as string
        }
    })

    if (clientExist != null) {
        return NextResponse.json({ success: false, message: "Tidak bisa menyimpan klien dengan nama yang sama. Silahkan menggunakan nama klien yang lain." }, { status: 409 })
    }

    if (data.get("status") == "") {
        // const updateClient = await prisma.client.update({
        //     where: {
        //         id: clientId
        //     },
        //     data: {
        //        name: data.name as string,
        //        city: data.city as string,
        //        address: data.address as string,
        //        telephone: data.telephone as string
        //     }
        // })

        return NextResponse.json({ success: true, message: "Data klien telah berhasil diperbaharui. Silahkan muat ulang halaman ini." }, { status: 200 })
    }

    // const updateClient = await prisma.client.update({
    //     where: {
    //         id: clientId
    //     }
    // })

    return NextResponse.json({ success: true, message: "Klien telah berhasil dinonaktifkan." }, { status: 200 })
}