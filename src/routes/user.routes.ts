import express from "express";
import upload from "../middlewares/upload";
import { checkAuth } from "../middlewares/checkAuth";
import {
  addAvatarController,
  updateController,
  deleteUser,
} from "../controllers/user.Controllers";

////////////////////////////////
const router = express.Router();

router.post(
  "/upload-avatar/:id",
  [checkAuth, upload.single("avatar")],
  addAvatarController
);
router.patch("/update/", checkAuth, updateController);
router.delete("/delete", checkAuth, deleteUser);

export default router;
