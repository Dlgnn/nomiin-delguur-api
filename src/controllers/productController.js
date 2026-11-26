
import prisma from "../db.js";

const allowedFields = [
  "title",
  "isbn",
  "price",
  "stock",
  "publishedYear",
  "pages",
  "description",
  "isAvailable",
  "categoryId",
  "brandId"
];

const requiredFields = [
  "title",
  "isbn",
  "price",
  "stock",
  "publishedYear",
  "pages",
  "categoryId"
];

const allowedSortFields = [
  "id",
  "title",
  "price",
  "publishedYear",
  "createdAt"
];

// Validate Product request data
const validateProductData = (data, partial = false) => {
  const fields = Object.keys(data);

  const unknownFields = fields.filter(
    (field) => !allowedFields.includes(field)
  );

  if (unknownFields.length > 0) {
    return {
      message: "Unknown field in request body."
    };
  }

  if (!partial) {
    const missingFields = requiredFields.filter(
      (field) => !Object.hasOwn(data, field)
    );

    if (missingFields.length > 0) {
      return {
        message: "Required fields are missing.",
        field: missingFields.join(", ")
      };
    }
  }

  if (partial && fields.length === 0) {
    return {
      message: "At least one field is required."
    };
  }

  if (
    Object.hasOwn(data, "title") &&
    (typeof data.title !== "string" || !data.title.trim())
  ) {
    return {
      message: "Title must be a non-empty string.",
      field: "title"
    };
  }

  if (
    Object.hasOwn(data, "isbn") &&
    (typeof data.isbn !== "string" || !data.isbn.trim())
  ) {
    return {
      message: "ISBN must be a non-empty string.",
      field: "isbn"
    };
  }

  if (
    Object.hasOwn(data, "price") &&
    (
      typeof data.price !== "number" ||
      !Number.isFinite(data.price) ||
      data.price <= 0
    )
  ) {
    return {
      message: "Price must be a positive number.",
      field: "price"
    };
  }

  if (
    Object.hasOwn(data, "stock") &&
    (
      !Number.isInteger(data.stock) ||
      data.stock <= 0
    )
  ) {
    return {
      message: "Stock must be a positive integer.",
      field: "stock"
    };
  }

  if (
    Object.hasOwn(data, "publishedYear") &&
    (
      !Number.isInteger(data.publishedYear) ||
      data.publishedYear < 1900 ||
      data.publishedYear > new Date().getFullYear() + 1
    )
  ) {
    return {
      message: "Published year is outside the allowed range.",
      field: "publishedYear"
    };
  }

  if (
    Object.hasOwn(data, "pages") &&
    (
      !Number.isInteger(data.pages) ||
      data.pages <= 0
    )
  ) {
    return {
      message: "Pages must be a positive integer.",
      field: "pages"
    };
  }

  if (
    Object.hasOwn(data, "description") &&
    data.description !== null &&
    (
      typeof data.description !== "string" ||
      !data.description.trim()
    )
  ) {
    return {
      message: "Description must be a non-empty string or null.",
      field: "description"
    };
  }

  if (
    Object.hasOwn(data, "isAvailable") &&
    typeof data.isAvailable !== "boolean"
  ) {
    return {
      message: "isAvailable must be a boolean.",
      field: "isAvailable"
    };
  }

  if (
    Object.hasOwn(data, "categoryId") &&
    (
      !Number.isInteger(data.categoryId) ||
      data.categoryId <= 0
    )
  ) {
    return {
      message: "Category ID must be a positive integer.",
      field: "categoryId"
    };
  }

  if (
    Object.hasOwn(data, "brandId") &&
    data.brandId !== null &&
    (
      !Number.isInteger(data.brandId) ||
      data.brandId <= 0
    )
  ) {
    return {
      message: "Brand ID must be a positive integer or null.",
      field: "brandId"
    };
  }

  return null;
};

// Check whether related Category and Brand records exist
const validateRelations = async (data) => {
  if (Object.hasOwn(data, "categoryId")) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    });

    if (!category) {
      return {
        message: "Category not found.",
        field: "categoryId"
      };
    }
  }

  if (Object.hasOwn(data, "brandId") && data.brandId !== null) {
    const brand = await prisma.brand.findUnique({
      where: { id: data.brandId }
    });

    if (!brand) {
      return {
        message: "Brand not found.",
        field: "brandId"
      };
    }
  }

  return null;
};

// GET /products
export const getProducts = async (req, res, next) => {
  try {
    const {
      page: pageQuery,
      limit: limitQuery,
      search,
      categoryId: categoryIdQuery,
      brandId: brandIdQuery,
      minPrice: minPriceQuery,
      maxPrice: maxPriceQuery,
      isAvailable: isAvailableQuery,
      sortBy: sortByQuery,
      order: orderQuery
    } = req.query;

    const page = Number(pageQuery ?? 1);
    const limit = Number(limitQuery ?? 10);

    if (
      (pageQuery !== undefined && typeof pageQuery !== "string") ||
      (limitQuery !== undefined && typeof limitQuery !== "string") ||
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

    if (
      search !== undefined &&
      (typeof search !== "string" || !search.trim())
    ) {
      return res.status(400).json({
        message: "Search must be a non-empty string.",
        field: "search"
      });
    }

    let categoryId;
    if (categoryIdQuery !== undefined) {
      categoryId = Number(categoryIdQuery);

      if (
        typeof categoryIdQuery !== "string" ||
        !Number.isInteger(categoryId) ||
        categoryId < 1
      ) {
        return res.status(400).json({
          message: "Category ID must be a positive integer.",
          field: "categoryId"
        });
      }
    }

    let brandId;
    if (brandIdQuery !== undefined) {
      brandId = Number(brandIdQuery);

      if (
        typeof brandIdQuery !== "string" ||
        !Number.isInteger(brandId) ||
        brandId < 1
      ) {
        return res.status(400).json({
          message: "Brand ID must be a positive integer.",
          field: "brandId"
        });
      }
    }

    let minPrice;
    if (minPriceQuery !== undefined) {
      minPrice = Number(minPriceQuery);

      if (
        typeof minPriceQuery !== "string" ||
        !Number.isFinite(minPrice) ||
        minPrice < 0
      ) {
        return res.status(400).json({
          message: "minPrice must be a non-negative number.",
          field: "minPrice"
        });
      }
    }

    let maxPrice;
    if (maxPriceQuery !== undefined) {
      maxPrice = Number(maxPriceQuery);

      if (
        typeof maxPriceQuery !== "string" ||
        !Number.isFinite(maxPrice) ||
        maxPrice < 0
      ) {
        return res.status(400).json({
          message: "maxPrice must be a non-negative number.",
          field: "maxPrice"
        });
      }
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      return res.status(400).json({
        message: "minPrice cannot be greater than maxPrice."
      });
    }

    let isAvailable;
    if (isAvailableQuery !== undefined) {
      if (
        isAvailableQuery !== "true" &&
        isAvailableQuery !== "false"
      ) {
        return res.status(400).json({
          message: "isAvailable must be true or false.",
          field: "isAvailable"
        });
      }

      isAvailable = isAvailableQuery === "true";
    }

    const sortBy = sortByQuery ?? "id";
    const order = orderQuery ?? "asc";

    if (
      typeof sortBy !== "string" ||
      !allowedSortFields.includes(sortBy)
    ) {
      return res.status(400).json({
        message: "Invalid sortBy field.",
        field: "sortBy"
      });
    }

    if (
      typeof order !== "string" ||
      !["asc", "desc"].includes(order)
    ) {
      return res.status(400).json({
        message: "Order must be asc or desc.",
        field: "order"
      });
    }

    // Build database filters
    const where = {};

    if (search !== undefined) {
      where.title = {
        contains: search.trim(),
        mode: "insensitive"
      };
    }

    if (categoryId !== undefined) {
      where.categoryId = categoryId;
    }

    if (brandId !== undefined) {
      where.brandId = brandId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};

      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }

      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    if (isAvailable !== undefined) {
      where.isAvailable = isAvailable;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: order
        },
        include: {
          category: true,
          brand: true,
          _count: {
            select: { reviews: true }
          }
        }
      }),
      prisma.product.count({
        where
      })
    ]);

    res.status(200).json({
      data: products,
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

// GET /products/:id
export const getProductById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid product ID."
      });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        reviews: true
      }
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found."
      });
    }

    res.status(200).json({
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// POST /products
export const createProduct = async (req, res, next) => {
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

    const validationError = validateProductData(req.body);

    if (validationError) {
      return res.status(400).json(validationError);
    }

    const relationError = await validateRelations(req.body);

    if (relationError) {
      return res.status(404).json(relationError);
    }

    const data = {
      ...req.body,
      title: req.body.title.trim(),
      isbn: req.body.isbn.trim()
    };

    if (typeof data.description === "string") {
      data.description = data.description.trim();
    }

    const product = await prisma.product.create({
      data,
      include: {
        category: true,
        brand: true
      }
    });

    res.status(201).json({
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /products/:id
export const patchProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid product ID."
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

    const validationError = validateProductData(req.body, true);

    if (validationError) {
      return res.status(400).json(validationError);
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found."
      });
    }

    const relationError = await validateRelations(req.body);

    if (relationError) {
      return res.status(404).json(relationError);
    }

    const data = { ...req.body };

    if (typeof data.title === "string") {
      data.title = data.title.trim();
    }

    if (typeof data.isbn === "string") {
      data.isbn = data.isbn.trim();
    }

    if (typeof data.description === "string") {
      data.description = data.description.trim();
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        brand: true
      }
    });

    res.status(200).json({
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid product ID."
      });
    }

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found."
      });
    }

    await prisma.product.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
