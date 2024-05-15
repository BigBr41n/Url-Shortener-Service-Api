import express from "express";
import upload from "../middlewares/upload";
import { checkAuth } from "../middlewares/checkAuth";
import {
  addAvatarController,
  updateController,
  deleteUserController,
  getUserController,
} from "../controllers/user.Controllers";

////////////////////////////////
const router = express.Router();

router.post(
  "/upload-avatar/:id",
  [checkAuth, upload.single("avatar")],
  addAvatarController
);
router.get("/:id", getUserController);
router.patch("/update/", checkAuth, updateController);
router.delete("/delete", checkAuth, deleteUserController);

//TODO :
/*
router.get("/analytics", checkAuth, analyticsController);
*/

export default router;
