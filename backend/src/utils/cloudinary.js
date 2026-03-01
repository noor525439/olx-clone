const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer - Image buffer from multer
 * @param {string} mimetype - e.g. 'image/jpeg'
 * @param {string} folder - Cloudinary folder (e.g. 'olx-avatars')
 * @returns {Promise<{ url: string, publicId: string }>}
 */
async function uploadImage(buffer, mimetype, folder = 'olx-avatars') {
  return new Promise((resolve, reject) => {
    const base64 = `data:${mimetype};base64,${buffer.toString('base64')}`;
    cloudinary.uploader.upload(base64, {
      folder,
      resource_type: 'image',
      transformation: [{ width: 400, height: 400, crop: 'fill' }],
    }, (err, result) => {
      if (err) return reject(err);
      resolve({ url: result.secure_url, publicId: result.public_id });
    });
  });
}

/**
 * Delete image from Cloudinary by public_id
 */
async function deleteImage(publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

module.exports = { cloudinary, uploadImage, deleteImage };
