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
import { setSourceMapsEnabled } from "process"

interface WorkOrder {
    id: string;
    workOrderNumber: string;
    estimatedFinishDate: string;
    createdDate: string;
    worker: string;
    notes: string;
    itemDescription: string;
    quantity: string;
    price: string;
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

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [valid, setValid] = useState<boolean>(true)
    const [message, setMessage] = useState<string>("")


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
        createdDate: "",
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

    const handleClickBack = () => {
        router.push("/dashboard/work-orders")
    }

    const handleNavigateDetail = () => {
        router.push(`${path}/edit`)
    }

    const handleChangeStatus = async (event: any): Promise<void> => {
        setIsLoading(true)

        const formData = new FormData()

        formData.set("id", path.split("/")[3])
        formData.set("status", event.target.name)

        try {
            const response = await fetch(`/api/work-orders/${path.split("/")[3]}`, {
                method: "PUT",
                body: formData
            })

            const data = await response.json()

            if(!response.ok) {
                throw new Error("Something went wrong. Please try again.")
            }

            setMessage(data.message)
            setIsVisible(true)

            if (data.success) {
                setValid(true)
            } else {
                setValid(false)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchWorkOrderDetail = async () => {
        try {
            const response = await fetch(`/api/work-orders/${path.split("/")[3]}`)

            const data = await response.json()

            if (!response.ok) {
                throw new Error("Failed to fetch data. Please try again.")
            }

            console.log(data.workOrder)

            setWorkOrder(data.workOrder)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className=" px-5 py-4 rounded-lg flex flex-row items-center justify-between bg-white">
                <h1 className="text-2xl">Rincian Surat Perintah Kerja</h1>

                <div className="flex items-center">
                    {/* Dropdown */}
                    <Button className="bg-[gold] rounded-lg ml-5 hover:cursor-pointer" onPress={handleClickBack}>
                        <Image src={back} alt="icon" width={20} height={20} />
                        <p>Kembali</p>
                    </Button>
                </div>
            </div>

            {/* Rincian SPK */}
            <div>
                <div className="grid grid-cols-3 gap-x-3 mt-5">
                    <div className="bg-white rounded-lg shadow-lg px-5 py-3">
                        <h3 className="text-slate-500 font-semibold">DIBUAT PADA:</h3>
                        <p className="text-lg">{convertToDate(workOrder.createdDate.split("T")[0])}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg border-l-0 border-r-0 px-5 py-3">
                        <h3 className="text-slate-500 font-semibold">PERKIRAAN TANGGAL SELESAI:</h3>
                        <p className="text-lg">{convertToDate(workOrder.estimatedFinishDate.split("T")[0])}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg px-5 py-3">
                        <h3 className="text-slate-500 font-semibold">PEKERJA:</h3>
                        <p className="text-lg">Winsten</p>
                    </div>
                </div>

                <div className="flex mt-5">
                    {/* Left */}
                    <div className="w-[80%] mr-5 px-5 py-5 bg-white shadow-lg rounded-lg h-fit">
                        <div className="flex justify-between">
                            <h1 className="text-xl font-bold">#{workOrder.workOrderNumber} / Medan</h1>
                            <p className={clsx("px-5 py-1 rounded-full", workOrder.status == "NOT_STARTED" ? "bg-slate-100 text-slte-500" : workOrder.status == "IN_PROGRESS" ? "bg-orange-100 text-orange-500" : workOrder.status == "COMPLETED" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500")}>{workOrder.status == "NOT_STARTED" ? "Belum Dimulai" : workOrder.status == "IN_PROGRESS" ? "Sedang Diproses" : workOrder.status == "COMPLETED" ? "Selesai" : "Dibatalkan"}</p>
                        </div>

                        <hr className="my-3"/>

                        <div className="my-2">
                            <h3 className="font-semibold">Deskripsi Barang</h3>
                            <p>{workOrder.itemDescription}</p>
                        </div>
                        <div className="my-2">
                            <h3 className="font-semibold">Catatan</h3>
                            <p>{workOrder.notes}</p>
                        </div>
                        <div className="my-2">
                            <h3 className="font-semibold">Kuantitas</h3>
                            <p>{workOrder.quantity}</p>
                        </div>
                        <div className="my-2">
                            <h3 className="font-semibold">Harga Barang</h3>
                            <p>Rp. {workOrder.price.toLocaleString()}</p>
                        </div>

                        {
                            workOrder.status == "COMPLETED" || workOrder.status == "CANCELLED"
                            ?
                            <></>
                            :
                            <Button onPress={handleNavigateDetail} className="bg-[gold] mt-10 rounded-lg">
                                <Image src={edit} width={20} height={20} alt="icon" />
                                Edit SPK
                            </Button>
                        }
                    </div>

                    {/* Right */}
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
                            workOrder.status == "CANCELLED" || workOrder.status == "COMPLETED"
                            ?
                            <></>
                            :
                            <div className="bg-white mt-5 rounded-lg shadow-lg px-5 py-5">
                                <h1 className="font-bold text-xl mb-5">Edit Status</h1>
                                {
                                    workOrder.status == "NOT_STARTED"
                                    ?
                                    <Button className="bg-[gold] w-full rounded-lg hover:cursor-pointer" name="IN_PROGRESS" onPress={(e) => handleChangeStatus(e)}>Sedang Diproses</Button>
                                    :
                                    workOrder.status == "IN_PROGRESS"
                                    ?
                                    <Button className="bg-[gold] w-full rounded-lg hover:cursor-pointer" name="COMPLETED" onPress={(e) => handleChangeStatus(e)}>Selesai</Button>
                                    :
                                    <></>
                                }

                                {
                                    workOrder.status == "COMPLETED"
                                    ?
                                    <></>
                                    :
                                    <Button className="bg-red-600 text-white w-full rounded-lg my-3 hover:cursor-pointer" name="CANCELLED" onPress={(e) => handleChangeStatus(e)}>Batal</Button>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>



                {/* <div className="w-[20%]">
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
                        workOrder.status == "CANCELLED" || workOrder.status == "COMPLETED"
                        ?
                        <></>
                        :
                        <div className="bg-white mt-5 rounded-lg shadow-lg px-5 py-5">
                            <h1 className="font-bold text-xl mb-5">Edit Status</h1>
                            {
                                workOrder.status == "NOT_STARTED"
                                ?
                                <Button className="bg-[gold] w-full rounded-lg hover:cursor-pointer" name="IN_PROGRESS" onPress={(e) => handleChangeStatus(e)}>Sedang Diproses</Button>
                                :
                                workOrder.status == "IN_PROGRESS"
                                ?
                                <Button className="bg-[gold] w-full rounded-lg hover:cursor-pointer" name="COMPLETED" onPress={(e) => handleChangeStatus(e)}>Selesai</Button>
                                :
                                <></>
                            }

                            {
                                workOrder.status == "COMPLETED"
                                ?
                                <></>
                                :
                                <Button className="bg-red-600 text-white w-full rounded-lg my-3 hover:cursor-pointer" name="CANCELLED">Batal</Button>
                            }
                        </div>
                    }
                </div> */}
            

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