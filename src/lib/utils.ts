import fs from "fs"
import { twMerge } from "tailwind-merge"
import { type ClassValue, clsx } from "clsx"
// import { v2 as cloudinary } from "cloudinary"

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const uploadOnCloudinary = async (localFilePath: any) => {
//   try {
//     if (!localFilePath) return null
//     //upload the file on cloudinary
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto"
//     })
//     // file has been uploaded successfull
//     console.log("file is uploaded on cloudinary ", response.url);
//     fs.unlinkSync(localFilePath)
//     return response;

//   } catch (error) {
//     fs.unlinkSync(localFilePath)
//     // remove the locally saved temporary file as the upload operation got failed
//     return null;
//   }
// }

// export { uploadOnCloudinary }

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function formatNumber(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}