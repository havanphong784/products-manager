const express = require('express')
const controller = require("../../controllers/admin/role.controller");
const router = express.Router()
const permissionsMiddleware = require("../../middlewares/admin/permissions.middlewares");

router.get("/", permissionsMiddleware.permissions("roles_view"), controller.index)
router.get("/create", permissionsMiddleware.permissions("roles_create"), controller.create)
router.post("/create", permissionsMiddleware.permissions("roles_create"), controller.createPost)
router.get("/edit/:id", permissionsMiddleware.permissions("roles_edit"), controller.edit)
router.patch("/edit/:id", permissionsMiddleware.permissions("roles_edit"), controller.editPost)
router.patch("/delete/:id", permissionsMiddleware.permissions("roles_delete"), controller.deletePatch)
router.get("/permissions", permissionsMiddleware.permissions("roles_permissions"), controller.permissions)
router.patch("/permissions", permissionsMiddleware.permissions("roles_permissions"), controller.permissionsPatch)

module.exports = router
