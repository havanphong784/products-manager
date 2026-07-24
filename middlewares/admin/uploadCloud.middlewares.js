const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const uploadToCloud = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      (error, result) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadMultiple = async (files) => {
  const uploadPromises = files.map(file => {
    const buffer = Buffer.isBuffer(file) ? file : file.buffer;
    return uploadToCloud(buffer);
  });
  return Promise.all(uploadPromises);
};

module.exports.upLoad = uploadToCloud;
module.exports.uploadMultiple = uploadMultiple;

module.exports.uploadCloud = async (req, res, next) => {
  if (req.file) {
    try {
      const secureUrl = await uploadToCloud(req.file.buffer);
      req.body[req.file.fieldname] = secureUrl;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
};

module.exports.uploadMultipleCloud = async (req, res, next) => {
  if (req.files) {
    try {
      if (Array.isArray(req.files)) {
        const urls = await uploadMultiple(req.files);
        if (req.files.length > 0) {
          const fieldname = req.files[0].fieldname;
          req.body[fieldname] = urls;
        }
      } else {
        for (const key in req.files) {
          const urls = await uploadMultiple(req.files[key]);
          req.body[key] = urls;
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
};