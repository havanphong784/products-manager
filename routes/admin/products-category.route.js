const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();
const controller = require("../../controllers/admin/products-category.controller");
const middleware = require("../../middlewares/admin/uploadCloud.middlewares");
const validates = require("../../validates/admin/products-category.validates");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create",
  upload.single("thumbnail"),
  middleware.uploadCloud,
  validates.createPost,
  controller.createPost
);
router.get("/edit/:id", controller.edit)
router.patch("/edit/:id",
  upload.single("thumbnail"),
  middleware.uploadCloud,
  validates.createPost,
  controller.editPatch
)

module.exports = router;

