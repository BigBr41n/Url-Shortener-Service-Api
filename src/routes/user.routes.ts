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
const router = express.Router();

router.post(
  "/upload-avatar/:id",
  [checkAuth, upload.single("avatar")],
  addAvatarController
);
router.get("/:id", getUserController);
router.patch(
  "/update/",
  [validate(updateUserSchema), checkAuth],
  updateController
);
router.delete(
  "/delete",
  [validate(deleteUserSchema), checkAuth],
  deleteUserController
);

export default router;
