'use client'

import Image from "next/image"
import Link from "next/link"

import { Button, Input } from "@heroui/react"

import add from "@/public/svgs/add.svg"
import search from "@/public/svgs/search.svg"
import { useRouter } from "next/navigation"

export default function Invoices() {
    const router = useRouter()

    const handleChange = () => {

    }

    const fetchInvoices = async () => {

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
                        <tr>
                            <td className="w-[25%] py-2">
                                01/01/01
                            </td>
                            <td className="w-[15%]">02 Mei 2025</td>
                            <td className="w-[25%]">Winsten Coellins</td>
                            <td><span className={"bg-slate-100 text-slate-500 px-5 py-1 rounded-full"}>{true ? 'Lunas' : 'Belum Lunas'}</span></td>
                            <td><Link href={`/dashboard/clients/123`}>Lihat Detail</Link></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}