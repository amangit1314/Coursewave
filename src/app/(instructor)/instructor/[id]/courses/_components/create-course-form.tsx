"use client";

import { Button } from '@/components/ui/button';
import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form"

enum GenderEnum {
    female = "female",
    male = "male",
    other = "other",
}

interface IFormInput {
    courseName: string
    coursePrice: string
    courseImageUrl: string
    gender: GenderEnum
}

const CreateCourseForm = () => {
    const { register, handleSubmit } = useForm<IFormInput>()
    const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data)

    return (
        <div className='p-4 m-4 flex justify-center mx-auto items-center rounded-xl lg:my-20 bg-slate-500'>
            <form
                className='flex flex-col gap-y-6'
                onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className='text-md font-medium'>Course Name</label>
                    <input className='mx-1 p-2 rounded-sm outline-none text-xs border border-blue-500 bg-opacity-40' {...register("courseName")} />
                </div>
                <div>
                    <label className='text-md font-medium'>Course Image</label>
                    <input className='mx-1 p-2 rounded-sm outline-none text-xs border border-blue-500 bg-opacity-40' id="file_input" type="file" {...register("courseImageUrl")} />
                </div>
                <div>
                    <label className='text-md font-medium'>Course Price</label>
                    <input className='mx-1 p-2 rounded-sm outline-none text-xs border border-blue-500 bg-opacity-40' {...register("coursePrice")} />
                </div>
                <div>
                    <label className='text-md font-medium'>Gender Selection</label>
                    <select className='mx-1 p-2 rounded-sm outline-none text-xs border border-blue-500 bg-opacity-40' {...register("gender")}>
                        <option value="female">female</option>
                        <option value="male">male</option>
                        <option value="other">other</option>
                    </select>
                </div>
                <Button onClick={() => {}}>Create</Button>
            </form>
        </div>
    )
}

export default CreateCourseForm