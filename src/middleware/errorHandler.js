
import { Prisma } from "@prisma/client";

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  let status = err.status || 500;
  let message = err.message || "Internal server error";
  let field = err.field;

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        status = 409;
        message = "This value already exists.";
        field = err.meta?.target;
        break;

      case "P2003":
        status = 409;
        message = "Related data constraint failed.";
        break;

      case "P2025":
        status = 404;
        message = "Record not found.";
        break;

      default:
        status = 500;
        message = "Database error.";
    }
  }

  const response = { message };

  if (field) {
    response.field = Array.isArray(field)
      ? field.join(", ")
      : field;
  }

  res.status(status).json(response);
};
