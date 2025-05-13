'use client'

import { useRouter } from "next/navigation"

import Image from "next/image"

import { Button, Input } from "@heroui/react"

import back from "@/public/svgs/back.svg"
import clipboardAdd from "@/public/svgs/clipboard-add.svg"

import { FormEvent, useEffect, useState } from "react"

interface clientInfo {
    name: string;
    city: string;
    address: string;
    telephone: string;
    status: string;
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

export default function WorkOrderCreate() {
    const router = useRouter()

    const [message, setMessage] = useState<string>("")
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [valid, setValid] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [clients, setClients] = useState<clientInfo[]>([])
    const [employees, setEmployees] = useState([])

    useEffect(() => {
        fetchClients()
        fetchEmployees()
    }, [])

    /**
     * Fetches the list of all employees that's
     * available
     *
     * @returns none
     */
    const fetchEmployees = async () => {
        try {
            const response = await fetch(`/api/employees`)

            const data = await response.json()

            if (!response.ok) {
                throw new Error("Something went wrong. Please try again.")
            }

            console.log(data.employees)

            setEmployees(data.employees)
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Fetches all the client name to populate the select
     * tag dropdown. Then filter it based on ACTIVE clients
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
     * Handles the creation of a new work order
     *
     * @param event - input received from user
     *
     */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        setIsLoading(true)

        setValid(true)
        setIsVisible(false)
        setMessage("")

        event.preventDefault()

        const formData: any = new FormData(event.currentTarget)

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
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch("/api/work-orders", {
                method: "POST",
                body: formData
            })

            const data = await response.json()

            if (data.success) {
                setMessage(data.message)
                setIsVisible(true)
            } else {
                setMessage(data.message)
                setValid(false)
                setIsVisible(true)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }


    }

    /**
     * When user clicked on this button, user will be
     * redirected to work orders page
     *
     * @returns none
     */
    const handleClickBack = (): void => {
        router.push("/dashboard/work-orders")
    }

    return (
        <>
            <div className=" px-5 py-4 rounded-lg flex flex-row items-center justify-between bg-white">
                <h1 className="text-2xl">Pembuatan Surat Perintah Kerja Baru</h1>

                <div className="flex items-center">
                    {/* Dropdown */}
                    <Button className="bg-[gold] rounded-lg ml-5 hover:cursor-pointer" onPress={handleClickBack}>
                        <Image src={back} alt="icon" width={20} height={20} />
                        <p>Kembali</p>
                    </Button>
                </div>
            </div>

            <form className="bg-white rounded-lg mt-5 px-5 py-5 shadow-lg" onSubmit={handleSubmit}>
                <h1 className="text-xl">Informasi Surat Perintah Kerja</h1>

                <hr className="my-2"/>

                <table>
                    <tbody>
                        <tr>
                            <td># SPK</td>
                            <td className="w-[55%]"><Input placeholder="01/01/25" className="bg-slate-200 rounded-lg mb-3 mt-3 w-[350px]" classNames={{
                                input: "focus:outline-none"
                            }} name="workOrderNumber" /></td>
                        </tr>
                        <tr>
                            <td>Perkiraan Tanggal Selesai</td>
                            <td><input type="date" className="bg-slate-200 rounded-lg px-3 py-2 w-[350px] mb-3" name="estimatedFinishDate" /></td>
                        </tr>
                        <tr>
                            <td>Pekerja</td>
                            <td>
                                <select className="w-[350px] appearance-none px-3 py-2 bg-slate-200 rounded-lg mb-3" name="workerId">
                                    <option value="">-</option>
                                    {
                                        employees.map((employee: any) => (
                                            <option key={employee.id} value={employee.id}>{employee.name}</option>
                                        ))
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Nama Klien</td>
                            <td>
                                <select className="w-[350px] appearance-none px-3 py-2 bg-slate-200 rounded-lg mb-3" name="client">
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
                                <textarea placeholder="Masukkan catatan ..." className="bg-slate-200 rounded-lg mb-3 px-3 py-3 w-[350px]" rows={3} name="notes" />
                            </td>
                        </tr>
                        <tr>
                            <td>Deskripsi Barang</td>
                            <td>
                                <Input placeholder="Lemari 2 pintu" className="bg-slate-200 rounded-lg mb-3" classNames={{
                                    input: "focus:outline-none"
                                }} name="itemDescription" />
                            </td>
                        </tr>
                        <tr>
                            <td>Kuantitas</td>
                            <td>
                                <Input placeholder="1" className="bg-slate-200 rounded-lg mb-3" classNames={{
                                    input: "focus:outline-none"
                                }} name="quantity" />
                            </td>
                        </tr>
                        <tr>
                            <td>Harga Barang</td>
                            <td>
                                <Input placeholder="4500000" type="number" className="bg-slate-200 rounded-lg mb-3"
                                startContent={<p className="mr-2">Rp. </p>} classNames={{
                                    input: "focus:outline-none"
                                }} name="price" />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <hr className="my-5" />

                <Button type="submit" disabled={isLoading} className="hover:cursor-pointer bg-[gold] rounded-lg">
                    <Image src={clipboardAdd} alt="icon" width={20} height={20} />
                    {isLoading ? "Sedang Memproses..." : "Buat SPK Baru"}
                </Button>
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