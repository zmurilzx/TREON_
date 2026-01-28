import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const userId = session.user.id

    // Buscar apostas recentes do usuário
    const surebets = await prisma.surebet.findMany({
      where: { userId },
      orderBy: { betDate: 'desc' },
      take: limit
    })

    // Formatar dados para o frontend
    const recentBets = surebets.map(bet => {
      const isSettled = bet.status === 'SETTLED'
      const profit = isSettled ? (bet.actualProfit || 0) : 0
      const status = isSettled ? (profit >= 0 ? 'green' : 'red') : 'pending'
      
      // Formatar data
      const dateStr = formatDistanceToNow(bet.betDate, { 
        addSuffix: true, 
        locale: ptBR 
      })

      return {
        id: bet.id,
        match: bet.event,
        market: `${bet.market1} vs ${bet.market2}`,
        stake: Number(bet.totalStake),
        odd: Number(((bet.odd1 + bet.odd2) / 2).toFixed(2)), // Média das odds
        status,
        profit: Number(profit.toFixed(2)),
        date: dateStr.charAt(0).toUpperCase() + dateStr.slice(1),
        sport: bet.sport,
        house1: bet.house1,
        house2: bet.house2,
        betDate: bet.betDate
      }
    })

    return NextResponse.json(recentBets)

  } catch (error: any) {
    console.error('Error fetching recent bets:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
