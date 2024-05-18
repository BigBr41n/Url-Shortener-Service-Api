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

import { checkAuth } from "../middlewares/checkAuth";
import { changePasswordController } from "../controllers/auth.Controllers";
import { changePassSchema } from "../schema/auth/changePassword.schema";

////////////////////////////////
// Initialize router
const router = express.Router();

//Route to register and create user new account
router.post("/register", validate(createUserSchema), registerController);

//Route to login to the  activated account
router.post("/login", validate(loginUserSchema), loginController);

//Route to logout from the account
router.get("/logout", logoutController);

//Route to activate the account after register and get the activation email
router.get("/activate", validate(activateAccountSchema), activateAccount);

//Route to reset the password
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPasswordController
);

router.post(
  "/change-password",
  [validate(changePassSchema), checkAuth],
  changePasswordController
);

export default router;
