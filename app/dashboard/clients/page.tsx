'use client'

import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Pagination, Input} from "@heroui/react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import add from "@/public/svgs/add.svg"
import search from "@/public/svgs/search.svg"

import { Key } from "@react-types/shared";
import clsx from "clsx";

export default function Client() {
    const [message, setMessage] = useState<string>('')
    const [isVisible, setIsVisible] = useState<boolean>(false);

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

                    <Button className="bg-green-200 rounded-lg ml-5">
                        <Image src={add} alt="icon" width={20} height={20} />
                        Add Client
                    </Button>
                </div>
            </div>

            {/* Clients table */}
            <div className="bg-white mt-10 px-5 py-5 rounded-lg">
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
                <div className="fixed bottom-5 right-5 bg-black text-white w-1/4 py-5 rounded-lg px-4 flex justify-between items-center z-20">
                    <p>{message}</p>
                    <Button onPress={() => setIsVisible(false)} className="bg-white text-black rounded-lg ml-5 cursor-pointer">Tutup</Button>
                </div>
                :
                <></>
            }
        </>
    )
}