const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();
const controller = require("../../controllers/admin/products-category.controller");
const middleware = require("../../middlewares/admin/uploadCloud.middlewares");
const validates = require("../../validates/admin/products-category.validates");
const permissionsMiddleware = require("../../middlewares/admin/permissions.middlewares");

router.get("/", controller.index);
router.get("/create", permissionsMiddleware.permissions("product-category_create"), controller.create);
router.post("/create",
  permissionsMiddleware.permissions("product-category_create"),
  upload.single("thumbnail"),
  middleware.uploadCloud,
  validates.createPost,
  controller.createPost
);
router.get("/edit/:id", permissionsMiddleware.permissions("product-category_edit"), controller.edit)
router.patch("/edit/:id",
  permissionsMiddleware.permissions("product-category_edit"),
  upload.single("thumbnail"),
  middleware.uploadCloud,
  validates.createPost,
  controller.editPatch
)

module.exports = router;

