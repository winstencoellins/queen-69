'use client'

import { Button, Input, Pagination } from "@heroui/react";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import add from "@/public/svgs/add.svg"
import search from "@/public/svgs/search.svg"

import clsx from "clsx";

interface clientForm {
    clientName: string;
    city: string;
    address: string;
    telephone: string;
}

interface client {
    id: string;
    name: string;
    city: string;
    address: string;
    status: string;
    telephone: string;
}

export default function Client() {
    const [message, setMessage] = useState<string>('')
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [valid, setValid] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [clients, setClients] = useState<client[]>([]);
    const [tempClients, setTempClients] = useState<client[]>([])

    const maxRecords: number = 8

    const [records, setRecords] = useState<number>(0)
    const [page, setPage] = useState<number>(0)
    const pageNumber: number = 1

    useEffect(() => {
        fetchClients()
    }, [])

    /**
     * Handles the creation of a new client
     * and frontend validation. This function will first check
     * the regex for phone number, then empty input. This function will
     * show a warning message if the inputs are invalid.
     *
     * @param event - captures all values input to the form
     * @returns - none
     */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        const formData: FormData = new FormData(event.currentTarget)

        const formName: clientForm = {'clientName': 'Nama Klien', 'city': 'Kota', 'address': 'Alamat', 'telephone': 'Nomor Telepon'}

        // Phone number regex and empty value validation
        const pattern = /[^0-9]/
        const telNum = formData.get('telephone') as string
        const telephoneValidation = "No. Telepon yang dimasukkan invalid."

        if (telNum.match(pattern) != null) {
            setMessage(telephoneValidation)
            setIsVisible(true)
            setValid(false)
            return
        }

        let count: number = 0;
        let validString: string = "";

        for (const pair of formData.entries()) {
            if (pair[1] == "") {
                count += 1

                if (count > 1) {
                    validString += ", "
                }
                validString += formName[pair[0] as keyof clientForm]
            }
        }

        validString += ' tidak boleh kosong.'

        if (count > 0) {
            setMessage(validString)
            setIsVisible(true)
            setValid(false)
            return
        }

        try {
            const response = await fetch('/api/clients', {
                method: "POST",
                body: formData
            })

            const data = await response.json()

            if (data.success) {
                setShowForm(false)
                setValid(true)
            } else {
                setValid(false)
            }

            setIsVisible(true)
            setMessage(data.message)
        } catch (error: any) {
            console.log(error)
        }
    }

    /**
     * Fetches the data of all the clients in the
     * database to be shown into the table
     *
     * @returns - none
     */
    const fetchClients = async (): Promise<void> => {
        try {
            const response = await fetch(`/api/clients`)

            const data = await response.json()

            if (!response.ok) {
                throw new Error('Failed to fetch the data. Please try again.')
            }

            if (data.success) {
                setClients(data.clients)
                setRecords(data.clients.length)
                setPage(Math.ceil(data.clients.length / maxRecords))
                setTempClients(data.clients.slice(((pageNumber - 1) * maxRecords), (pageNumber * maxRecords)))
            }
        } catch (error) {
            console.log(error)
            setMessage('Gagal untuk memuat data. Silahkan muat ulang halaman ini lagi.')
            setIsVisible(true)
            setValid(false)
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Outputs the changes for the client's list based
     * on filter applied.
     * Filter: search bar, client status, and pagination
     *
     * @param pageNumber - pagination onChange
     */
    const handleChange = (pageNumber: number = 1) => {
        const dropdown: any = document.getElementById("dropdown")
        const search: any = document.getElementById("search")

        if (dropdown.value != "all") {
            var firstFilter: any = clients.filter((client) => client.status.toLowerCase() == dropdown.value)
        } else {
            var firstFilter: any = clients
        }

        if (search.value != "") {
            var result: any = firstFilter.filter((client: any) => client.name.toLowerCase().includes(search.value.toLowerCase()))
        } else {
            var result: any = firstFilter
        }

        setPage(Math.ceil(result.length / maxRecords))
        setRecords(result.length)
        setTempClients(result.slice(((pageNumber - 1) * maxRecords), (maxRecords * pageNumber)))
    }

    return (
        <>
            <div className=" px-5 py-4 rounded-lg flex flex-row items-center justify-between bg-white">
                <h1 className="text-2xl">Klien</h1>

                <div className="flex items-center">
                    {/* Dropdown */}
                    <div className="flex items-center">
                        <p className="mr-2">Filter Status</p>
                        <select id="dropdown" onChange={() => handleChange()} className="bg-slate-200 px-10 py-1.5 rounded-lg appearance-none text-center hover:cursor-pointer">
                            <option value="all">Semua</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Tidak Aktif</option>
                        </select>
                    </div>

                    <Button className="bg-[gold] rounded-lg ml-5 hover:cursor-pointer" onPress={() => showForm ? setShowForm(false) : setShowForm(true)}>
                        <Image src={add} alt="icon" width={20} height={20} />
                        {showForm ? 'Batal' : 'Tambah Klien'}
                    </Button>
                </div>
            </div>

            {/* Client Creation Form */}
            {
                showForm
                ?
                <form onSubmit={handleSubmit} className="bg-white mt-5 px-5 py-5 rounded-lg">
                    <h1 className="text-xl">Informasi Klien Baru</h1>

                    <hr className="my-2" />

                    <div className="mb-2 text-sm">
                        <label className="mb-1">Nama Klien</label>
                        <Input name='clientName' className="bg-slate-200 rounded-lg" placeholder="PT Lestari Indah" classNames={{
                            input: "focus:outline-none",
                        }} />
                    </div>
                    <div className="mb-2 text-sm">
                        <label className="mb-1">Kota</label>
                        <Input name='city' className="bg-slate-200 rounded-lg" placeholder="Medan" classNames={{
                            input: "focus:outline-none"
                        }}/>
                    </div>
                    <div className="mb-2 text-sm">
                        <label className="mb-1">Alamat</label>
                        <Input name='address' className="bg-slate-200 rounded-lg" placeholder="Jalan Karya" classNames={{
                            input: "focus:outline-none"
                        }}/>
                    </div>
                    <div className="mb-2 text-sm">
                        <label className="mb-1">No. Telepon</label>
                        <Input name='telephone' startContent={<p className="mr-2">+62</p>} className="bg-slate-200 rounded-lg" placeholder="8123456789" classNames={{
                            input: "focus:outline-none"
                        }}/>
                    </div>

                    <Button type="submit" className="bg-[gold] rounded-lg mt-3 text-white hover:cursor-pointer">Buat Baru</Button>
                </form>
                :
                <></>
            }

            {/* Clients table */}
            <div className="bg-white mt-5 px-5 py-5 rounded-lg">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-lg font-bold">Daftar</h1>

                    <Input
                        startContent={
                            <Image src={search} alt='icon' width={20} height={20} className="mr-2" />
                        }
                        classNames={{
                            input: "focus:outline-none"
                        }}
                        placeholder="Masukkan nama klien..."
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
                            <th className="pb-5">Nama Klien</th>
                            <th className="pb-5">Kota</th>
                            <th className="pb-5">Alamat</th>
                            <th className="pb-5">Status</th>
                            <th className="pb-5">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tempClients.map((client) => (
                                <tr key={client.name}>
                                    <td className="w-[25%] py-2">
                                        <p className="font-semibold">
                                            {client.name} <br />
                                            <span className="text-xs font-normal">+62 {client.telephone}</span>
                                        </p>
                                    </td>
                                    <td className="w-[15%]">{client.city}</td>
                                    <td className="w-[25%]">{client.address}</td>
                                    <td><span className={clsx("px-5 py-1 rounded-full text-sm", client.status == 'ACTIVE' ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500")}>{client.status == 'ACTIVE' ? 'Aktif' : 'Tidak Aktif'}</span></td>
                                    <td><Link href={`/dashboard/clients/${client.id}`} className="text-yellow-500 hover:underline duration-150">Lihat Rincian</Link></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                {
                    records == 0
                    ?
                    <div className="mt-3">{isLoading ? "Sedang memuat data..." :  "Tidak ada data yang tersedia..."}</div>
                    :
                    <></>
                }
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-5">
                <p className="text-sm">{records} records</p>

                <Pagination total={page} classNames={{
                    item: "bg-yellow-200 rounded-lg px-3",
                    cursor: "px-3 bg-[gold] rounded-lg duration-200 text-white"
                }} onChange={(page: number) => handleChange(page)}/>
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