const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  const products = [
    {
      name: "Classic Silk Sherwani",
      price: 45000,
      description: "A timeless classic crafted from premium silk with intricate hand-embroidery.",
      images: JSON.stringify(["/hero-silk.jpg"]),
      category: "Men",
      sizes: JSON.stringify(["S", "M", "L", "XL"])
    },
    {
      name: "Luxury Velvet Lehengha",
      price: 85000,
      description: "Elegant velvet lehengha with deep maroon tones and gold zardozi work.",
      images: JSON.stringify(["/lehengha-velvet.jpg"]),
      category: "Women",
      sizes: JSON.stringify(["S", "M", "L"])
    },
    {
      name: "Modern Cotton Kurta",
      price: 12000,
      description: "Minimalist cotton kurta perfect for everyday elegance.",
      images: JSON.stringify(["/kurta-cotton.jpg"]),
      category: "Men",
      sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"])
    },
    {
      name: "Embroidered Chiffon Saree",
      price: 35000,
      description: "Lightweight chiffon saree with delicate floral embroidery.",
      images: JSON.stringify(["/saree-chiffon.jpg"]),
      category: "Women",
      sizes: JSON.stringify(["Free Size"])
    },
    {
      name: "Royal Pashmina Shawl",
      price: 25000,
      description: "Authentic hand-woven Pashmina shawl for ultimate warmth and style.",
      images: JSON.stringify(["/shawl-pashmina.jpg"]),
      category: "Accessories",
      sizes: JSON.stringify(["Free Size"])
    }
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
