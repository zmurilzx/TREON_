import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { abacatePay } from '@/lib/abacatepay';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productType, amount, discordLink } = await request.json();

        // Validate parameters
        if (!productType || !amount || !discordLink) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // Create checkout with AbacatePay
        const checkout = await abacatePay.createCheckout({
            amount: amount * 100, // Convert to cents
            metadata: {
                userId: session.user.id,
                userEmail: session.user.email,
                productType,
                discordLink,
                type: 'SUBSCRIPTION', // Can be SUBSCRIPTION or PURCHASE
                planType: 'DELAY_ESPORTIVO',
            },
            returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        });

        return NextResponse.json({
            checkoutUrl: checkout.checkoutUrl,
            transactionId: checkout.transactionId,
        });
    } catch (error: any) {
        console.error('Checkout creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout' },
            { status: 500 }
        );
    }
}
