import { prisma } from '../lib/prisma.js';
import cloudinary from '../lib/cloudinary.js';

const parseMaybeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value.split(',').map((v) => v.trim()).filter(Boolean);
    }
  }
  return [];
};

export const getProducts = async (req, res) => {
  const { category, sort = 'latest', q } = req.query;
  const where = {
    ...(category ? { category } : {}),
    ...(q ? { name: { contains: q, mode: 'insensitive' } } : {})
  };

  const orderBy = sort === 'price_asc' ? { price: 'asc' } : { createdAt: 'desc' };
  const products = await prisma.product.findMany({ where, orderBy });
  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

export const createProduct = async (req, res) => {
  const { name, price, description, category, sizes, images } = req.body;
  const uploaded = req.files?.length
    ? await Promise.all(
        req.files.map((file) =>
          cloudinary.uploader.upload(file.path, { folder: 'shahiposh/products' }).then((r) => r.secure_url)
        )
      )
    : [];

  const product = await prisma.product.create({
    data: {
      name,
      price: Number(price),
      description,
      category,
      sizes: parseMaybeArray(sizes),
      images: [...parseMaybeArray(images), ...uploaded]
    }
  });

  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const { name, price, description, category, sizes, images } = req.body;
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: {
      ...(name && { name }),
      ...(price && { price: Number(price) }),
      ...(description && { description }),
      ...(category && { category }),
      ...(sizes && { sizes: parseMaybeArray(sizes) }),
      ...(images && { images: parseMaybeArray(images) })
    }
  });
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.status(204).send();
};
