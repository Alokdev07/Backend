import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFileOnCloudinary = async (localFilePath) => {
  try {
    if(!localFilePath) return null;
    //file upload in cloudinary
   const response = await cloudinary.uploader.upload(localFilePath,{
        resource_type : "auto"
    })
    //file successfully uploaded
    console.log("file upload successfully",response.url)
    fs.unlinkSync(localFilePath)
    return response
  } catch (error) {
    fs.unlinkSync(localFilePath) // remove the localfile path from the local saved temporary path when operation got failed
    return null
  }
}

export {uploadFileOnCloudinary} 
