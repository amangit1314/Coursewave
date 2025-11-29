"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, ImageIcon, Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/config/supabase";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { dmSans } from "@/lib/config/fonts";

const formSchema = z.object({
    thumbnailUrl: z.string().min(1, {
        message: "Project image is required",
    }),
});

interface ImageFormProps {
    initialData?: { thumbnailUrl?: string };
    onUpdate: (thumbnailUrl: string) => void;
}

export const ImageForm = ({ initialData, onUpdate }: ImageFormProps) => {
    const [isEditing, setIsEditing] = useState(!initialData?.thumbnailUrl);
    const [isUploading, setIsUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(initialData?.thumbnailUrl || "");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { thumbnailUrl: initialData?.thumbnailUrl || "" },
    });

    const uploadImageToSupabase = async (file: File): Promise<string> => {
        try {
            setIsUploading(true);

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                throw new Error("File size must be less than 5MB");
            }

            // Validate file type
            const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
            if (!validTypes.includes(file.type)) {
                throw new Error("Please upload a valid image file (JPEG, PNG, WebP, GIF)");
            }

            // Generate unique filename
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `project-images/${fileName}`;

            // Upload to Supabase
            const { data, error } = await supabase.storage
                .from("courses")
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage.from("courses").getPublicUrl(filePath);

            return publicUrl;
        } catch (error: any) {
            console.error("Image upload error:", error);
            throw new Error(error.message || "Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        try {
            // Show temporary preview
            const tempUrl = URL.createObjectURL(file);
            setImageUrl(tempUrl);

            // Upload to Supabase
            const publicUrl = await uploadImageToSupabase(file);

            // Set the actual Supabase URL
            setImageUrl(publicUrl);
            form.setValue("thumbnailUrl", publicUrl, { shouldValidate: true });

            toast.success("Image uploaded successfully!");
        } catch (error: any) {
            setImageUrl(initialData?.thumbnailUrl || "");
            form.setValue("thumbnailUrl", initialData?.thumbnailUrl || "", { shouldValidate: true });
            toast.error(error.message || "Failed to upload image");
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            onUpdate(values.thumbnailUrl);
            toast.success("Project image updated");
            toggleEdit();
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="mt-6 rounded-2xl bg-slate-100 p-4 dark:bg-zinc-900">
            <div
                className={`${dmSans.className} flex items-center justify-between font-medium`}
            >
                Project Image *
                <Button onClick={toggleEdit} variant="outline" className="rounded-full">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4" />
                            Edit
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className="mt-2">
                    {initialData?.thumbnailUrl ? (
                        <img
                            src={initialData.thumbnailUrl}
                            alt="Project thumbnail"
                            className="w-full h-48 object-cover rounded-lg"
                        />
                    ) : (
                        <p className="italic text-gray-600 dark:text-gray-400 text-sm">
                            No image uploaded
                        </p>
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
                            name="thumbnailUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="space-y-4">
                                            {isUploading ? (
                                                <div className="text-center p-8 border-2 border-dashed rounded-xl">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                                    <p className="text-sm">Uploading image...</p>
                                                </div>
                                            ) : imageUrl ? (
                                                <div className="relative">
                                                    <img
                                                        src={imageUrl}
                                                        alt="Project preview"
                                                        className="w-full h-48 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setImageUrl("");
                                                            form.setValue("thumbnailUrl", "", { shouldValidate: true });
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
                                                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                                    <p className="text-sm mb-2">
                                                        Drop your image here, or{" "}
                                                        <button
                                                            type="button"
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="text-blue-500 hover:text-blue-600 underline"
                                                        >
                                                            browse
                                                        </button>
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Recommended: 16:9 aspect ratio, max 5MB
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) await handleFileUpload(file);
                                                }}
                                                className="hidden"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                className="dark:bg-zinc-950 dark:text-white"
                                disabled={!form.formState.isValid || isUploading}
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
