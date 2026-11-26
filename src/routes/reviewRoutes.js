
import { Router } from "express";

import {
  getReviews,
  getReviewById,
  createReview,
  patchReview,
  deleteReview
} from "../controllers/reviewController.js";

const router = Router();

/**
 * @openapi
 * /reviews:
 *   get:
 *     summary: Бүх сэтгэгдэл авах
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Хуудасны дугаар
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Нэг хуудсанд харагдах сэтгэгдлийн тоо
 *     responses:
 *       200:
 *         description: Сэтгэгдлүүд амжилттай буцлаа.
 *       400:
 *         description: Page эсвэл limit параметр буруу.
 */

/**
 * @openapi
 * /reviews:
 *   post:
 *     summary: Шинэ сэтгэгдэл бүртгэх
 *     tags:
 *       - Reviews
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - authorName
 *               - productId
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 nullable: true
 *                 example: Маш сонирхолтой ном байна.
 *               authorName:
 *                 type: string
 *                 example: Бат
 *               productId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Сэтгэгдэл амжилттай үүссэн.
 *       400:
 *         description: Оролтын өгөгдөл буруу.
 *       404:
 *         description: Product олдсонгүй.
 *       409:
 *         description: Давхардсан сэтгэгдэл.
 */

/**
 * @openapi
 * /reviews/{id}:
 *   get:
 *     summary: ID-аар сэтгэгдэл авах
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Сэтгэгдлийн ID
 *     responses:
 *       200:
 *         description: Сэтгэгдэл амжилттай олдсон.
 *       400:
 *         description: ID буруу байна.
 *       404:
 *         description: Сэтгэгдэл олдсонгүй.
 */

/**
 * @openapi
 * /reviews/{id}:
 *   patch:
 *     summary: Сэтгэгдэл шинэчлэх
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Сэтгэгдлийн ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 nullable: true
 *                 example: Сэтгэгдлээ шинэчиллээ.
 *               authorName:
 *                 type: string
 *                 example: Бат
 *     responses:
 *       200:
 *         description: Сэтгэгдэл амжилттай шинэчлэгдсэн.
 *       400:
 *         description: Оролтын өгөгдөл буруу.
 *       404:
 *         description: Сэтгэгдэл олдсонгүй.
 *       409:
 *         description: Давхардсан сэтгэгдэл.
 */

/**
 * @openapi
 * /reviews/{id}:
 *   delete:
 *     summary: Сэтгэгдэл устгах
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Сэтгэгдлийн ID
 *     responses:
 *       204:
 *         description: Сэтгэгдэл амжилттай устсан.
 *       400:
 *         description: ID буруу байна.
 *       404:
 *         description: Сэтгэгдэл олдсонгүй.
 */

router.get("/", getReviews);
router.post("/", createReview);
router.get("/:id", getReviewById);
router.patch("/:id", patchReview);
router.delete("/:id", deleteReview);

export default router;
