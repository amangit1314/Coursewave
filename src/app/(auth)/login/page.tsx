"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect } from "react";
import { absoluteUrl } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { LucideLoader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { PasswordInput } from "./_components/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { useZustandStore } from "@/zustand/store";
import { signIn } from "next-auth/react";

axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";

const successNotification = (message: string) => toast.success(message);
const errorNotification = (errorMessage: string) => toast.error(errorMessage);

const Login = () => {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);
  const [user, setUserInfo] = React.useState({ email: "", password: "" });
  const [isButtonDisabled, setButtonDisabled] = React.useState(false);
  const { setUser } = useZustandStore();

  const onLogin = async () => {
    try {
      setLoading(true);
      await axios.post(("api/auth/login"), user).then((res) => {
        console.log("Login response: ", res.data);
        setUser(res.data);
      });

      successNotification("Logged in successfully");
      router.push("/browseCourses");
    } catch (error: any) {
      console.error("Login failed: ", error.message);
      errorNotification(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="h-[80vh] bg-zinc-800">
      <div className="flex flex-col items-center h-auto bg-slate-800 md:p-24 md:max-w-7xl w-full md:mx-auto">
        <div className="flex flex-col space-y-4 md:space-y-0 lg:flex-row w-7xl p-14 justify-center bg-slate-900 rounded-3xl">
          {/* Left section */}
          <div className="flex flex-col mr-0 lg:mr-20 justify-center">
            <div className="text-white font-bold text-2xl md:text-[42px] tracking-tight space-y-8 md:leading-10">
              Welcome back to <br />{" "}
              <span className="text-blue-500">CourseWave</span>
            </div>
            <div className="h-[5px] rounded-full bg-blue-500 w-32 mt-1 mb-4"></div>
            <div className="text-slate-400">
              Sign in to continue to your <br /> account.
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col p-8 bg-white rounded-3xl">
            {/* <div className="inline-flex items-center justify-center w-full">
              <SignInWithGoogleButton />
              <hr className="w-30 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
              <span className="px-3 font-medium text-gray-900  bg-white  ">
                or
              </span>
              <hr className="w-30 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            </div> */}

            <Input
              className="p-2 border border-gray-300 bg-transparent rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
              id="email"
              type="text"
              value={user.email}
              onChange={(e) => {
                setUserInfo({ ...user, email: e.target.value });
              }}
              placeholder="email"
            />

            <PasswordInput
              id="current_password"
              value={user.password}
              onChange={(e: any) =>
                setUserInfo({ ...user, password: e.target.value })
              }
              autoComplete="current-password"
            />

            <Link
              href="/forgotPassword"
              className="pb-2 text-sm text-blue-500 cursor-point"
            >
              forgot password?
            </Link>

            <button
              onClick={onLogin}
              type="submit"
              className="py-2 text-white w-full bg-blue-500 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              disabled={isButtonDisabled}
            >
              {loading ? (
                <LucideLoader2 className="animate-spin" />
              ) : isButtonDisabled ? (
                "Cant Login"
              ) : (
                "Login"
              )}
            </button>

            <Toaster />

            <p className="pt-3 text-sm dark:text-gray-900">
              Dont have an account?
              <Link href="/register" className="text-blue-500 ml-[4px]">
                Register!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

const SignInWithGoogleButton = () => {
  return (
    <Button
      variant="outline"
      onClick={() => signIn()}
      className="p-3 bg-transparent border-blue-500 rounded-md overflow-hidden"
    >
      <FcGoogle size={26} />
      <div className="pl-2">Sign in with Google</div>
    </Button>
  );
};
