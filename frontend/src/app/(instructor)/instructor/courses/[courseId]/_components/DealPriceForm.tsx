"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Tag } from "lucide-react";
import { useState } from "react";
import toast  from "react-hot-toast";
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

interface DealPriceFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  dealPrice: z.coerce.number().min(0, "Deal price cannot be negative"),
});

export const DealPriceForm = ({ initialData, courseId }: DealPriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();
  const { mutate: updateCourse } = useUpdateCourse();

  // Debug logging to see what's actually in the data
  console.log('Initial Data:', {
    price: initialData?.price,
    discountPercent: initialData?.discount,
    dealPrice: initialData?.dealPrice
  });

  // Calculate values properly
  const originalPrice = Number(initialData?.price) || 0;
  const discountPercent = Number(initialData?.discount) || 0;
  const calculatedDealPrice = originalPrice * (1 - discountPercent / 100);
  const currentDealPrice = Number(initialData?.dealPrice) || calculatedDealPrice;

  console.log('Calculations:', {
    originalPrice,
    discountPercent,
    calculatedDealPrice,
    currentDealPrice
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dealPrice: currentDealPrice || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      updateCourse(
        {
          courseId: courseId,
          updates: {
            dealPrice: values.dealPrice,
          },
        },
        {
          onSuccess: (updatedCourse) => {
            toast.success("Deal price updated successfully ✔️");
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

  const hasDiscount = discountPercent > 0;
  const isAutoCalculated = !initialData?.dealPrice && hasDiscount;

  return (
    <div className="mt-6 rounded-2xl bg-slate-100 p-4 dark:bg-zinc-900">
  
      <div
        className={`${dmSans.className} flex items-center justify-between font-medium`}
      >
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Deal Price
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
          <p
            className={cn(
              "text-sm font-medium",
              !currentDealPrice && "italic text-gray-500 dark:text-gray-400"
            )}
          >
            {currentDealPrice
              ? formatPrice(currentDealPrice, "USD")
              : "No deal price set"}
          </p>
          
          {hasDiscount && originalPrice > 0 && (
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div className="flex items-center gap-2">
                <span className="line-through">
                  {formatPrice(originalPrice, "USD")}
                </span>
                <span className="text-green-600 font-medium">
                  {discountPercent}% off
                </span>
              </div>
              {isAutoCalculated && (
                <p className="text-blue-600 text-xs italic">
                  Automatically calculated from {formatPrice(originalPrice, "USD")} - {discountPercent}%
                </p>
              )}
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
              name="dealPrice"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="dark:bg-transparent"
                      type="number"
                      step="0.01"
                      min="0"
                      disabled={isSubmitting}
                      placeholder="Set a custom deal price"
                      {...field}
                    />
                  </FormControl>
                  <div className="text-xs text-gray-500 mt-1">
                    {hasDiscount ? (
                      <span>
                        Auto-calculated: {formatPrice(calculatedDealPrice, "USD")} 
                        ({discountPercent}% off {formatPrice(originalPrice, "USD")})
                      </span>
                    ) : (
                      "Set a custom deal price for your course"
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Comparison */}
            {originalPrice > 0 && (
              <div className="p-3 bg-slate-200 dark:bg-zinc-800 rounded-lg text-sm">
                <p className="font-medium mb-2">Price Breakdown:</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Original Price:</span>
                    <span>{formatPrice(originalPrice, "USD")}</span>
                  </div>
                  
                  {hasDiscount && (
                    <>
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span className="text-red-600">-{discountPercent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount Amount:</span>
                        <span className="text-red-600">
                          -{formatPrice(originalPrice * (discountPercent / 100), "USD")}
                        </span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Final Deal Price:</span>
                    <span className="text-green-600 font-bold">
                      {formatPrice(form.watch("dealPrice") || 0, "USD")}
                    </span>
                  </div>

                  {form.watch("dealPrice") !== calculatedDealPrice && (
                    <p className="text-blue-600 text-xs font-medium">
                      Custom price set (auto: {formatPrice(calculatedDealPrice, "USD")})
                    </p>
                  )}
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
              {hasDiscount && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.setValue("dealPrice", calculatedDealPrice)}
                  className="text-xs"
                >
                  Use Auto-calculated
                </Button>
              )}
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};