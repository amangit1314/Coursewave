"use client";

import { UploadDropzone } from "@/lib/utils/uploadthing";
import toast from "react-hot-toast";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

const EditProfileImage = ({
  imageUrl,
  setImageUrl,
}: {
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const content = isEditing ? (
    <div className="w-full max-w-md mx-auto">
      <UploadDropzone
        endpoint={"profileImageUpdater"}
        onClientUploadComplete={(res: any) => {
          console.log("Uploadthing profile image upload response: ", res);
          console.log("Uploaded profile img url: ", res[0].url);
          setImageUrl(res[0].url);
          setIsEditing(false);
          toast.success("Profile Image uploaded successfully!");
        }}
        onUploadError={(error: Error) => {
          toast.error(`${error?.message}`);
        }}
      />
    </div>
  ) : (
    <div className="flex justify-center">
      <Image
        src={imageUrl ? imageUrl : "/assets/images/user/user-01.png"}
        width={96}
        height={96}
        className="border-stroke h-24 w-24 rounded-full border object-cover"
        alt="profile"
      />
    </div>
  );

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {content}
        <Button
          size="sm"
          variant="outline"
          className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0 bg-white dark:bg-zinc-800 shadow-md"
          onClick={handleEditClick}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EditProfileImage;
