import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Buscar todas as surebets do usuário
    const surebets = await prisma.surebet.findMany({
      where: { userId },
      orderBy: { betDate: 'desc' }
    })

    // Calcular estatísticas
    const settledBets = surebets.filter(bet => bet.status === 'SETTLED')
    const totalBets = settledBets.length
    
    // Total apostado
    const totalStaked = surebets.reduce((sum, bet) => sum + bet.totalStake, 0)
    
    // Lucro líquido (apenas apostas finalizadas)
    const netProfit = settledBets.reduce((sum, bet) => sum + (bet.actualProfit || 0), 0)

    // ===== LUCROS DAS PLANILHAS =====
    
    // 1. Gestão de Banca - Lucro total
    const bankroll = await prisma.bankroll.findUnique({
      where: { userId }
    })
    const bankrollProfit = bankroll?.rows ? 
      (bankroll.rows as any[]).reduce((sum, row) => sum + (row.lucro || 0), 0) : 0

    // 2. Procedimentos (Aumentada 25%) - Lucro total
    const procedures = await prisma.procedureEntry.findMany({
      where: { userId }
    })
    const proceduresProfit = procedures.reduce((sum: number, entry: any) => sum + (entry.lucro || 0), 0)

    // 3. Planilha de Ganhos (Earnings) - Lucro líquido total
    const earnings = await prisma.earning.findMany({
      where: { 
        userId,
        resultado: 'green' // Apenas operações green
      }
    })
    const earningsProfit = earnings.reduce((sum: number, op: any) => sum + (op.lucroLiquido || 0), 0)

    // 4. Gestão de Contas - ROI total (seu lucro)
    const accounts = await prisma.account.findMany({
      where: { userId }
    })
    const accountsProfit = accounts.reduce((sum: number, acc: any) => sum + (acc.roi || 0), 0)

    // LUCRO TOTAL DE TODAS AS PLANILHAS
    const totalSpreadsheetProfit = bankrollProfit + proceduresProfit + earningsProfit + accountsProfit
    
    // ROI médio
    const roi = totalStaked > 0 ? (netProfit / totalStaked) * 100 : 0
    
    // Win Rate (apostas com lucro positivo)
    const winningBets = settledBets.filter(bet => (bet.actualProfit || 0) > 0).length
    const winRate = totalBets > 0 ? (winningBets / totalBets) * 100 : 0

    // Ganhos por período
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const todayProfit = settledBets
      .filter(bet => bet.resultDate && bet.resultDate >= today)
      .reduce((sum, bet) => sum + (bet.actualProfit || 0), 0)

    const weekProfit = settledBets
      .filter(bet => bet.resultDate && bet.resultDate >= weekAgo)
      .reduce((sum, bet) => sum + (bet.actualProfit || 0), 0)

    const monthProfit = settledBets
      .filter(bet => bet.resultDate && bet.resultDate >= monthAgo)
      .reduce((sum, bet) => sum + (bet.actualProfit || 0), 0)

    // Sistema de nível baseado em lucro
    const level = Math.floor(Math.max(netProfit, 0) / 1000) + 1
    const xp = Math.max(netProfit, 0) % 1000
    const xpToNextLevel = 1000

    return NextResponse.json({
      roi: Number(roi.toFixed(2)),
      totalStaked: Number(totalStaked.toFixed(2)),
      netProfit: Number(netProfit.toFixed(2)),
      winRate: Number(winRate.toFixed(1)),
      todayProfit: Number(todayProfit.toFixed(2)),
      weekProfit: Number(weekProfit.toFixed(2)),
      monthProfit: Number(monthProfit.toFixed(2)),
      level,
      xp: Number(xp.toFixed(2)),
      xpToNextLevel,
      totalBets,
      winningBets,
      // Lucros das planilhas
      spreadsheets: {
        bankroll: Number(bankrollProfit.toFixed(2)),
        procedures: Number(proceduresProfit.toFixed(2)),
        earnings: Number(earningsProfit.toFixed(2)),
        accounts: Number(accountsProfit.toFixed(2)),
        total: Number(totalSpreadsheetProfit.toFixed(2))
      }
    })

  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
