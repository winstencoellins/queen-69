'use client'

import Image from "next/image"

import building from "@/public/svgs/building.svg"

import { useState } from "react"

import { Button, Input } from "@heroui/react"

export default function ClientDetail() {
    const [enableEdit, setEnableEdit] = useState<boolean>(false)

    const handleSubmit = async () => {

    }

    return (
        <div>
            {/* Profile */}
            <div className="bg-white px-5 py-5 flex flex-col w-1/2 rounded-lg items-center">
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
                            <Button onPress={() => setEnableEdit(true)} className="bg-red-100">Edit Klien</Button>
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
                            <Button onPress={() => setEnableEdit(false)}>Kembali</Button>
                            <Button type="submit">Simpan</Button>
                        </div>
                        :
                        <></>
                    }
                </form>

            </div>

            <div>

            </div>
        </div>
    )
}