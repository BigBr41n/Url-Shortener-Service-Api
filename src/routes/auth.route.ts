import express from "express";
import {
  registerController,
  loginController,
  logoutController,
  activateAccount,
} from "../controllers/auth.Controllers";
import validate from "../middlewares/validateResource";
import { createUserSchema } from "../schema/auth/register.schema";
import { loginUserSchema } from "../schema/auth/login.schema";
import { activateAccountSchema } from "../schema/auth/activateAccount.schema";
import { forgotPasswordController } from "../controllers/user.Controllers";
import { forgotPasswordSchema } from "../schema/auth/forgotPassword.schema";

////////////////////////////////
const router = express.Router();

//routes:

router.post("/register", validate(createUserSchema), registerController);
router.post("/login", validate(loginUserSchema), loginController);
router.get("/logout", logoutController);
router.get("/activate", validate(activateAccountSchema), activateAccount);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPasswordController
);

//TODO:
/* 
router.post("/change-password", checkAuth, changePasswordController);

 */

export default router;
