
import { Router } from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  patchProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = Router();

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Номын жагсаалтыг хайлт, шүүлт, эрэмбэлэлт болон хуудаслалттай буцаана.
 *     tags:
 *       - Products
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
 *         description: Нэг хуудсанд авах номын тоо
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Номын нэрээр хайх
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Ангиллын ID-аар шүүх
 *       - in: query
 *         name: brandId
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Брэндийн ID-аар шүүх
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Үнийн доод хязгаар
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Үнийн дээд хязгаар
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *         description: Ном байгаа эсэхээр шүүх
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, title, price, publishedYear, createdAt]
 *           default: id
 *         description: Эрэмбэлэх талбар
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Өсөх эсвэл буурах дараалал
 *     responses:
 *       200:
 *         description: Номын жагсаалт амжилттай буцлаа.
 *       400:
 *         description: Query параметрүүд буруу байна.
 */
router.get("/", getProducts);

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Create a product
 *     description: Шинэ ном бүртгэнэ.
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ProductInput"
 * 
 *     responses:
 *       201:
 *         description: Ном амжилттай үүссэн.
 *       400:
 *         description: Оролтын өгөгдөл буруу эсвэл шаардлагатай талбар дутуу.
 *       404:
 *         description: Category эсвэл Brand олдсонгүй.
 *       409:
 *         description: ISBN давхардсан.
 */
router.post("/", createProduct);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: ID-аар нэг номын дэлгэрэнгүй мэдээлэл авна.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Номын ID
 *     responses:
 *       200:
 *         description: Номын мэдээлэл амжилттай буцлаа.
 *       400:
 *         description: ID буруу байна.
 *       404:
 *         description: Ном олдсонгүй.
 */
router.get("/:id", getProductById);

/**
 * @openapi
 * /products/{id}:
 *   patch:
 *     summary: Update product
 *     description: Номын мэдээллийг хэсэгчлэн шинэчилнэ.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Номын ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Backend хөгжүүлэлтийн үндэс
 *               isbn:
 *                 type: string
 *                 example: "9789919000001"
 *               price:
 *                 type: number
 *                 example: 45000
 *               stock:
 *                 type: integer
 *                 example: 10
 *               publishedYear:
 *                 type: integer
 *                 example: 2025
 *               pages:
 *                 type: integer
 *                 example: 320
 *               description:
 *                 type: string
 *                 nullable: true
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               brandId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       200:
 *         description: Ном амжилттай шинэчлэгдсэн.
 *       400:
 *         description: ID эсвэл request body буруу байна.
 *       404:
 *         description: Ном, Category эсвэл Brand олдсонгүй.
 *       409:
 *         description: ISBN давхардсан.
 */
router.patch("/:id", patchProduct);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Delete product
 *     description: Номыг устгана. Түүнтэй холбоотой Review-үүд мөн устгагдана.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Номын ID
 *     responses:
 *       204:
 *         description: Ном амжилттай устгагдсан.
 *       400:
 *         description: ID буруу байна.
 *       404:
 *         description: Ном олдсонгүй.
 */
router.delete("/:id", deleteProduct);

export default router;
