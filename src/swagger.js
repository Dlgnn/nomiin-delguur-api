
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Book Store API",
      version: "1.0.0",
      description: "Номын дэлгүүрийн Backend API documentation"
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server"
      }
    ],

    components: {
      schemas: {
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Уран зохиол" },
            createdAt: { type: "string", format: "date-time" }
          }
        },

        Brand: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Монсудар" },
            country: {
              type: "string",
              nullable: true,
              example: "Монгол"
            },
            createdAt: { type: "string", format: "date-time" }
          }
        },

        Product: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Цагаан бороо" },
            isbn: { type: "string", example: "9789919000002" },
            price: { type: "number", example: 18000 },
            stock: { type: "integer", example: 15 },
            publishedYear: { type: "integer", example: 2020 },
            pages: { type: "integer", example: 210 },
            description: {
              type: "string",
              nullable: true,
              example: "Номын тайлбар."
            },
            isAvailable: { type: "boolean", example: true },
            categoryId: { type: "integer", example: 1 },
            brandId: {
              type: "integer",
              nullable: true,
              example: 1
            },
            createdAt: { type: "string", format: "date-time" }
          }
        },

        ProductInput: {
          type: "object",
          required: [
            "title",
            "isbn",
            "price",
            "stock",
            "publishedYear",
            "pages",
            "categoryId"
          ],
          properties: {
            title: { type: "string", example: "Цагаан бороо" },
            isbn: { type: "string", example: "9789919000002" },
            price: { type: "number", example: 18000 },
            stock: { type: "integer", example: 15 },
            publishedYear: { type: "integer", example: 2020 },
            pages: { type: "integer", example: 210 },
            description: {
              type: "string",
              nullable: true,
              example: "Номын тайлбар."
            },
            isAvailable: { type: "boolean", example: true },
            categoryId: { type: "integer", example: 1 },
            brandId: {
              type: "integer",
              nullable: true,
              example: 1
            }
          }
        },

        Review: {
          type: "object",
          required: ["rating", "authorName", "productId"],
          properties: {
            id: { type: "integer", example: 1 },
            rating: {
              type: "integer",
              minimum: 1,
              maximum: 5,
              example: 5
            },
            comment: {
              type: "string",
              nullable: true,
              example: "Сонирхолтой ном байна."
            },
            authorName: { type: "string", example: "Бат" },
            productId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" }
          }
        },

        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Record not found."
            },
            field: {
              type: "string",
              example: "name"
            }
          }
        }
      }
    }
  },

  apis: [
  "./src/routes/*.js",
  "./src/app.js"
]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
