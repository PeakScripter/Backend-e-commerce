import express from "express";
const router = express.Router();
import {registerUser, loginUser, logout, forgotPassword, resetPassword, getUserdetails, updateUserPassword } from "../controllers/userController.mjs";
import {isAuthenticatedUser} from "../middleware/auth.mjs";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getUserdetails);
router.route("/password/update").put(isAuthenticatedUser, updateUserPassword);
export default router;