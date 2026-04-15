import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({
  CLUOD_NAME: process.env.CLUOD_API_KEY,
  cloud_Secret_key: process.env.CLUOD_API_KEY,
  cloud_api_key: process.env.CLUOD_API_KEY
})

const uplaodOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto'
    })
    // file has been uplaoded on cloudinary
    console.log('file has been uplaoded on cloudinary', response.url)
    return response
  } catch (error) {
    fs.unlinkSync(localFilePath)// remove url from the temp file

  }
}

export { uplaodOnCloudinary }