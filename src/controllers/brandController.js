
import prisma from "../db.js";

// GET /brands
export const getBrands = async (req, res, next) => {
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

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        skip,
        take: limit,
        orderBy: { id: "asc" },
        include: {
          _count: {
            select: { products: true }
          }
        }
      }),
      prisma.brand.count()
    ]);

    res.status(200).json({
      data: brands,
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

// GET /brands/:id
export const getBrandById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid brand ID."
      });
    }

    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!brand) {
      return res.status(404).json({
        message: "Brand not found."
      });
    }

    res.status(200).json({
      data: brand
    });
  } catch (error) {
    next(error);
  }
};

// POST /brands
export const createBrand = async (req, res, next) => {
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

    const allowedFields = ["name", "country"];

    const unknownFields = Object.keys(req.body).filter(
      (key) => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
      return res.status(400).json({
        message: "Unknown field in request body."
      });
    }

    const { name, country } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Name is required.",
        field: "name"
      });
    }

    if (
      country !== undefined &&
      country !== null &&
      (typeof country !== "string" || !country.trim())
    ) {
      return res.status(400).json({
        message: "Country must be a non-empty string or null.",
        field: "country"
      });
    }

    const brand = await prisma.brand.create({
      data: {
        name: name.trim(),
        country: country === undefined || country === null
          ? null
          : country.trim()
      }
    });

    res.status(201).json({
      data: brand
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /brands/:id
export const patchBrand = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid brand ID."
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

    const allowedFields = ["name", "country"];
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

    const data = {};

    if (Object.hasOwn(req.body, "name")) {
      if (
        typeof req.body.name !== "string" ||
        !req.body.name.trim()
      ) {
        return res.status(400).json({
          message: "Name must be a non-empty string.",
          field: "name"
        });
      }

      data.name = req.body.name.trim();
    }

    if (Object.hasOwn(req.body, "country")) {
      const country = req.body.country;

      if (
        country !== null &&
        (typeof country !== "string" || !country.trim())
      ) {
        return res.status(400).json({
          message: "Country must be a non-empty string or null.",
          field: "country"
        });
      }

      data.country = country === null ? null : country.trim();
    }

    const existingBrand = await prisma.brand.findUnique({
      where: { id }
    });

    if (!existingBrand) {
      return res.status(404).json({
        message: "Brand not found."
      });
    }

    const updatedBrand = await prisma.brand.update({
      where: { id },
      data
    });

    res.status(200).json({
      data: updatedBrand
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /brands/:id
export const deleteBrand = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid brand ID."
      });
    }

    const brand = await prisma.brand.findUnique({
      where: { id }
    });

    if (!brand) {
      return res.status(404).json({
        message: "Brand not found."
      });
    }

    await prisma.brand.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
