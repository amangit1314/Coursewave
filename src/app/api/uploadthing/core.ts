import { decrypt } from "@/helpers/jwt_helper";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
  const token = cookies().get('token')?.value;

  if (!token) {
    throw new Error('Token is missing ⚠, Login first ...');
  };

  const decryptedToken = await decrypt(token);
  const userId = decryptedToken.id;

  if (!userId) {
    console.log('No userId is provided in uploadthing core ...');
    throw new Error(`TOKEN: ${token}, ERROR: user id not found 🤦‍♂️⚠...`);
  }

  const user = await db.user.findUnique({
    where: {
      id: userId,
    }
  });

  if (!user || !user.isInstructor) {
    console.log('No user found in the uploadthing core ...');
    throw new Error(`ERROR: UNAUTHORIZED, No user found with this ${userId} OR user is not an instructor 🤦‍♂️⚠...`);
  }

  return { userId };
}

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => await handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
  profileImageUpdater: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => await handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url after updating image", file.url);
      return { uploadedBy: metadata.userId };
    }),
  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => { }),
  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => { })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;