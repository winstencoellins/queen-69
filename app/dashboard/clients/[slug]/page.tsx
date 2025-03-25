'use client'

import Image from "next/image"

import building from "@/public/svgs/building.svg"
import { useState } from "react"
import { Button, Input } from "@heroui/react"

export default function ClientDetail() {
    const [enableEdit, setEnableEdit] = useState<boolean>(false)

    return (
        <div>
            {/* Profile */}
            <div>
                <Image src={building} alt="icon" width={40} height={40} />
                <h1>Lumibyte Mdn</h1>

                <Button onPress={() => enableEdit ? setEnableEdit(false) : setEnableEdit(true)}>Edit Klien</Button>

                {
                    enableEdit
                    ?
                    <div>

                    </div>
                    :
                    <div>
                        <Input label="Nama Klien" labelPlacement="outside" type="text" className="bg-slate-200 rounded-lg mb-5" isInvalid={true}/>
                        <Input label="Kota" type="text" className="bg-slate-200 rounded-lg mb-5"/>
                        <Input label="Alamat" type="text" className="bg-slate-200 rounded-lg mb-5"/>
                        <Input label="No. Telepon" type="text" className="bg-slate-200 rounded-lg mb-5"/>
                    </div>
                }
            </div>

            <div>

            </div>
        </div>
    )
}