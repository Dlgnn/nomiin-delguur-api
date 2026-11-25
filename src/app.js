
import express from "express";
import dotenv from "dotenv";

import { logger } from "./middleware/logger.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

import categoryRoutes from "./routes/categoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(logger);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

// API Routes
app.use("/categories", categoryRoutes);
app.use("/brands", brandRoutes);
app.use("/products", productRoutes);

// 404
app.use(notFound);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
