'use client'

import { Button, Input } from "@heroui/react"

import Image from "next/image"

import back from "@/public/svgs/back.svg"
import search from "@/public/svgs/search.svg"
import clipboardAdd from "@/public/svgs/clipboard-add.svg"

import { useRouter } from "next/navigation"
import { useEffect, useState, FormEvent } from "react"
import { useUser } from "@clerk/nextjs"

interface InvoiceForm {
    invoiceNumber: string;
    clientName: string;
    packingPrice: number;
    shippingPrice: number;
}

export default function CreateInvoice() {
    const router = useRouter()
    const { user } = useUser()

    const [tableVisible, setTableVisible] = useState<boolean>(false)

    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")
    const [valid, setValid] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [workOrders, setWorkOrders] = useState([])
    const [clients, setClients] = useState([])
    const [displayedWorkOrders, setDisplayedWorkOrders] = useState([])


    const [selectedWorkOrder, setSelectedWorkOrder] = useState<Record<string, number>>({})
    let count: number = 0

    useEffect(() => {
        fetchWorkOrders()
        fetchClients()
    }, [])

    /**
     * Fetches all of the list of work orders
     *
     * @returns none
     */
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

    /**
     * Fetches all of the list of clients to be populated
     * into the dropdown list
     *
     * @returns none
     */
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

    /**
     * Navigates to list of invoices when user clicks on it
     *
     * @returns none
     */
    const handleClickBack = (): void => {
        router.push("/dashboard/invoices")
    }

    /**
     * Handles the submission the newly created invoices
     * by the user, and check the validation in the frontend.
     *
     * @param event
     * @returns
     */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        setIsLoading(true)

        const formData = new FormData(event.currentTarget)

        // Validate invoice based on user input
        const invoice = {
            invoiceNumber: "Nomor Invoice",
            clientName: "Nama Klien",
            packingPrice: "Biaya Packing",
            shippingPrice: "Biaya Pengiriman",
        }

        let s: string = ""
        let count: number = 0

        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1])
            if (pair[1] == "") {
                count += 1

                if (count > 1) {
                    s += ", "
                }

                s += invoice[pair[0] as keyof InvoiceForm]
            }
        }

        if (Object.keys(selectedWorkOrder).length == 0) {
            if (count > 0) {
                s += ", List SPK"
            } else {
                s += "List SPK"
            }

            count += 1
        }

        s += " tidak boleh kosong."

        if (count > 0) {
            setMessage(s)
            setIsVisible(true)
            setValid(false)
            setIsLoading(false)
            return
        }

        formData.set("workOrders", JSON.stringify(selectedWorkOrder))
        formData.set("user", user?.firstName + " " + user?.lastName)

        try {
            const response = await fetch(`/api/invoices`, {
                method: "POST",
                body: formData
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error("Something went wrong. Please submit again.")
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
            setMessage("Gagal untuk mengirimkan data karena kendala internet. Silahkan coba lagi.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleChangeDropdown = (event: any): void => {
        const clientName = event.currentTarget.value

        const result = workOrders.filter((workOrder: any) => workOrder.client.name == clientName && workOrder.availability == "AVAILABLE" && workOrder.status == "COMPLETED")

        setDisplayedWorkOrders(result)
        setTableVisible(true)
    }

    const handleChangeSelect = (event: any) => {
        const temp = selectedWorkOrder
        const key = event.currentTarget.value

        if (key in temp) {
            delete temp[`${key}`]
            count -= 1
        } else {
            temp[`${event.currentTarget.value}`] = count
            count += 1
        }

        setSelectedWorkOrder(temp)
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
                                <select className="w-[350px] appearance-none px-3 py-2 bg-slate-200 rounded-lg mb-3" onChange={(e) => handleChangeDropdown(e)} name="clientName">
                                    <option value="">-</option>
                                    {
                                        clients.map((client: any) => (
                                            <option key={client.name} value={client.name}>{client.name}</option>
                                        ))
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="w-[30%]">Biaya Packing</td>
                            <td>
                                <Input placeholder="150000" type="number" className="bg-slate-200 rounded-lg mb-3"
                                startContent={<p className="mr-2">Rp. </p>} classNames={{
                                    input: "focus:outline-none"
                                }} name="packingPrice" />
                            </td>
                        </tr>
                        <tr>
                            <td className="w-[30%]">Biaya Pengiriman</td>
                            <td>
                                <Input placeholder="75000" type="number" className="bg-slate-200 rounded-lg mb-3"
                                startContent={<p className="mr-2">Rp. </p>} classNames={{
                                    input: "focus:outline-none"
                                }} name="shippingPrice" />
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
                    <Button type="submit" className="bg-[gold] rounded-lg hover:cursor-pointer">
                        <Image src={clipboardAdd} alt="icon" width={20} height={20} />
                        {isLoading ? "Memproses..." : "Buat Baru"}
                    </Button>
                    :
                    <></>
                }
            </form>

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