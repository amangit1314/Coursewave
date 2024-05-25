'use client';

import React from "react";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password is required",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });

// ! user will redirect to here when he will click on the sended forgot password link to his email on the forgotpassword request

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("resetToken");
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await axios
      .patch(
        `api/auth/resetPassword`,
        JSON.stringify({ token: token!, newPassword: values.password })
      )
      .then(() => {
        router.push(`/login`);
        toast.success("Password successfully changed ✔ ...");
      })
      .catch((err: any) => {
        console.log("Error in changing password: ", err.message);
        toast.error(`Error in changing password: ${err.message}`);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
        {/* new password  */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <div>
              <FormItem className="mt-8">
                <FormLabel className="my-4 text-base text-gray-800 dark:text-gray-100">
                  New Password
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    className="bg-transparent border-gray-700 dark:border-gray-400 "
                    placeholder="your password here ..."
                    {...field}
                  />
                </FormControl>
                <FormDescription className="">
                  Enter your new password
                </FormDescription>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        {/* confirm password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <div>
              <FormItem className="mt-8">
                <FormLabel className="my-4 text-base text-gray-800 dark:text-gray-100">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    className="bg-transparent border-gray-700 dark:border-gray-400 "
                    placeholder="enter your password here agian to confirm ..."
                    {...field}
                  />
                </FormControl>
                <FormDescription className="">
                  Enter your new password again to confirm
                </FormDescription>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        <Button type="submit" disabled={!isValid || isSubmitting} color="blue">
          Change Password
        </Button>
      </form>
    </Form>
  );
};

export default ResetPassword;
