"use client"

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import * as z from 'zod';
import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"

import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

const successNotification = (message: string) => toast.success(message);
const errorNotification = (errorMessage: string) => toast.error(errorMessage);

function Login() {
    const router = useRouter();

    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [user, setUser] = React.useState({ email: "", password: "" });
    const [isButtonDisabled, setButtonDisabled] = React.useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/auth/login", user);
            console.log("Login success", response.data);
            successNotification('Logged in successfully');
            router.push("/browseCourses");
        } catch (error: any) {
            console.log("Login failed", error.message);
            errorNotification(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);


    return (
        <div className="h-auto w-auto bg-slate-800">
            <div className='h-screen bg-slate-800 lg:p-24 xl:p-24 max-w-7xl mx-auto my-auto '>
                <div className='flex flex-col  lg:flex-row xl:flex-row w-auto justify-center bg-slate-900 rounded-lg'>
                    {/* Left section */}
                    <div className='flex flex-col py-8 px-8 mr-0 lg:mr-20 xl:mr-20 justify-center'>
                        <div className='text-white font-bold text-3xl'>
                            Welcome back to <br /> <span className="text-blue-500">CourseWave</span>
                        </div>
                        <div className='h-1.5 rounded-xl bg-blue-500 w-32 mt-1 mb-4'></div>
                        <div className='text-slate-400'>
                            Sign in to continue to your <br /> account.
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className='flex flex-col m-14 py-8 px-8 bg-white rounded-lg'>

                        <Button
                            variant="outline"
                            className='p-3 border-blue-500'><FcGoogle size={26} />
                            <div className="pl-2">Sign in with Google</div>
                        </Button>

                        <div className="inline-flex items-center justify-center w-full">
                            <hr className="w-30 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                            <span className="px-3 font-medium text-gray-900  bg-white  ">or</span>
                            <hr className="w-30 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                        </div>

                        <input
                            className="p-2 border border-gray-300 bg-transparent rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                            id="email"
                            type="text"
                            value={user.email}
                            onChange={(e) => {
                                setUser({ ...user, email: e.target.value })
                            }}
                            placeholder="email"
                        />

                        <div className="password-input-container border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className='bg-transparent outline-none p-2 mr-2'
                                value={user.password}
                                onChange={(e) => {
                                    setUser({ ...user, password: e.target.value });
                                }}
                                placeholder="Enter password"
                            />
                            <button
                                type="button"
                                className="password-toggle-button mr-2"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </button>
                        </div>

                        <a href="/forgotPassword" className='text-sm pb-2 text-blue-500 cursor-point'>forgot password?</a>

                        <button
                            onClick={onLogin}
                            type="submit"
                            className="py-2 text-white w-full bg-blue-500 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                            disabled={isButtonDisabled}
                        >
                            {loading ? '...Loading' : (isButtonDisabled ? "Cant Login" : "Login")}
                        </button>

                        <Toaster />

                        <p className="pt-3 text-sm dark:text-gray-900"> Dont have an account?
                            <a href="/register" className="text-blue-500 "> Register!</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login