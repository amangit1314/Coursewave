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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { dmSans } from "@/lib/config/fonts";

const formSchema = z.object({
    description: z.string().min(150, {
        message: "Description must be at least 150 characters",
    }).max(1000, {
        message: "Description must be less than 1000 characters"
    }),
});

interface DescriptionFormProps {
    initialData?: { description?: string };
    onUpdate: (description: string) => void;
}

export const DescriptionForm = ({ initialData, onUpdate }: DescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(!initialData?.description);
    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { description: initialData?.description || "" },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            onUpdate(values.description);
            toast.success("Project description updated");
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
                Project Description *
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
                        !initialData?.description
                            ? "italic text-gray-600 dark:text-gray-400"
                            : "text-md text-base whitespace-pre-wrap"
                    )}
                >
                    {initialData?.description || "No description provided"}
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            className="dark:bg-zinc-900 px-3 py-4 text-sm"
                                            placeholder="Describe what students will build in this project. Include key features and technologies. (Minimum 150 characters)"
                                            rows={6}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <p className="text-sm text-gray-500">
                                        {field.value?.length || 0}/1000 characters
                                    </p>
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
