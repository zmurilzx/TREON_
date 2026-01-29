import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
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

    const monthData = await request.json();
    
    const archivedMonth = await prisma.bankrollArchive.create({
      data: {
        userId: user.id,
        mesAno: monthData.mesAno,
        bancaInicial: monthData.bancaInicial,
        metaMensal: monthData.metaMensal,
        lucroTotal: monthData.lucroTotal,
        roiMensal: monthData.roiMensal,
        rows: monthData.rows
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Mês arquivado com sucesso',
      id: archivedMonth.id 
    });
  } catch (error) {
    console.error('Erro ao arquivar mês:', error);
    return NextResponse.json(
      { error: 'Erro ao arquivar mês' },
      { status: 500 }
    );
  }
}

export async function GET() {
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

    const archives = await prisma.bankrollArchive.findMany({
      where: { userId: user.id },
      orderBy: { archivedAt: 'desc' }
    });

    return NextResponse.json(archives);
  } catch (error) {
    console.error('Erro ao carregar arquivos:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar arquivos' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID não fornecido' },
        { status: 400 }
      );
    }

    await prisma.bankrollArchive.delete({
      where: { 
        id,
        userId: user.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Mês deletado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao deletar mês:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar mês' },
      { status: 500 }
    );
  }
}
