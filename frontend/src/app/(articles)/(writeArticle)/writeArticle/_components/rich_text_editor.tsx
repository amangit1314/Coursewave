"use client";

import React, { useRef, useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Handle initial value and synchronization
  useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleCommand = (command: string) => {
    document.execCommand(command, false);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border rounded-md p-3 bg-white dark:bg-zinc-900">
      <div className="flex gap-2 mb-3 border-b pb-2">
        <button
          type="button"
          onClick={() => handleCommand("bold")}
          className="font-bold border px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => handleCommand("italic")}
          className="italic border px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => handleCommand("underline")}
          className="underline border px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          U
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="min-h-[150px] outline-none text-zinc-900 dark:text-white"
      />
    </div>
  );
};