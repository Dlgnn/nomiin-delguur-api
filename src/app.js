
import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

import { logger } from "./middleware/logger.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

import categoryRoutes from "./routes/categoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

import swaggerSpec from "./swagger.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(logger);

// Swagger Documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/**
 * @openapi
 * /health:
 *   get:
 *     summary: Серверийн ажиллагаа шалгах
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Сервер хэвийн ажиллаж байна.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});


// API Routes
app.use("/categories", categoryRoutes);
app.use("/brands", brandRoutes);
app.use("/products", productRoutes);
app.use("/reviews", reviewRoutes);

// 404
app.use(notFound);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
