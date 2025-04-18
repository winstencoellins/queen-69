'use client'

import { Button } from "@heroui/react"

import { useEffect, useState } from "react"

import Image from "next/image"
import Link from "next/link"

import clsx from "clsx"

import add from "@/public/svgs/add.svg"
import { useRouter } from "next/navigation"

import { convertToDate } from "@/lib/utils"

export default function WorkOrders() {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [active, setActive] = useState<boolean>(true)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [valid, setValid] = useState<boolean>(true)
    const [message, setMessage] = useState<string>("")

    const [workOrders, setWorkOrders] = useState([])

    useEffect(() => {
        fetchWorkOrder()
    }, [])

    /**
     * Handles the changes of the status
     * depending on the user input
     *
     * @returns none
     */
    const handleChange = () => {
        // const btn = document.getElementById("btn")
        // console.log(btn?.innerHTML)
        // active ? setActive(false) : setActive(true)
    }

    /**
     * Fetches the work order and set the
     * initial state of the button to "All"
     * work orders
     *
     * @returns none
     */
    const fetchWorkOrder = async (): Promise<void> => {
        setActive(true)
        setIsLoading(true)
        setIsVisible(false)
        setValid(true)

        try {
            const response = await fetch("/api/work-orders")

            const data = await response.json()

            setWorkOrders(data.workOrders)
        } catch (error) {
            setMessage("Gagal memuat data. Silahkan muat ulang halaman ini.")
            setValid(false)
            setIsVisible(true)
        } finally {
            setIsLoading(false)
        }


    }

    /**
     * Redirects the user to create work order
     * page
     *
     * @returns none
     */
    const handleClickCreate = (): void => {
        router.push('/dashboard/work-orders/create')
    }

    return (
        <>
            <div className=" px-5 py-4 rounded-lg flex flex-row items-center justify-between bg-white">
                <h1 className="text-2xl">Surat Perintah Kerja</h1>

                <div className="flex items-center">
                    {/* Dropdown */}
                    <Button className="bg-[gold] rounded-lg ml-5 hover:cursor-pointer" onPress={handleClickCreate}>
                        <Image src={add} alt="icon" width={20} height={20} />
                        <p>{isLoading ? "Mengarahkan ..." : "Tambah SPK"}</p>
                    </Button>
                </div>
            </div>

            <div className="bg-white mt-5 px-5 py-5 rounded-lg shadow-lg">
                <div>
                    <Button className={active ? `border-3 border-b-yellow-500 border-l-0 border-t-0 border-r-0 focus:border-3 focus:border-l-0 focus:border-t-0 focus:border-r-0 focus:border-b-yellow-500 focus:outline-none` : `border-none`} onPress={handleChange} id="btn">Semua</Button>
                    <Button className="focus:border-3 focus:border-l-0 focus:border-t-0 focus:border-r-0 focus:border-b-yellow-500 focus:outline-none" onPress={handleChange} id="btn">Belum Dimulai</Button>
                    <Button className="focus:border-3 focus:border-l-0 focus:border-t-0 focus:border-r-0 focus:border-b-yellow-500 focus:outline-none" onPress={handleChange} id="btn">Sedang Diproses</Button>
                    <Button className="focus:border-3 focus:border-l-0 focus:border-t-0 focus:border-r-0 focus:border-b-yellow-500 focus:outline-none" onPress={handleChange} id="btn">Selesai</Button>
                </div>

                <hr className="pb-5"/>

                <table className="w-full text-left">
                    <thead className="pt-5">
                        <tr>
                            <th># SPK</th>
                            <th>Klien</th>
                            <th>Deskripsi Barang</th>
                            <th>Perkiraan Tanggal Selesai</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            workOrders.map((workOrder: any) => (
                                <tr key={workOrder.workOrderNumber} className="">
                                    <td className="py-5">{workOrder.workOrderNumber}</td>
                                    <td className="">
                                        <p>{workOrder.client.name}<br />
                                        <span className="text-xs">+62 {workOrder.client.telephone}</span>
                                        </p>
                                    </td>
                                    <td><p>{workOrder.itemDescription} <br /><span className="text-xs">{workOrder.notes}</span></p></td>
                                    <td>{convertToDate(workOrder.estimatedFinishDate.split("T")[0])}</td>
                                    <td><p className={clsx("px-5 py-1 w-fit text-sm rounded-full", workOrder.status == "NOT_STARTED" ? "bg-slate-100 text-slate-500" : workOrder.status == "IN_PROGRESS" ? "bg-orange-100 text-orange-500" : workOrder.status == "COMPLETED" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500")}>{workOrder.status == "NOT_STARTED" ? "Belum Dimulai" : workOrder.status == "IN_PROGRESS" ? "Sedang Diproses" : workOrder.status == "COMPLETED" ? "Selesai" : "Dibatalkan"}</p></td>
                                    <td><Link href={`/dashboard/work-orders/${workOrder.id}`}>Lihat Detail</Link></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
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