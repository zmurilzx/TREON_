import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Listar todas as contas do usuário
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

        // Buscar todas as contas do usuário
        const contas = await prisma.account.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            contas
        });

    } catch (error) {
        console.error('Erro ao buscar contas:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar contas' },
            { status: 500 }
        );
    }
}

// POST - Criar nova conta
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
            parceiro,
            telefone,
            casa,
            metodo,
            status,
            tipo,
            percentual,
            lucroLiquido,
            repasse,
            repassePago,
            roi
        } = body;

        // Validações
        if (!parceiro || !casa || !metodo || !status || !tipo) {
            return NextResponse.json(
                { error: 'Dados obrigatórios faltando' },
                { status: 400 }
            );
        }

        // Criar conta
        const conta = await prisma.account.create({
            data: {
                userId: user.id,
                parceiro,
                telefone,
                casa,
                metodo,
                status,
                tipo,
                percentual,
                lucroLiquido,
                repasse,
                repassePago,
                roi
            }
        });

        return NextResponse.json({
            success: true,
            conta
        });

    } catch (error) {
        console.error('Erro ao criar conta:', error);
        return NextResponse.json(
            { error: 'Erro ao criar conta' },
            { status: 500 }
        );
    }
}

// PUT - Atualizar conta existente
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
                { error: 'ID da conta não fornecido' },
                { status: 400 }
            );
        }

        // Verificar se a conta pertence ao usuário
        const conta = await prisma.account.findUnique({
            where: { id }
        });

        if (!conta) {
            return NextResponse.json(
                { error: 'Conta não encontrada' },
                { status: 404 }
            );
        }

        if (conta.userId !== user.id) {
            return NextResponse.json(
                { error: 'Você não tem permissão para atualizar esta conta' },
                { status: 403 }
            );
        }

        // Atualizar conta
        const updatedConta = await prisma.account.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({
            success: true,
            conta: updatedConta
        });

    } catch (error) {
        console.error('Erro ao atualizar conta:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar conta' },
            { status: 500 }
        );
    }
}

// DELETE - Deletar conta
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

        // Pegar o ID da conta da URL
        const { searchParams } = new URL(req.url);
        const contaId = searchParams.get('id');

        if (!contaId) {
            return NextResponse.json(
                { error: 'ID da conta não fornecido' },
                { status: 400 }
            );
        }

        // Verificar se a conta pertence ao usuário
        const conta = await prisma.account.findUnique({
            where: { id: contaId }
        });

        if (!conta) {
            return NextResponse.json(
                { error: 'Conta não encontrada' },
                { status: 404 }
            );
        }

        if (conta.userId !== user.id) {
            return NextResponse.json(
                { error: 'Você não tem permissão para deletar esta conta' },
                { status: 403 }
            );
        }

        // Deletar a conta
        await prisma.account.delete({
            where: { id: contaId }
        });

        return NextResponse.json({
            success: true,
            message: 'Conta deletada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao deletar conta:', error);
        return NextResponse.json(
            { error: 'Erro ao deletar conta' },
            { status: 500 }
        );
    }
}
