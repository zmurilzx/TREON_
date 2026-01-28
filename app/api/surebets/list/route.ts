import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
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

        // Buscar todas as surebets do usuário
        const surebets = await prisma.surebet.findMany({
            where: { userId: user.id },
            orderBy: { betDate: 'desc' }
        });

        // Calcular estatísticas
        const stats = {
            totalBets: surebets.length,
            pendingBets: surebets.filter(s => s.status === 'PENDING').length,
            settledBets: surebets.filter(s => s.status === 'SETTLED').length,
            totalStaked: surebets.reduce((sum, s) => sum + s.totalStake, 0),
            totalProfit: surebets
                .filter(s => s.actualProfit !== null)
                .reduce((sum, s) => sum + (s.actualProfit || 0), 0),
            averageROI: 0,
            winRate: 0
        };

        // Calcular ROI médio
        const settledWithROI = surebets.filter(s => s.roi !== null);
        if (settledWithROI.length > 0) {
            stats.averageROI = settledWithROI.reduce((sum, s) => sum + (s.roi || 0), 0) / settledWithROI.length;
        }

        // Calcular win rate (apostas com lucro positivo)
        const settledBets = surebets.filter(s => s.status === 'SETTLED');
        if (settledBets.length > 0) {
            const profitableBets = settledBets.filter(s => (s.actualProfit || 0) > 0);
            stats.winRate = (profitableBets.length / settledBets.length) * 100;
        }

        // Dados para gráfico (evolução da banca)
        const chartData = [];
        let accumulatedProfit = 0;

        const sortedBets = [...surebets]
            .filter(s => s.status === 'SETTLED')
            .sort((a, b) => new Date(a.betDate).getTime() - new Date(b.betDate).getTime());

        for (const bet of sortedBets) {
            accumulatedProfit += bet.actualProfit || 0;
            chartData.push({
                date: bet.betDate,
                profit: accumulatedProfit,
                event: bet.event
            });
        }

        return NextResponse.json({
            success: true,
            surebets,
            stats,
            chartData
        });

    } catch (error) {
        console.error('Erro ao buscar surebets:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar surebets' },
            { status: 500 }
        );
    }
}
