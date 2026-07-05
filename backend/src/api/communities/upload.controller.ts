import { Request, Response } from "express";
import multer from "multer";
import { asyncHandler, sendSuccess, AppError } from "../../core/middleware";
import { prisma } from "../../config/prisma";
import { uploadBufferToCloudinary } from "../../config/cloudinary";
import { features } from "../../config/config";

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/zip",
]);

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new AppError(`Unsupported file type: ${file.mimetype}`, 400));
      return;
    }
    cb(null, true);
  },
}).single("file");

function formatSize(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export const uploadCommunityAttachment = asyncHandler(
  async (req: Request, res: Response) => {
    if (!features.cloudinaryEnabled) {
      throw new AppError(
        "File uploads are not configured on this server.",
        503
      );
    }

    const { communityId } = req.params;
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", 401);

    const isMember = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId, communityId } },
    });
    if (!isMember) {
      throw new AppError("Access denied. You are not a member of this community.", 403);
    }

    const file = req.file;
    if (!file) throw new AppError("No file uploaded", 400);

    const { secure_url, resource_type } = await uploadBufferToCloudinary(
      file.buffer,
      `communities/${communityId}`
    );

    sendSuccess(
      res,
      {
        type: resource_type === "image" ? "image" : "file",
        url: secure_url,
        name: file.originalname,
        size: formatSize(file.size),
      },
      "File uploaded successfully",
      201
    );
  }
);
