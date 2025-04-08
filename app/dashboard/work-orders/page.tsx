'use client'

import { Button } from "@heroui/react"

import { useEffect, useState } from "react"

import Image from "next/image"

import add from "@/public/svgs/add.svg"



export default function WorkOrders() {
    const [showForm, setShowForm] = useState<boolean>(false)
    const [active, setActive] = useState<boolean>(true)

    useEffect(() => {
        fetchWorkOrder()
    }, [])

    /**
     * Handles the changes of the status
     * depending on the user input
     * 
     * @returns none
     */
    const handleChange = () => {
        const btn = document.getElementById("btn")
        console.log(btn?.innerHTML)
        active ? setActive(false) : setActive(true)
    }

    /**
     * Fetches the work order and set the
     * initial state of the button to "All"
     * work orders
     * 
     * @returns none
     */
    const fetchWorkOrder = async (): Promise<void> => {
        setActive(true)


        
    }

    return (
        <>
            <div className=" px-5 py-4 rounded-lg flex flex-row items-center justify-between bg-white">
                <h1 className="text-2xl">Work Orders</h1>

                <div className="flex items-center">
                    {/* Dropdown */}
                    <Button className="bg-green-200 rounded-lg ml-5">
                        <Image src={add} alt="icon" width={20} height={20} />
                        {showForm ? 'Batal' : 'Tambah SPK'}
                    </Button>
                </div>

            </div>
            
            <div className="bg-white mt-5 px-5 py-5">
                <div>
                    <Button className={active ? `border-3 border-b-yellow-500 border-l-0 border-t-0 border-r-0 focus:border-3 focus:border-l-0 focus:border-t-0 focus:border-r-0 focus:border-b-yellow-500 focus:outline-none` : `border-none`} onPress={handleChange} id="btn">Semua</Button>
                    <Button className="focus:border-3 focus:border-l-0 focus:border-t-0 focus:border-r-0 focus:border-b-yellow-500 focus:outline-none" onPress={handleChange} id="btn">Belum Dimulai</Button>
                    <Button className="focus:border-3 focus:border-l-0 focus:border-t-0 focus:border-r-0 focus:border-b-yellow-500 focus:outline-none" onPress={handleChange} id="btn">Sedang Diproses</Button>
                    <Button className="focus:border-3 focus:border-l-0 focus:border-t-0 focus:border-r-0 focus:border-b-yellow-500 focus:outline-none" onPress={handleChange} id="btn">Selesai</Button>
                </div>

                <hr className="pb-5"/>

                <table className="w-full text-left">
                    <thead className="pt-5">
                        <tr>
                            <th># SPK</th>
                            <th>Klien</th>
                            <th>Perkiraan Tanggal Selesai</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-5">01/01/01</td>
                            <td>
                                <span>Xhelinskii</span>
                                <span>+62 8112345667</span>
                            </td>
                            <td>31/12/2004</td>
                            <td>Belum Dimulai</td>
                            <td>Lihat Detail</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}