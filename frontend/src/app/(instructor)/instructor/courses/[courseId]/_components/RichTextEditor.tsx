"use client";

import type React from "react";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Rich Text Editor Component
const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const handleFormat = (format: string) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = value;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    const selectedText = value.substring(selectionStart, selectionEnd);
    let newText = value;

    switch (format) {
      case "bold":
        newText =
          value.substring(0, selectionStart) +
          `**${selectedText}**` +
          value.substring(selectionEnd);
        setIsBold(!isBold);
        break;
      case "italic":
        newText =
          value.substring(0, selectionStart) +
          `*${selectedText}*` +
          value.substring(selectionEnd);
        setIsItalic(!isItalic);
        break;
      case "code":
        newText =
          value.substring(0, selectionStart) +
          `\`${selectedText}\`` +
          value.substring(selectionEnd);
        break;
    }

    onChange(newText);
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-slate-100 dark:bg-zinc-800 rounded-lg">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat("bold")}
          className="h-8 px-3 text-xs font-bold"
        >
          B
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat("italic")}
          className="h-8 px-3 text-xs italic"
        >
          I
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat("code")}
          className="h-8 px-3 text-xs font-mono"
        >
          {"</>"}
        </Button>
      </div>

      {/* Editor */}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your content here... You can use **bold**, *italic*, and `code` formatting."
        rows={12}
        className="bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl font-mono text-sm transition-all duration-200 shadow-sm resize-none"
      />

      {/* Preview */}
      {value && (
        <div className="mt-4 p-4 bg-slate-50 dark:bg-zinc-800 rounded-lg border">
          <Label className="text-sm font-medium mb-2 block">Preview:</Label>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {value.split("**").map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i}>{part}</strong>
              ) : (
                part.split("*").map((subPart, j) =>
                  j % 2 === 1 ? (
                    <em key={`${i}-${j}`}>{subPart}</em>
                  ) : (
                    subPart.split("`").map((codePart, k) =>
                      k % 2 === 1 ? (
                        <code
                          key={`${i}-${j}-${k}`}
                          className="bg-slate-200 dark:bg-zinc-700 px-1 rounded"
                        >
                          {codePart}
                        </code>
                      ) : (
                        codePart
                      )
                    )
                  )
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
