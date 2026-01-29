"use client";

import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import ProgressBar from "@/components/ProgressBar";
import {
    TrendingUp,
    DollarSign,
    Target,
    Award,
    Calendar,
    ArrowUpRight,
    Copy,
    CheckCircle2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface DashboardStats {
    roi: number;
    totalStaked: number;
    netProfit: number;
    winRate: number;
    todayProfit: number;
    weekProfit: number;
    monthProfit: number;
    level: number;
    xp: number;
    xpToNextLevel: number;
    totalBets: number;
    winningBets: number;
    spreadsheets?: {
        bankroll: number;
        procedures: number;
        earnings: number;
        accounts: number;
        total: number;
    };
}

interface RecentBet {
    id: string;
    match: string;
    market: string;
    stake: number;
    odd: number;
    status: string;
    profit: number;
    date: string;
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentBets, setRecentBets] = useState<RecentBet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDashboardData() {
            if (status === 'authenticated') {
                try {
                    // Buscar estatísticas
                    const statsResponse = await fetch('/api/dashboard/stats');
                    if (statsResponse.ok) {
                        const statsData = await statsResponse.json();
                        setStats(statsData);
                    }

                    // Buscar apostas recentes
                    const betsResponse = await fetch('/api/dashboard/recent-bets?limit=4');
                    if (betsResponse.ok) {
                        const betsData = await betsResponse.json();
                        setRecentBets(betsData);
                    }
                } catch (error) {
                    console.error('Error loading dashboard data:', error);
                } finally {
                    setLoading(false);
                }
            }
        }

        loadDashboardData();
    }, [status]);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading || !stats) {
        return (
            <DashboardLayout title="Meu Desempenho" subtitle="Carregando...">
                <div className="flex items-center justify-center h-64">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </DashboardLayout>
        );
    }

    const achievements = [
        { icon: "🎯", title: "Primeira Vitória", description: "Ganhe sua primeira aposta", unlocked: true },
        { icon: "🔥", title: "Sequência de 5", description: "5 vitórias consecutivas", unlocked: true },
        { icon: "💎", title: "ROI Diamante", description: "Alcance 20% de ROI", unlocked: false },
        { icon: "👑", title: "Rei da Banca", description: "Lucro de R$ 10.000", unlocked: false }
    ];

    return (
        <DashboardLayout
            title="Meu Desempenho"
            subtitle="Acompanhe suas estatísticas e performance em tempo real"
        >
            {/* Welcome Banner */}
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-chrome-600/20 via-chrome-500/10 to-chrome-400/20 border border-chrome-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">
                        Olá, <span className="text-chrome">{session?.user?.name || 'Usuário'}</span>! 👋
                    </h2>
                    <p className="text-gray-400">
                        Veja abaixo sua performance detalhada de ganhos
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    label="ROI Médio"
                    value={`${stats.roi > 0 ? '+' : ''}${stats.roi}%`}
                    icon={TrendingUp}
                    variant="success"
                    trend={stats.roi > 0 ? { value: `${stats.roi.toFixed(1)}%`, positive: true } : undefined}
                />
                <StatsCard
                    label="Total Apostado"
                    value={`R$ ${stats.totalStaked.toLocaleString('pt-BR')}`}
                    icon={DollarSign}
                    variant="default"
                />
                <StatsCard
                    label="Lucro Líquido"
                    value={`R$ ${stats.netProfit.toLocaleString('pt-BR')}`}
                    icon={Award}
                    variant="success"
                    trend={stats.netProfit > 0 ? { value: `${stats.winningBets} vitórias`, positive: true } : undefined}
                />
                <StatsCard
                    label="Win Rate"
                    value={`${stats.winRate}%`}
                    icon={Target}
                    variant="premium"
                    trend={stats.totalBets > 0 ? { value: `${stats.totalBets} apostas`, positive: true } : undefined}
                />
            </div>

            {/* Lucro Total das Planilhas */}
            {stats.spreadsheets && (
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-600/20 via-emerald-500/10 to-emerald-400/20 border border-emerald-500/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-300 mb-1">💰 Lucro Total das Planilhas</h3>
                                <p className="text-sm text-gray-400">Soma de todas as suas operações</p>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-bold text-emerald-400">
                                    R$ {stats.spreadsheets.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                        
                        {/* Breakdown por planilha */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-emerald-500/20">
                            <div className="text-center">
                                <div className="text-xs text-gray-400 mb-1">Gestão de Banca</div>
                                <div className="text-lg font-bold text-white">
                                    R$ {stats.spreadsheets.bankroll.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-gray-400 mb-1">Aumentada 25%</div>
                                <div className="text-lg font-bold text-white">
                                    R$ {stats.spreadsheets.procedures.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-gray-400 mb-1">Planilha de Ganhos</div>
                                <div className="text-lg font-bold text-white">
                                    R$ {stats.spreadsheets.earnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-gray-400 mb-1">Gestão de Contas</div>
                                <div className="text-lg font-bold text-white">
                                    R$ {stats.spreadsheets.accounts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Earnings by Period */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card-gamified">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-chrome-500 animate-pulse" />
                            <span className="text-sm text-gray-400">Ganhos de hoje</span>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-chrome-400 mb-1">
                        R$ {stats.todayProfit.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-xs text-gray-500">Atualizado agora</div>
                </div>

                <div className="card-gamified">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-400">Ganhos da semana</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                        R$ {stats.weekProfit.toLocaleString('pt-BR')}
                    </div>
                    <ProgressBar value={stats.weekProfit} max={3000} size="sm" />
                </div>

                <div className="card-gamified">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-400">Ganhos do mês</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                        R$ {stats.monthProfit.toLocaleString('pt-BR')}
                    </div>
                    <ProgressBar value={stats.monthProfit} max={10000} size="sm" />
                </div>
            </div>

            {/* Level & Achievements Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Level Progress */}
                <div className="card-gamified lg:col-span-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl font-bold shadow-premium-glow">
                            {stats.level}
                        </div>
                        <div>
                            <div className="text-lg font-bold">Nível {stats.level}</div>
                            <div className="text-sm text-gray-400">Apostador Avançado</div>
                        </div>
                    </div>
                    <ProgressBar
                        value={stats.xp}
                        max={stats.xpToNextLevel}
                        label="Progresso para Nível 13"
                        variant="premium"
                    />
                    <div className="mt-2 text-xs text-gray-500 text-center">
                        {stats.xp.toLocaleString()} / {stats.xpToNextLevel.toLocaleString()} XP
                    </div>
                </div>

                {/* Achievements */}
                <div className="card-gamified lg:col-span-2">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-400" />
                        Conquistas Recentes
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {achievements.map((achievement, idx) => (
                            <div
                                key={idx}
                                className={`p-3 rounded-xl border transition-all ${achievement.unlocked
                                        ? 'bg-chrome-500/5 border-chrome-500/30'
                                        : 'bg-white/5 border-white/10 opacity-50'
                                    }`}
                            >
                                <div className="text-2xl mb-1">{achievement.icon}</div>
                                <div className="text-sm font-semibold mb-1">{achievement.title}</div>
                                <div className="text-xs text-gray-400">{achievement.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Bets Table */}
            <div className="card-gamified">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-chrome-400" />
                        Apostas Recentes
                    </h3>
                    <Link
                        href="/dashboard/transactions"
                        className="text-sm text-chrome-400 hover:text-chrome-300 flex items-center gap-1 transition-colors"
                    >
                        Ver todas
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">
                                    Partida
                                </th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">
                                    Mercado
                                </th>
                                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">
                                    Stake
                                </th>
                                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">
                                    Odd
                                </th>
                                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">
                                    Lucro
                                </th>
                                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">
                                    Status
                                </th>
                                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentBets.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-400">
                                        Nenhuma aposta registrada ainda.
                                        <Link href="/dashboard/transactions" className="block mt-2 text-emerald-400 hover:text-emerald-300">
                                            Registrar primeira aposta
                                        </Link>
                                    </td>
                                </tr>
                            ) : recentBets.map((bet) => (
                                <tr key={bet.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-4">
                                        <div className="font-medium">{bet.match}</div>
                                        <div className="text-xs text-gray-500">{bet.date}</div>
                                    </td>
                                    <td className="py-4">
                                        <span className="text-sm text-gray-300">{bet.market}</span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <span className="text-sm">R$ {bet.stake}</span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <span className="text-sm font-semibold">{bet.odd.toFixed(2)}</span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <span className={`text-sm font-bold ${bet.profit > 0 ? 'text-chrome-400' : 'text-red-400'
                                            }`}>
                                            {bet.profit > 0 ? '+' : ''}R$ {Math.abs(bet.profit)}
                                        </span>
                                    </td>
                                    <td className="py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${bet.status === 'green'
                                                ? 'bg-chrome-500/10 text-chrome-400 border border-chrome-500/20'
                                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}>
                                            {bet.status === 'green' ? 'GREEN' : 'RED'}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button
                                            onClick={() => handleCopy(bet.match, bet.id)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            title="Copiar detalhes"
                                        >
                                            {copiedId === bet.id ? (
                                                <CheckCircle2 className="w-4 h-4 text-chrome-400" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-gray-400" />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Link
                    href="/calculators"
                    className="card-hover group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-chrome-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-6 h-6 text-chrome-400" />
                        </div>
                        <div>
                            <div className="font-semibold group-hover:text-chrome-400 transition-colors">
                                Calculadoras
                            </div>
                            <div className="text-sm text-gray-400">Acesse todas as ferramentas</div>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/tips"
                    className="card-hover group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Target className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <div className="font-semibold group-hover:text-purple-400 transition-colors">
                                Tips do Dia
                            </div>
                            <div className="text-sm text-gray-400">Veja as dicas de hoje</div>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/checkout"
                    className="card-hover group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Award className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                            <div className="font-semibold group-hover:text-yellow-400 transition-colors">
                                Upgrade VIP
                            </div>
                            <div className="text-sm text-gray-400">Desbloqueie recursos premium</div>
                        </div>
                    </div>
                </Link>
            </div>
        </DashboardLayout>
    );
}
