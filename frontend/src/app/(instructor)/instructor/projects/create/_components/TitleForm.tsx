"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { dmSans } from "@/lib/config/fonts";

const formSchema = z.object({
    title: z.string().min(5, {
        message: "Title must be at least 5 characters",
    }).max(100, {
        message: "Title must be less than 100 characters"
    }),
});

interface TitleFormProps {
    initialData?: { title?: string };
    onUpdate: (title: string) => void;
}

export const TitleForm = ({ initialData, onUpdate }: TitleFormProps) => {
    const [isEditing, setIsEditing] = useState(!initialData?.title);
    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: initialData?.title || "" },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            onUpdate(values.title);
            toast.success("Project title updated");
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
                Project Title *
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
                <p
                    className={cn(
                        "mt-2 text-sm",
                        !initialData?.title
                            ? "italic text-gray-600 dark:text-gray-400"
                            : "text-md text-base"
                    )}
                >
                    {initialData?.title || "No title provided"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-4 space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            className="dark:bg-zinc-900 px-3 py-4 text-sm"
                                            placeholder="e.g. 'Build a Full-Stack E-commerce Platform'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
