
import { Router } from "express";

import {
  getBrands,
  getBrandById,
  createBrand,
  patchBrand,
  deleteBrand
} from "../controllers/brandController.js";

const router = Router();

/**
 * @openapi
 * /brands:
 *   get:
 *     summary: Get all brands
 *     description: Брэндүүдийн жагсаалтыг хуудаслалттай буцаана.
 *     tags:
 *       - Brands
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Хуудасны дугаар
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Нэг хуудсанд авах брэндийн тоо
 *     responses:
 *       200:
 *         description: Брэндүүдийн жагсаалт амжилттай буцлаа.
 *       400:
 *         description: Page эсвэл limit буруу байна.
 */
router.get("/", getBrands);

/**
 * @openapi
 * /brands:
 *   post:
 *     summary: Create a brand
 *     description: Шинэ брэнд үүсгэнэ.
 *     tags:
 *       - Brands
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Монсудар
 *               country:
 *                 type: string
 *                 nullable: true
 *                 example: Монгол
 *     responses:
 *       201:
 *         description: Брэнд амжилттай үүссэн.
 *       400:
 *         description: Оролтын өгөгдөл буруу эсвэл шаардлагатай талбар дутуу.
 *       409:
 *         description: Ижил нэртэй брэнд бүртгэлтэй байна.
 */
router.post("/", createBrand);

/**
 * @openapi
 * /brands/{id}:
 *   get:
 *     summary: Get brand by ID
 *     description: ID-аар нэг брэндийн мэдээллийг авна.
 *     tags:
 *       - Brands
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Брэндийн ID
 *     responses:
 *       200:
 *         description: Брэндийн мэдээлэл амжилттай буцлаа.
 *       400:
 *         description: ID буруу байна.
 *       404:
 *         description: Брэнд олдсонгүй.
 */
router.get("/:id", getBrandById);

/**
 * @openapi
 * /brands/{id}:
 *   patch:
 *     summary: Update brand
 *     description: Брэндийн мэдээллийг хэсэгчлэн шинэчилнэ.
 *     tags:
 *       - Brands
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Брэндийн ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Монсудар хэвлэл
 *               country:
 *                 type: string
 *                 nullable: true
 *                 example: Монгол
 *     responses:
 *       200:
 *         description: Брэнд амжилттай шинэчлэгдсэн.
 *       400:
 *         description: ID эсвэл request body буруу байна.
 *       404:
 *         description: Брэнд олдсонгүй.
 *       409:
 *         description: Ижил нэртэй брэнд байна.
 */
router.patch("/:id", patchBrand);

/**
 * @openapi
 * /brands/{id}:
 *   delete:
 *     summary: Delete brand
 *     description: Брэндийг устгана. Түүнтэй холбоотой Product-ийн brandId null болно.
 *     tags:
 *       - Brands
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Брэндийн ID
 *     responses:
 *       204:
 *         description: Брэнд амжилттай устгагдсан.
 *       400:
 *         description: ID буруу байна.
 *       404:
 *         description: Брэнд олдсонгүй.
 */
router.delete("/:id", deleteBrand);

export default router;
