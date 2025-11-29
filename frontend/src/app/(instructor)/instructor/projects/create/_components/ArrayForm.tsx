"use client";

import { Pencil, Plus, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/utils";
import { dmSans } from "@/lib/config/fonts";

interface ArrayFormProps {
    label: string;
    initialData?: string[];
    onUpdate: (values: string[]) => void;
    placeholder?: string;
}

export const ArrayForm = ({ label, initialData = [], onUpdate, placeholder }: ArrayFormProps) => {
    const [isEditing, setIsEditing] = useState(initialData.length === 0);
    const [items, setItems] = useState<string[]>(initialData);
    const [inputValue, setInputValue] = useState("");
    const toggleEdit = () => setIsEditing((current) => !current);

    const addItem = () => {
        const trimmedValue = inputValue.trim();
        if (trimmedValue && !items.includes(trimmedValue)) {
            const newItems = [...items, trimmedValue];
            setItems(newItems);
            setInputValue("");
        }
    };

    const removeItem = (itemToRemove: string) => {
        const newItems = items.filter(item => item !== itemToRemove);
        setItems(newItems);
    };

    const handleSave = () => {
        onUpdate(items);
        toast.success(`${label} updated`);
        toggleEdit();
    };

    const handleCancel = () => {
        setItems(initialData);
        setInputValue("");
        toggleEdit();
    };

    return (
        <div className="mt-6 rounded-2xl bg-slate-100 p-4 dark:bg-zinc-900">
            <div
                className={`${dmSans.className} flex items-center justify-between font-medium`}
            >
                {label}
                <Button onClick={isEditing ? handleCancel : toggleEdit} variant="outline" className="rounded-full">
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
                    {initialData.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {initialData.map((item, index) => (
                                <span
                                    key={index}
                                    className={`${dmSans.className} inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700`}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="italic text-gray-600 dark:text-gray-400 text-sm">
                            No items added
                        </p>
                    )}
                </div>
            )}
            {isEditing && (
                <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addItem();
                                }
                            }}
                            placeholder={placeholder || `Add ${label.toLowerCase()}`}
                            className="dark:bg-zinc-900 px-3 py-4 text-sm"
                        />
                        <Button
                            type="button"
                            onClick={addItem}
                            className="dark:bg-zinc-950"
                        >
                            <Plus size={18} />
                        </Button>
                    </div>
                    {items.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {items.map((item, index) => (
                                <span
                                    key={index}
                                    className={`${dmSans.className} inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700`}
                                >
                                    {item}
                                    <button
                                        type="button"
                                        onClick={() => removeItem(item)}
                                        className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center gap-x-2">
                        <Button
                            type="button"
                            onClick={handleSave}
                            className="dark:bg-zinc-950 dark:text-white"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
