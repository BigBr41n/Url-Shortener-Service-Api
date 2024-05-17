import express from "express";
import upload from "../middlewares/upload";
import { checkAuth } from "../middlewares/checkAuth";
import {
  addAvatarController,
  updateController,
  deleteUserController,
  getUserController,
} from "../controllers/user.Controllers";

import { deleteUserSchema } from "../schema/user/deleteUser.schema";
import validate from "../middlewares/validateResource";
import { updateUserSchema } from "../schema/user/updateUser.schema";

////////////////////////////////
//Initialization
const router = express.Router();

//Route to upload an avatar of the account
//PROTECTED ROUTE
router.post(
  "/upload-avatar/:id",
  [checkAuth, upload.single("avatar")],
  addAvatarController
);

//Route to get the user profile
//PROTECTED ROUTE
router.get("/:id", getUserController);

//Route to update the user profile
//PROTECTED ROUTE
router.patch(
  "/update/",
  [validate(updateUserSchema), checkAuth],
  updateController
);

//Route to delete the user account
//PROTECTED ROUTE
router.delete(
  "/delete",
  [validate(deleteUserSchema), checkAuth],
  deleteUserController
);

export default router;
