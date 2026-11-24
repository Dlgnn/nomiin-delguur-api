import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  "Уран зохиол",
  "Түүх",
  "Шинжлэх ухаан",
  "Хүүхдийн ном",
  "Хувь хүний хөгжил"
];

const brands = [
  { name: "Монсудар", country: "Монгол" },
  { name: "Интерном", country: "Монгол" },
  { name: "Адмон", country: "Монгол" },
  { name: "Penguin Books", country: "Их Британи" },
  { name: "HarperCollins", country: "АНУ" },
  { name: "Oxford University Press", country: "Их Британи" }
];

const books = [
  ["Монголын нууц товчоо", "9789919000001", 25000, 20, 1240, 320, 2, 1],
  ["Цагаан бороо", "9789919000002", 18000, 15, 2020, 210, 1, 1],
  ["Алтан товч", "9789919000003", 22000, 10, 1651, 250, 2, 2],
  ["Дэлхийн түүх", "9789919000004", 35000, 12, 2022, 400, 2, 3],
  ["Шинжлэх ухааны гайхамшиг", "9789919000005", 28000, 8, 2023, 280, 3, 4],
  ["Хүүхдийн үлгэрүүд", "9789919000006", 15000, 30, 2021, 100, 4, 2],
  ["Амжилтын нууц", "9789919000007", 20000, 18, 2024, 190, 5, 3],
  ["Дэлхийн сонгодог зохиол", "9789919000008", 32000, 7, 2019, 350, 1, 4],
  ["Оддын тухай", "9789919000009", 24000, 14, 2022, 230, 3, 5],
  ["Бяцхан ханхүү", "9789919000010", 16000, 25, 2018, 120, 4, 4],
  ["Сэтгэх урлаг", "9789919000011", 27000, 11, 2023, 260, 5, 5],
  ["Монголын түүх", "9789919000012", 30000, 9, 2020, 310, 2, 1],
  ["Байгалийн шинжлэх ухаан", "9789919000013", 29000, 13, 2021, 290, 3, 6],
  ["Хүүхдийн ертөнц", "9789919000014", 14000, 22, 2022, 90, 4, 2],
  ["Өөрийгөө хөгжүүлэх нь", "9789919000015", 21000, 16, 2024, 200, 5, 3],
  ["Утга зохиолын дээж", "9789919000016", 26000, 6, 2017, 240, 1, 4],
  ["Сансар огторгуй", "9789919000017", 33000, 10, 2023, 360, 3, 5],
  ["Үлгэрийн ном", "9789919000018", 12000, 35, 2020, 80, 4, 6],
  ["Амьдралын ухаан", "9789919000019", 23000, 12, 2021, 220, 5, 1],
  ["Монгол бичгийн өв", "9789919000020", 19000, 17, 2019, 180, 2, 2],
  ["Сонгодог өгүүллэг", "9789919000021", 17000, 14, 2018, 150, 1, 3],
  ["Технологийн ирээдүй", "9789919000022", 31000, 8, 2024, 300, 3, 4],
  ["Бяцхан судлаач", "9789919000023", 13000, 28, 2022, 95, 4, 5],
  ["Хөгжлийн сэтгэлгээ", "9789919000024", 22000, 19, 2023, 210, 5, 6],
  ["Дурсамжийн ном", "9789919000025", 20000, 5, 2020, 175, 1, 1]
];

async function main() {
  // 1. Categories
  const categoryRecords = {};

  for (const name of categories) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name }
    });

    categoryRecords[name] = category;
  }

  // 2. Brands
  const brandRecords = {};

  for (const brand of brands) {
    const record = await prisma.brand.upsert({
      where: { name: brand.name },
      update: { country: brand.country },
      create: brand
    });

    brandRecords[brand.name] = record;
  }

  // 3. Products
  const productRecords = [];

  for (let i = 0; i < books.length; i++) {
    const [title, isbn, price, stock, year, pages, categoryIndex, brandIndex] = books[i];

    const product = await prisma.product.upsert({
      where: { isbn },
      update: {},
      create: {
        title,
        isbn,
        price,
        stock,
        publishedYear: year,
        pages,
        description: `${title} номын тайлбар.`,
        isAvailable: stock > 0,
        categoryId: categoryRecords[categories[categoryIndex - 1]].id,
        brandId: i >= 22
          ? null
          : brandRecords[brands[brandIndex - 1].name].id
      }
    });

    productRecords.push(product);
  }

  // 4. Reviews: эхний 20 ном тус бүр 3 үнэлгээтэй
  const authors = ["Бат", "Сараа", "Тэмүүлэн"];

  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < authors.length; j++) {
      const authorName = authors[j];
      const productId = productRecords[i].id;

      await prisma.review.upsert({
        where: {
          authorName_productId: {
            authorName,
            productId
          }
        },
        update: {},
        create: {
          authorName,
          productId,
          rating: ((i + j) % 5) + 1,
          comment: "Сонирхолтой, уншихад үнэ цэнтэй ном."
        }
      });
    }
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });