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
    <div className="border border-border rounded-md p-3 bg-card">
      <div className="flex gap-2 mb-3 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => handleCommand("bold")}
          className="font-bold border border-border px-2 py-1 rounded hover:bg-muted"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => handleCommand("italic")}
          className="italic border border-border px-2 py-1 rounded hover:bg-muted"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => handleCommand("underline")}
          className="underline border border-border px-2 py-1 rounded hover:bg-muted"
        >
          U
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="min-h-[150px] outline-none text-foreground"
      />
    </div>
  );
};