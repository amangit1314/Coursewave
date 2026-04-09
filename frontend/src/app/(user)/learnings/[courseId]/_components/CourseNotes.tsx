"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@tremor/react";
import { FaNoteSticky } from "react-icons/fa6";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdModeEditOutline, MdDeleteOutline } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

const CourseNotes = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "What is Full Stack",
      content: "Understanding full stack development concepts",
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Node.js Installation Steps",
      content: "Step by step guide to install Node.js",
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: "3",
      title: "React Hooks Overview",
      content: "Important React hooks and their usage",
      createdAt: new Date(Date.now() - 172800000),
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  const handleAddNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title,
        content: newNote.content,
        createdAt: new Date(),
      };
      setNotes((prev) => [note, ...prev]);
      setNewNote({ title: "", content: "" });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditNote = () => {
    if (editingNote && editingNote.title.trim() && editingNote.content.trim()) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNote.id
            ? { ...editingNote, createdAt: new Date() }
            : note
        )
      );
      setEditingNote(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day"
    );
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-700/50 dark:bg-zinc-900/80">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-green-50 p-2 dark:bg-green-900/20">
            <FaNoteSticky className="text-lg text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Your Notes
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {notes.length} note{notes.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <button className="group rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 p-2 shadow-sm transition-all hover:shadow-md hover:shadow-green-500/25">
              <IoMdAddCircleOutline className="text-lg text-white transition-transform group-hover:scale-110" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">
                Create New Note
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Add a note to remember important points from this course.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-3">
                <Label
                  htmlFor="title"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Note title..."
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="border-gray-200 dark:border-zinc-600"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="content"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Content
                </Label>
                <Textarea
                  id="content"
                  placeholder="Write your note here..."
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote((prev) => ({ ...prev, content: e.target.value }))
                  }
                  className="min-h-[120px] border-gray-200 dark:border-zinc-600"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddNote}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm transition-all hover:shadow-md hover:shadow-green-500/25"
              >
                Create Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        <AnimatePresence>
          {notes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <div className="group relative rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-green-200 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-green-800/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate font-medium text-gray-900 dark:text-gray-100">
                      {note.title}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {note.content}
                    </p>
                    <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                      {formatDate(note.createdAt)}
                    </p>
                  </div>

                  <div className="ml-4 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <button
                          onClick={() => setEditingNote(note)}
                          className="rounded-lg p-2 text-gray-400 transition-all hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                        >
                          <MdModeEditOutline className="text-lg" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle className="text-gray-900 dark:text-gray-100">
                            Edit Note
                          </DialogTitle>
                          <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Make changes to your note.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-3">
                            <Label
                              htmlFor="edit-title"
                              className="text-gray-700 dark:text-gray-300"
                            >
                              Title
                            </Label>
                            <Input
                              id="edit-title"
                              value={editingNote?.title || ""}
                              onChange={(e) =>
                                setEditingNote((prev) =>
                                  prev
                                    ? { ...prev, title: e.target.value }
                                    : null
                                )
                              }
                              className="border-gray-200 dark:border-zinc-600"
                            />
                          </div>
                          <div className="space-y-3">
                            <Label
                              htmlFor="edit-content"
                              className="text-gray-700 dark:text-gray-300"
                            >
                              Content
                            </Label>
                            <Textarea
                              id="edit-content"
                              value={editingNote?.content || ""}
                              onChange={(e) =>
                                setEditingNote((prev) =>
                                  prev
                                    ? { ...prev, content: e.target.value }
                                    : null
                                )
                              }
                              className="min-h-[120px] border-gray-200 dark:border-zinc-600"
                            />
                          </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                          <Button
                            variant="secondary"
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <MdDeleteOutline className="mr-2" />
                            Delete
                          </Button>
                          <Button
                            onClick={handleEditNote}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm hover:shadow-md hover:shadow-green-500/25"
                          >
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {notes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-12 text-center"
        >
          <div className="mx-auto mb-4 rounded-full bg-gray-100 p-4 dark:bg-zinc-800 w-fit">
            <FaNoteSticky className="text-3xl text-gray-400 dark:text-gray-500" />
          </div>
          <h4 className="mb-2 font-medium text-gray-600 dark:text-gray-400">
            No notes yet
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Add your first note to capture important insights
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CourseNotes;
