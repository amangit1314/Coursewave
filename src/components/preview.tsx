"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface PreviewProps {
  value: string;
};

export const Preview = ({
  value,
}: PreviewProps) => {
  // const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

  return (
    <ReactQuill
      theme="bubble"
      value={value}
      className="bg-white dark:bg-zinc-900 p-1 rounded-xl font-serif"
      readOnly
    />
  );
};
