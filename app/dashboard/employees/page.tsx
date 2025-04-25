'use client'

import { Button, Input } from "@heroui/react"

import add from "@/public/svgs/add.svg"
import search from "@/public/svgs/search.svg"
import phone from "@/public/svgs/phone.svg"
import user from "@/public/svgs/user.svg"

import Image from "next/image"
import Link from "next/link"
import { useState, FormEvent, useEffect } from "react"

interface EmployeeForm {
    name: string;
    role: string;
    birthday: string;
    tel: string;
}

export default function Employees() {
    const [message, setMessage] = useState<string>("")
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [valid, setValid] = useState<boolean>(true)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [showForm, setShowForm] = useState<boolean>(false)

    const [employees, setEmployees] = useState([])

    useEffect(() => {
        fetchEmployee()
    }, [])

    const handleShowForm = (): void => {
        showForm ? setShowForm(false) : setShowForm(true)
    }

    const fetchEmployee = async () => {
        try {
            const response = await fetch(`/api/employees`)

            const data = await response.json()

            if (!response.ok) {
                throw new Error("Something went wrong. Please try again.")
            }

            setEmployees(data.employees)
        } catch (error) {
            console.log(error)
            setMessage("Gagal untuk memuat data karena koneksi internet. Silahkan coba lagi.")  
            setValid(false)
            setIsVisible(true)
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

        try {
            const response = await fetch("/api/employees", {
                method: "POST",
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
                <h1 className="text-2xl">Karyawan</h1>

                <div className="flex items-center">

                    <Button className="bg-[gold] rounded-lg ml-5 hover:cursor-pointer" onPress={handleShowForm}>
                        <Image src={add} alt="icon" width={20} height={20} />
                        { showForm ? "Batal" : "Tambah Karyawan"}
                    </Button>
                </div>
            </div>

            {
                showForm
                ?
                <form className="bg-white mt-5 px-5 py-5" onSubmit={handleSubmit}>
                    <h1 className="text-lg">Informasi Karyawan Baru</h1>

                    <hr className="my-3"/>

                    <div className="my-2">
                        <label className="">Nama Karyawan</label>
                        <Input name='name' className="bg-slate-200 rounded-lg mt-2" placeholder="John Doe" classNames={{
                            input: "focus:outline-none",
                        }} />
                    </div>
                    <div className="my-2">
                        <label className="">Peran Karyawan</label>
                        <Input name='role' className="bg-slate-200 rounded-lg mt-2" placeholder="Potong Kaca" classNames={{
                            input: "focus:outline-none",
                        }} />
                    </div>
                    <div className="my-2">
                        <label className="">Tanggal Lahir</label>
                        <Input name='birthday' type="date" className="bg-slate-200 rounded-lg mt-2" placeholder="John Doe" classNames={{
                            input: "focus:outline-none",
                        }} />
                    </div>
                    <div className="my-4">
                        <label className="mr-5">Jenis Kelamin</label>
                        <select className="bg-slate-200 px-10 py-1.5 rounded-lg appearance-none text-center hover:cursor-pointer" name="gender">
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
                        />
                    </div>

                    <Button type="submit" className="bg-[gold] rounded-lg mt-5">{ isLoading ? "Memproses..." : "Buat Baru" }</Button>
                </form>
                :
                <></>
            }

            <div className="mt-10">
                <Input 
                    startContent={<Image src={search} alt='icon' width={20} height={20} className="mr-2" />} 
                    classNames={{
                                input: "focus:outline-none"
                            }}
                    placeholder="Masukkan nama karyawan..."
                    type='text'
                    className="w-1/4 bg-slate-100 rounded-lg mb-5"
                    id="search"
                    // onChange={() => handleChange()}
                />

                <div className="grid grid-cols-4 gap-x-5">
                    {
                        employees.map((employee: any, index) => (
                            <div className="bg-white rounded-lg shadow-lg px-5 py-5" key={index}>
                                <div>
                                    <h3 className="my-1 text-lg">{employee.name}</h3>
                                    <p className="text-sm text-slate-500">{employee.role}</p>
                                </div>

                                <hr className="my-2"/>
                                
                                <div className="flex my-1">
                                    <Image src={phone} alt="icon" width={16} height={16} />
                                    <p className="ml-2"> +62 {employee.phone}</p>
                                </div>
                                <div className="flex my-1">
                                    <Image src={user} alt="icon" width={16} height={16} />
                                    <p className="ml-2">{employee.gender == "MALE" ? "Laki - laki" : "Perempuan"}</p>
                                </div>

                                <div className="mt-5">
                                    <Link href={`/dashboard/employees/${employee.id}`} className="text-yellow-500 rounded-lg hover:underline">Lihat Rincian</Link>
                                </div>
                            </div>
                        ))
                    }
                </div>
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