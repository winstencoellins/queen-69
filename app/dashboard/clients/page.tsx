'use client'

import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Pagination, Input} from "@heroui/react";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import add from "@/public/svgs/add.svg"
import search from "@/public/svgs/search.svg"

import { Key } from "@react-types/shared";
import clsx from "clsx";

interface clientForm {
    clientName: string;
    city: string;
    address: string;
    telephone: string;
}

export default function Client() {
    const [message, setMessage] = useState<string>('')
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [color, setColor] = useState<string>('black');

    /**
     * Show list of clients based on status applied
     * using the filter
     * 
     * @param key - the value of the status that determines the filter condition (active, inactive, all)
     * @returns none
     */
    const onChangeDropwdown = async (key: Key): Promise<void> => {
        const status: string = key == 'active' ? 'Aktif' : key =='inactive' ? 'Tidak Aktif' : 'Semua'

        try {
            // Logic implementation for fetching filtered data
            setMessage(`Filter status '${status}' telah berhasil diaplikasikan`)
        } catch (error) {
            console.log(error)
        } finally {
            setIsVisible(true)
        }
    }

    /**
     * Handles the creation of a new client
     * 
     * @param event - captures all values input to the form
     */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        console.log('T')

        const formData: FormData = new FormData(event.currentTarget)

        const formName: clientForm = {'clientName': 'nama klien', 'city': 'kota', 'address': 'alamat', 'telephone': 'nomor telepon'}
        let count: number = 0;
        let s: string = "Informasi klien baru: ";

        for (const pair of formData.entries()) {
            if (pair[1] == "") {
                s += formName[pair[0] as keyof clientForm] + " "
                count += 1
            }
        }

        s += ' tidak boleh kosong.'

        if (count > 0) {
            setMessage(s)
            setColor('red-500')
            setIsVisible(true)
            return
        }

        try {

            setMessage('Klien baru berhasil ditambahkan')
        } catch (error) {
            console.log(error)
        } finally {
            setShowForm(false)
            setIsVisible(true)
        }
    }

    return (
        <>
            <div className=" px-5 py-4 rounded-lg flex flex-row items-center justify-between bg-white">
                <h1 className="text-2xl">Clients</h1>

                <div className="flex items-center">
                    {/* Dropdown */}
                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant="bordered" className="border border-slate-200 rounded-lg cursor-pointer">Filter Status</Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions" className="bg-white px-4 rounded-lg" onAction={(key) => onChangeDropwdown(key)}>
                            <DropdownItem key="all" className="cursor-pointer">Semua</DropdownItem>
                            <DropdownItem key="active" className="cursor-pointer">Aktif</DropdownItem>
                            <DropdownItem key="inactive" className="cursor-pointer">Tidak Aktif</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                    <Button className="bg-green-200 rounded-lg ml-5" onPress={() => showForm ? setShowForm(false) : setShowForm(true)}>
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
                        <Input name='city' className="bg-slate-200 rounded-lg" placeholder="Medan"/>
                    </div>
                    <div className="mb-2 text-sm">
                        <label className="mb-1">Alamat</label>
                        <Input name='address' className="bg-slate-200 rounded-lg" placeholder="Jalan Karya" />
                    </div>
                    <div className="mb-2 text-sm">
                        <label className="mb-1">No. Telepon</label>
                        <Input name='telephone' startContent={<p className="mr-2">+62</p>} className="bg-slate-200 rounded-lg" placeholder="8123456789"/>
                    </div>

                    <Button type="submit">Buat Baru</Button>
                </form>
                :
                <></>
            }

            {/* Clients table */}
            <div className="bg-white mt-5 px-5 py-5 rounded-lg">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-lg font-bold">Lists</h1>

                    <Input
                        startContent={
                            <Image src={search} alt='icon' width={20} height={20} className="mr-2" />
                        }
                        placeholder="Masukkan nama klien..."
                        type='text'
                        className="w-1/4 bg-slate-100 rounded-lg"
                    />
                </div>

                <hr className="my-10"/>

                <table className="table-auto w-full">
                    <thead>
                        <tr className="text-left">
                            <th className="pb-5">No</th>
                            <th className="pb-5">Nama Klien</th>
                            <th className="pb-5">Kota</th>
                            <th className="pb-5">Alamat</th>
                            <th className="pb-5">Status</th>
                            <th className="pb-5">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-5">1</td>
                            <td className="w-[25%]">
                                <p>
                                    Winsten Coellins <br />
                                    <span className="text-xs">+62 8116359119</span>
                                </p>
                            </td>
                            <td className="w-[15%]">Medan</td>
                            <td className="w-[25%]">Jln K L Yos Sudarso No. 153 AB</td>
                            <td><span className={clsx("px-4 py-2 rounded-full text-white", true ? "bg-green-500" : "bg-red-500")}>Aktif</span></td>
                            <td><Link href="/dashboard/clients/1">Lihat Detail</Link></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-5">
                <p className="text-sm">Showing 0 to 1 from 1 results</p>

                <Pagination total={10} classNames={{
                    item: "bg-green-200 rounded-lg px-3",
                    cursor: "px-3 bg-green-500 rounded-lg"
                }} />
            </div>

            {/* Toast */}
            {
                isVisible ?
                <div className={`fixed bottom-5 right-5 bg-${color} text-white w-1/4 py-5 rounded-lg px-4 flex justify-between items-center z-20`}>
                    <p>{message}</p>
                    <Button onPress={() => setIsVisible(false)} className="bg-white text-black rounded-lg ml-3 cursor-pointer">Tutup</Button>
                </div>
                :
                <></>
            }
        </>
    )
}