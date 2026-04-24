const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  const products = [
    {
      name: "Classic Embroidered Abaya",
      price: 15000,
      description: "A timeless black abaya with elegant embroidery.",
      images: JSON.stringify(["abaya.jpg"]),
      category: "Women",
      sizes: JSON.stringify(["S", "M", "L", "XL"])
    },
    {
      name: "Premium Black Kurta",
      price: 8500,
      description: "Sleek black kurta for formal and casual occasions.",
      images: JSON.stringify(["black-kurta.jpg"]),
      category: "Men",
      sizes: JSON.stringify(["M", "L", "XL"])
    },
    {
      name: "Signature Hoodie",
      price: 4500,
      description: "Comfortable and stylish hoodie with minimal branding.",
      images: JSON.stringify(["hoodie.jpg"]),
      category: "Unisex",
      sizes: JSON.stringify(["S", "M", "L"])
    },
    {
      name: "Modern Biker Jacket",
      price: 12000,
      description: "High-quality leather jacket for the modern wardrobe.",
      images: JSON.stringify(["jacket.jpg"]),
      category: "Men",
      sizes: JSON.stringify(["M", "L", "XL"])
    },
    {
      name: "Elegant White Dress",
      price: 25000,
      description: "Stunning white dress for special evening events.",
      images: JSON.stringify(["white-dress.jpg"]),
      category: "Women",
      sizes: JSON.stringify(["S", "M", "L"])
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
