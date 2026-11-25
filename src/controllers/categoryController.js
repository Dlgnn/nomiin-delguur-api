
import prisma from "../db.js";

// GET /categories
export const getCategories = async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 50
    ) {
      return res.status(400).json({
        message: "Invalid page or limit."
      });
    }

    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        skip,
        take: limit,
        orderBy: { id: "asc" },
        include: {
          _count: {
            select: { products: true }
          }
        }
      }),
      prisma.category.count()
    ]);

    res.status(200).json({
      data: categories,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /categories/:id
export const getCategoryById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid category ID."
      });
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found."
      });
    }

    res.status(200).json({
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// POST /categories
export const createCategory = async (req, res, next) => {
  try {
    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        message: "Invalid request body."
      });
    }

    const allowedFields = ["name"];

    const unknownFields = Object.keys(req.body).filter(
      (key) => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
      return res.status(400).json({
        message: "Unknown field in request body."
      });
    }

    const name = req.body.name;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Name is required.",
        field: "name"
      });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim()
      }
    });

    res.status(201).json({
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /categories/:id
export const patchCategory = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid category ID."
      });
    }

    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        message: "Invalid request body."
      });
    }

    const allowedFields = ["name"];
    const fields = Object.keys(req.body);

    const unknownFields = fields.filter(
      (key) => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
      return res.status(400).json({
        message: "Unknown field in request body."
      });
    }

    if (fields.length === 0) {
      return res.status(400).json({
        message: "At least one field is required."
      });
    }

    const name = req.body.name;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Name must be a non-empty string.",
        field: "name"
      });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found."
      });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim()
      }
    });

    res.status(200).json({
      data: updatedCategory
    });
  } catch (error) {
    next(error);
  }
};
