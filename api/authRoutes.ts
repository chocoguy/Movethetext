import express from 'express'
const authController = require('./controllers/authController')
const router = express.Router()

router.route("/login").post(authController.Login)
router.route("/signup").post(authController.SignUp)
router.route("/auth").get(authController.Authorize)
router.route("/changepass").post(authController.ChangePassword)
router.route("/me").get(authController.GetProfile)
router.route("/delete-account").delete(authController.DeleteAccount)



module.exports = router