"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController = require('./controllers/authController');
const router = express_1.default.Router();
router.route("/login").post(authController.Login);
router.route("/signup").post(authController.SignUp);
router.route("/logout").post(authController.Logout);
router.route("/auth").get(authController.Authorize);
router.route("/changepass").post(authController.ChangePassword);
router.route("/me").get(authController.GetProfile);
router.route("/delete-account").delete(authController.DeleteAccount);
module.exports = router;
