
import { Router } from "express";

import {
  getCategories,
  getCategoryById,
  createCategory,
  patchCategory,
  deleteCategory
} from "../controllers/categoryController.js";

const router = Router();

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Get all categories
 *     description: Ангиллуудын жагсаалтыг хуудаслалттай буцаана.
 *     tags:
 *       - Categories
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
 *         description: Нэг хуудсанд авах ангиллын тоо
 *     responses:
 *       200:
 *         description: Ангиллын жагсаалт амжилттай буцлаа.
 *       400:
 *         description: Page эсвэл limit буруу байна.
 */
router.get("/", getCategories);

/**
 * @openapi
 * /categories:
 *   post:
 *     summary: Create a category
 *     description: Шинэ ангилал үүсгэнэ.
 *     tags:
 *       - Categories
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
 *                 example: Программчлал
 *     responses:
 *       201:
 *         description: Ангилал амжилттай үүссэн.
 *       400:
 *         description: Оролтын өгөгдөл буруу эсвэл шаардлагатай талбар дутуу.
 *       409:
 *         description: Ижил нэртэй ангилал бүртгэлтэй байна.
 */
router.post("/", createCategory);

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     description: ID-аар нэг ангиллын мэдээллийг авна.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ангиллын ID
 *     responses:
 *       200:
 *         description: Ангиллын мэдээлэл амжилттай буцлаа.
 *       400:
 *         description: ID буруу байна.
 *       404:
 *         description: Ангилал олдсонгүй.
 */
router.get("/:id", getCategoryById);

/**
 * @openapi
 * /categories/{id}:
 *   patch:
 *     summary: Update category
 *     description: Ангиллын нэрийг хэсэгчлэн шинэчилнэ.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ангиллын ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Программчлалын ном
 *     responses:
 *       200:
 *         description: Ангилал амжилттай шинэчлэгдсэн.
 *       400:
 *         description: ID эсвэл request body буруу байна.
 *       404:
 *         description: Ангилал олдсонгүй.
 *       409:
 *         description: Ижил нэртэй ангилал байна.
 */
router.patch("/:id", patchCategory);

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     summary: Delete category
 *     description: Бүтээгдэхүүнтэй холбоогүй ангиллыг устгана.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ангиллын ID
 *     responses:
 *       204:
 *         description: Ангилал амжилттай устгагдсан.
 *       400:
 *         description: ID буруу байна.
 *       404:
 *         description: Ангилал олдсонгүй.
 *       409:
 *         description: Энэ ангилалд бүтээгдэхүүн байгаа тул устгах боломжгүй.
 */
router.delete("/:id", deleteCategory);

export default router;
