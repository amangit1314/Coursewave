import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  courseImageUploader: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("File uploaded:", file.url);
    }
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
