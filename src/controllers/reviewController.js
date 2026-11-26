
import prisma from "../db.js";

// GET /reviews
export const getReviews = async (req, res, next) => {
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

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        skip,
        take: limit,
        orderBy: { id: "asc" },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              isbn: true
            }
          }
        }
      }),
      prisma.review.count()
    ]);

    res.status(200).json({
      data: reviews,
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

// GET /reviews/:id
export const getReviewById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid review ID."
      });
    }

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        product: true
      }
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found."
      });
    }

    res.status(200).json({
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// POST /reviews
export const createReview = async (req, res, next) => {
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

    const allowedFields = [
      "rating",
      "comment",
      "authorName",
      "productId"
    ];

    const unknownFields = Object.keys(req.body).filter(
      (key) => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
      return res.status(400).json({
        message: "Unknown field in request body."
      });
    }

    const { rating, comment, authorName, productId } = req.body;

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5.",
        field: "rating"
      });
    }

    if (
      typeof authorName !== "string" ||
      !authorName.trim()
    ) {
      return res.status(400).json({
        message: "Author name is required.",
        field: "authorName"
      });
    }

    if (
      !Number.isInteger(productId) ||
      productId < 1
    ) {
      return res.status(400).json({
        message: "Product ID must be a positive integer.",
        field: "productId"
      });
    }

    if (
      comment !== undefined &&
      comment !== null &&
      (
        typeof comment !== "string" ||
        !comment.trim()
      )
    ) {
      return res.status(400).json({
        message: "Comment must be a non-empty string or null.",
        field: "comment"
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
        field: "productId"
      });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment == null ? null : comment.trim(),
        authorName: authorName.trim(),
        productId
      },
      include: {
        product: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.status(201).json({
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /reviews/:id
export const patchReview = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid review ID."
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

    const allowedFields = [
      "rating",
      "comment",
      "authorName"
    ];

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

    const existingReview = await prisma.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      return res.status(404).json({
        message: "Review not found."
      });
    }

    const data = {};

    if (Object.hasOwn(req.body, "rating")) {
      const rating = req.body.rating;

      if (
        !Number.isInteger(rating) ||
        rating < 1 ||
        rating > 5
      ) {
        return res.status(400).json({
          message: "Rating must be an integer between 1 and 5.",
          field: "rating"
        });
      }

      data.rating = rating;
    }

    if (Object.hasOwn(req.body, "authorName")) {
      const authorName = req.body.authorName;

      if (
        typeof authorName !== "string" ||
        !authorName.trim()
      ) {
        return res.status(400).json({
          message: "Author name is required.",
          field: "authorName"
        });
      }

      data.authorName = authorName.trim();
    }

    if (Object.hasOwn(req.body, "comment")) {
      const comment = req.body.comment;

      if (
        comment !== null &&
        (
          typeof comment !== "string" ||
          !comment.trim()
        )
      ) {
        return res.status(400).json({
          message: "Comment must be a non-empty string or null.",
          field: "comment"
        });
      }

      data.comment = comment === null ? null : comment.trim();
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data,
      include: {
        product: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.status(200).json({
      data: updatedReview
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /reviews/:id
export const deleteReview = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid review ID."
      });
    }

    const review = await prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found."
      });
    }

    await prisma.review.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
