'use client'

import back from "@/public/svgs/back.svg"
import edit from "@/public/svgs/edit.svg"

import { Button, Input } from "@heroui/react"

import Image from "next/image"

import { usePathname, useRouter } from "next/navigation"

import { FormEvent, useEffect, useState } from "react"

interface InvoiceForm {
    invoiceNumber: string;
    packingPrice: string;
    shippingPrice: string;
}

export default function EditInvoice() {
    const router = useRouter()
    const path = usePathname()

    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [valid, setValid] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [workOrders, setWorkOrders] = useState([])
    const [invoiceWorkOrder, setInvoiceWorkOrder] = useState([])
    const [invoice, setInvoice] = useState({
        invoiceNumber: "",
        packingPrice: "",
        shippingPrice: "",
        name: ""
    })

    const [removeWorkOrder, setRemoveWorkOrder] = useState<Record<string, boolean>>({})
    const [addWorkOrder, setAddWorkOrder] = useState<Record<string, boolean>>({})

    useEffect(() => {
        fetchInvoiceDetail()
    }, [])

    /**
     * Navigate back to invoice detail
     *
     * @returns none
     */
    const handleClickBack = (): void => {
        router.push(`/dashboard/invoices/${path.split("/")[3]}`)
    }

    /**
     * Handles the changes made by user and will be
     * submitted to the backend.
     *
     * @param e
     */
    const handleChange = (e: any): void => {
        const { name, value } = e.target

        console.log(name, value)

        setInvoice(prev => ({...prev, [name]: value}))
    }

    /**
     * Collects all the checked data by user to add
     * the work order into the related invoice
     *
     * @param event
     */
    const handleAddSelect = (event: any) => {
        const temp = addWorkOrder
        const key = event.currentTarget.value

        if (key in temp) {
            delete temp[`${key}`]
        } else {
            temp[`${key}`] = true
        }

        console.log(temp)
        setAddWorkOrder(temp)
    }

    /**
     * Collects all the checked data by user to remove
     * work order from the invoice
     *
     * @param event
     */
    const handleRemoveSelect = (event: any) => {
        const temp = removeWorkOrder
        const key = event.currentTarget.value

        if (key in temp) {
            delete temp[`${key}`]
        } else {
            temp[`${key}`] = true
        }

        console.log(temp)
        setRemoveWorkOrder(temp)
    }

    /**
     * Fetches the invoice detail data including the
     * "COMPLETED" work order related to client targeted in the invoice.
     *
     * JSON Output - { invoice, client, workOrders }
     * @returns none
     */
    const fetchInvoiceDetail = async (): Promise<void> => {
        setIsLoading(true)

        try {
            const response = await fetch(`/api/invoices/${path.split("/")[3]}`)

            const data = await response.json()

            if (!response.ok) {
                throw new Error("Something went wrong. Please try again.")
            }

            if (data.invoice.status == "PAID") {
                router.push(`/dashboard/invoices/${path.split("/")[3]}`)

                return
            }

            setInvoiceWorkOrder(data.invoice.workOrder)
            setWorkOrders(data.workOrders)
            setInvoice({
                invoiceNumber: data.invoice.invoiceNumber,
                shippingPrice: data.invoice.shippingPrice,
                packingPrice: data.invoice.packingPrice,
                name: data.client.name
            })
        } catch (error) {
            console.log(error)
            setIsVisible(true)
            setValid(false)
            setMessage("Gagal untuk memuat data karena koneksi internet. Silahkan coba lagi.")
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Handles the submission of the edited field made by the user
     *
     * @param event
     * @returns none
     */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        setValid(true)

        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const invoice: InvoiceForm = {
            invoiceNumber: "Nomor Invoice",
            packingPrice: "Biaya Pengepakan",
            shippingPrice: "Biaya Pengiriman",
        }

        let count = 0
        let s = ""

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

        s += " tidak boleh kosong."

        if (count > 0) {
            setMessage(s)
            setIsVisible(true)
            setValid(false)
            setIsLoading(false)
            return
        }

        formData.set("removeWorkOrder", JSON.stringify(removeWorkOrder))
        formData.set("addWorkOrder", JSON.stringify(addWorkOrder))
        formData.set("id", path.split("/")[3])
        formData.set("status", "")

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
            } else {
                setValid(false)
            }
        } catch (error) {
            console.log(error)
            setMessage("Gagal untuk mengirimkan data dikarenakan kenadala internet. Silahkan coba lagi.")
            setValid(false)
            setIsVisible(true)
        }
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
                                <Input placeholder="01/01/25" className="bg-slate-200 rounded-lg mb-2.5 mt-3 w-[350px]" classNames={{
                                    input: "focus:outline-none"
                                }} name="invoiceNumber" value={invoice.invoiceNumber}  onChange={handleChange}/>
                            </td>
                        </tr>
                        <tr className="">
                            <td className="w-[30%]">Nama Klien</td>
                            <td>
                                <Input placeholder="01/01/25" className="bg-slate-200 rounded-lg mb-3 w-[350px]" classNames={{
                                    input: "focus:outline-none"
                                }} name="clientName" value={invoice.name} disabled />
                            </td>
                        </tr>
                        <tr>
                            <td className="w-[30%]">Biaya Packing</td>
                            <td>
                                <Input placeholder="150000" className="bg-slate-200 rounded-lg mb-3"
                                startContent={<p className="mr-2">Rp. </p>} classNames={{
                                    input: "focus:outline-none"
                                }} name="packingPrice" value={invoice.packingPrice} onChange={handleChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td className="w-[30%]">Biaya Pengiriman</td>
                            <td>
                                <Input placeholder="75000" className="bg-slate-200 rounded-lg mb-3"
                                startContent={<p className="mr-2">Rp. </p>} classNames={{
                                    input: "focus:outline-none"
                                }} name="shippingPrice" value={invoice.shippingPrice} onChange={handleChange}/>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="my-5">
                    <h1 className="mb-2 font-semibold">Hapus SPK dari Invoice <br /> <span className="text-sm text-orange-400 font-normal">Catatan: Untuk menghapus barang dari invoice, silahkan pilih barang yang ingin dihapuskan.</span></h1>

                    <hr />

                    <div>
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-slate-400">
                                    <th className="py-2"></th>
                                    <th className="py-2"># SPK</th>
                                    <th className="py-2">Deskripsi Barang</th>
                                    <th className="py-2">Catatan</th>
                                    <th className="py-2">Harga Barang</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    invoiceWorkOrder.map((item: any, index) => (
                                        <tr key={index}>
                                            <td className="py-2"><input type="checkbox" value={item.id} onChange={(e) => handleRemoveSelect(e)}/></td>
                                            <td>{item.workOrderNumber}</td>
                                            <td>{item.itemDescription}</td>
                                            <td>{item.notes}</td>
                                            <td>Rp. {item.price.toLocaleString()}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h1 className="font-semibold mb-2">Tambah SPK ke Invoice <br /> <span className="text-sm text-orange-400 font-normal">Catatan: Untuk menambahkan barang silahkan memilih barang yang ingin anda tambahkan.</span></h1>

                    <hr />

                    <div>
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-slate-400">
                                    <th className="py-2"></th>
                                    <th className="py-2"># SPK</th>
                                    <th className="py-2">Deskripsi Barang</th>
                                    <th className="py-2">Catatan</th>
                                    <th className="py-2">Harga Barang</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    workOrders.length == 0
                                    ?
                                    <></>
                                    :
                                    workOrders.map((item: any, index) => (
                                        <tr key={index}>
                                            <td className="py-2"><input type="checkbox" value={item.id} onChange={(e) => handleAddSelect(e)}/></td>
                                            <td>{item.workOrderNumber}</td>
                                            <td>{item.itemDescription}</td>
                                            <td>{item.notes}</td>
                                            <td>Rp. {item.price.toLocaleString()}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>

                        {
                            workOrders.length == 0
                            ?
                            <p>{ isLoading ? "Sedang memuat data..." : "Tidak ada data yang tersedia..."}</p>
                            :
                            <></>
                        }
                    </div>
                </div>

                <Button className="bg-[gold] rounded-lg mt-10 hover:cursor-pointer" type="submit">
                    <Image src={edit} alt="icon" width={16} height={16} />
                    Simpan Data
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