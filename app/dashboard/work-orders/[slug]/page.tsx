'use client'

import Image from "next/image"

import { Button } from "@heroui/react"

import edit from "@/public/svgs/edit.svg"
import user from "@/public/svgs/user.svg"
import address from "@/public/svgs/address.svg"
import phone from "@/public/svgs/phone.svg"

import wardobe from "@/public/images/wardobe.jpeg"

export default function WorkOrderDetail() {
    return (
        <>
            <div className=" px-5 py-4 rounded-lg flex flex-row items-center justify-between">
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
            <div className="flex flex-row">
                <div className="bg-white w-[80%] mr-10 py-5 px-5 rounded-lg shadow-lg">
                    <div className="mb-5">
                        <h1>No. SPK: </h1>
                        <p>Status</p>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-xl font-bold">Informasi Barang</h1>

                        <hr className="mt-2 mb-4"/>

                        <div className="flex items-center w-full">
                            <Image src={wardobe} alt="icon" width={75} height={75} className="rounded-lg mr-5" />

                            <div className="flex items-center">
                                <div className="w-[500px]">
                                    <h1 className="font-semibold text-lg">Lemari 10 pintu</h1>
                                    <p className="text-sm">Warna Classic</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-xl font-bold">Order Summary</h1>

                        <hr className="mt-2 mb-4" />

                        <div className="flex justify-between">
                            <p>Subtotal (1 barang)</p>
                            <p>Rp. 1,000,000</p>
                        </div>

                        <div className="flex justify-between">
                            <p>Pengiriman</p>
                            <p>Rp. 1,000,000</p>
                        </div>

                        <div className="flex justify-between my-2">
                            <p>Total</p>
                            <p>Rp. 2,000,000</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-lg px-5 py-5 w-[20%] h-fit">
                    <h1 className="font-bold text-xl mb-5">Informasi Klien</h1>

                    <div className="flex items-center">
                        <Image src={user} alt="icon" width={20} height={20} />
                        <p className="text-lg ml-2">Xhelinskii</p>
                    </div>

                    <div className="flex">
                        <Image src={address} alt="icon" width={20} height={20} />
                        <p className="text-lg ml-2">Xhelinskii</p>
                    </div>

                    <div className="flex">
                        <Image src={phone} alt="icon" width={20} height={20} />
                        <p className="text-lg ml-2">Xhelinskii</p>
                    </div>
                </div>
            </div>
        </>
    )
}