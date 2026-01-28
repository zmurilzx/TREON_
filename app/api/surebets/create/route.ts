import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Não autenticado' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        const body = await req.json();
        const {
            event,
            sport,
            betDate,
            house1,
            odd1,
            stake1,
            market1,
            house2,
            odd2,
            stake2,
            market2
        } = body;

        // Validações
        if (!event || !sport || !betDate) {
            return NextResponse.json(
                { error: 'Evento, esporte e data são obrigatórios' },
                { status: 400 }
            );
        }

        if (!house1 || !odd1 || !stake1 || !market1) {
            return NextResponse.json(
                { error: 'Dados da Casa 1 são obrigatórios' },
                { status: 400 }
            );
        }

        if (!house2 || !odd2 || !stake2 || !market2) {
            return NextResponse.json(
                { error: 'Dados da Casa 2 são obrigatórios para surebet' },
                { status: 400 }
            );
        }

        // Cálculos automáticos
        const totalStake = parseFloat(stake1) + parseFloat(stake2);

        // Lucro potencial = maior retorno possível - stake total
        const return1 = parseFloat(stake1) * parseFloat(odd1);
        const return2 = parseFloat(stake2) * parseFloat(odd2);
        const potentialProfit = Math.max(return1, return2) - totalStake;

        // Criar surebet
        const surebet = await prisma.surebet.create({
            data: {
                userId: user.id,
                event,
                sport,
                betDate: new Date(betDate),
                house1,
                odd1: parseFloat(odd1),
                stake1: parseFloat(stake1),
                market1,
                house2,
                odd2: parseFloat(odd2),
                stake2: parseFloat(stake2),
                market2,
                totalStake,
                potentialProfit
            }
        });

        return NextResponse.json({
            success: true,
            surebet
        });

    } catch (error: any) {
        console.error('Erro ao criar surebet:', error);

        // Log detalhado do erro
        if (error.message) {
            console.error('Mensagem:', error.message);
        }
        if (error.code) {
            console.error('Código:', error.code);
        }

        return NextResponse.json(
            {
                error: 'Erro ao criar surebet',
                details: error.message || 'Erro desconhecido',
                code: error.code
            },
            { status: 500 }
        );
    }
}
