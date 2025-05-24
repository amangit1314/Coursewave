"use client";

import axios from "axios";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { PasswordInput } from "../login/_components/password-input";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { LucideLoader2 } from "lucide-react";
import { absoluteUrl } from "@/utils/utils";
import ApiManager from "@/lib/api/api-manager";

axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";

const successNotification = (message: string) => toast.success(message);
const errorNotification = (errorMessage: string) => toast.error(errorMessage);

const RegisterPage = () => {
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
      // const response = await axios.post(
      //   process.env.ENVIRONMENT === "DEVELOPMENT"
      //     ? absoluteUrl("/api/auth/register")
      //     : "api/auth/register",
      //   user,
      // );
      const url = "http://localhost:5002/api/auth/register";
      // process.env.ENVIRONMENT === "DEVELOPMENT"
      //   ? absoluteUrl("/api/auth/login")
      //   : "api/auth/login";
      await ApiManager.getInstance()
        .post(url, user)
        .then((res) => {
          console.log("Registeration response: ", res.data);
          // setUser(res.data);
          successNotification("Registeration successfull");
          router.push("/login");
        });
      // console.log("Signup success", response.data);
      // router.push("/login");
    } catch (error: any) {
      console.log("Signup failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-auto w-auto bg-slate-800">
      <div className="mx-auto my-auto h-auto max-w-7xl bg-slate-800 md:p-24">
        <div className="flex w-auto flex-col justify-center rounded-3xl bg-slate-900 lg:flex-row xl:flex-row">
          {/* Left section */}
          <div className="mr-0 flex flex-col justify-center px-8 py-8 lg:mr-20 xl:mr-20">
            <div className="text-[42px] font-bold leading-10 tracking-tight text-white">
              Join Coursewave <br /> for{" "}
              <span className="text-blue-500">Free</span>
            </div>
            <div className="mb-4 mt-1 h-1.5 w-32 rounded-xl bg-blue-500"></div>
            <div className="text-slate-400">Create your account Its Free.</div>
          </div>

          {/* Right Section */}
          <div className="m-14 flex flex-col rounded-3xl bg-white p-8">
            {/* <Button variant="outline" className="border-blue-500">
              <FcGoogle size={26} />{" "}
              <div className="pl-2">Continue with Google</div>
            </Button>

            <div className="inline-flex items-center justify-center w-full">
              <hr className="w-30 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
              <span className="px-3 font-medium text-gray-900  bg-white  ">
                or
              </span>
              <hr className="w-30 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            </div> */}

            <Input
              className="mb-4 rounded-lg border border-gray-300 bg-transparent p-2 text-black focus:border-gray-600 focus:outline-none"
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
              className="inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-md bg-blue-500 py-2 text-sm font-medium text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              disabled={isButtonDisabled}
            >
              {loading ? (
                <LucideLoader2 className="animate-spin" />
              ) : isButtonDisabled ? (
                "Can't Register"
              ) : (
                "Register"
              )}
            </button>

            <Toaster />

            <p className="pt-3 text-sm dark:text-gray-900">
              {" "}
              Already have an account?
              <Link href="/login" className="text-blue-500">
                {" "}
                Login!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
