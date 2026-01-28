import axios from 'axios';
import crypto from 'crypto';

const ABACATEPAY_API_URL = 'https://api.abacatepay.com';

interface CheckoutData {
    amount: number;
    metadata?: Record<string, any>;
    returnUrl?: string;
}

interface SubscriptionData {
    planId: string;
    userId: string;
    metadata?: Record<string, any>;
}

export class AbacatePayService {
    private apiKey: string;
    private webhookSecret: string;
    private env: string;

    constructor() {
        this.apiKey = process.env.ABACATEPAY_API_KEY || '';
        this.webhookSecret = process.env.ABACATEPAY_WEBHOOK_SECRET || '';
        this.env = process.env.ABACATEPAY_ENV || 'development';
    }

    /**
     * Create a one-time payment checkout
     */
    async createCheckout(data: CheckoutData): Promise<{ checkoutUrl: string; transactionId: string }> {
        try {
            const response = await axios.post(
                `${ABACATEPAY_API_URL}/billing`,
                {
                    frequency: 'one-time',
                    methods: ['pix', 'card'],
                    products: [
                        {
                            externalId: crypto.randomUUID(),
                            name: 'Compra TREON',
                            quantity: 1,
                            price: data.amount,
                        },
                    ],
                    returnUrl: data.returnUrl || process.env.NEXT_PUBLIC_APP_URL,
                    metadata: data.metadata,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return {
                checkoutUrl: response.data.url,
                transactionId: response.data.id,
            };
        } catch (error: any) {
            console.error('AbacatePay createCheckout error:', error.response?.data || error.message);
            throw new Error('Failed to create checkout');
        }
    }

    /**
     * Create a recurring subscription
     */
    async createSubscription(data: SubscriptionData): Promise<{ checkoutUrl: string; subscriptionId: string }> {
        try {
            const response = await axios.post(
                `${ABACATEPAY_API_URL}/billing`,
                {
                    frequency: 'monthly',
                    methods: ['pix', 'card'],
                    products: [
                        {
                            externalId: data.planId,
                            name: 'Assinatura TREON',
                            quantity: 1,
                            price: 99.90, // This should come from plan config
                        },
                    ],
                    returnUrl: process.env.NEXT_PUBLIC_APP_URL + '/dashboard',
                    metadata: {
                        userId: data.userId,
                        ...data.metadata,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return {
                checkoutUrl: response.data.url,
                subscriptionId: response.data.id,
            };
        } catch (error: any) {
            console.error('AbacatePay createSubscription error:', error.response?.data || error.message);
            throw new Error('Failed to create subscription');
        }
    }

    /**
     * Cancel a subscription
     */
    async cancelSubscription(subscriptionId: string): Promise<boolean> {
        try {
            await axios.delete(`${ABACATEPAY_API_URL}/billing/${subscriptionId}`, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
            return true;
        } catch (error: any) {
            console.error('AbacatePay cancelSubscription error:', error.response?.data || error.message);
            throw new Error('Failed to cancel subscription');
        }
    }

    /**
     * Verify webhook signature using HMAC
     */
    verifyWebhookSignature(payload: string, signature: string): boolean {
        try {
            const hmac = crypto.createHmac('sha256', this.webhookSecret);
            hmac.update(payload);
            const expectedSignature = hmac.digest('hex');

            return crypto.timingSafeEqual(
                Buffer.from(signature),
                Buffer.from(expectedSignature)
            );
        } catch (error) {
            console.error('Webhook signature verification error:', error);
            return false;
        }
    }
}

export const abacatePay = new AbacatePayService();
