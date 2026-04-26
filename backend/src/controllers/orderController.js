import { prisma } from '../lib/prisma.js';
import { PaymentFactory } from '../lib/payments/factory.js';

export const createOrder = async (req, res) => {
  try {
    const { 
      customerName, 
      customerEmail, 
      phone, 
      address, 
      city, 
      area, 
      items, 
      subtotal, 
      tax, 
      shippingFee, 
      totalPrice, 
      paymentMethod 
    } = req.body;

    const orderNumber = `SP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 1. Create the Order in PENDING/AWAITING state
    const orderStatus = paymentMethod === 'BANK_TRANSFER' ? 'AWAITING_BANK_VERIFICATION' : 'AWAITING_PAYMENT';
    const paymentStatus = paymentMethod === 'BANK_TRANSFER' ? 'AWAITING_VERIFICATION' : 'UNPAID';

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail: customerEmail || 'guest@shahiposh.com',
        customerPhone: phone,
        shippingAddress: address,
        city,
        area,
        items: JSON.stringify(items),
        subtotal: Number(subtotal || totalPrice),
        tax: Number(tax || 0),
        shippingFee: Number(shippingFee || 0),
        totalPrice: Number(totalPrice),
        paymentMethod,
        status: paymentMethod === 'COD' ? 'PENDING' : orderStatus,
        paymentStatus: paymentMethod === 'COD' ? 'UNPAID' : paymentStatus,
      }
    });

    // 2. Handle Online Payment Initiation
    if (['CARD', 'EASYPAISA', 'JAZZCASH'].includes(paymentMethod)) {
      const gateway = PaymentFactory.getGateway(paymentMethod);
      const paymentResponse = await gateway.initiatePayment(order);

      if (paymentResponse.success) {
        // Create Transaction record
        await prisma.transaction.create({
          data: {
            orderId: order.id,
            amount: order.totalPrice,
            paymentMethod,
            status: 'INITIATED',
            provider: paymentResponse.metadata?.provider || paymentMethod,
            gatewayTransactionId: paymentResponse.transactionId,
          }
        });

        return res.status(201).json({
          ...order,
          paymentUrl: paymentResponse.paymentUrl,
          requiresRedirect: paymentResponse.status === 'REDIRECT'
        });
      } else {
        throw new Error(paymentResponse.error || 'Payment initiation failed');
      }
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('Order Creation Error:', err);
    res.status(500).json({ error: 'Failed to process order', details: err.message });
  }
};

export const getOrders = async (_req, res) => {
  const orders = await prisma.order.findMany({ 
    orderBy: { createdAt: 'desc' },
    include: { transactions: true, receipt: true }
  });
  res.json(orders);
};
