const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/auth.controller')
const validates = require('../../validates/admin/auth.validates')


router.get("/login", controller.login)
router.post("/login", validates.login, controller.loginPost)
router.get("/logout", controller.logout)


module.exports = router
