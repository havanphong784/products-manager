const express = require("express");
const multer = require("multer");
// const storageMulter = require("../../helpers/storageMulter");
// const upload = multer({storage: storageMulter()});
const upload = multer();
const router = express.Router();
const controller = require("../../controllers/admin/products.controller");
const validates = require("../../validates/admin/product.validates");
const middleware = require("../../middlewares/admin/uploadCloud.middlewares");
const permissionsMiddleware = require("../../middlewares/admin/permissions.middlewares");

router.get("/", permissionsMiddleware.permissions("product_view"), controller.index);
router.patch("/change-status/:status/:id", permissionsMiddleware.permissions("product_edit"), controller.changeStatus);
router.patch(
  "/change-multi",
  permissionsMiddleware.permissions("product_edit"),
  controller.changeMulti
);
router.delete("/delete/:id", permissionsMiddleware.permissions("product_delete"), controller.deleteItem);
router.get("/create", permissionsMiddleware.permissions("product_create"), controller.create);
router.post(
  "/create",
  permissionsMiddleware.permissions("product_create"),
  upload.single("thumbnail"),
  middleware.uploadCloud,
  validates.createPost,
  controller.createPost,
);
router.get("/edit/:id", permissionsMiddleware.permissions("product_edit"), controller.edit);
router.patch(
  "/edit/:id",
  permissionsMiddleware.permissions("product_edit"),
  upload.single("thumbnail"),
  middleware.uploadCloud,
  validates.createPost,
  controller.editPatch,
);
router.get("/detail/:id", permissionsMiddleware.permissions("product_view"), controller.detail)

module.exports = router;
