'use client'

import Image from "next/image"
import Link from "next/link"

import building from "@/public/svgs/building.svg"
import progress from "@/public/svgs/progress.svg"

import { FormEvent, useState } from "react"
import clsx from "clsx"

import { Button, Input, Pagination } from "@heroui/react"

export default function ClientDetail() {
    const [enableEdit, setEnableEdit] = useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')

    /**
     * Handles the submission to update the existing
     * client's data
     * 
     * @param event - capture all the inputs from the form
     * @returns none
     */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {

        } catch (error) {
            console.log(error)
        } finally {
            setMessage('Data klien telah berhasil disimpan.')
            setIsVisible(true)
        }
    }

    /**
     * Set the status of the current client
     * to inactive
     */
    const handleSubmitDeactivate = async () => {
        try {

        } catch (error) {
            console.log(error)
        } finally {
            setMessage('Data klien telah berhasil dinonaktifkan.')
            setIsVisible(true)
        }
    }

    const fetchClientDetail = async () => {
        try {

        } catch (error) {

        }
    }

    return (
        <>
            <div className="flex flex-row mb-10">
                {/* Profile */}
                <div className="bg-white px-5 py-5 flex flex-col w-[40%] rounded-lg items-center mr-5 h-fit">
                    <Image src={building} alt="icon" width={70} height={70} />


                    <form onSubmit={handleSubmit} className="w-full">
                        {
                            enableEdit
                            ?
                            <></>
                            :
                            <h1 className="text-2xl text-center">Lumibyte Mdn</h1>
                        }

                        <div className="flex justify-center">
                            {
                                enableEdit
                                ?
                                <></>
                                :
                                <div className="flex">
                                    <Button onPress={() => setEnableEdit(true)} className="bg-green-300 rounded-lg my-5 hover:cursor-pointer mr-5">Edit Klien</Button>
                                    <Button onPress={handleSubmitDeactivate} className="bg-green-300 rounded-lg my-5 hover:cursor-pointer">Nonaktifkan</Button>
                                </div>
                            }
                        </div>


                        {
                            enableEdit
                            ?
                            <div>
                                <div>
                                    <label>Nama Klien</label>
                                    <Input type="text" placeholder="Nama Klien" className="bg-slate-200 rounded-lg mb-3 mt-1" value={"Lumibyte Mdn"}/>
                                </div>

                                <div>
                                    <label>Kota</label>
                                    <Input type="text" placeholder="Kota" className="bg-slate-200 rounded-lg mb-3 mt-1" value={"Medan"}/>
                                </div>

                                <div>
                                    <label>Alamat</label>
                                    <Input type="text" placeholder="Alamat" className="bg-slate-200 rounded-lg mb-3" value={"Jalan K L Yos Sudarso No. 153 AB"}/>
                                </div>

                                <div>
                                    <label>No. Telepon</label>
                                    <Input type="text" startContent={<p className="mr-2">+62</p>} placeholder="No. Telepon" className="bg-slate-200 rounded-lg mb-3" value={"8116359119"}/>
                                </div>
                            </div>
                            :
                            <div>
                                <Input type="text" value="Medan" className="bg-slate-200 rounded-lg mb-5"  disabled={true}/>
                                <Input type="text" value="Jalan K L Yos Sudarso No. 153AB" className="bg-slate-200 rounded-lg mb-5" disabled={true}/>
                                <Input type="text" value="8116359119" startContent={<p className="mr-2">+62</p>} className="bg-slate-200 rounded-lg mb-5" disabled={true}/>
                            </div>
                        }

                        {
                            enableEdit
                            ?
                            <div>
                                <Button onPress={() => setEnableEdit(false)} className="hover:cursor-pointer">Kembali</Button>
                                <Button type="submit" className="hover:cursor-pointer">Simpan</Button>
                            </div>
                            :
                            <></>
                        }
                    </form>
                </div>
                
                <div>
                    <div className="grid grid-cols-3">
                        <div className="bg-white rounded-lg h-fit px-10 py-5 flex">
                            <div className="mr-3">
                                <p className="text-2xl font-bold text-orange-500">5</p>
                                <p className="">Sedang Diproses</p>
                            </div>
                            <Image src={progress} alt="icon" width={30} height={30} />
                        </div>
                    </div>

                    {/* Table List SPK */}
                    <div className="bg-white px-5 py-5 rounded-lg mt-5">
                        <h1 className="mb-5">List SPK</h1>

                        <table className="table-auto w-full">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="pb-2"># SPK</th>
                                    <th className="pb-2">Pekerja</th>
                                    <th className="pb-2">Deskripsi Barang</th>
                                    <th className="pb-2">Status</th>
                                    <th className="pb-2">Aksi</th>
                                </tr>
                            </thead>
                            {
                                false
                                ?
                                <tbody>
                                    <tr className="text-sm">
                                        <td className="py-3">01/01/01</td>
                                        <td>Winsten Coellins</td>
                                        <td>Lemari Ukuran 10x10x30</td>
                                        <td><p className={clsx("px-2 py-1 text-orange-600 bg-orange-100 w-fit rounded-full text-xs")}>Sedang Diproses</p></td>
                                        <td><Link href="">Lihat Detail</Link></td>
                                    </tr>
                                </tbody>
                                :
                                <></>
                            }
                        </table>

                        {
                            true 
                            ? 
                            <div className="mt-3 text-sm">Tidak ada data yang tersedia ...</div> 
                            : 
                            <></>
                        }
                        
                        {
                            true
                            ?
                            <></>
                            :
                            <div className="flex justify-between items-center mt-5">
                                <p className="text-sm">Showing 0 to 10 from 10 records</p>
                                <Pagination total={5} classNames={{
                                    item: "px-3 bg-red-100 rounded-lg",
                                    cursor: "px-3 bg-red-500 rounded-lg duration-200"
                                }}/>
                            </div>
                        }
                    </div>

                    {/* Table List Invoice */}
                    <div className="bg-white px-5 py-5 rounded-lg mt-5">
                        <h1 className="mb-5">List Invoice</h1>

                        <table className="table-auto w-full">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="pb-2"># Invoice</th>
                                    <th className="pb-2">Status</th>
                                    <th className="pb-2">Deskripsi Barang</th>
                                    <th className="pb-2">Harga</th>
                                    <th className="pb-2">Aksi</th>
                                </tr>
                            </thead>
                            {
                                false
                                ?
                                <tbody>
                                    <tr className="text-sm">
                                        <td className="py-3">01/01/01</td>
                                        <td><p className={clsx("px-2 py-1 bg-green-100 w-fit text-green-600 rounded-full text-xs")}>Lunas</p></td>
                                        <td>Lemari Ukuran 10x10x30</td>
                                        <td>Rp. 3000000</td>
                                        <td><Link href="">Lihat Detail</Link></td>
                                    </tr>
                                </tbody>
                                :
                                <></>
                            }
                        </table>
                        
                        {
                            true 
                            ? 
                            <div className="mt-3 text-sm">Tidak ada data yang tersedia ...</div> 
                            : 
                            <></>
                        }
                        
                        {
                            true
                            ?
                            <></>
                            :
                            <div className="flex justify-between items-center mt-5">
                                <p className="text-sm">Showing 0 to 10 from 10 records</p>
                                <Pagination total={5} classNames={{
                                    item: "px-3 bg-red-100 rounded-lg",
                                    cursor: "px-3 bg-red-500 rounded-lg duration-200"
                                }}/>
                            </div>
                        }
                    </div>
                </div>
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