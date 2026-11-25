
import { Router } from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  patchProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.get("/:id", getProductById);
router.patch("/:id", patchProduct);
router.delete("/:id", deleteProduct);

export default router;
