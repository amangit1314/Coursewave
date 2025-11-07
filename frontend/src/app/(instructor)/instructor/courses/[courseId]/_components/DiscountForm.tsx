"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Percent } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils/format";
import { Course } from "@/types/course";
import { dmSans } from "@/lib/config/fonts";
import { useUpdateCourse } from "@/hooks/useCourses";

interface DiscountFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  discountPercent: z.coerce
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%"),
});

export const DiscountForm = ({ initialData, courseId }: DiscountFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();
  const { mutate: updateCourse } = useUpdateCourse();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      discountPercent: Number(initialData?.discount) || 0,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      updateCourse(
        {
          courseId: courseId,
          updates: values,
        },
        {
          onSuccess: (updatedCourse) => {
            toast.success("Course discount updated successfully ✔️");
            toggleEdit();
            router.refresh();
          },
          onError: (error) => {
            toast.error(error.message || "Something went wrong ❌");
          },
        }
      );
    } catch {
      toast.error("Something went wrong ❌");
    }
  };

  // Calculate discounted price for display
  const originalPrice = Number(initialData?.price) || 0;
  const discountPercent = Number(initialData?.discount) || 0;
  const discountedPrice = originalPrice * (1 - discountPercent / 100);

  return (
    <div className="mt-6 rounded-2xl bg-slate-100 p-4 dark:bg-zinc-900">
   
      <div
        className={`${dmSans.className} flex items-center justify-between font-medium`}
      >
        <div className="flex items-center gap-2">
          <Percent className="h-4 w-4" />
          Course Discount
        </div>
        <Button onClick={toggleEdit} variant="outline" className="rounded-full">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-2 space-y-2">
          <p className={cn(
            "text-sm",
            !discountPercent && "italic text-gray-500 dark:text-gray-400"
          )}>
            {discountPercent > 0 
              ? `${discountPercent}% off` 
              : "No discount"}
          </p>
          
          {discountPercent > 0 && originalPrice > 0 && (
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div className="flex items-center gap-2">
                <span className="line-through">
                  {formatPrice(originalPrice, "USD")}
                </span>
                <span className="text-green-600 font-medium">
                  {formatPrice(discountedPrice, "USD")}
                </span>
              </div>
              <p className="text-green-600 font-medium">
                You save {formatPrice(originalPrice - discountedPrice, "USD")}
              </p>
            </div>
          )}
        </div>
      )}
      
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="discountPercent"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="dark:bg-transparent pr-12"
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        disabled={isSubmitting}
                        placeholder="Enter discount percentage"
                        {...field}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Percent className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </FormControl>
                  <div className="text-xs text-gray-500 mt-1">
                    Enter a value between 0 and 100
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Preview */}
            {originalPrice > 0 && (
              <div className="p-3 bg-slate-200 dark:bg-zinc-800 rounded-lg text-sm">
                <p className="font-medium mb-2">Price Preview:</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Original Price:</span>
                    <span>{formatPrice(originalPrice, "USD")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span className="text-red-600">
                      {form.watch("discountPercent") || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-1">
                    <span>Final Price:</span>
                    <span className="text-green-600">
                      {formatPrice(
                        originalPrice * (1 - (form.watch("discountPercent") || 0) / 100), 
                        "USD"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-x-2">
              <Button
                className="dark:bg-zinc-950 dark:text-white"
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};