"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCourses } from "@/hooks/useCourses";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { dmSans } from "@/lib/config/fonts";

const formSchema = z.object({
    courseId: z.string().min(1, {
        message: "Please select a course",
    }),
});

interface CourseFormProps {
    initialData?: { courseId?: string };
    onUpdate: (courseId: string) => void;
}

export const CourseForm = ({ initialData, onUpdate }: CourseFormProps) => {
    const [isEditing, setIsEditing] = useState(!initialData?.courseId);
    const { data: courses, isLoading } = useCourses();
    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { courseId: initialData?.courseId || "" },
    });

    const { isSubmitting, isValid } = form.formState;
    const selectedCourse = courses?.find(c => c.id === initialData?.courseId);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            onUpdate(values.courseId);
            toast.success("Course selected");
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
                Associated Course *
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
                        !selectedCourse
                            ? "italic text-gray-600 dark:text-gray-400"
                            : "text-md text-base"
                    )}
                >
                    {selectedCourse?.title || "No course selected"}
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
                            name="courseId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select
                                            disabled={isSubmitting || isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="dark:bg-zinc-900">
                                                <SelectValue placeholder="Select a course" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courses?.map((course) => (
                                                    <SelectItem key={course.id} value={course.id}>
                                                        {course.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
