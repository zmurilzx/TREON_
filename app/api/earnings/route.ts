import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Listar todas as operações do usuário
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

        // Buscar todas as operações do usuário
        const operacoes = await prisma.earning.findMany({
            where: { userId: user.id },
            orderBy: { data: 'desc' }
        });

        return NextResponse.json({
            success: true,
            operacoes
        });

    } catch (error) {
        console.error('Erro ao buscar operações:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar operações' },
            { status: 500 }
        );
    }
}

// POST - Criar nova operação
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
            data,
            hora,
            jogo,
            tipo,
            stake,
            odd,
            casa,
            resultado,
            lucroLiquido,
            lucroParceria,
            parceria
        } = body;

        // Validações
        if (!data || !jogo || !tipo || !casa) {
            return NextResponse.json(
                { error: 'Dados obrigatórios faltando' },
                { status: 400 }
            );
        }

        // Criar operação
        const operacao = await prisma.earning.create({
            data: {
                userId: user.id,
                data,
                hora,
                jogo,
                tipo,
                stake,
                odd,
                casa,
                resultado,
                lucroLiquido,
                lucroParceria,
                parceria
            }
        });

        return NextResponse.json({
            success: true,
            operacao
        });

    } catch (error) {
        console.error('Erro ao criar operação:', error);
        return NextResponse.json(
            { error: 'Erro ao criar operação' },
            { status: 500 }
        );
    }
}

// PUT - Atualizar operação existente
export async function PUT(req: NextRequest) {
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
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'ID da operação não fornecido' },
                { status: 400 }
            );
        }

        // Verificar se a operação pertence ao usuário
        const operacao = await prisma.earning.findUnique({
            where: { id }
        });

        if (!operacao) {
            return NextResponse.json(
                { error: 'Operação não encontrada' },
                { status: 404 }
            );
        }

        if (operacao.userId !== user.id) {
            return NextResponse.json(
                { error: 'Você não tem permissão para atualizar esta operação' },
                { status: 403 }
            );
        }

        // Atualizar operação
        const updatedOperacao = await prisma.earning.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({
            success: true,
            operacao: updatedOperacao
        });

    } catch (error) {
        console.error('Erro ao atualizar operação:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar operação' },
            { status: 500 }
        );
    }
}

// DELETE - Deletar operação
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

        // Pegar o ID da operação da URL
        const { searchParams } = new URL(req.url);
        const operacaoId = searchParams.get('id');

        if (!operacaoId) {
            return NextResponse.json(
                { error: 'ID da operação não fornecido' },
                { status: 400 }
            );
        }

        // Verificar se a operação pertence ao usuário
        const operacao = await prisma.earning.findUnique({
            where: { id: operacaoId }
        });

        if (!operacao) {
            return NextResponse.json(
                { error: 'Operação não encontrada' },
                { status: 404 }
            );
        }

        if (operacao.userId !== user.id) {
            return NextResponse.json(
                { error: 'Você não tem permissão para deletar esta operação' },
                { status: 403 }
            );
        }

        // Deletar a operação
        await prisma.earning.delete({
            where: { id: operacaoId }
        });

        return NextResponse.json({
            success: true,
            message: 'Operação deletada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao deletar operação:', error);
        return NextResponse.json(
            { error: 'Erro ao deletar operação' },
            { status: 500 }
        );
    }
}
