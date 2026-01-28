import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user's latest subscription
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: session.user.id,
                status: 'ACTIVE',
                planType: 'DELAY_ESPORTIVO',
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!subscription) {
            return NextResponse.json({
                status: 'pending',
                message: 'No active subscription found'
            });
        }

        // Get Discord link - hardcoded for now since metadata doesn't exist in schema
        const discordLink = 'https://discord.gg/seu-servidor';

        return NextResponse.json({
            status: 'paid',
            discordLink,
            subscription: {
                id: subscription.id,
                planType: subscription.planType,
                endDate: subscription.endDate,
            },
        });
    } catch (error: any) {
        console.error('Status check error:', error);
        return NextResponse.json(
            { error: 'Failed to check status' },
            { status: 500 }
        );
    }
}
