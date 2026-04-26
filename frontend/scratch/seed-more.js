const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  
  const getCatId = (name) => categories.find(c => c.name.toLowerCase() === name.toLowerCase())?.id;

  const newProducts = [
    // Embroidered Dupatta
    {
      name: "Floral Silk Luxe Dupatta",
      price: 4500,
      category: "Embroidered dupatta",
      image: "silk_embroidered_dupatta_1.png",
      desc: "A masterpiece of silk embroidery with gold tilla work."
    },
    {
      name: "Ethereal Organza Scalloped Dupatta",
      price: 3800,
      category: "Embroidered dupatta",
      image: "organza_dupatta_2.png",
      desc: "Lightweight organza with intricate silver embroidery."
    },
    {
      name: "Midnight Mirror Net Dupatta",
      price: 5200,
      category: "Embroidered dupatta",
      image: "net_dupatta_3.png",
      desc: "Stunning mirror work on premium black net fabric."
    },
    // Luxury Khaddar Shawl
    {
      name: "Classic Earth Tone Khaddar Shawl",
      price: 6500,
      category: "Luxury khaddar shawl",
      image: "khaddar_shawl_brown_1.png",
      desc: "Traditional handmade weave in a rich earthy brown."
    },
    {
      name: "Kashmiri Pashmina Blend Shawl",
      price: 12500,
      category: "Luxury khaddar shawl",
      image: "pashmina_style_shawl_2.png",
      desc: "Fine wool blend with authentic Kashmiri needlework."
    },
    {
      name: "Charcoal Minimalist Wool Shawl",
      price: 8900,
      category: "Luxury khaddar shawl",
      image: "grey_wool_shawl_3.png",
      desc: "Sleek, timeless charcoal grey wool for formal elegance."
    },
    // Chunri Dupatta
    {
      name: "Sun-Kissed Bandhani Chunri",
      price: 2900,
      category: "Chunri dupatta",
      image: "chunri_yellow_1.png",
      desc: "Festive yellow and orange tie-dye silk chunri."
    },
    {
      name: "Royal Blue Gota Chunri",
      price: 3500,
      category: "Chunri dupatta",
      image: "chunri_blue_2.png",
      desc: "Deep blue silk chunri with shimmering gota patti."
    },
    {
      name: "Fuchsia multi-color Chunri",
      price: 3200,
      category: "Chunri dupatta",
      image: "chunri_pink_3.png",
      desc: "Vibrant multi-color festive chunri dupatta."
    },
    // Velvet Embroidered Shawl
    {
      name: "Emerald Zardozi Velvet Shawl",
      price: 15500,
      category: "Velvet embroidered shawl",
      image: "velvet_shawl_green_1.png",
      desc: "Heavy gold Zardozi work on plush emerald velvet."
    },
    {
      name: "Navy Silver Embroidered Velvet",
      price: 13800,
      category: "Velvet embroidered shawl",
      image: "velvet_shawl_blue_2.png",
      desc: "Sophisticated navy blue velvet with silver artisanal work."
    },
    {
      name: "Ruby Bridal Velvet Shawl",
      price: 18900,
      category: "Velvet embroidered shawl",
      image: "velvet_shawl_red_3.png",
      desc: "Majestic ruby red velvet with intricate gold borders."
    },
    // Vintage Jewelry
    {
      name: "Heritage Polki Emerald Set",
      price: 25000,
      category: "Vintage jewelry",
      image: "vintage_necklace_1.png",
      desc: "Antique gold finish set with emeralds and pearls."
    },
    {
      name: "Gold Filigree Jhumka Set",
      price: 12000,
      category: "Vintage jewelry",
      image: "vintage_jhumar_2.png",
      desc: "Traditional Jhumka and Jhumar with intricate filigree."
    },
    {
      name: "Royal Ruby Antique Bangles",
      price: 9500,
      category: "Vintage jewelry",
      image: "vintage_bangles_3.png",
      desc: "A set of gold-plated bangles with ruby stone work."
    }
  ];

  for (const p of newProducts) {
    const categoryId = getCatId(p.category);
    if (!categoryId) {
      console.warn(`Category not found: ${p.category}`);
      continue;
    }

    const slug = p.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    await prisma.product.create({
      data: {
        name: p.name,
        slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
        sku: `SP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        regularPrice: p.price,
        description: p.desc,
        images: JSON.stringify([{ url: p.image, alt: p.name }]),
        categoryId: categoryId,
        isPublished: true,
        status: "Active",
        tags: JSON.stringify([p.category.split(' ')[0]]),
        inventory: 10
      }
    });
    console.log(`Created product: ${p.name}`);
  }

  console.log("Seeding complete!");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
