
import { Router } from "express";

import {
  getBrands,
  getBrandById,
  createBrand,
  patchBrand,
  deleteBrand
} from "../controllers/brandController.js";

const router = Router();

router.get("/", getBrands);
router.post("/", createBrand);
router.get("/:id", getBrandById);
router.patch("/:id", patchBrand);
router.delete("/:id", deleteBrand);

export default router;
