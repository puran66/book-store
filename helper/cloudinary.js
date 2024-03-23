const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dngagi706', 
  api_key: '866592987543789', 
  api_secret: 'okNg-7JY4VCXjIWw_b6Cm0Jn-M8' 
});

const  imageUpload =async (filePath) =>{
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return result;
  } catch (error) {
    console.log(error);
  }
}

module.exports = imageUpload;