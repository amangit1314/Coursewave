// "use client";

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import toast from "react-hot-toast";

// interface Props {
//   onSubmit: (data: {
//     bio: string;
//     expertise: string[];
//     socialLinks?: any;
//   }) => void;
//   onClose: () => void;
//   isSubmitting: boolean;
// }

// export const InstructorRegistrationForm: React.FC<Props> = ({
//   onSubmit,
//   onClose,
//   isSubmitting,
// }) => {
//   const [bio, setBio] = useState("");
//   const [expertiseInput, setExpertiseInput] = useState("");
//   const [expertiseList, setExpertiseList] = useState<string[]>([]);
//   const [socialLink, setSocialLink] = useState("");

//   const handleAddExpertise = () => {
//     if (
//       expertiseInput.trim() &&
//       !expertiseList.includes(expertiseInput.trim())
//     ) {
//       setExpertiseList([...expertiseList, expertiseInput.trim()]);
//       setExpertiseInput("");
//     }
//   };

//   const handleRemoveExpertise = (item: string) => {
//     setExpertiseList(expertiseList.filter((exp) => exp !== item));
//   };

//   const handleSubmit = () => {
//     if (!bio) {
//       toast.error("Please enter your bio.");
//       return;
//     }
//     if (expertiseList.length === 0) {
//       toast.error("Please add at least one expertise area.");
//       return;
//     }
//     onSubmit({
//       bio,
//       expertise: expertiseList,
//       socialLinks: socialLink ? { linkedin: socialLink } : undefined,
//     });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md shadow-lg">
//         <h2 className="text-lg font-bold mb-4">Become an Instructor</h2>

//         <label className="block text-sm font-medium mb-1">Bio</label>
//         <textarea
//           value={bio}
//           onChange={(e) => setBio(e.target.value)}
//           className="w-full p-2 border rounded mb-4 dark:bg-zinc-800"
//           rows={3}
//           placeholder="Tell us about yourself..."
//           disabled={isSubmitting}
//         />

//         <label className="block text-sm font-medium mb-1">Expertise</label>
//         <div className="flex mb-2">
//           <input
//             type="text"
//             value={expertiseInput}
//             onChange={(e) => setExpertiseInput(e.target.value)}
//             placeholder="e.g., Web Development"
//             className="flex-1 p-2 border rounded-l dark:bg-zinc-800"
//             disabled={isSubmitting}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 e.preventDefault();
//                 handleAddExpertise();
//               }
//             }}
//           />
//           <Button
//             onClick={handleAddExpertise}
//             className="rounded-l-none"
//             disabled={isSubmitting}
//           >
//             Add
//           </Button>
//         </div>
//         <div className="flex flex-wrap gap-2 mb-4">
//           {expertiseList.map((item, idx) => (
//             <span
//               key={idx}
//               className="bg-blue-600 text-white px-2 py-1 rounded text-xs cursor-pointer"
//               onClick={() => !isSubmitting && handleRemoveExpertise(item)}
//             >
//               {item} ✕
//             </span>
//           ))}
//         </div>

//         <label className="block text-sm font-medium mb-1">
//           LinkedIn (optional)
//         </label>
//         <input
//           type="url"
//           value={socialLink}
//           onChange={(e) => setSocialLink(e.target.value)}
//           className="w-full p-2 border rounded mb-4 dark:bg-zinc-800"
//           placeholder="https://linkedin.com/in/..."
//           disabled={isSubmitting}
//         />

//         <div className="flex justify-end gap-2">
//           <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={isSubmitting}>
//             {isSubmitting ? "Submitting..." : "Submit"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };


"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface Props {
  onSubmit: (data: {
    bio: string;
    expertise: string[];
    socialLinks?: { linkedin?: string };
  }) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

interface FormData {
  bio: string;
  expertiseInput: string;
  expertiseList: string[];
  socialLink?: string;
}

export const InstructorRegistrationForm: React.FC<Props> = ({
  onSubmit,
  onClose,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      bio: "",
      expertiseInput: "",
      expertiseList: [],
      socialLink: "",
    },
  });

  const expertiseList = watch("expertiseList");

  const handleAddExpertise = () => {
    const input = getValues("expertiseInput").trim();
    if (input && !expertiseList.includes(input)) {
      setValue("expertiseList", [...expertiseList, input]);
      setValue("expertiseInput", "");
    }
  };

  const handleRemoveExpertise = (item: string) => {
    setValue(
      "expertiseList",
      expertiseList.filter((exp) => exp !== item)
    );
  };

  const onFormSubmit = (data: FormData) => {
    if (data.expertiseList.length === 0) {
      toast.error("Please add at least one expertise area.");
      return;
    }

    onSubmit({
      bio: data.bio,
      expertise: data.expertiseList,
      socialLinks: data.socialLink ? { linkedin: data.socialLink } : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">Become an Instructor</h2>

        {/* Bio */}
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          {...register("bio", { required: "Please enter your bio." })}
          className="w-full p-2 border rounded mb-4 dark:bg-zinc-800"
          rows={3}
          placeholder="Tell us about yourself..."
          disabled={isSubmitting}
        />
        {errors.bio && (
          <p className="text-xs text-red-500">{errors.bio.message}</p>
        )}

        {/* Expertise */}
        <label className="block text-sm font-medium mb-1">Expertise</label>
        <div className="flex mb-2">
          <input
            {...register("expertiseInput")}
            type="text"
            placeholder="e.g., Web Development"
            className="flex-1 p-2 border rounded-l dark:bg-zinc-800"
            disabled={isSubmitting}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddExpertise();
              }
            }}
          />
          <Button
            onClick={handleAddExpertise}
            className="rounded-l-none"
            disabled={isSubmitting}
          >
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {expertiseList.map((item, idx) => (
            <span
              key={idx}
              className="bg-blue-600 text-white px-2 py-1 rounded text-xs cursor-pointer"
              onClick={() => !isSubmitting && handleRemoveExpertise(item)}
            >
              {item} ✕
            </span>
          ))}
        </div>

        {/* LinkedIn */}
        <label className="block text-sm font-medium mb-1">LinkedIn (optional)</label>
        <input
          {...register("socialLink")}
          type="url"
          className="w-full p-2 border rounded mb-4 dark:bg-zinc-800"
          placeholder="https://linkedin.com/in/..."
          disabled={isSubmitting}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onFormSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};
