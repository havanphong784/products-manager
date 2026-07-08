const express = require('express')
const controller = require("../../controllers/admin/accounts.controller");
const middleware = require("../../middlewares/admin/uploadCloud.middlewares");
const multer = require("multer");
const upload = multer();
const router = express.Router()
const validates = require("../../validates/admin/acounts.validates")
const permissionsMiddleware = require("../../middlewares/admin/permissions.middlewares")


router.get("/", permissionsMiddleware.permissions("account_view"), controller.index)
router.get("/create", permissionsMiddleware.permissions("account_create"), controller.create)
router.post("/create",
  permissionsMiddleware.permissions("account_create"),
  upload.single("avatar"),
  middleware.uploadCloud,
  validates.createPost,
  controller.createPost
)
router.get("/edit/:id", permissionsMiddleware.permissions("account_edit"), controller.edit)
router.patch("/edit/:id",
  permissionsMiddleware.permissions("account_edit"),
  upload.single("avatar"),
  middleware.uploadCloud,
  validates.editPatch,
  controller.editPatch
)

module.exports = router