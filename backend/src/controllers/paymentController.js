import { prisma } from '../lib/prisma.js';
import { PaymentFactory } from '../lib/payments/factory.js';

export const handleWebhook = async (req, res) => {
  const { transactionId, status, amount, metadata } = req.body;
  
  console.log(`[Webhook] Received update for TXN: ${transactionId} | Status: ${status}`);

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { gatewayTransactionId: transactionId },
      include: { order: true }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Update Transaction
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: status === 'SUCCESS' ? 'SUCCESS' : 'FAILED' }
    });

    // Update Order if success
    if (status === 'SUCCESS') {
      await prisma.order.update({
        where: { id: transaction.orderId },
        data: { 
          paymentStatus: 'PAID',
          status: 'CONFIRMED'
        }
      });
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook Error:', err);
    res.status(500).json({ error: 'Internal processing error' });
  }
};
