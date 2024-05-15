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

////////////////////////////////
const router = express.Router();

//routes:

router.post("/register", validate(createUserSchema), registerController);
router.post("/login", validate(loginUserSchema), loginController);
router.get("/logout", logoutController);
router.get("/activate", validate(activateAccountSchema), activateAccount);

//TODO:
/* 
router.post("/change-password", checkAuth, changePasswordController);
router.post("/forgot-password", forgotPasswordController);
 */

export default router;
