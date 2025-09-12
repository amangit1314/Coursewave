"use client";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  return (
    <ReactQuill
      theme="bubble"
      value={value}
      className="rounded-xl bg-white p-1 font-serif dark:bg-zinc-900"
      readOnly
    />
  );
};
