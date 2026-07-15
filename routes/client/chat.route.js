const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024 // Giới hạn 10MB cho mỗi ảnh
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file định dạng hình ảnh!'), false);
    }
  }
});

const controller = require('../../controllers/client/chat.controller');
const uploadCloud = require('../../middlewares/admin/uploadCloud.middlewares');

router.get('/', controller.index);

router.post('/upload', upload.array('images', 10), uploadCloud.uploadMultipleCloud, controller.uploadImages);

module.exports = router;
