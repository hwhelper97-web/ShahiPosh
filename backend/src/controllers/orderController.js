import { prisma } from '../lib/prisma.js';

export const createOrder = async (req, res) => {
  const { customerName, phone, address, items, totalPrice } = req.body;

  const order = await prisma.order.create({
    data: {
      customerName,
      phone,
      address,
      items,
      totalPrice: Number(totalPrice)
    }
  });

  res.status(201).json(order);
};

export const getOrders = async (_req, res) => {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(orders);
};
