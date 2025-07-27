"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface Props {
  onSubmit: (data: { bio: string; expertise: string[]; socialLinks?: any }) => void;
  onClose: () => void;
}

export const InstructorRegistrationForm: React.FC<Props> = ({ onSubmit, onClose }) => {
  const [bio, setBio] = useState("");
  const [expertiseInput, setExpertiseInput] = useState("");
  const [expertiseList, setExpertiseList] = useState<string[]>([]);
  const [socialLink, setSocialLink] = useState("");

  const handleAddExpertise = () => {
    if (expertiseInput.trim() && !expertiseList.includes(expertiseInput.trim())) {
      setExpertiseList([...expertiseList, expertiseInput.trim()]);
      setExpertiseInput("");
    }
  };

  const handleSubmit = () => {
    if (!bio) {
      toast.error("Please enter your bio.");
      return;
    }
    if (expertiseList.length === 0) {
      toast.error("Please add at least one expertise area.");
      return;
    }
    onSubmit({
      bio,
      expertise: expertiseList,
      socialLinks: { linkedin: socialLink },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">Become an Instructor</h2>

        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 border rounded mb-4 dark:bg-zinc-800"
          rows={3}
          placeholder="Tell us about yourself..."
        />

        <label className="block text-sm font-medium mb-1">Expertise</label>
        <div className="flex mb-2">
          <input
            type="text"
            value={expertiseInput}
            onChange={(e) => setExpertiseInput(e.target.value)}
            placeholder="e.g., Web Development"
            className="flex-1 p-2 border rounded-l dark:bg-zinc-800"
          />
          <Button onClick={handleAddExpertise} className="rounded-l-none">Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {expertiseList.map((item, idx) => (
            <span
              key={idx}
              className="bg-blue-600 text-white px-2 py-1 rounded text-xs cursor-pointer"
              onClick={() => setExpertiseList(expertiseList.filter((exp) => exp !== item))}
            >
              {item} ✕
            </span>
          ))}
        </div>

        <label className="block text-sm font-medium mb-1">LinkedIn (optional)</label>
        <input
          type="text"
          value={socialLink}
          onChange={(e) => setSocialLink(e.target.value)}
          className="w-full p-2 border rounded mb-4 dark:bg-zinc-800"
          placeholder="https://linkedin.com/in/..."
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </div>
  );
};
