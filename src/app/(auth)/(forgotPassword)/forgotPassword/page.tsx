"use client";

import React from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string(),
});

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url =
        process.env.ENVIRONMENT === "DEVELOPMENT"
          ? "/api/auth/forgotPassword"
          : "api/auth/forgotPassword";
          
    await axios
        .post(url, {
          email: values.email,
        })
        .then((res) => {
          console.log("Forgot email sent successfully ✔ ...", res.data);
          toast.success("Forgot email sent successfully");
          router.push("/login");
        })
        .catch((err: any) => {
          console.error("Forgot password failed", err.message);
          toast.error(err.message);
        });
    } catch (error: any) {
      console.error("Forgot password failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-auto w-auto bg-slate-800">
      <div className="mx-auto my-auto h-screen max-w-7xl bg-slate-800 lg:p-24 xl:p-24">
        <div className="flex w-auto flex-col justify-center rounded-lg bg-slate-900 lg:flex-row xl:flex-row">
          {/* Left section */}
          <div className="mr-0 flex flex-col justify-center px-8 py-8 lg:mr-20 xl:mr-20">
            <p className="pt-3 text-sm">
              <Link
                href="/login"
                className="space-x-2 text-white transition-all duration-200 hover:text-blue-500"
              >
                <ChevronLeft /> <p>Back to login!</p>
              </Link>
            </p>
            <div className="text-3xl font-bold text-white">
              Did you Forgot Password <br /> your password for{" "}
              <span className="text-blue-500">Coursewae</span>
            </div>
            <div className="mb-4 mt-1 h-1.5 w-32 rounded-xl bg-blue-500" />
            <div className="text-slate-400">
              Enter your email, and we will send you a <br /> forgot password
              link to your email.
            </div>
          </div>

          {/* Right Section */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="m-14 flex flex-col rounded-lg bg-white px-8 py-8"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <div>
                    <FormItem className="mt-8">
                      <FormLabel className="my-4 text-base text-gray-800 dark:text-gray-100">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          className="bg-transaprent mb-4 border border-gray-700 dark:border-gray-400"
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="">
                        Enter your email we will send a reset link to it
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />

              <br className="py-2" />
              <button
                type="submit"
                className="inline-flex w-full justify-center whitespace-nowrap rounded-md bg-blue-500 py-2 text-sm font-medium text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                disabled={!isValid || isSubmitting}
              >
                {loading ? <Loader className="animate-spin" /> : "Send Email"}
              </button>

              <p className="pt-3 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500">
                  Login!
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
