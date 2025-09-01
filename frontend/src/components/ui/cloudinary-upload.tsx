import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface CloudinaryUploadProps {
  value: string;
  disabled?: boolean;
  onChange: (url: string) => void;
}

export const CloudinaryUpload = ({
  value,
  disabled,
  onChange,
}: CloudinaryUploadProps) => {
  const cloudinaryRef = useRef<any>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Load Cloudinary script
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    script.onload = () => {
      if (window.cloudinary) {
        cloudinaryRef.current = window.cloudinary;
        initializeWidget();
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      if (widgetRef.current) {
        widgetRef.current.destroy();
      }
    };
  }, []);

  const initializeWidget = () => {
    if (!cloudinaryRef.current) return;

    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: "coursewave_preset",
        sources: ["local", "camera"],
        multiple: false,
        maxFileSize: 5000000,
        resourceType: "image",
        folder: "coursewave",
        allowedFormats: ["jpg", "jpeg", "png", "gif"],
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          onChange(result.info.secure_url);
          toast.success("Image uploaded successfully!");
        }
        if (error) {
          console.error("Upload error:", error);
          toast.error("Failed to upload image");
        }
      }
    );
  };

  const onUpload = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-x-2">
      <div className="relative">
        <div
          className="
            p-20 
            border-2 
            border-dashed
            border-primary/10 
            rounded-lg 
            hover:opacity-75 
            transition 
            flex 
            flex-col 
            justify-center 
            items-center 
            gap-y-2 
            text-neutral-600
          "
        >
          <div className="font-semibold text-lg">
            <Button
              disabled={disabled}
              variant="ghost"
              type="button"
              onClick={onUpload}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload an image
            </Button>
          </div>
          <p className="text-neutral-500 text-sm font-light">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
      </div>
      {value && (
        <div className="flex flex-col items-center gap-y-1">
          <div className="relative w-40 h-40">
            <Image
              fill
              className="object-cover rounded-md"
              alt="Upload"
              src={value}
            />
          </div>
          <Button
            onClick={() => onChange("")}
            type="button"
            disabled={disabled}
            variant="ghost"
            className="bg-transparent hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}; 