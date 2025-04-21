'use client'

import back from "@/public/svgs/back.svg"
import user from "@/public/svgs/user.svg"
import address from "@/public/svgs/address.svg"
import phone from "@/public/svgs/phone.svg"

import Image from "next/image"
import { Button } from "@heroui/react"

import { useRouter } from "next/navigation"

export default function InvoiceDetail() {
    const router = useRouter()
    
    const handleClickBack = () => {
        router.push("/dashboard/invoices")
    }

    return (
        <>
            <div className=" px-5 py-4 rounded-lg flex flex-row items-center justify-between bg-white">
                <h1 className="text-2xl">Rincian Invoice</h1>

                <div className="flex items-center">
                    {/* Dropdown */}
                    <Button className="bg-[gold] rounded-lg ml-5 hover:cursor-pointer" onPress={handleClickBack}>
                        <Image src={back} alt="icon" width={20} height={20} />
                        <p>Kembali</p>
                    </Button>
                </div>
            </div>

            <div className="flex bg-red-100 mt-5">
                {/* Left */}
                <div className="bg-white w-[80%] mr-5 rounded-lg shadow-lg px-5 py-5">
                    <div>
                        <div className="flex text-xl items-center">
                            <h1 className="mr-5">Invoice ID: #01/01/01</h1>
                            <p className="text-sm">Status of Payment</p>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">Dibuat pada tanggal: </p>
                    </div>

                    <div className="my-5">
                        <h1 className="text-lg">Order Item</h1>

                        <hr className="my-2"/>

                        <ol>
                            <li className="flex items-center justify-between my-3">
                                <div className="flex">
                                    <p className="mr-3">1.</p>
                                    <div>
                                        <p>Lemari</p>
                                        <p className="text-sm text-slate-500">Notes</p>
                                    </div>
                                </div>

                                <p className="text-sm">Rp. 200000</p>
                            </li>
                            <li className="flex items-center justify-between my-3">
                                <div className="flex">
                                    <p className="mr-3">1.</p>
                                    <div>
                                        <p>Lemari</p>
                                        <p className="text-sm text-slate-500">Notes</p>
                                    </div>
                                </div>

                                <p className="text-sm">Rp. 200000</p>
                            </li>
                            <li className="flex items-center justify-between my-3">
                                <div className="flex">
                                    <p className="mr-3">1.</p>
                                    <div>
                                        <p>Lemari</p>
                                        <p className="text-sm text-slate-500">Notes</p>
                                    </div>
                                </div>

                                <p className="text-sm">Rp. 200000</p>
                            </li>
                        </ol>
                    </div>

                    <div className="mt-10">
                        <h1 className="text-lg">Order Summary</h1>

                        <hr className="my-2"/>

                        <div>
                            <div className="flex justify-between my-1">
                                <p className="text-sm">Subtotal (n barang)</p>
                                <p className="text-sm">Rp. 1000000</p>
                            </div>
                            <div className="flex justify-between my-1">
                                <p className="text-sm">Biaya Packing</p>
                                <p className="text-sm">Rp. 1000000</p>
                            </div>
                            <div className="flex justify-between my-1">
                                <p className="text-sm">Biaya Pengiriman</p>
                                <p className="text-sm">Rp. 1000000</p>
                            </div>

                            <hr className="my-2" />

                            <div className="flex justify-between my-1 font-bold">
                                <p className="text-sm">Total</p>
                                <p className="text-sm">Rp. 1000000</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="bg-white shadow-lg rounded-lg px-5 py-5 h-fit w-[20%]">
                    <h1 className="font-bold text-xl mb-5">Informasi Klien</h1>

                    <div className="flex items-center">
                        <Image src={user} alt="icon" width={20} height={20} />
                        <p className="text-lg ml-2"></p>
                    </div>

                    <div className="flex">
                        <Image src={address} alt="icon" width={20} height={20} />
                        <p className="text-lg ml-2"></p>
                    </div>

                    <div className="flex">
                        <Image src={phone} alt="icon" width={20} height={20} />
                        <p className="text-lg ml-2">+62 </p>
                    </div>
                </div>
            </div>
        </>
    )
}