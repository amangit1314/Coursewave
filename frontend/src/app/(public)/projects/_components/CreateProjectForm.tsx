import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const CreateProjectForm = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "intermediate",
    tags: "",
    isPublic: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating project:", form);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Project Title
        </label>
        <Input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Enter project title"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe your project"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            required
          >
            <option value="">Select category</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="AI/ML">AI/ML</option>
            <option value="Data Science">Data Science</option>
            <option value="DevOps">DevOps</option>
            <option value="Design">Design</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Difficulty
          </label>
          <select
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tags
        </label>
        <Input
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="Enter tags separated by commas"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={form.isPublic}
          onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
          className="rounded border-gray-300"
        />
        <label
          htmlFor="isPublic"
          className="text-sm text-gray-700 dark:text-gray-300"
        >
          Make project public
        </label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-500 text-white to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          Create Project
        </Button>
      </div>
    </form>
  );
};

export default CreateProjectForm;
