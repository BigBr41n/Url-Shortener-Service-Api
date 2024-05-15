import { Router } from "express";

// Import controllers and middleware as needed
import {
  createShortUrlController,
  redirectController,
  getShortUrlAnalyticsController,
  updateShortUrlController,
  deleteShortUrlController,
  listUserShortUrlsController,
  generateQRCodeController,
} from "../controllers/url.Controllers";

import { checkAuth } from "../middlewares/checkAuth";

// Initialize router
const router = Router();

// Route to create a short URL for a given long URL
router.post("/shorten", checkAuth, createShortUrlController);

// Route to handle requests to a short URL and redirect users to the original long URL
router.get("/redirect/:shortCode", redirectController);

// Route to retrieve analytics data for a specific short URL
router.get("/:shortCode/analytics", checkAuth, getShortUrlAnalyticsController);

// Route to update properties of a short URL
router.patch("/:shortCode/update", checkAuth, updateShortUrlController);

// Route to delete a short URL
router.delete("/:shortCode/delete", checkAuth, deleteShortUrlController);

// Route to retrieve a list of short URLs created by the authenticated user
router.get("/my-short-urls", checkAuth, listUserShortUrlsController);

// Route to generate a QR code for a short URL
router.get("/qr-code", generateQRCodeController);

export default router;
