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

        const body = await req.json();
        const { surebetId, winningHouse } = body;

        if (!surebetId || !winningHouse) {
            return NextResponse.json(
                { error: 'ID da surebet e casa vencedora são obrigatórios' },
                { status: 400 }
            );
        }

        if (winningHouse !== 1 && winningHouse !== 2) {
            return NextResponse.json(
                { error: 'Casa vencedora deve ser 1 ou 2' },
                { status: 400 }
            );
        }

        // Buscar surebet
        const surebet = await prisma.surebet.findUnique({
            where: { id: surebetId }
        });

        if (!surebet) {
            return NextResponse.json(
                { error: 'Surebet não encontrada' },
                { status: 404 }
            );
        }

        // Calcular lucro real e ROI
        let actualProfit: number;

        if (winningHouse === 1) {
            // Casa 1 ganhou
            const winnings = surebet.stake1 * surebet.odd1;
            actualProfit = winnings - surebet.totalStake;
        } else {
            // Casa 2 ganhou
            const winnings = surebet.stake2 * surebet.odd2;
            actualProfit = winnings - surebet.totalStake;
        }

        // Calcular ROI em porcentagem
        const roi = (actualProfit / surebet.totalStake) * 100;

        // Atualizar surebet
        const updatedSurebet = await prisma.surebet.update({
            where: { id: surebetId },
            data: {
                status: 'SETTLED',
                winningHouse,
                actualProfit,
                roi,
                resultDate: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            surebet: updatedSurebet
        });

    } catch (error) {
        console.error('Erro ao atualizar resultado:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar resultado' },
            { status: 500 }
        );
    }
}
