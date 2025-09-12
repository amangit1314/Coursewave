import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  courseImageUploader: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("File uploaded:", file.url);
    }
  ),

  profileImageUpdater: f({ image: { maxFileSize: "2MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("Profile image uploaded:", file.url);
      // You could update your DB user profile here
      return { url: file.url };
    }
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
