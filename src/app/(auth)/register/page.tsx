"use client";

import axios from "axios";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { PasswordInput } from "../login/_components/password-input";
import { Input } from "@/components/ui/input";

function RegisterPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [isButtonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onRegister = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/register", user);
      console.log("Signup success", response.data);
      router.push("/login");
    } catch (error: any) {
      console.log("Signup failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-auto w-auto bg-slate-800">
      <div className="h-auto bg-slate-800 md:p-24 max-w-7xl mx-auto my-auto ">
        <div className="flex flex-col lg:flex-row xl:flex-row w-auto justify-center bg-slate-900 rounded-3xl">
          {/* Left section */}
          <div className="flex flex-col py-8 px-8 mr-0 lg:mr-20 xl:mr-20 justify-center">
            <div className="text-white font-bold text-[42px] leading-10 tracking-tight">
              Join Coursewave <br /> for{" "}
              <span className="text-blue-500">Free</span>
            </div>
            <div className="h-1.5 rounded-xl bg-blue-500 w-32 mt-1 mb-4"></div>
            <div className="text-slate-400">Create your account Its Free.</div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col m-14 py-8 px-8 bg-white rounded-3xl">
            <Button variant="outline" className="border-blue-500">
              <FcGoogle size={26} />{" "}
              <div className="pl-2">Continue with Google</div>
            </Button>

            <div className="inline-flex items-center justify-center w-full">
              <hr className="w-30 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
              <span className="px-3 font-medium text-gray-900  bg-white  ">
                or
              </span>
              <hr className="w-30 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            </div>

            <Input
              className="p-2 border bg-transparent border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
              id="email"
              type="email"
              autoComplete="true"
              value={user.email}
              onChange={(e) => {
                setUser({ ...user, email: e.target.value });
              }}
              placeholder="email"
            />

            <PasswordInput
              id="current_password"
              value={user.password}
              onChange={(e: any) =>
                setUser({ ...user, password: e.target.value })
              }
              autoComplete="current-password"
            />

            <br className="py-2" />

            <button
              onClick={onRegister}
              type="submit"
              className="py-2 text-white w-full bg-blue-500 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              disabled={isButtonDisabled}
            >
              {loading
                ? "...Loading"
                : isButtonDisabled
                  ? "Cant Register"
                  : "Register"}
            </button>

            <Toaster />

            <p className="pt-3 text-sm dark:text-gray-900">
              {" "}
              Already have an account?
              <a href="/login" className="text-blue-500 ">
                {" "}
                Login!
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
