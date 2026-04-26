export class MockGateway {
  constructor(provider) {
    this.providerName = provider;
  }

  async initiatePayment(order) {
    console.log(`[${this.providerName}] Initiating payment for Order ${order.orderNumber}`);
    
    // Simulate a PSP redirect URL (enterprise standard)
    return {
      success: true,
      transactionId: `TXN-${Date.now()}`,
      status: 'REDIRECT',
      paymentUrl: `/payment/simulated-portal?order=${order.orderNumber}&provider=${this.providerName}&amount=${order.totalPrice}`
    };
  }

  async verifyPayment(gatewayId) {
    // In production, this would call the PSP API
    return {
      paid: true,
      transactionId: gatewayId,
      amount: 0,
      status: 'SUCCESS'
    };
  }
}

export class PaymentFactory {
  static getGateway(method) {
    switch (method) {
      case 'CARD':
        return new MockGateway('PayFast_Cards');
      case 'EASYPAISA':
        return new MockGateway('Easypaisa_Merchant');
      case 'JAZZCASH':
        return new MockGateway('JazzCash_Merchant');
      default:
        throw new Error(`Unsupported payment method: ${method}`);
    }
  }
}
