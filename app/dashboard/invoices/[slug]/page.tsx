'use client'

import back from "@/public/svgs/back.svg"
import user from "@/public/svgs/user.svg"
import address from "@/public/svgs/address.svg"
import phone from "@/public/svgs/phone.svg"
import edit from "@/public/svgs/edit.svg"

import Image from "next/image"
import { Button } from "@heroui/react"

import { usePathname, useRouter } from "next/navigation"

import { useState, useEffect } from "react"
import { convertToDate } from "@/lib/utils"
import clsx from "clsx"
import { setSourceMapsEnabled } from "process"

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

interface Client {
    name: string;
    address: string;
    telephone: string;
}

export default function InvoiceDetail() {
    const router = useRouter()
    const path = usePathname()

    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")
    const [valid, setValid] = useState<boolean>(true)

    const [invoiceDetail, setInvoiceDetail] = useState<any>({})
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
    const [client, setClient] = useState<Client>({name: "", address: "", telephone: ""})

    const [subtotal, setSubtotal] = useState<number>(0)

    useEffect(() => {
        fetchInvoiceDetail()
    }, [])

    /**
     * Handles user click to navigate back to invoice list page
     * 
     * @returns none
     */
    const handleClickBack = (): void => {
        router.push("/dashboard/invoices")
    }

    /**
     * Handles the click to view the detail page
     * 
     * @returns none
     */
    const handleClickDetail = (): void => {
        router.push(`/dashboard/invoices/${path.split("/")[3]}/edit`)
    }

    /**
     * Fetches the detail of the invoice to be shown to the user
     * 
     * @returns none
     */
    const fetchInvoiceDetail = async (): Promise<void> => {
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
            setClient(data.client)
        } catch (error) {
            console.log(error)
            setMessage("Gagal untuk memuat data karena koneksi internet. Silahkan coba lagi.")
            setIsVisible(true)
            setValid(false)
        }
    }

    /**
     * Changes the status of the invoice to PAID
     * 
     * @returns none
     */
    const handleStatusChange = async (): Promise<void> => {
        const formData = new FormData()

        formData.set("id", path.split("/")[3])
        formData.set("status", "PAID")

        try {
            const response = await fetch(`/api/invoices/${path.split("/")[3]}`, {
                method: "PUT",
                body: formData
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error("Something went wrong. Please try again.")
            }

            setMessage(data.message)
            setIsVisible(true)

            if (data.success) {
                setValid(true)
            }
        } catch (error) {
            console.log(error)
            setMessage("Gagal untuk memperbaharui data karena koneksi internet. Silahkan coba lagi.")
            setValid(false)
            setIsVisible(true)
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

            <div className="flex mt-5">
                {/* Left */}
                <div className="bg-white w-[80%] mr-5 rounded-lg shadow-lg px-5 py-5">
                    <div>
                        <div className="flex text-xl items-center justify-between">
                            <h1 className="mr-5 font-semibold">Invoice ID: #{invoiceDetail.invoiceNumber}</h1>
                            <p className={clsx("text-sm rounded-full px-5 py-1", invoiceDetail.status == "UNPAID" ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500")}>{invoiceDetail.status == "UNPAID" ? "Belum Lunas" : "Lunas"}</p>
                        </div>

                        {/* <p className="mt-2 text-sm text-slate-500">Dibuat pada tanggal: {convertToDate(invoiceDetail.createdDate.split("T")[0])}</p> */}
                    </div>

                    <div className="my-5">
                        <h1 className="text-lg">Pesanan Barang</h1>

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
                        <h1 className="text-lg">Ringkasan Pesanan</h1>

                        <hr className="my-2"/>

                        <div>
                            <div className="flex justify-between my-2">
                                <p className="text-sm">Subtotal ({workOrders.length} barang)</p>
                                <p className="text-sm">Rp. {subtotal.toLocaleString()}</p>
                            </div>
                            <div className="flex justify-between my-2">
                                <p className="text-sm">Biaya Pengepakan</p>
                                <p className="text-sm">Rp. {parseInt(invoiceDetail.packingPrice).toLocaleString()}</p>
                            </div>
                            <div className="flex justify-between my-2">
                                <p className="text-sm">Biaya Pengiriman</p>
                                <p className="text-sm">Rp. {parseInt(invoiceDetail.shippingPrice).toLocaleString()}</p>
                            </div>

                            <hr className="my-2" />

                            <div className="flex justify-between my-3 font-bold">
                                <p className="">Total</p>
                                <p className="">Rp. {(subtotal + invoiceDetail.packingPrice + invoiceDetail.shippingPrice).toLocaleString()}</p>
                            </div>
                        </div>
                        
                        {
                            invoiceDetail.status == "PAID"
                            ?
                            <></>
                            :
                            <div className="flex justify-end">
                                <Button className="bg-[gold] rounded-lg mt-5 hover:cursor-pointer" onPress={handleClickDetail}>
                                    <Image src={edit} alt="icon" width={20} height={20} />
                                    Edit Invoice
                                </Button>
                            </div>
                        }
                    </div>
                </div>

                {/* Right */}
                <div className="w-[20%]">
                    <div className="bg-white shadow-lg rounded-lg px-5 py-5 h-fit">
                        <h1 className="font-bold text-xl mb-5">Informasi Klien</h1>

                        <div className="flex items-center">
                            <Image src={user} alt="icon" width={20} height={20} />
                            <p className="text-lg ml-2">{client.name}</p>
                        </div>

                        <div className="flex">
                            <Image src={address} alt="icon" width={20} height={20} />
                            <p className="text-lg ml-2">{client.address}</p>
                        </div>

                        <div className="flex">
                            <Image src={phone} alt="icon" width={20} height={20} />
                            <p className="text-lg ml-2">+62 {client.telephone}</p>
                        </div>
                    </div>
                    
                    {
                        invoiceDetail.status == "PAID"
                        ?
                        <></>
                        :
                        <div className="bg-white shadow-lg rounded-lg px-5 py-5 mt-5">
                            <h1>Ubah Status</h1>

                            <Button className="w-full bg-[gold] rounded-lg my-2 hover:cursor-pointer" onPress={handleStatusChange}>Lunas</Button>
                        </div>
                    }
                </div>
            </div>

            {/* Toast */}
            {
                isVisible ?
                <div className={`fixed bottom-5 right-5 ${valid ? 'bg-green-700' : 'bg-red-700'} text-white w-[30%] py-5 rounded-lg px-4 flex justify-between items-center z-20`}>
                    <p>{message}</p>
                    <Button onPress={() => {setIsVisible(false); setValid(true)}} className={`bg-white text-black rounded-lg ml-3 cursor-pointer px-4 ${valid ? 'text-green-700' : 'text-red-700'}`}>Tutup</Button>
                </div>
                :
                <></>
            }
        </>
    )
}