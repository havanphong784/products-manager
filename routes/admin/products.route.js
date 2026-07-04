const express = require("express");
const multer = require("multer");
// const storageMulter = require("../../helpers/storageMulter");
// const upload = multer({storage: storageMulter()});
const upload = multer();
const router = express.Router();
const controller = require("../../controllers/admin/products.controller");
const validates = require("../../validates/admin/product.validates");
const middleware = require("../../middlewares/admin/uploadCloud.middlewares");

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.create);
router.post(
    "/create",
    upload.single("thumbnail"),
    middleware.uploadCloud,
    validates.createPost,
    controller.createPost,
);
router.get("/edit/:id", controller.edit);
router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    middleware.uploadCloud,
    validates.createPost,
    controller.editPatch,
);
router.get("/detail/:id", controller.detail)

module.exports = router;
