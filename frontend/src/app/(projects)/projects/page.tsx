"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, PlusCircle, Users } from "lucide-react";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<
    {
      id: number;
      title: string;
      description: string;
      tags: string;
      peers: any[];
    }[]
  >([]);
  const [form, setForm] = useState({ title: "", description: "", tags: "" });
  const [open, setOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateProject = () => {
    if (!form.title.trim()) return;
    const newProject = {
      ...form,
      id: Date.now(),
      peers: [],
    };
    setProjects([newProject, ...projects]);
    setForm({ title: "", description: "", tags: "" });
    setOpen(false); // Close the dialog after creation
  };

  return (
    <div className="max-w-4xl mx-auto pt-30 pb-16" >
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      {/* Floating action button */}
      <div className="fixed bottom-6 right-6">
        <Button 
          onClick={() => setOpen(true)}
          className="rounded-full w-12 h-12 p-2 cursor-pointer hover:bg-blue-600 bg-blue-500 " 
          variant="default"
        >
          <Plus size={20} />
        </Button>
      </div>

      {/* Create Project Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlusCircle size={20} />
              Create New Project
            </DialogTitle>
          </DialogHeader>
            <div className="space-y-4">
            <Input
              name="title"
              placeholder="Project Title"
              value={form.title}
              onChange={handleChange}
              maxLength={100}
            />
            <Textarea
              name="description"
              placeholder="Project Description"
              value={form.description}
              onChange={handleChange}
              maxLength={250}
            />
            <Input
              name="tags"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={handleChange}
            />
            <Button onClick={handleCreateProject} className="bg-blue-500 w-full hover:bg-blue-600 cursor-pointer">Create Project</Button>
            </div>
        </DialogContent>
      </Dialog>

      {/* Project List */}
      <div className="grid grid-cols-2 gap-4 space-y-4">
        {projects.length === 0 ? (
          <p className="text-muted-foreground">
            No projects yet. Click the + button to create one.
          </p>
        ) : (
          projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm text-muted-foreground">
                  {project.description}
                </p>
                <p className="mb-2 text-xs text-zinc-500">
                  Tags: {project.tags || "No tags"}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <Button variant="outline" size="sm">
                    <Users size={16} className="mr-1" />
                    Invite Peers
                  </Button>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600 cursor-pointer">Join Coding Session</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;