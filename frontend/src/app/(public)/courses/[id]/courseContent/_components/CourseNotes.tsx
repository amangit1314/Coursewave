
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { FaNoteSticky } from "react-icons/fa6";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";

export default function CourseNotes() {
  const [notes, setNotes] = React.useState([
    "What is Full Stack",
    "Node.js Installation Steps",
  ]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Notes
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Add Note">
              <IoMdAddCircleOutline size={22} className="text-blue-500" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a Note</DialogTitle>
              <DialogDescription>
                Write down something useful from this class.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Note title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea id="note" placeholder="Write your note here..." />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Notes help you remember key learnings.
      </p>

      <ScrollArea className="max-h-[20rem] rounded-md border p-4 shadow-sm dark:border-zinc-700">
        <ul className="space-y-3">
          {notes.map((note, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded-md border px-2 py-2 text-sm shadow-sm transition hover:border-blue-500 dark:border-zinc-700 dark:hover:border-blue-400"
            >
              <div className="flex items-center space-x-3">
                <FaNoteSticky className="text-blue-500" />
                <span className="truncate text-gray-800 dark:text-gray-200">
                  {note}
                </span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Edit Note">
                    <MdModeEditOutline
                      className="text-gray-600 hover:text-blue-500 dark:text-gray-300"
                      size={20}
                    />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Note</DialogTitle>
                    <DialogDescription>
                      Make changes and save your updated note.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 pb-4">
                    {/*
                      We use local state to prefill the input and textarea with the note content.
                      On save, we clear the state.
                    */}
                    {(() => {
                      const [editTitle, setEditTitle] = React.useState(note);
                      const [editNote, setEditNote] = React.useState(note);

                      // To clear on save, we need to intercept the submit.
                      // We'll wrap the DialogFooter Button in a form and handle submit.
                      // For this snippet, assume the parent is not already a form.

                      // To avoid duplicate state for every note, you may want to lift this up if you have many notes.
                      // For this rewrite, we keep it local for clarity.

                      return (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            // Here you would save the changes, e.g. call a prop or context
                            setEditTitle("");
                            setEditNote("");
                            // Optionally close the dialog, if you have access to a close function
                          }}
                        >
                          <div className="space-y-2">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                              id="edit-title"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-note">Note</Label>
                            <Textarea
                              id="edit-note"
                              value={editNote}
                              onChange={(e) => setEditNote(e.target.value)}
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              type="submit"
                              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </form>
                      );
                    })()}
                  </div>
                  {/* <DialogFooter>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Save Changes
                    </Button>
                  </DialogFooter> */}
                </DialogContent>
              </Dialog>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
