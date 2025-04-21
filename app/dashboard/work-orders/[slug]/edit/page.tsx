'use client'

import { Button,  Input } from "@heroui/react";

import Image from "next/image";

import { useState, useEffect, ChangeEvent, FormEventHandler, FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";

import back from "@/public/svgs/back.svg"

interface WorkOrder {
    id: string;
    workOrderNumber: string;
    estimatedFinishDate: string;
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
}

interface workOrderForm {
    workOrderNumber: string;
    estimatedFinishDate: string;
    worker: string;
    client: string;
    notes: string;
    itemDescription: string;
    quantity: number;
    price: number;
}

export default function EditWorkOrder () {
    const path = usePathname()
    const router = useRouter()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [valid, setValid] = useState<boolean>(true)
    const [message, setMessage] = useState<string>("")

    const [clients, setClients] = useState<Client[]>([])
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
            name: ""
        }
    })

    useEffect(() => {
        fetchClients()
        fetchWorkOrderDetail()
    }, [])

    /**
     * Handles the navigation to the specific work order
     * detail page
     *
     * @returns none
     */
    const handleClickBack = (): void => {
        router.push(`${path.slice(0, path.length - 5)}`)
    }

    /**
     * This function fetches the information of
     * the work order detail
     *
     * @retuns none
     */
    const fetchWorkOrderDetail = async (): Promise<void> => {
        try {
            const response = await fetch(`/api/work-orders/${path.split("/")[3]}`)

            const data = await response.json()

            if (!response.ok) {
                throw new Error("Failed to fetch data. Please try again.")
            }

            console.log(data.workOrder.estimatedFinishDate.split("T")[0])

            setWorkOrder(data.workOrder)
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Fetches the clients to populate the dropdown
     * list.
     *
     * @returns none
     */
    const fetchClients = async (): Promise<void> => {
        try {
            const response = await fetch('/api/clients')

            const data = await response.json()

            const result = data.clients.filter((client: any) => client.status == "ACTIVE")

            setClients(result)
        } catch (error) {
            console.log(error)
        }
    }

    /**
     *
     * @param e
     */
    const handleChange = (e: any): void => {
        const { name, value } = e.target

        console.log(name, value)

        setWorkOrder(prev => ({...prev, [name]: value}))
    }

    /**
     *
     */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        setIsLoading(true)

        event.preventDefault()

        const formData: any = new FormData(event.currentTarget)

        formData.set("status", "")
        formData.set("id", path.split("/")[3])

        // Work Order form validation in the frontend
        const workOrderData = {
            workOrderNumber: "# SPK",
            estimatedFinishDate: "Perkiraan Tanggal Selesai",
            worker: "Pekerja",
            client: "Klien",
            notes: "Catatan",
            itemDescription: "Deskripsi Barang",
            quantity: "Kuantitas",
            price: "Harga Barang",
        }

        let s: string = ""
        let count: number = 0

        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1])
            if (pair[0] == "status") {
                continue
            }

            if (pair[1] == "") {
                count += 1

                if (count > 1) {
                    s += ", "
                }

                s += workOrderData[pair[0] as keyof workOrderForm]
            }
        }

        s += " tidak boleh kosong."

        if (count > 0) {
            setMessage(s)
            setIsVisible(true)
            setValid(false)
            setIsLoading(false)
            return
        }

        // Checking the validity of work order number written by user
        if (formData.get("workOrderNumber").split("/").length != 3) {
            setMessage("# SPK tidak sesuai. Silahkan melakukan pemeriksaan terhadap # SPK yang diinput. Format # SPK harus sesuai dengan yang dicontohkan.")
            setIsVisible(true)
            setValid(false)
            return
        }

        try {
            const response = await fetch(`/api/work-orders/${path.split("/")[3]}`, {
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
            } else {
                setValid(false)
            }
        } catch (error) {
            console.log(error)
            setMessage("Gagal untuk mengirim data. Silahkan kirim ulang data ini lagi.")
            setValid(false)
        } finally {
            setIsLoading(false)
        }

    }

    return (
        <>
            <div className=" px-5 py-4 rounded-lg flex flex-row items-center justify-between bg-white">
                <h1 className="text-2xl">Edit Surat Perintah Kerja</h1>

                <div className="flex items-center">
                    {/* Dropdown */}
                    <Button className="bg-[gold] rounded-lg ml-5 hover:cursor-pointer" onPress={handleClickBack}>
                        <Image src={back} alt="icon" width={20} height={20} />
                        <p>Kembali</p>
                    </Button>
                </div>
            </div>

            <form className="bg-white rounded-lg mt-5 px-5 py-5" onSubmit={handleSubmit}>
                <h1 className="text-xl">Informasi Surat Perintah Kerja</h1>

                <hr className="my-2"/>

                <table>
                    <tbody>
                        <tr>
                            <td># SPK</td>
                            <td className="w-[55%]"><Input placeholder="01/01/25" className="bg-slate-200 rounded-lg mb-3 mt-3 w-[350px]" classNames={{
                                input: "focus:outline-none"
                            }} name="workOrderNumber" onChange={handleChange} value={workOrder.workOrderNumber} /></td>
                        </tr>
                        <tr>
                            <td>Perkiraan Tanggal Selesai</td>
                            <td><input type="date" className="bg-slate-200 rounded-lg px-3 py-2 w-[350px] mb-3" name="estimatedFinishDate" onChange={handleChange} value={workOrder.estimatedFinishDate.split("T")[0]} /></td>
                        </tr>
                        <tr>
                            <td>Pekerja</td>
                            <td>
                                <Input placeholder="John Doe" className="bg-slate-200 rounded-lg mb-3" classNames={{
                                    input: "focus:outline-none"
                                }} name="worker" onChange={handleChange} value={workOrder.worker} />
                            </td>
                        </tr>
                        <tr>
                            <td>Nama Klien</td>
                            <td>
                                <select className="w-[350px] appearance-none px-3 py-2 bg-slate-200 rounded-lg mb-3" name="client" onChange={handleChange} value={workOrder.client.name}>
                                    <option value="">-</option>
                                    {
                                        clients.map((client: any) => (
                                            <option key={client.id} value={client.name}>{client.name}</option>
                                        ))
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Catatan</td>
                            <td className="w-[45%%]">
                                <textarea placeholder="Masukkan catatan ..." className="bg-slate-200 rounded-lg mb-3 px-3 py-3 w-[350px]" rows={3} name="notes" onChange={handleChange} value={workOrder.notes}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Deskripsi Barang</td>
                            <td>
                                <Input placeholder="Lemari 2 pintu" className="bg-slate-200 rounded-lg mb-3" classNames={{
                                    input: "focus:outline-none"
                                }} name="itemDescription" onChange={handleChange} value={workOrder.itemDescription} />
                            </td>
                        </tr>
                        <tr>
                            <td>Kuantitas</td>
                            <td>
                                <Input placeholder="1" className="bg-slate-200 rounded-lg mb-3" classNames={{
                                    input: "focus:outline-none"
                                }} name="quantity" onChange={handleChange} value={workOrder.quantity}/>
                            </td>
                        </tr>
                        <tr>
                            <td>Harga Barang</td>
                            <td>
                                <Input placeholder="4500000" className="bg-slate-200 rounded-lg mb-3"
                                startContent={<p className="mr-2">Rp. </p>} classNames={{
                                    input: "focus:outline-none"
                                }} name="price" onChange={handleChange} value={workOrder.price} />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <hr className="my-5" />

                <Button type="submit" disabled={isLoading} className="hover:cursor-pointer bg-[gold] rounded-lg">{isLoading ? "Sedang Memproses..." : "Simpan Data"}</Button>
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