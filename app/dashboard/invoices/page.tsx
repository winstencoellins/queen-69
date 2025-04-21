'use client'

import Image from "next/image"
import Link from "next/link"

import { Button, Input } from "@heroui/react"

import add from "@/public/svgs/add.svg"
import search from "@/public/svgs/search.svg"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

import { convertToDate } from "@/lib/utils"

import clsx from "clsx"

interface Invoice {
    id: string;
    invoiceNumber: string;
    createdDate: string;
    createdBy: string;
    status: string;
}

export default function Invoices() {
    const router = useRouter()

    const [message, setMessage] = useState<string>("")
    const [valid, setValid] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const [invoices, setInvoices] = useState<Invoice[]>([])

    useEffect(() => {
        fetchInvoices()
    }, [])

    const handleChange = () => {

    }

    /**
     * Fetches all of the invoices
     *
     * @returns none
     */
    const fetchInvoices = async (): Promise<void> => {
        setValid(true)

        try {
            const response = await fetch("/api/invoices")

            const data = await response.json()

            if (!response.ok) {
                throw new Error("Something went wrong. Please try again.")
            }

            setInvoices(data.invoices)
        } catch (error) {
            console.log(error)
            setMessage("Gagal untuk memuat data dikarenakan koneksi internet. Silahkan coba lagi.")
            setValid(false)
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Redirects the page to create invoice page
     * when user click on it
     *
     * @returns none
     */
    const handleClick = (): void => {
        router.push("/dashboard/invoices/create")
    }

    return (
        <>
            <div className=" px-5 py-4 rounded-lg flex flex-row items-center justify-between bg-white">
                <h1 className="text-2xl">Invoice</h1>

                <div className="flex items-center">
                    {/* Dropdown */}
                    <div className="flex items-center">
                        <p className="mr-2">Filter Status</p>
                        <select id="dropdown" onChange={() => handleChange()} className="bg-slate-200 px-10 py-1.5 rounded-lg appearance-none text-center hover:cursor-pointer">
                            <option value="all">Semua</option>
                            <option value="active">Lunas</option>
                            <option value="inactive">Belum Lunas</option>
                        </select>
                    </div>

                    <Button className="bg-[gold] rounded-lg ml-5 hover:cursor-pointer" onPress={handleClick}>
                        <Image src={add} alt="icon" width={20} height={20} />
                        Tambah Invoice
                    </Button>
                </div>
            </div>

            <div className="bg-white mt-5 px-5 py-5 rounded-lg">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-lg font-bold">Lists</h1>

                    <Input
                        startContent={
                            <Image src={search} alt='icon' width={20} height={20} className="mr-2" />
                        }
                        classNames={{
                            input: "focus:outline-none"
                        }}
                        placeholder="Masukkan nomor invoice..."
                        type='text'
                        className="w-1/4 bg-slate-100 rounded-lg"
                        id="search"
                        onChange={() => handleChange()}
                    />
                </div>

                <hr className="my-10"/>

                <table className="table-auto w-full">
                    <thead>
                        <tr className="text-left text-slate-400">
                            <th className="pb-5"># Invoice</th>
                            <th className="pb-5">Tanggal Dibuat</th>
                            <th className="pb-5">Dibuat Oleh</th>
                            <th className="pb-5">Status</th>
                            <th className="pb-5">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            invoices.map((invoice, index) => (
                                <tr key={index}>
                                    <td className="w-[25%] py-2">
                                        {invoice.invoiceNumber}
                                    </td>
                                    <td className="w-[15%]">{convertToDate(invoice.createdDate.split("T")[0])}</td>
                                    <td className="w-[25%]">{invoice.createdBy == null ? "-" : invoice.createdBy}</td>
                                    <td><span className={clsx("px-5 py-1 w-fit rounded-full text-sm", invoice.status == "UNPAID" ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500")}>{invoice.status == "PAID" ? 'Lunas' : 'Belum Lunas'}</span></td>
                                    <td><Link href={`/dashboard/invoices/${invoice.id}`}>Lihat Detail</Link></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}