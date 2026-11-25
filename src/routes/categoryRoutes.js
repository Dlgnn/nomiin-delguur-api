
import { Router } from "express";

import {
  getCategories,
  getCategoryById,
  createCategory,
  patchCategory
} from "../controllers/categoryController.js";

const router = Router();

router.get("/", getCategories);
router.post("/", createCategory);
router.get("/:id", getCategoryById);
router.patch("/:id", patchCategory);

export default router;
