const express = require('express')
const controller = require("../../controllers/admin/roles.controller");
const router = express.Router()

router.get("/", controller.index)
router.get("/create", controller.create)
router.post("/create", controller.createPost)
router.get("/edit/:id", controller.edit)
router.patch("/edit/:id", controller.editPost)

module.exports = router