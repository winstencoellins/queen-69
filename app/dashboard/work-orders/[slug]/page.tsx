'use client'

import Image from "next/image"

import { Button } from "@heroui/react"

import edit from "@/public/svgs/edit.svg"

export default function WorkOrderDetail() {
    return (
        <>
            <div className=" px-5 py-4 rounded-lg flex flex-row items-center justify-between bg-white">
                <h1 className="text-2xl">Detail Surat Perintah Kerja</h1>

                <div className="flex items-center">
                    {/* Dropdown */}
                    <Button className="bg-green-200 rounded-lg ml-5 hover:cursor-pointer">
                        <Image src={edit} alt="icon" width={20} height={20} />
                        <p>Edit SPK</p>
                    </Button>
                </div>
            </div>

            {/* Detail SPK */}
            <div>
                <h1>Informasi SPK</h1>

                <hr />


            </div>
        </>
    )
}