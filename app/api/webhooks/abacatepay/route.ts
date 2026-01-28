import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { abacatePay } from '@/lib/abacatepay';

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('x-signature') || '';

        // Verify webhook signature
        if (!abacatePay.verifyWebhookSignature(body, signature)) {
            console.error('Invalid webhook signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(body);
        const { type, data } = event;

        // Check if event already processed (idempotency)
        const existingEvent = await prisma.paymentEvent.findFirst({
            where: {
                eventType: type,
                payload: {
                    equals: event,
                },
            },
        });

        if (existingEvent?.processed) {
            console.log('Event already processed:', type);
            return NextResponse.json({ message: 'Event already processed' }, { status: 200 });
        }

        // Create payment event log
        const paymentEvent = await prisma.paymentEvent.create({
            data: {
                eventType: type,
                signature,
                payload: event,
                processed: false,
            },
        });

        // Process event based on type
        try {
            switch (type) {
                case 'billing.paid':
                    await handleBillingPaid(data);
                    break;

                case 'withdraw.done':
                    console.log('Withdrawal completed:', data);
                    break;

                case 'withdraw.failed':
                    await handleWithdrawFailed(data);
                    break;

                default:
                    console.log('Unhandled event type:', type);
            }

            // Mark event as processed
            await prisma.paymentEvent.update({
                where: { id: paymentEvent.id },
                data: {
                    processed: true,
                    processedAt: new Date(),
                },
            });

            return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
        } catch (processingError: any) {
            // Log error but don't retry
            await prisma.paymentEvent.update({
                where: { id: paymentEvent.id },
                data: {
                    error: processingError.message,
                    retryCount: { increment: 1 },
                },
            });

            throw processingError;
        }
    } catch (error: any) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}

async function handleBillingPaid(data: any) {
    const { id: abacatePayTxId, metadata } = data;

    // Find or create transaction
    let transaction = await prisma.transaction.findUnique({
        where: { abacatePayTxId },
    });

    if (!transaction) {
        // Create new transaction
        transaction = await prisma.transaction.create({
            data: {
                userId: metadata.userId,
                amount: data.amount / 100, // Convert cents to reais
                type: metadata.type || 'PURCHASE',
                status: 'COMPLETED',
                abacatePayTxId,
                idempotencyKey: abacatePayTxId,
                metadata,
            },
        });
    } else {
        // Update existing transaction
        transaction = await prisma.transaction.update({
            where: { id: transaction.id },
            data: { status: 'COMPLETED' },
        });
    }

    // Grant access based on transaction type
    if (metadata.type === 'SUBSCRIPTION') {
        await grantSubscriptionAccess(metadata.userId, metadata.planType, abacatePayTxId);
    } else if (metadata.type === 'PURCHASE') {
        await grantContentAccess(metadata.userId, metadata.contentType, metadata.contentId);
    }

    // TODO: Send confirmation email
    console.log('Payment confirmed and access granted:', abacatePayTxId);
}

async function grantSubscriptionAccess(userId: string, planType: string, abacatePaySubId: string) {
    const now = new Date();
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Get Discord link from transaction metadata
    const transaction = await prisma.transaction.findFirst({
        where: { abacatePayTxId: abacatePaySubId },
    });

    const discordLink = transaction?.metadata?.discordLink || null;

    // Create or update subscription
    const subscription = await prisma.subscription.upsert({
        where: { abacatePaySubId },
        create: {
            userId,
            planType,
            status: 'ACTIVE',
            startDate: now,
            endDate,
            abacatePaySubId,
            metadata: discordLink ? { discordLink } : undefined,
        },
        update: {
            status: 'ACTIVE',
            endDate,
            metadata: discordLink ? { discordLink } : undefined,
        },
    });

    console.log('Subscription granted:', subscription.id);

    // Return Discord link for redirect
    return discordLink;
}

async function grantContentAccess(userId: string, contentType: string, contentId: string) {
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year

    await prisma.userAccess.upsert({
        where: {
            userId_contentType_contentId: {
                userId,
                contentType: contentType as any, // Type assertion for dynamic content types
                contentId,
            },
        },
        create: {
            userId,
            contentType: contentType as any,
            contentId,
            methodId: contentType === 'METHOD' ? contentId : null,
            spreadsheetId: contentType === 'SPREADSHEET' ? contentId : null,
            expiresAt,
            source: 'PURCHASE',
        },
        update: {
            expiresAt,
        },
    });

    console.log('Content access granted:', contentType, contentId);
}

async function handleWithdrawFailed(data: any) {
    const { id: abacatePayTxId, metadata } = data;

    // Update transaction status
    await prisma.transaction.updateMany({
        where: { abacatePayTxId },
        data: { status: 'FAILED' },
    });

    // If it's a subscription renewal failure, trigger dunning
    if (metadata.type === 'SUBSCRIPTION') {
        const subscription = await prisma.subscription.findUnique({
            where: { abacatePaySubId: abacatePayTxId },
        });

        if (subscription) {
            await prisma.subscription.update({
                where: { id: subscription.id },
                data: { status: 'DUNNING' },
            });

            // TODO: Send dunning email
            console.log('Subscription payment failed, dunning initiated:', subscription.id);
        }
    }
}
