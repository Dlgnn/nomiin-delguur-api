
import { Router } from "express";

import {
  getCategories,
  getCategoryById,
  createCategory,
  patchCategory,
  deleteCategory
} from "../controllers/categoryController.js";

const router = Router();

router.get("/", getCategories);
router.post("/", createCategory);
router.get("/:id", getCategoryById);
router.patch("/:id", patchCategory);
router.delete("/:id", deleteCategory);

export default router;
