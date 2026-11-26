
import { Router } from "express";

import {
  getReviews,
  getReviewById,
  createReview,
  patchReview,
  deleteReview
} from "../controllers/reviewController.js";

const router = Router();

router.get("/", getReviews);
router.post("/", createReview);
router.get("/:id", getReviewById);
router.patch("/:id", patchReview);
router.delete("/:id", deleteReview);

export default router;
