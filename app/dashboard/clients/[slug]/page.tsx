'use client'

import Image from "next/image"
import Link from "next/link"

import building from "@/public/svgs/building.svg"
import progress from "@/public/svgs/progress.svg"

import { convertToDate } from "@/lib/utils"

import { FormEvent, useEffect, useState } from "react"
import clsx from "clsx"

import { Button, Input, Pagination } from "@heroui/react"
import { usePathname } from "next/navigation"

interface clientInfo {
    name: string;
    city: string;
    address: string;
    telephone: string;
    status: string;
}

export default function ClientDetail() {
    const path: string = usePathname()

    const [enableEdit, setEnableEdit] = useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(true)

    const [workOrders, setWorkOrders] = useState([])
    const [invoices, setInvoices] = useState([])

    const [clientInfo, setClientInfo] = useState<clientInfo>({
        name: "",
        city: "",
        address: "",
        telephone: "",
        status: ""
    })

    const [initialClientInfo, setInitialClientInfo] = useState<clientInfo>({
        name: "",
        city: "",
        address: "",
        telephone: "",
        status: ""
    })

    useEffect(() => {
        fetchClientDetail()
    }, [])

    /**
     * Handles the submission to update the existing
     * client's data
     *
     * @param event - capture all the inputs from the form
     * @returns none
     */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        setIsLoading(true)

        event.preventDefault()

        const formData = new FormData()

        for (const [key, value] of Object.entries(clientInfo)) {
            formData.set(key, value)
        }

        formData.set("status", "")

        try {
            const response = await fetch(`/api/clients/${path.split('/')[3]}`, {
                method: "PUT",
                body: formData
            })

            const data = await response.json()

            if (!data.success) {
                setSuccess(false)
                setEnableEdit(true)
            } else {
                setEnableEdit(false)
                setSuccess(true)
            }

            setMessage(data.message)
        } catch (error) {
            console.log(error)
        } finally {
            setIsVisible(true)
            setIsLoading(false)
        }
    }

    /**
     * Set the status of the current client
     * to inactive
     */
    const handleDeactivate = async () => {
        setIsLoading(true)

        const formData = new FormData()

        formData.set("status", clientInfo.status)

        try {
            const response = await fetch(`/api/clients/${path.split('/')[3]}`, {
                method: "PUT",
                body: formData
            })

            if (!response.ok) {
                throw new Error('Something went wrong. Please try again.')
            }

            const data = await response.json()

            if (data.success) {
                setMessage(data.message)
                setSuccess(true)
            }

            setIsVisible(true)
        } catch (error) {
            console.log(error)
            setSuccess(false)
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Fetches the detailed data for specific
     * client and show it to the user.
     */
    const fetchClientDetail = async (): Promise<void> => {
        try {
            const response = await fetch(`/api/clients/${path.split('/')[3]}`)

            const data = await response.json()

            console.log(data)

            if (data.success) {
                setClientInfo({
                    name: data.clientDetail.name,
                    city: data.clientDetail.city,
                    address: data.clientDetail.address,
                    telephone: data.clientDetail.telephone,
                    status: data.clientDetail.status
                })
                setInitialClientInfo({
                    name: data.clientDetail.name,
                    city: data.clientDetail.city,
                    address: data.clientDetail.address,
                    telephone: data.clientDetail.telephone,
                    status: data.clientDetail.status
                })
                setWorkOrders(data.workOrders)
                setInvoices(data.invoices)
            }
        } catch (error) {
            console.log(error)
            setMessage('Gagal untuk memuat detail klien. Silahkan muat ulang halaman ini.')
        } finally {
            // setIsLoading(false)
        }
    }

    /**
     * Handles the changes of the word when the user
     * edits the input
     *
     * @param e - specific input element triggered by user
     * @returns none
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target

        console.log(name, value)

        setClientInfo(prev => ({...prev, [name]: value}))
    }

    /**
     * Reset the form when user clicks on back button
     * after the form has been modified
     *
     * @returns none
     */
    const handleReset = (): void => {
        setClientInfo(initialClientInfo)
        setEnableEdit(false)
    }

    return (
        <>
            <div className="flex flex-row mb-10">
                {/* Profile */}
                <div className="bg-white px-5 py-5 flex flex-col w-[40%] rounded-lg items-center mr-5 h-fit">
                    <Image src={building} alt="icon" width={70} height={70} />

                    <form onSubmit={handleSubmit} className="w-full">
                        {
                            enableEdit
                            ?
                            <></>
                            :
                            <div className="flex flex-col-reverse items-center">
                                <h1 className="text-2xl">{clientInfo.name}</h1>
                                <p className={clsx("px-4 py-1 text-white w-fit rounded-lg mt-5 mb-2", clientInfo.status == "ACTIVE" ? "bg-gradient-to-l from-green-500 to-green-600" : "bg-gradient-to-l from-red-500 to-red-600")}>{clientInfo.status == "ACTIVE" ? "Aktif" : "Nonaktif"}</p>
                            </div>
                        }

                        <div className="flex justify-center">
                            {
                                enableEdit
                                ?
                                <></>
                                :
                                <div className="flex">
                                    <Button onPress={() => setEnableEdit(true)} className="bg-[gold] rounded-lg my-5 hover:cursor-pointer mr-5">Edit Klien</Button>
                                    <Button disabled={isLoading} onPress={handleDeactivate} className={clsx("rounded-lg hover:cursor-pointer border my-5", clientInfo.status == "INACTIVE" ? "border-green-500 text-green-500" : "border-red-500 text-red-500")}>{clientInfo.status == "ACTIVE" ? "Nonaktifkan" : "Aktifkan"}</Button>
                                </div>
                            }
                        </div>


                        {
                            enableEdit
                            ?
                            <div>
                                <div>
                                    <label>Nama Klien</label>
                                    <Input type="text" placeholder="Nama Klien" className="bg-slate-200 rounded-lg mb-3 mt-1" value={clientInfo.name} classNames={{
                                        input: "focus:outline-none"
                                    }} onChange={handleChange} name="name"/>
                                </div>

                                <div>
                                    <label>Kota</label>
                                    <Input type="text" placeholder="Kota" className="bg-slate-200 rounded-lg mb-3 mt-1" value={clientInfo.city} classNames={{
                                        input: "focus:outline-none"
                                    }} onChange={handleChange} name="city"/>
                                </div>

                                <div>
                                    <label>Alamat</label>
                                    <Input type="text" placeholder="Alamat" className="bg-slate-200 rounded-lg mb-3" value={clientInfo.address} classNames={{
                                        input: "focus:outline-none"
                                    }} onChange={handleChange} name="address"/>
                                </div>

                                <div>
                                    <label>No. Telepon</label>
                                    <Input type="text" startContent={<p className="mr-2">+62</p>} placeholder="No. Telepon" className="bg-slate-200 rounded-lg mb-3" value={clientInfo.telephone} classNames={{
                                        input: "focus:outline-none"
                                    }} onChange={handleChange} name="telephone"/>
                                </div>
                            </div>
                            :
                            <div>
                                <Input type="text" value={clientInfo.city} className="bg-slate-200 rounded-lg mb-5"  disabled={true}/>
                                <Input type="text" value={clientInfo.address} className="bg-slate-200 rounded-lg mb-5" disabled={true}/>
                                <Input type="text" value={clientInfo.telephone} startContent={<p className="mr-2">+62</p>} className="bg-slate-200 rounded-lg mb-5" disabled={true}/>
                            </div>
                        }

                        {
                            enableEdit
                            ?
                            <div className="mt-10">
                                <Button onPress={handleReset} className="hover:cursor-pointer border border-red-500 text-red-500 rounded-lg">Kembali</Button>
                                <Button disabled={isLoading} type="submit" className="hover:cursor-pointer bg-[gold] rounded-lg ml-5">Simpan Data</Button>
                            </div>
                            :
                            <></>
                        }
                    </form>
                </div>

                <div>
                    <div className="grid grid-cols-3">
                        <div className="bg-white rounded-lg h-fit px-10 py-5 flex">
                            <div className="mr-3">
                                <p className="text-2xl font-bold text-orange-500">5</p>
                                <p className="">Sedang Diproses</p>
                            </div>
                            <Image src={progress} alt="icon" width={30} height={30} />
                        </div>
                    </div>

                    {/* Table List SPK */}
                    <div className="bg-white px-5 py-5 rounded-lg mt-5">
                        <h1 className="mb-5">Daftar SPK Terbaru (5 daftar)</h1>

                        <table className="table-auto w-full">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="pb-2"># SPK</th>
                                    <th className="pb-2">Pekerja</th>
                                    <th className="pb-2">Deskripsi Barang</th>
                                    <th className="pb-2">Status</th>
                                    <th className="pb-2">Aksi</th>
                                </tr>
                            </thead>
                            {
                                workOrders.length > 0
                                ?
                                <tbody>
                                    {
                                        workOrders.map((workOrder: any, index) => (
                                            <tr className="text-sm" key={index}>
                                                <td className="py-3">{workOrder.workOrderNumber}</td>
                                                <td>{workOrder.worker}</td>
                                                <td>{workOrder.itemDescription}</td>
                                                <td><p className={clsx("px-2 py-1 w-fit rounded-full text-xs", workOrder.status == "COMPLETED" ? "bg-green-100 text-green-500" : workOrder.status == "IN_PROGRESS" ? "bg-orange-100 text-orange-500" : workOrder.status == "NOT_STARTED" ? "bg-slate-100 text-slate-500" : "bg-red-100 text-red-500")}>{workOrder.status == "COMPLETED" ? "Selesai" : workOrder.status == "IN_PROGRESS" ? "Sedang Diproses" : workOrder.status == "NOT_STARTED" ? "Belum Dimulai" : "Dibatalkan"}</p></td>
                                                <td><Link href={`/dashboard/work-orders/${workOrder.id}`} className="text-yellow-500 hover:underline">Lihat Detail</Link></td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                                :
                                <></>
                            }
                        </table>

                        {
                            workOrders.length == 0
                            ?
                            <div className="mt-3 text-sm">Tidak ada data yang tersedia ...</div>
                            :
                            <></>
                        }
                    </div>

                    {/* Table List Invoice */}
                    <div className="bg-white px-5 py-5 rounded-lg mt-5">
                        <h1 className="mb-5">Daftar Invoice</h1>

                        <table className="table-auto w-full">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="pb-2"># Invoice</th>
                                    <th className="pb-2">Status</th>
                                    <th className="pb-2">Dibuat Pada Tanggal</th>
                                    <th className="pb-2">Aksi</th>
                                </tr>
                            </thead>
                            {
                                invoices.length > 0
                                ?
                                <tbody>
                                    {
                                        invoices.map((invoice: any, index) => (
                                            <tr className="text-sm" key={index}>
                                                <td className="py-3">{invoice.invoiceNumber}</td>
                                                <td><p className={clsx("px-2 py-1 w-fit rounded-full text-xs", invoice.status == "PAID" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500")}>{invoice.status == "PAID" ? "Lunas" : "Belum Lunas"}</p></td>
                                                <td>{convertToDate(invoice.createdDate.split("T")[0])}</td>
                                                <td><Link href={`/dashboard/invoices/${invoice.id}`} className="text-yellow-500 hover:underline">Lihat Detail</Link></td>
                                            </tr>

                                        ))
                                    }
                                </tbody>
                                :
                                <></>
                            }
                        </table>

                        {
                            invoices.length == 0
                            ?
                            <div className="mt-3 text-sm">Tidak ada data yang tersedia ...</div>
                            :
                            <></>
                        }

                    </div>
                </div>
            </div>

            {/* Toast */}
            {
                isVisible ?
                <div className={`fixed bottom-5 right-5 ${success ? "bg-green-700" : "bg-red-700"} text-white w-[30%] py-5 rounded-lg px-4 flex justify-between items-center z-20`}>
                    <p>{message}</p>
                    <Button onPress={() => setIsVisible(false)} className={`bg-white text-black rounded-lg ml-5 cursor-pointer ${success ? "text-green-700" : "text-red-700"}`}>Tutup</Button>
                </div>
                :
                <></>
            }
        </>
    )
}