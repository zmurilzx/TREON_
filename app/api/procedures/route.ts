import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Listar todas as entradas do usuário
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

        // Buscar todas as entradas do usuário
        const entries = await prisma.procedureEntry.findMany({
            where: { userId: user.id },
            orderBy: { data: 'desc' }
        });

        return NextResponse.json({
            success: true,
            entries
        });

    } catch (error) {
        console.error('Erro ao buscar entradas:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar entradas' },
            { status: 500 }
        );
    }
}

// POST - Criar nova entrada
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
            dataCompleta,
            tipo,
            evento,
            casas,
            totalInvestido,
            retornoTotal,
            lucro,
            roi,
            defesa
        } = body;

        // Validações
        if (!data || !tipo || !evento) {
            return NextResponse.json(
                { error: 'Dados obrigatórios faltando' },
                { status: 400 }
            );
        }

        // Criar entrada
        const entry = await prisma.procedureEntry.create({
            data: {
                userId: user.id,
                data,
                dataCompleta,
                tipo,
                evento,
                casas,
                totalInvestido,
                retornoTotal,
                lucro,
                roi,
                defesa
            }
        });

        return NextResponse.json({
            success: true,
            entry
        });

    } catch (error) {
        console.error('Erro ao criar entrada:', error);
        return NextResponse.json(
            { error: 'Erro ao criar entrada' },
            { status: 500 }
        );
    }
}

// PUT - Atualizar entrada existente
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
                { error: 'ID da entrada não fornecido' },
                { status: 400 }
            );
        }

        // Verificar se a entrada pertence ao usuário
        const entry = await prisma.procedureEntry.findUnique({
            where: { id }
        });

        if (!entry) {
            return NextResponse.json(
                { error: 'Entrada não encontrada' },
                { status: 404 }
            );
        }

        if (entry.userId !== user.id) {
            return NextResponse.json(
                { error: 'Você não tem permissão para atualizar esta entrada' },
                { status: 403 }
            );
        }

        // Atualizar entrada
        const updatedEntry = await prisma.procedureEntry.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({
            success: true,
            entry: updatedEntry
        });

    } catch (error) {
        console.error('Erro ao atualizar entrada:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar entrada' },
            { status: 500 }
        );
    }
}

// DELETE - Deletar entrada
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

        // Pegar o ID da entrada da URL
        const { searchParams } = new URL(req.url);
        const entryId = searchParams.get('id');

        if (!entryId) {
            return NextResponse.json(
                { error: 'ID da entrada não fornecido' },
                { status: 400 }
            );
        }

        // Verificar se a entrada pertence ao usuário
        const entry = await prisma.procedureEntry.findUnique({
            where: { id: entryId }
        });

        if (!entry) {
            return NextResponse.json(
                { error: 'Entrada não encontrada' },
                { status: 404 }
            );
        }

        if (entry.userId !== user.id) {
            return NextResponse.json(
                { error: 'Você não tem permissão para deletar esta entrada' },
                { status: 403 }
            );
        }

        // Deletar a entrada
        await prisma.procedureEntry.delete({
            where: { id: entryId }
        });

        return NextResponse.json({
            success: true,
            message: 'Entrada deletada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao deletar entrada:', error);
        return NextResponse.json(
            { error: 'Erro ao deletar entrada' },
            { status: 500 }
        );
    }
}
