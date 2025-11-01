// Razorpay Payment Gateway Integration for Indian Market
export class PaymentGatewayService {
  private razorpayKey: string;
  private razorpaySecret: string;
  private webhookSecret: string;

  constructor() {
    this.razorpayKey = Deno.env.get('RAZORPAY_KEY_ID') || '';
    this.razorpaySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || '';
    this.webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') || '';
  }

  // Create Razorpay Order
  async createPaymentOrder(orderData: any): Promise<any> {
    try {
      const {
        amount,
        currency = 'INR',
        receipt,
        notes = {},
        paymentCapture = 1
      } = orderData;

      // Convert amount to paise (smallest currency unit)
      const amountInPaise = Math.round(amount * 100);

      const orderPayload = {
        amount: amountInPaise,
        currency: currency,
        receipt: receipt || `receipt_${Date.now()}`,
        payment_capture: paymentCapture,
        notes: {
          ...notes,
          partner: 'figma_make_travel',
          created_at: new Date().toISOString()
        }
      };

      const auth = btoa(`${this.razorpayKey}:${this.razorpaySecret}`);
      
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Razorpay Order Creation Failed: ${errorData.error?.description || response.statusText}`);
      }

      const order = await response.json();

      return {
        success: true,
        orderId: order.id,
        amount: order.amount / 100, // Convert back to rupees
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        createdAt: order.created_at,
        razorpayOrder: order
      };

    } catch (error) {
      console.error('Payment order creation error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.createMockPaymentOrder(orderData)
      };
    }
  }

  private createMockPaymentOrder(orderData: any): any {
    return {
      orderId: `order_mock_${Date.now()}`,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      receipt: orderData.receipt || `receipt_${Date.now()}`,
      status: 'created',
      createdAt: Math.floor(Date.now() / 1000)
    };
  }

  // Verify Payment Signature (Deno-compatible)
  async verifyPaymentSignature(paymentData: any): Promise<any> {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      } = paymentData;

      // Generate expected signature using Web Crypto API (Deno-compatible)
      const encoder = new TextEncoder();
      const data = encoder.encode(`${razorpay_order_id}|${razorpay_payment_id}`);
      const key = encoder.encode(this.razorpaySecret);
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      
      const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
      const expectedSignature = Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      const isSignatureValid = expectedSignature === razorpay_signature;

      if (!isSignatureValid) {
        throw new Error('Payment signature verification failed');
      }

      // Fetch payment details from Razorpay
      const paymentDetails = await this.fetchPaymentDetails(razorpay_payment_id);

      return {
        success: true,
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        paymentDetails: paymentDetails
      };

    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        verified: false,
        error: error.message
      };
    }
  }

  // Fetch Payment Details
  async fetchPaymentDetails(paymentId: string): Promise<any> {
    try {
      const auth = btoa(`${this.razorpayKey}:${this.razorpaySecret}`);
      
      const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch payment details: ${response.statusText}`);
      }

      const payment = await response.json();

      return {
        paymentId: payment.id,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        captured: payment.captured,
        description: payment.description,
        email: payment.email,
        contact: payment.contact,
        createdAt: payment.created_at,
        card: payment.card ? {
          last4: payment.card.last4,
          network: payment.card.network,
          type: payment.card.type,
          issuer: payment.card.issuer
        } : null,
        upi: payment.upi ? {
          vpa: payment.upi.vpa
        } : null,
        wallet: payment.wallet ? {
          wallet: payment.wallet
        } : null,
        bank: payment.bank ? {
          name: payment.bank
        } : null
      };

    } catch (error) {
      console.error('Error fetching payment details:', error);
      return {
        paymentId: paymentId,
        amount: 0,
        currency: 'INR',
        status: 'unknown',
        method: 'unknown'
      };
    }
  }

  // Capture Payment (for authorized payments)
  async capturePayment(paymentId: string, amount?: number): Promise<any> {
    try {
      const auth = btoa(`${this.razorpayKey}:${this.razorpaySecret}`);
      
      const captureData: any = {};
      if (amount) {
        captureData.amount = Math.round(amount * 100); // Convert to paise
      }

      const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(captureData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Payment capture failed: ${errorData.error?.description || response.statusText}`);
      }

      const payment = await response.json();

      return {
        success: true,
        paymentId: payment.id,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
        captured: payment.captured
      };

    } catch (error) {
      console.error('Payment capture error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Refund Payment
  async refundPayment(paymentId: string, refundData: any): Promise<any> {
    try {
      const {
        amount,
        reason = 'requested_by_customer',
        notes = {}
      } = refundData;

      const auth = btoa(`${this.razorpayKey}:${this.razorpaySecret}`);
      
      const refundPayload: any = {
        reason: reason,
        notes: {
          ...notes,
          processed_by: 'figma_make_travel',
          processed_at: new Date().toISOString()
        }
      };

      if (amount) {
        refundPayload.amount = Math.round(amount * 100); // Convert to paise
      }

      const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(refundPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Refund failed: ${errorData.error?.description || response.statusText}`);
      }

      const refund = await response.json();

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount / 100,
        currency: refund.currency,
        status: refund.status,
        paymentId: refund.payment_id,
        createdAt: refund.created_at,
        processedAt: refund.processed_at
      };

    } catch (error) {
      console.error('Refund error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Handle Webhook Events (Deno-compatible)
  async handleWebhook(webhookBody: string, signature: string): Promise<any> {
    try {
      // Verify webhook signature using Web Crypto API
      const encoder = new TextEncoder();
      const data = encoder.encode(webhookBody);
      const key = encoder.encode(this.webhookSecret);
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      
      const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, data);
      const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      if (expectedSignature !== signature) {
        throw new Error('Webhook signature verification failed');
      }

      const event = JSON.parse(webhookBody);

      switch (event.event) {
        case 'payment.captured':
          return await this.handlePaymentCaptured(event.payload.payment.entity);
        
        case 'payment.failed':
          return await this.handlePaymentFailed(event.payload.payment.entity);
        
        case 'refund.processed':
          return await this.handleRefundProcessed(event.payload.refund.entity);
        
        default:
          console.log(`Unhandled webhook event: ${event.event}`);
          return { success: true, handled: false };
      }

    } catch (error) {
      console.error('Webhook handling error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  private async handlePaymentCaptured(payment: any): Promise<any> {
    console.log('Payment captured:', payment.id);
    
    // Update booking status, send confirmation emails, etc.
    // This would integrate with your booking system
    
    return {
      success: true,
      action: 'payment_captured',
      paymentId: payment.id,
      amount: payment.amount / 100
    };
  }

  private async handlePaymentFailed(payment: any): Promise<any> {
    console.log('Payment failed:', payment.id);
    
    // Handle failed payment - notify customer, release inventory, etc.
    
    return {
      success: true,
      action: 'payment_failed',
      paymentId: payment.id,
      errorCode: payment.error_code,
      errorDescription: payment.error_description
    };
  }

  private async handleRefundProcessed(refund: any): Promise<any> {
    console.log('Refund processed:', refund.id);
    
    // Handle successful refund - update booking, notify customer, etc.
    
    return {
      success: true,
      action: 'refund_processed',
      refundId: refund.id,
      amount: refund.amount / 100
    };
  }

  // Get Payment Methods Configuration
  getPaymentMethodsConfig(amount: number, currency: string = 'INR'): any {
    return {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency,
      methods: {
        card: {
          enabled: true,
          supported_networks: ['Visa', 'MasterCard', 'Maestro', 'RuPay'],
          supported_types: ['credit', 'debit']
        },
        netbanking: {
          enabled: true,
          supported_banks: [
            'HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank',
            'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda'
          ]
        },
        upi: {
          enabled: true,
          supported_apps: ['PhonePe', 'Google Pay', 'Paytm', 'BHIM', 'Amazon Pay']
        },
        wallet: {
          enabled: true,
          supported_wallets: ['Paytm', 'PhonePe', 'Amazon Pay', 'Mobikwik']
        },
        emi: {
          enabled: amount >= 1000, // EMI only for amounts >= ₹1000
          tenure_options: [3, 6, 9, 12],
          banks: ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank']
        }
      },
      offers: this.getApplicableOffers(amount),
      fees: this.calculatePaymentFees(amount)
    };
  }

  private getApplicableOffers(amount: number): any[] {
    const offers = [];

    if (amount >= 5000) {
      offers.push({
        type: 'instant_discount',
        payment_method: 'card',
        discount: Math.min(amount * 0.1, 500), // 10% up to ₹500
        description: 'Get 10% instant discount on card payments above ₹5000'
      });
    }

    if (amount >= 2000) {
      offers.push({
        type: 'cashback',
        payment_method: 'upi',
        cashback: Math.min(amount * 0.05, 200), // 5% up to ₹200
        description: 'Get 5% cashback on UPI payments above ₹2000'
      });
    }

    return offers;
  }

  private calculatePaymentFees(amount: number): any {
    return {
      card: {
        percentage: 2.0,
        fixed: 0,
        total: Math.round(amount * 0.02)
      },
      netbanking: {
        percentage: 1.5,
        fixed: 5,
        total: Math.round(amount * 0.015) + 5
      },
      upi: {
        percentage: 0,
        fixed: 0,
        total: 0 // UPI is typically free
      },
      wallet: {
        percentage: 1.0,
        fixed: 2,
        total: Math.round(amount * 0.01) + 2
      }
    };
  }

  // Generate Payment Receipt
  generatePaymentReceipt(paymentData: any, bookingData: any): any {
    return {
      receiptNumber: `RCP${Date.now()}`,
      paymentId: paymentData.paymentId,
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      paymentMethod: paymentData.method,
      status: paymentData.status,
      transactionDate: new Date(paymentData.createdAt * 1000).toISOString(),
      customer: {
        name: bookingData.customerName,
        email: bookingData.customerEmail,
        phone: bookingData.customerPhone
      },
      booking: {
        bookingId: bookingData.bookingId,
        type: bookingData.type,
        description: bookingData.description
      },
      taxes: {
        sgst: Math.round(paymentData.amount * 0.09), // 9% SGST
        cgst: Math.round(paymentData.amount * 0.09), // 9% CGST
        total: Math.round(paymentData.amount * 0.18)  // 18% GST total
      },
      company: {
        name: 'Figma Make Travel',
        gstin: 'GST123456789',
        address: 'Travel Technology Solutions, India'
      }
    };
  }
}

export const paymentGateway = new PaymentGatewayService();