import express from "express";

////////////////////////////////
const router = express.Router();

//routes:

// name   : register
// method : POST
// route  : api/v1/register
// status  : UNPROTECTED

router.post("/api/v1/register");
router.post("/api/v1/login");
router.post("/api/v1/logout");
router.post("/api/v1/forgot-password");

export default router;
