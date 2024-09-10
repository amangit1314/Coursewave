import { v2 as cloudinaryAdapter } from "cloudinary";

export const cloudinary = cloudinaryAdapter.config({
  cloud_name: process.env.CLODINARY_CLOUD_NAME! as string,
  api_key: process.env.CLOUDINARY_API_KEY! as string,
  api_secret: process.env.CLOUDINARY_API_SECRET! as string,
  secure: true,
});

// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
//   api_key: process.env.CLOUDINARY_API_KEY!,
//   api_secret: process.env.CLOUDINARY_API_SECRET!,
//   secure: true,
// });

// export default cloudinary;
