'use client'

import back from "@/public/svgs/back.svg"
import edit from "@/public/svgs/edit.svg"

import { Button, Input } from "@heroui/react"

import Image from "next/image"

import { usePathname, useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"

interface EmployeeForm {
    name: string;
    role: string;
    birthday: string;
    tel: string;
}

export default function EmployeeDetail() {
    const router = useRouter()
    const path = usePathname()

    useEffect(() => {
        fetchEmployeeDetail()
    }, [])

    const [employee, setEmployee] = useState({
        id: "",
        name: "",
        role: "",
        birthday: "",
        gender: "",
        phone: ""
    })

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [valid, setValid] = useState<boolean>(true)
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")

    const handleBack = () => {
        router.push("/dashboard/employees")
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target

        console.log(name, value)

        setEmployee(prev => ({...prev, [name]: value}))
    }

    const fetchEmployeeDetail = async () => {
        try {
            const response = await fetch(`/api/employees/${path.split("/")[3]}`)

            const data = await response.json()

            setEmployee(data.employee)
        } catch (error) {
            console.log(error)
            setMessage("Gagal untuk memuat data karena koneksi internet. Silahkan muat ulang halaman ini.")
            setIsVisible(true)
            setValid(false)
        }
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        setIsLoading(true)

        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const employeeForm = {
            name: "Nama Karyawan",
            role: "Peran Karyawan",
            birthday: "Tanggal Lahir",
            tel: "No. Telepon"
        }

        let s = ""
        let count = 0

        for (const pair of formData.entries()) {
            if (pair[1] == "") {
                count += 1

                if (count > 1) {
                    s += ", "
                }
                s += employeeForm[pair[0] as keyof EmployeeForm]
            }
        }

        s += ' tidak boleh kosong.'

        if (count > 0) {
            setMessage(s)
            setIsVisible(true)
            setValid(false)
            return
        }

        formData.set('id', path.split("/")[3])

        try {
            const response = await fetch(`/api/employees/${path.split("/")[3]}`, {
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
            setMessage("Gagal untuk mengirimkan data karena koneksi internet. Silahkan coba lagi.")
            setIsVisible(true)
            setValid(false)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className=" px-5 py-4 rounded-lg flex flex-row items-center justify-between bg-white">
                <h1 className="text-2xl">Rincian Karyawan</h1>

                <div className="flex items-center">
                    <Button className="bg-[gold] rounded-lg ml-5 hover:cursor-pointer" onPress={handleBack}>
                        <Image src={back} alt="icon" width={20} height={20} />
                        Kembali
                    </Button>
                </div>
            </div>

            <form className="bg-white mt-5 px-5 py-5" onSubmit={handleSubmit}>
                <h1 className="text-lg">Informasi Karyawan</h1>

                <hr className="my-3"/>

                <div className="my-2">
                    <label className="">Nama Karyawan</label>
                    <Input name='name' className="bg-slate-200 rounded-lg mt-2" placeholder="John Doe" classNames={{
                        input: "focus:outline-none",
                    }} value={employee.name}
                        onChange={(e: any) => handleChange(e)}
                    />
                </div>
                <div className="my-2">
                    <label className="">Peran Karyawan</label>
                    <Input name='role' className="bg-slate-200 rounded-lg mt-2" placeholder="Potong Kaca" classNames={{
                        input: "focus:outline-none",
                    }} value={employee.role}
                        onChange={(e: any) => handleChange(e)}
                    />
                </div>
                <div className="my-2">
                    <label className="">Tanggal Lahir</label>
                    <Input name='birthday' type="date" className="bg-slate-200 rounded-lg mt-2" placeholder="John Doe" classNames={{
                        input: "focus:outline-none",
                    }} value={employee.birthday.split("T")[0]}
                        onChange={(e: any) => handleChange(e)}
                    />
                </div>
                <div className="my-4">
                    <label className="mr-5">Jenis Kelamin</label>
                    <select className="bg-slate-200 px-10 py-1.5 rounded-lg appearance-none text-center hover:cursor-pointer" name="gender" value={employee.gender} onChange={(e: any) => handleChange(e)}>
                        <option value="MALE">Laki - laki</option>
                        <option value="FEMALE">Perempuan</option>
                    </select>
                </div>
                <div className="my-2">
                    <label className="">No. Tel</label>
                    <Input name='tel' type="number" className="bg-slate-200 rounded-lg mt-2"
                        startContent={<p className="mr-2">+62 </p>}
                        placeholder="8115342667" classNames={{
                            input: "focus:outline-none",
                        }}
                        value={employee.phone}
                        onChange={(e: any) => handleChange(e)}
                    />
                </div>

                <Button type="submit" className="bg-[gold] rounded-lg mt-5 hover:cursor-pointer">
                    <Image src={edit} alt="icon" width={20} height={20} />
                    { isLoading ? "Memproses..." : "Simpan Data" }
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