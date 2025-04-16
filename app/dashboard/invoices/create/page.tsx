'use client'

import { Button, Input } from "@heroui/react"

import Image from "next/image"

import back from "@/public/svgs/back.svg"
import search from "@/public/svgs/search.svg"

import { useRouter } from "next/navigation"
import { useEffect, useState, FormEvent } from "react"

export default function CreateInvoice() {
    const router = useRouter()

    const [tableVisible, setTableVisible] = useState<boolean>(false)

    const [workOrders, setWorkOrders] = useState([])
    const [clients, setClients] = useState([])
    const [displayedWorkOrders, setDisplayedWorkOrders] = useState([])

    
    const selectedWorkOrder: Record<string, number> = {}
    let count: number = 0

    useEffect(() => {
        fetchWorkOrders()
        fetchClients()
    }, [])
    
    const fetchWorkOrders = async (): Promise<void> => {
        try {
            const response = await fetch("/api/work-orders")

            const data = await response.json()

            if (!response.ok) {
                throw new Error("Something went wrong. Please try again.")
            }

            setWorkOrders(data.workOrders)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchClients = async (): Promise<void> => {
        try {
            const response = await fetch("/api/clients")

            const data = await response.json()

            if (!response.ok) {
                throw new Error("Something went wrong. Please try again.")
            }

            const result = data.clients.filter((client: any) => client.status == "ACTIVE")

            setClients(result)
        } catch (error) {
            console.log(error)
        }
    }

    const handleClickBack = (): void => {
        router.push("/dashboard/invoices")
    }
    
    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        formData.set("workOrders", JSON.stringify(selectedWorkOrder))

        try {
            const response = await fetch(`/api/invoices`, {
                method: "POST",
                body: formData
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error("Something went wrong. Please submit again.")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleChangeDropdown = (event: any): void => {
        const clientName = event.currentTarget.value

        const result = workOrders.filter((workOrder: any) => workOrder.client.name == clientName && workOrder.availability == "AVAILABLE")

        setDisplayedWorkOrders(result)
        setTableVisible(true)
    }

    const handleChangeSelect = (event: any) => {
        const key = event.currentTarget.value

        if (key in selectedWorkOrder) {
            delete selectedWorkOrder[`${key}`]
            count -= 1
        } else {
            selectedWorkOrder[`${event.currentTarget.value}`] = count
            count += 1
        }

        console.log(selectedWorkOrder)
    }

    return (
        <>
            <div className=" px-5 py-4 rounded-lg flex flex-row items-center justify-between bg-white">
                <h1 className="text-2xl">Pembuatan Invoice Baru</h1>

                <div className="flex items-center">
                    {/* Dropdown */}
                    <Button className="bg-[gold] rounded-lg ml-5 hover:cursor-pointer" onPress={handleClickBack}>
                        <Image src={back} alt="icon" width={20} height={20} />
                        <p>Kembali</p>
                    </Button>
                </div>
            </div>

            <form className="bg-white rounded-lg mt-5 px-5 py-5 shadow-lg" onSubmit={handleSubmit}>
                <h1 className="text-xl">Informasi Invoice</h1>

                <hr className="my-2"/>

                <table>
                    <tbody>
                        <tr>
                            <td className="w-[30%]">Nomor Invoice</td>
                            <td>
                                <Input placeholder="01/01/25" className="bg-slate-200 rounded-lg mb-3 mt-3 w-[350px]" classNames={{
                                    input: "focus:outline-none"
                                }} name="invoiceNumber" />
                            </td>
                        </tr>
                        <tr className="">
                            <td className="w-[30%]">Nama Klien</td>
                            <td>
                                <select className="w-[350px] appearance-none px-3 py-2 bg-slate-200 rounded-lg mb-3" onChange={(e) => handleChangeDropdown(e)}>
                                    <option value="">-</option>
                                    {
                                        clients.map((client: any) => (
                                            <option key={client.name} value={client.name}>{client.name}</option>
                                        ))
                                    }
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>


                {
                    tableVisible
                    ?
                    <div className="mt-10">
                        <Input
                            startContent={
                                <Image src={search} alt='icon' width={20} height={20} className="mr-2" />
                            }
                            classNames={{
                                input: "focus:outline-none"
                            }}
                            placeholder="Masukkan deskripsi barang..."
                            type='text'
                            className="w-1/4 bg-slate-100 rounded-lg"
                            id="search"
                            // onChange={() => handleChange()}
                        />

                        <table className="w-full my-5">
                            <thead>
                                <tr className="text-left text-slate-400">
                                    <th className="pb-5"></th>
                                    <th className="pb-5"># SPK</th>
                                    <th className="pb-5">Deskripsi</th>
                                    <th className="pb-5">Kuantitas</th>
                                    <th className="pb-5">Harga Barang</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    displayedWorkOrders.map((workOrder: any) => (
                                        <tr key={workOrder.id}>
                                            <td><input type="checkbox" value={workOrder.id} onChange={(e) => handleChangeSelect(e)}/></td>
                                            <td className="py-2">{workOrder.workOrderNumber}</td>
                                            <td className="py-2">
                                                <p>{workOrder.itemDescription} <br /><span className="text-xs">{workOrder.notes}</span></p>
                                            </td>
                                            <td className="py-2">{workOrder.quantity}</td>
                                            <td className="py-2">Rp. {workOrder.price.toLocaleString()}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    :
                    <></>
                }

                {
                    tableVisible
                    ?
                    <Button type="submit">Buat Baru</Button>
                    :
                    <></>
                }
            </form>
        </>
    )
}