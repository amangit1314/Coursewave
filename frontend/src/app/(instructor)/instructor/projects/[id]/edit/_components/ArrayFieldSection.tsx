"use client";

import React from "react";
import { Plus, X, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ListItemStyle = "badge" | "list-check" | "list-bullet" | "list-icon" | "list-link";

interface ArrayFieldSectionProps {
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  buttonColor: string;
  items: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  placeholder: string;
  emptyMessage: string;
  listStyle: ListItemStyle;
  itemIcon?: React.ReactNode;
  inputType?: string;
  focusColor?: string;
}

export const ArrayFieldSection = ({
  title,
  icon,
  iconColor,
  buttonColor,
  items,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
  placeholder,
  emptyMessage,
  listStyle,
  itemIcon,
  inputType = "text",
  focusColor = "blue",
}: ArrayFieldSectionProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAdd();
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg border border-zinc-200/50 dark:border-zinc-700/50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <Button
          type="button"
          onClick={onAdd}
          className={`h-full flex items-center justify-center px-6 ${buttonColor} rounded-xl`}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          type={inputType}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`flex-1 px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-${focusColor}-500 dark:focus:border-${focusColor}-400 focus:outline-none focus:ring-2 focus:ring-${focusColor}-500/20 transition-all`}
          placeholder={placeholder}
        />
      </div>
      {items.length > 0 ? (
        listStyle === "badge" ? (
          <div className="flex flex-wrap gap-2">
            {items.map((item, idx) => (
              <span
                key={idx}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${iconColor} flex items-center gap-2 border hover:opacity-80 transition-colors`}
              >
                {item}
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group"
              >
                {listStyle === "list-check" && (
                  <CheckCircle className="w-5 h-5 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                )}
                {listStyle === "list-bullet" && (
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0" />
                )}
                {listStyle === "list-icon" && itemIcon && (
                  <span className="mt-0.5 flex-shrink-0">{itemIcon}</span>
                )}
                {listStyle === "list-link" ? (
                  <a
                    href={item}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-sm text-blue-600 dark:text-blue-400 hover:underline truncate"
                  >
                    {item}
                  </a>
                ) : (
                  <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {item}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )
      ) : (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
          {emptyMessage}
        </p>
      )}
    </div>
  );
};
