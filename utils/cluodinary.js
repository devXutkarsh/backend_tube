import cloudinary from 'cloudinary'
import fs from 'fs'


// Configuration
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.CLUOD_API_KEY,
  api_secret: process.env.CLUOD_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uplaodOnCluodinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    // file has upload sccesssfully 
    console.log("file uplaod on cluodinary", response.url)
    return response;

  } catch (error) {
    fs.unlinkSync(localFilePath) // file removed
  }
}



const uploadResult = await cloudinary.uploader
  .upload(
    'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
    public_id: 'shoes',
  }
  )
  .catch((error) => {
    console.log(error);
  });