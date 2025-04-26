'use client'

import { Button, Pagination } from "@heroui/react"

import { useEffect, useState } from "react"

import Image from "next/image"
import Link from "next/link"

import clsx from "clsx"

import add from "@/public/svgs/add.svg"
import { useRouter } from "next/navigation"

import { convertToDate } from "@/lib/utils"
import ClientDetail from "../clients/[slug]/page"

export default function WorkOrders() {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [active, setActive] = useState<boolean>(true)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [valid, setValid] = useState<boolean>(true)
    const [message, setMessage] = useState<string>("")

    const [workOrders, setWorkOrders] = useState([])
    const [displayedWorkOrders, setDisplayedWorkOrders] = useState<any[]>([])
    const [clients, setClients] = useState([])

    const maxRecords = 8

    const [status, setStatus] = useState<string>("")
    const [clientName, setClientName] = useState<string>("")
    const [page, setPage] = useState(0)
    const [records, setRecords] = useState<number>(0)

    useEffect(() => {
        fetchWorkOrder()
        fetchClients()
    }, [])

    /**
     * Handles the UI display to follow
     * the output status clicked by the user.
     *
     * @param event
     */
    const handleStatusChange = (event: any) => {
        setPage(0)

        let result: any[] = []
        const dropdown: any = document.getElementById("clientDropdown")

        if (event.target.name == "") {
            if (dropdown.value != "") {
                result = workOrders.filter((workOrder: any) => workOrder.client.name == dropdown.value)
            } else {
                result = workOrders
            }
            setActive(true)
        } else {
            if (dropdown.value != "") {
                result = workOrders.filter((workOrder: any) => workOrder.status == event.target.name && workOrder.client.name == dropdown.value)
            } else {
                result = workOrders.filter((workOrder: any) => workOrder.status == event.target.name)
            }

            setActive(false)
        }


        setRecords(result.length)
        setClientName(dropdown.value)
        setDisplayedWorkOrders(result.slice(0, maxRecords))
        setStatus(event.target.name)
        setPage(Math.ceil(result.length / maxRecords))
    }

    /**
     * This function is used to handle the pagination
     * when the pagination is clicked by the user.
     *
     * @param pageNumber
     */
    const handlePaginationChange = (pageNumber: number) => {
        let result: any[] = []

        if (status == "") {
            if (clientName != "") {
                result = workOrders.filter((workOrder: any) => workOrder.client.name == clientName)
            } else {
                result = workOrders
            }
        } else {
            if (clientName != "") {
                result = workOrders.filter((workOrder: any) => workOrder.status == status && workOrder.client.name == clientName)
            } else {
                result = workOrders.filter((workOrder: any) => workOrder.status == status)
            }
        }

        setDisplayedWorkOrders(result.slice(((pageNumber - 1) * maxRecords), maxRecords * pageNumber))
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
            setDisplayedWorkOrders(data.workOrders.slice(0, maxRecords))
            setRecords(data.workOrders.length)
            setPage(Math.ceil(data.workOrders.length / maxRecords))
        } catch (error) {
            setMessage("Gagal memuat data. Silahkan muat ulang halaman ini.")
            setValid(false)
            setIsVisible(true)
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Fetches all of the clients to be populated
     * in the filter client dropdown
     *
     * @returns none
     */
    const fetchClients = async () => {
        try {
            const response = await fetch("/api/clients")

            const data = await response.json()

            setClients(data.clients)
        } catch (error) {
            console.log(error)
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
                {/* Filter Client */}
                <div className="flex items-center mb-5">
                    <h3 className="mr-2">Filter Klien</h3>

                    <select className="bg-slate-200 px-10 py-1.5 rounded-lg appearance-none text-center hover:cursor-pointer text-left" id="clientDropdown" onChange={handleStatusChange}>
                        <option value="">-</option>
                        {
                            clients.map((client: any, index) => (
                                <option key={index} value={client.name}>{client.name}</option>
                            ))
                        }
                    </select>
                </div>

                <div id="btn">
                    <Button className={active ? `border-3 border-t-0 border-r-0 border-l-0 border-b-yellow-500 focus:outline-none` : ""} onPress={(e) => handleStatusChange(e)} name="">Semua</Button>
                    <Button className={status == "NOT_STARTED" ? "border-3 border-l-0 border-t-0 border-r-0 border-b-yellow-500 outline-none" : ""} onPress={(e) => handleStatusChange(e)} name="NOT_STARTED">Belum Dimulai</Button>
                <Button className={status == "IN_PROGRESS" ? "border-3 border-l-0 border-t-0 border-r-0 border-b-yellow-500 outline-none" : ""} onPress={(e) => handleStatusChange(e)} name="IN_PROGRESS">Sedang Diproses</Button>
                    <Button className="focus:border-3 focus:border-l-0 focus:border-t-0 focus:border-r-0 focus:border-b-yellow-500 focus:outline-none" onPress={(e) => handleStatusChange(e)} name="COMPLETED">Selesai</Button>
                </div>

                <hr className="pb-5"/>

                <table className="w-full text-left">
                    <thead className="pt-5 text-slate-400">
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
                            displayedWorkOrders.map((workOrder: any) => (
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
                                    <td><Link href={`/dashboard/work-orders/${workOrder.id}`} className="text-yellow-500 hover:underline">Lihat Rincian</Link></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                {
                    displayedWorkOrders.length == 0
                    ?
                    <p className="mt-5">{isLoading ? "Sedang memuat data..." : "Tidak ada data yang tersedia..."}</p>
                    :
                    <></>
                }

            </div>
            
            {/* Pagination */}
            <div className="flex justify-between items-center mt-5">
                <Pagination total={page} initialPage={1} classNames={{
                        item: "bg-yellow-200 rounded-lg px-3",
                        cursor: "px-3 bg-[gold] rounded-lg duration-200 text-white"
                    }}
                    onChange={(page: number) => handlePaginationChange(page)}
                />

                <p className="text-sm">{records} records</p>
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