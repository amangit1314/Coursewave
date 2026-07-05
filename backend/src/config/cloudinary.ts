import { v2 as cloudinary } from "cloudinary";
import { env, features } from "./config";

if (features.cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<{ secure_url: string; resource_type: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload returned no result"));
          return;
        }
        resolve({ secure_url: result.secure_url, resource_type: result.resource_type });
      }
    );
    stream.end(buffer);
  });
}
