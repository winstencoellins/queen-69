import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * Creates a new client in the database.
 * This function will check if client with the same name exist
 *
 * @param req - data from the form submit via frontend
 * @param res
 * @returns error messsage if client already exist, else will create new client.
 */
export async function POST(req: NextRequest) {
    const { userId } = await auth()
    const formData = await req.formData()

    if (!userId) {
        return NextResponse.json({ error: "Unauthenticated user." }, { status: 401 })
    }

    const clientExist = await prisma.client.findFirst({
        where: {
            name: formData.get('clientName') as string
        }
    })

    if (clientExist != null) {
        return NextResponse.json({ success: false, message: "Tidak bisa membuat klien dengan nama yang sama. Silahkan menggunakan nama klien yang lain." }, { status: 409 })
    }

    const createClient = await prisma.client.create({
        data: {
            name: formData.get('clientName') as string,
            city: formData.get('city') as string,
            address: formData.get('address') as string,
            telephone: formData.get('telephone') as string
        }
    })

    return NextResponse.json({ success: true, message: "Klien baru telah berhasil ditambahkan ke database. Silahkan muat ulang halaman ini untuk melihat perubahan." }, { status: 201 })
}

/**
 * Fetches all client from the database
 *
 * @param req
 */
export async function GET() {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ error: "Unauthenticated user." }, { status: 401 })
    }

    const clients = await prisma.client.findMany()

    return NextResponse.json({ success: true, clients }, { status: 200 })
}