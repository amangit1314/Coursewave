import { v2 as cloudinaryAdapter } from "cloudinary"

export const cloudinary = cloudinaryAdapter.config({
    //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    cloud_name: 'df2g8tcxq' as string,
    api_key: process.env.CLOUDINARY_API_KEY! as string,
    api_secret: process.env.CLOUDINARY_API_SECRET! as string,
    secure: true,
});

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
