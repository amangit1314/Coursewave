"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { QueryClient, QueryKey, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import Link from "next/link";

import { FcGoogle } from "react-icons/fc";
import toast, { Toaster } from "react-hot-toast";
import { PasswordInput } from "./_components/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useNotificationsStore from "@/zustand/notificationsStore";
import { absoluteUrl } from "@/lib/utils";
import { BiNotification } from "react-icons/bi";
import { BellIcon } from "lucide-react";

const successNotification = (message: string) => toast.success(message);
const errorNotification = (errorMessage: string) => toast.error(errorMessage);

function Login() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState({ email: "", password: "" });
  const [isButtonDisabled, setButtonDisabled] = React.useState(false);
  // const setNotification = useNotificationsStore(
  //   (state) => state.setNotification
  // );

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30,
      },
    },
  });

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/login", user);
      // Cache the user information using React Query
      queryClient.setQueryData(["user"], response.data);
      // const data = await queryClient.fetchQuery({
      //   queryKey: ["user"],
      //   queryFn: ,
      //   staleTime: 10000,
      // });
      console.log("Login success", response.data);

      // const res = await fetch(
      //   absoluteUrl(`/api/notify`),
      //   {
      //     method: "POST",
      //     body: JSON.stringify({title: 'Welcome Back 🎉', body: 'Welcome back to Coursewave, We missed you so much.', icon: BellIcon, url: absoluteUrl(`/browseCourses`)}),
      //     headers: {
      //       "content-type": "application/json",
      //     },
      //   }
      // );

      // const data = await res.json();
      // console.log('Sended notification data: ', data);

      successNotification("Logged in successfully");
      router.push("/browseCourses");

      // setNotification(
      //   "Welcome Back 🎉",
      //   `Welcome back to Courswave, we missed you so much "${response.data.courseName}" course.`
      // );
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
            <Button variant="outline" className="p-3 border-blue-500">
              <FcGoogle size={26} />
              <div className="pl-2">Sign in with Google</div>
            </Button>

            <div className="inline-flex items-center justify-center w-full">
              <hr className="w-30 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
              <span className="px-3 font-medium text-gray-900  bg-white  ">
                or
              </span>
              <hr className="w-30 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            </div>

            <Input
              className="p-2 border border-gray-300 bg-transparent rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
              id="email"
              type="text"
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

            <Link
              href="/forgotPassword"
              className="pb-2 text-xs text-blue-500 cursor-point"
            >
              forgot password?
            </Link>

            <button
              onClick={onLogin}
              type="submit"
              className="py-2 text-white w-full bg-blue-500 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              disabled={isButtonDisabled}
            >
              {loading
                ? "...Loading"
                : isButtonDisabled
                  ? "Cant Login"
                  : "Login"}
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
}

export default Login;
