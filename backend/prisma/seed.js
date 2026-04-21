import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Royal Black Kurta",
        price: 4500,
        description: "Premium black kurta with modern fit.",
        images: JSON.stringify(["/products/black-kurta.jpg"]),
        category: "Men",
        sizes: JSON.stringify(["S", "M", "L"]),
      },
      {
        name: "Elegant White Dress",
        price: 6200,
        description: "Luxury white outfit for women.",
        images: JSON.stringify(["/products/white-dress.jpg"]),
        category: "Women",
        sizes: JSON.stringify(["S", "M"]),
      },
      {
        name: "Streetwear Hoodie",
        price: 3800,
        description: "Modern oversized hoodie.",
        images: JSON.stringify(["/products/hoodie.jpg"]),
        category: "New Arrival",
        sizes: JSON.stringify(["M", "L"]),
      },
      {
        name: "Classic Denim Jacket",
        price: 7200,
        description: "Premium denim with clean finish.",
        images: JSON.stringify(["/products/jacket.jpg"]),
        category: "Men",
        sizes: JSON.stringify(["M", "L"]),
      },
      {
        name: "Luxury Abaya",
        price: 8500,
        description: "Elegant flowing abaya.",
        images: JSON.stringify(["/products/abaya.jpg"]),
        category: "Women",
        sizes: JSON.stringify(["S", "M", "L"]),
      }
    ],
  });

  console.log("🌱 Sample products added!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());