import express from "express";
import {
  registerController,
  loginController,
  logoutController,
  activateAccount,
} from "../controllers/auth.Controllers";
import validate from "../middlewares/validateResource";
import { createUserSchema } from "../schema/register.schema";
import { loginUserSchema } from "../schema/login.schema";

////////////////////////////////
const router = express.Router();

//routes:

router.post("/register", validate(createUserSchema), registerController);
router.post("/login", validate(loginUserSchema), loginController);
router.get("/logout", logoutController);
router.get("/activate", activateAccount);

//TODO:
/* 
router.post("/change-password", checkAuth, changePasswordController);
router.post("/forgot-password", forgotPasswordController);
 */

export default router;
