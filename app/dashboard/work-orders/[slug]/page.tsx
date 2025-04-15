'use client'

import clsx from "clsx"

import Image from "next/image"

import { Button } from "@heroui/react"

import { usePathname, useRouter } from "next/navigation"

import { convertToDate } from "@/lib/utils"

import back from "@/public/svgs/back.svg"
import edit from "@/public/svgs/edit.svg"
import user from "@/public/svgs/user.svg"
import address from "@/public/svgs/address.svg"
import phone from "@/public/svgs/phone.svg"

import wardobe from "@/public/images/wardobe.jpeg"
import { useEffect, useState } from "react"

interface WorkOrder {
    id: string;
    workOrderNumber: string;
    estimatedFinishDate: string;
    worker: string;
    notes: string;
    itemDescription: string;
    quantity: string;
    price: string
    status: string;
    client: Client
}

interface Client {
    id: string;
    name: string;
    address: string;
    telephone: string;
}

export default function WorkOrderDetail() {
    const path = usePathname();
    const router = useRouter();

    const [workOrder, setWorkOrder] = useState<WorkOrder>({
        id: "",
        workOrderNumber: "",
        estimatedFinishDate: "",
        worker: "",
        notes: "",
        itemDescription: "",
        quantity: "",
        price: "",
        status: "",
        client: {
            id: "",
            name: "",
            address: "",
            telephone: ""
        }
    })

    useEffect(() => {
        fetchWorkOrderDetail()
    }, [])

    const handleBack = () => {
        router.push("/dashboard/work-orders")
    }

    const handleNavigateDetail = () => {
        router.push(`${path}/edit`)
    }

    const fetchWorkOrderDetail = async () => {
        try {
            const response = await fetch(`/api/work-orders/${path.split("/")[3]}`)

            const data = await response.json()

            if (!response.ok) {
                throw new Error("Failed to fetch data. Please try again.")
            }

            setWorkOrder(data.workOrder)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="py-4 rounded-lg flex flex-row items-center justify-between">
                <h1 className="text-2xl">Detail Surat Perintah Kerja</h1>

                <div className="flex items-center">
                    {/* Dropdown */}
                    <Button className="bg-[gold] rounded-lg ml-5 hover:cursor-pointer text-[black]" onPress={handleBack}>
                        <Image src={back} alt="icon" width={20} height={20} />
                        <p>Kembali</p>
                    </Button>
                </div>
            </div>

            {/* Detail SPK */}
            <div className="flex flex-row">
                <div className="bg-white w-[80%] mr-10 py-5 px-5 rounded-lg shadow-lg">
                    <div className="mb-5 flex justify-between items-center">
                        <h1 className="text-lg font-bold">No. SPK: {workOrder.workOrderNumber} - {workOrder.worker}</h1>
                        <p className={clsx("bg-slate-100 w-fit rounded-full px-5", workOrder.status == "NOT_STARTED" ? "bg-slate-100 text-slate-500" : workOrder.status == "IN_PROGRESS" ? "bg-orange-100 text-orange-500" : workOrder.status == "COMPLETED" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500")}>{workOrder.status == "NOT_STARTED" ? "Belum Dimulai" : workOrder.status == "IN_PROGRESS" ? "Diproses" : workOrder.status == "COMPLETED" ? "Selesai" : "Dibatalkan"}</p>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-xl font-bold">Informasi Barang</h1>

                        <hr className="mt-2 mb-4"/>

                        <p className="mb-5">Perkiraan Tanggal Selesai: {convertToDate(workOrder.estimatedFinishDate.split("T")[0])}</p>

                        <div className="flex items-center w-full">
                            <Image src={wardobe} alt="icon" width={75} height={75} className="rounded-lg mr-5" />

                            <div className="flex items-center">
                                <div className="w-[500px]">
                                    <h1 className="font-semibold text-lg">{workOrder.itemDescription}</h1>
                                    <p className="text-sm">{workOrder.notes}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-xl font-bold">Ringkasan Pesanan</h1>

                        <hr className="mt-2 mb-4" />

                        <div className="flex justify-between my-2">
                            <p>Subtotal ({workOrder.quantity} barang)</p>
                            <p>Rp. {workOrder.price.toLocaleString()}</p>
                        </div>

                        <div className="flex justify-between my-2">
                            <p>Biaya Pengiriman</p>
                            <p>Rp. 75,000</p>
                        </div>

                        <hr className="my-3"/>

                        <div className="flex justify-between my-2 font-semibold">
                            <p>Total</p>
                            <p>Rp. {(workOrder.price + 75000).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="flex justify-end mt-5">
                        <Button className="bg-[gold] rounded-lg hover:cursor-pointer" onPress={handleNavigateDetail}>
                            <Image src={edit} alt="icon" width={20} height={20} />
                            Edit SPK
                        </Button>
                    </div>
                </div>

                <div className="w-[20%]">
                    <div className="bg-white shadow-lg rounded-lg px-5 py-5 h-fit">
                        <h1 className="font-bold text-xl mb-5">Informasi Klien</h1>

                        <div className="flex items-center">
                            <Image src={user} alt="icon" width={20} height={20} />
                            <p className="text-lg ml-2">{workOrder.client.name}</p>
                        </div>

                        <div className="flex">
                            <Image src={address} alt="icon" width={20} height={20} />
                            <p className="text-lg ml-2">{workOrder.client.address}</p>
                        </div>

                        <div className="flex">
                            <Image src={phone} alt="icon" width={20} height={20} />
                            <p className="text-lg ml-2">+62 {workOrder.client.telephone}</p>
                        </div>
                    </div>

                    {
                        workOrder.status == "CANCELLED"
                        ?
                        <></>
                        :
                        <div className="bg-white mt-5 rounded-lg shadow-lg px-5 py-5">
                            <h1 className="font-bold text-xl mb-5">Edit Status</h1>
                            {
                                workOrder.status == "NOT_STARTED"
                                ?
                                <Button className="bg-red-100 w-full rounded-lg hover:cursor-pointer" value={"IN_PROGRESS"}>Sedang Diproses</Button>
                                :
                                workOrder.status == "IN_PROGRESS"
                                ?
                                <Button className="bg-red-100 w-full rounded-lg hover:cursor-pointer" value={"COMPLETED"}>Selesai</Button>
                                :
                                <></>
                            }
                            <Button className="bg-red-600 text-white w-full rounded-lg my-3 hover:cursor-pointer">Batal SPK</Button>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}