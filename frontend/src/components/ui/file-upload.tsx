import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/config/cloudinary";

interface FileUploadProps {
  onChange: (url: string) => void;
  value: string;
  disabled?: boolean;
}

export const FileUpload = ({
  onChange,
  value,
  disabled,
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
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
              disabled={disabled || isUploading}
              variant="ghost"
              type="button"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload an image
            </Button>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={onUpload}
              disabled={disabled || isUploading}
              className="hidden"
            />
          </div>
          <p className="text-neutral-500 text-sm font-light">
            PNG, JPG, GIF up to 10MB
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
            disabled={disabled || isUploading}
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