'use client'

import back from "@/public/svgs/back.svg"
import user from "@/public/svgs/user.svg"
import address from "@/public/svgs/address.svg"
import phone from "@/public/svgs/phone.svg"

import Image from "next/image"
import { Button } from "@heroui/react"

import { usePathname, useRouter } from "next/navigation"

import { useState, useEffect } from "react"
import { convertToDate } from "@/lib/utils"
import clsx from "clsx"

interface InvoiceDetail {
    id: string;
    invoiceNumber: string;
    packingPrice: string;
    shippingPrice: string;
    workOrder: WorkOrder[]
}

interface WorkOrder {
    itemDescription: string;
    notes: string;
    price: string;
}

export default function InvoiceDetail() {
    const router = useRouter()
    const path = usePathname()

    const [invoiceDetail, setInvoiceDetail] = useState<any>({})
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])

    const [subtotal, setSubtotal] = useState<number>(0)

    useEffect(() => {
        fetchInvoiceDetail()
    }, [])

    /**
     *
     */
    const handleClickBack = () => {
        router.push("/dashboard/invoices")
    }

    /**
     *
     */
    const fetchInvoiceDetail = async () => {
        let total = 0

        try {
            const response = await fetch(`/api/invoices/${path.split("/")[3]}`)

            const data = await response.json()

            if (!response.ok) {
                throw new Error("Something went wrong. Please try again.")
            }

            setWorkOrders(data.invoice.workOrder)
            setInvoiceDetail(data.invoice)

            for (const workOrder of data.invoice.workOrder) {
                total += parseInt(workOrder.price)
            }

            setSubtotal(total)
        } catch (error) {
            console.log(error)
        } finally {

        }
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
                        <div className="flex text-xl items-center justify-between">
                            <h1 className="mr-5">Invoice ID: #{invoiceDetail.invoiceNumber}</h1>
                            <p className={clsx("text-sm rounded-full px-5 py-1", invoiceDetail.status == "UNPAID" ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500")}>{invoiceDetail.status == "UNPAID" ? "Belum Lunas" : "Lunas"}</p>
                        </div>

                        {/* <p className="mt-2 text-sm text-slate-500">Dibuat pada tanggal: {convertToDate(invoiceDetail.createdDate.split("T")[0])}</p> */}
                    </div>

                    <div className="my-5">
                        <h1 className="text-lg">Order Item</h1>

                        <hr className="my-2"/>

                        <div>
                            {
                               workOrders.map((workOrder, index) => (
                                <div key={index} className="flex items-center justify-between my-3">
                                    <div className="flex">
                                        <p className="mr-3">{index + 1}.</p>
                                        <div>
                                            <p>{workOrder.itemDescription}</p>
                                            <p className="text-sm text-slate-500">{workOrder.notes}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm">Rp. {workOrder.price.toLocaleString()}</p>
                                </div>
                               ))
                            }
                        </div>
                    </div>

                    <div className="mt-10">
                        <h1 className="text-lg">Order Summary</h1>

                        <hr className="my-2"/>

                        <div>
                            <div className="flex justify-between my-1">
                                <p className="text-sm">Subtotal ({workOrders.length} barang)</p>
                                <p className="text-sm">Rp. {subtotal.toLocaleString()}</p>
                            </div>
                            <div className="flex justify-between my-1">
                                <p className="text-sm">Biaya Packing</p>
                                <p className="text-sm">Rp. {invoiceDetail.packingPrice}</p>
                            </div>
                            <div className="flex justify-between my-1">
                                <p className="text-sm">Biaya Pengiriman</p>
                                <p className="text-sm">Rp. {invoiceDetail.shippingPrice}</p>
                            </div>

                            <hr className="my-2" />

                            <div className="flex justify-between my-1 font-bold">
                                <p className="text-sm">Total</p>
                                <p className="text-sm">Rp. {(subtotal + invoiceDetail.packingPrice + invoiceDetail.shippingPrice).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="bg-white shadow-lg rounded-lg px-5 py-5 h-fit w-[20%]">
                    <h1 className="font-bold text-xl mb-5">Informasi Klien</h1>

                    <div className="flex items-center">
                        <Image src={user} alt="icon" width={20} height={20} />
                        <p className="text-lg ml-2">{}</p>
                    </div>

                    <div className="flex">
                        <Image src={address} alt="icon" width={20} height={20} />
                        <p className="text-lg ml-2">{}</p>
                    </div>

                    <div className="flex">
                        <Image src={phone} alt="icon" width={20} height={20} />
                        <p className="text-lg ml-2">+62 {}</p>
                    </div>
                </div>
            </div>
        </>
    )
}