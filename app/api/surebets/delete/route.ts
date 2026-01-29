import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: NextRequest) {
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

        // Pegar o ID da surebet da URL
        const { searchParams } = new URL(req.url);
        const surebetId = searchParams.get('id');

        if (!surebetId) {
            return NextResponse.json(
                { error: 'ID da surebet não fornecido' },
                { status: 400 }
            );
        }

        // Verificar se a surebet pertence ao usuário
        const surebet = await prisma.surebet.findUnique({
            where: { id: surebetId }
        });

        if (!surebet) {
            return NextResponse.json(
                { error: 'Surebet não encontrada' },
                { status: 404 }
            );
        }

        if (surebet.userId !== user.id) {
            return NextResponse.json(
                { error: 'Você não tem permissão para deletar esta surebet' },
                { status: 403 }
            );
        }

        // Deletar a surebet
        await prisma.surebet.delete({
            where: { id: surebetId }
        });

        return NextResponse.json({
            success: true,
            message: 'Surebet deletada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao deletar surebet:', error);
        return NextResponse.json(
            { error: 'Erro ao deletar surebet' },
            { status: 500 }
        );
    }
}
