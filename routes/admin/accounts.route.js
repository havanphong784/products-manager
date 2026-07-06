const express = require('express')
const controller = require("../../controllers/admin/accounts.controller");
const middleware = require("../../middlewares/admin/uploadCloud.middlewares");
const multer = require("multer");
const upload = multer();
const router = express.Router()
const validates = require("../../validates/admin/acounts.validates")


router.get("/", controller.index)
router.get("/create", controller.create)
router.post("/create",
  upload.single("thumbnail"),
  middleware.uploadCloud,
  validates.createPost,
  controller.createPost
)

module.exports = router