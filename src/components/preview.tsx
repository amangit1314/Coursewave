"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  // const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

  return (
    <ReactQuill
      theme="bubble"
      value={value}
      className="rounded-xl bg-white p-1 font-serif dark:bg-zinc-900"
      readOnly
    />
  );
};
