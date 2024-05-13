import express from "express";
import {
  registerController,
  loginController,
  logoutController,
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
//router.post("/api/v1/forgot-password");

export default router;
