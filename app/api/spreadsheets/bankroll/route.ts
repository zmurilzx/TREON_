import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Carregar planilha do usuário
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { bankroll: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Se não existir planilha, retornar dados padrão
    if (!user.bankroll) {
      return NextResponse.json({
        bancaInicial: 2000,
        metaMensal: 10000,
        rows: []
      });
    }

    return NextResponse.json({
      bancaInicial: user.bankroll.bancaInicial,
      metaMensal: user.bankroll.metaMensal,
      rows: user.bankroll.rows
    });

  } catch (error) {
    console.error('Erro ao carregar planilha:', error);
    return NextResponse.json({ error: 'Erro ao carregar planilha' }, { status: 500 });
  }
}

// POST - Salvar planilha do usuário
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const { bancaInicial, metaMensal, rows } = await req.json();

    // Upsert: criar ou atualizar
    const bankroll = await prisma.bankroll.upsert({
      where: { userId: user.id },
      update: {
        bancaInicial,
        metaMensal,
        rows
      },
      create: {
        userId: user.id,
        bancaInicial,
        metaMensal,
        rows
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Planilha salva com sucesso!',
      data: bankroll
    });

  } catch (error) {
    console.error('Erro ao salvar planilha:', error);
    return NextResponse.json({ error: 'Erro ao salvar planilha' }, { status: 500 });
  }
}
