'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import SurebetModal from '@/components/SurebetModal';
import ResultModal from '@/components/ResultModal';
import StatsCard from '@/components/StatsCard';
import {
    TrendingUp,
    DollarSign,
    Target,
    Award,
    Plus,
    CheckCircle,
    Clock,
    Edit,
    Trash2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

interface Surebet {
    id: string;
    event: string;
    sport: string;
    betDate: string;
    house1: string;
    odd1: number;
    stake1: number;
    market1: string;
    house2: string;
    odd2: number;
    stake2: number;
    market2: string;
    totalStake: number;
    potentialProfit: number;
    status: 'PENDING' | 'SETTLED';
    winningHouse: number | null;
    actualProfit: number | null;
    roi: number | null;
    resultDate: string | null;
    createdAt: string;
}

export default function SurebetsPage() {
    const [surebets, setSurebets] = useState<Surebet[]>([]);
    const [loading, setLoading] = useState(true);

    const [showInsertModal, setShowInsertModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [selectedSurebet, setSelectedSurebet] = useState<Surebet | null>(null);
    const [editingSurebet, setEditingSurebet] = useState<Surebet | null>(null);

    // Load surebets from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('treon_surebets');
        if (stored) {
            setSurebets(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    // Save to localStorage whenever surebets change
    const saveSurebets = (newSurebets: Surebet[]) => {
        localStorage.setItem('treon_surebets', JSON.stringify(newSurebets));
        setSurebets(newSurebets);
    };

    // Calculate stats
    const stats = {
        totalBets: surebets.length,
        pendingBets: surebets.filter(s => s.status === 'PENDING').length,
        settledBets: surebets.filter(s => s.status === 'SETTLED').length,
        totalStaked: surebets.reduce((sum, s) => sum + s.totalStake, 0),
        totalProfit: surebets
            .filter(s => s.actualProfit !== null)
            .reduce((sum, s) => sum + (s.actualProfit || 0), 0),
        averageROI: 0,
        winRate: 0
    };

    const settledWithROI = surebets.filter(s => s.roi !== null);
    if (settledWithROI.length > 0) {
        stats.averageROI = settledWithROI.reduce((sum, s) => sum + (s.roi || 0), 0) / settledWithROI.length;
    }

    const settledBets = surebets.filter(s => s.status === 'SETTLED');
    if (settledBets.length > 0) {
        const profitableBets = settledBets.filter(s => (s.actualProfit || 0) > 0);
        stats.winRate = (profitableBets.length / settledBets.length) * 100;
    }

    // Chart data
    const chartData = [];
    let accumulatedProfit = 0;
    const sortedBets = [...surebets]
        .filter(s => s.status === 'SETTLED')
        .sort((a, b) => new Date(a.betDate).getTime() - new Date(b.betDate).getTime());

    for (const bet of sortedBets) {
        accumulatedProfit += bet.actualProfit || 0;
        chartData.push({
            date: bet.betDate,
            profit: accumulatedProfit,
            event: bet.event
        });
    }

    const handleInsertSuccess = (surebet: Surebet) => {
        const newSurebets = [...surebets, surebet];
        saveSurebets(newSurebets);
        setShowInsertModal(false);
        toast.success('Aposta registrada como PENDENTE!');

        // NÃO abre modal de resultado automaticamente
        // Usuário registra depois clicando em "Registrar"
    };

    const handleResultSuccess = (surebetId: string, winningHouse: number) => {
        const updatedSurebets = surebets.map(s => {
            if (s.id === surebetId) {
                let actualProfit: number;

                if (winningHouse === 1) {
                    const winnings = s.stake1 * s.odd1;
                    actualProfit = winnings - s.totalStake;
                } else {
                    const winnings = s.stake2 * s.odd2;
                    actualProfit = winnings - s.totalStake;
                }

                const roi = (actualProfit / s.totalStake) * 100;

                return {
                    ...s,
                    status: 'SETTLED' as const,
                    winningHouse,
                    actualProfit,
                    roi,
                    resultDate: new Date().toISOString()
                };
            }
            return s;
        });

        saveSurebets(updatedSurebets);
        setShowResultModal(false);
        setSelectedSurebet(null);
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta surebet?')) {
            const newSurebets = surebets.filter(s => s.id !== id);
            saveSurebets(newSurebets);
            toast.success('Surebet excluída!');
        }
    };

    const handleEdit = (bet: Surebet) => {
        setEditingSurebet(bet);
        setShowInsertModal(true);
    };

    if (loading) {
        return (
            <DashboardLayout title="Gerenciamento" subtitle="Carregando...">
                <div className="flex items-center justify-center h-64">
                    <div className="w-16 h-16 border-4 border-chrome-500 border-t-transparent rounded-full animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title="Histórico de Transações"
            subtitle="Gerencie suas surebets e acompanhe sua performance"
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    label="ROI Médio"
                    value={`${stats.averageROI.toFixed(2)}%`}
                    icon={TrendingUp}
                    variant="success"
                    trend={stats.averageROI > 0 ? { value: `${stats.averageROI.toFixed(1)}%`, positive: true } : undefined}
                />
                <StatsCard
                    label="Total Apostado"
                    value={`R$ ${stats.totalStaked.toFixed(2)}`}
                    icon={DollarSign}
                    variant="default"
                />
                <StatsCard
                    label="Lucro Líquido"
                    value={`R$ ${stats.totalProfit.toFixed(2)}`}
                    icon={Award}
                    variant={stats.totalProfit > 0 ? "success" : "danger"}
                />
                <StatsCard
                    label="Win Rate"
                    value={`${stats.winRate.toFixed(1)}%`}
                    icon={Target}
                    variant="premium"
                />
            </div>

            {/* Insert Button */}
            <div className="mb-8">
                <button
                    onClick={() => setShowInsertModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Inserir aposta
                </button>
            </div>

            {/* Performance Chart */}
            {chartData.length > 0 && (
                <div className="card-gamified mb-8">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-chrome-400" />
                        Gráfico de Performance
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#9ca3af"
                                    tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0f1419',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px'
                                    }}
                                    labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="profit"
                                    stroke="#29CD7F"
                                    strokeWidth={2}
                                    dot={{ fill: '#29CD7F', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Surebets Table */}
            <div className="card-gamified">
                <h3 className="text-lg font-bold mb-6">Histórico de Surebets</h3>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-2">ROI</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-2">Partida</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-2">Esporte</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-2">Casas</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-2">Mercado</th>
                                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-2">Odds</th>
                                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-2">Stake</th>
                                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-2">Aporte</th>
                                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-2">Status</th>
                                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-2">Lucro</th>
                                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-2">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {surebets.map((bet) => (
                                <tr key={bet.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-2">
                                        <span className={`text-sm font-bold ${bet.roi && bet.roi > 0 ? 'text-chrome-400' : bet.roi ? 'text-red-400' : 'text-gray-400'
                                            }`}>
                                            {bet.roi ? `${bet.roi.toFixed(2)}%` : '-'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-2">
                                        <div className="font-medium text-sm">{bet.event}</div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(bet.betDate).toLocaleDateString('pt-BR')}
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 text-sm text-gray-300">{bet.sport}</td>
                                    <td className="py-4 px-2">
                                        <div className="text-sm">
                                            <div className="text-chrome-400">{bet.house1}</div>
                                            <div className="text-purple-400">{bet.house2}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-2">
                                        <div className="text-xs">
                                            <div className="text-gray-300">{bet.market1}</div>
                                            <div className="text-gray-400">{bet.market2}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 text-right">
                                        <div className="text-sm">
                                            <div className="font-semibold">{bet.odd1.toFixed(2)}</div>
                                            <div className="text-gray-400">{bet.odd2.toFixed(2)}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 text-right">
                                        <div className="text-sm">
                                            <div>R$ {bet.stake1.toFixed(2)}</div>
                                            <div className="text-gray-400">R$ {bet.stake2.toFixed(2)}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 text-right">
                                        <span className="text-sm font-semibold">R$ {bet.totalStake.toFixed(2)}</span>
                                    </td>
                                    <td className="py-4 px-2 text-center">
                                        {bet.status === 'PENDING' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                                <Clock className="w-3 h-3" />
                                                Pendente
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-chrome-500/10 text-chrome-400 border border-chrome-500/20">
                                                <CheckCircle className="w-3 h-3" />
                                                Casa {bet.winningHouse}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-2 text-right">
                                        <span className={`text-sm font-bold ${bet.actualProfit && bet.actualProfit > 0 ? 'text-chrome-400' : bet.actualProfit ? 'text-red-400' : 'text-gray-400'
                                            }`}>
                                            {bet.actualProfit ? `R$ ${bet.actualProfit.toFixed(2)}` : '-'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-2 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {bet.status === 'PENDING' ? (
                                                <button
                                                    onClick={() => {
                                                        setSelectedSurebet(bet);
                                                        setShowResultModal(true);
                                                    }}
                                                    className="text-xs text-chrome-400 hover:text-chrome-300 transition"
                                                >
                                                    Registrar
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleEdit(bet)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Editar aposta"
                                                >
                                                    <Edit className="w-4 h-4 text-blue-400" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(bet.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {surebets.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 mb-2">Nenhuma surebet registrada</p>
                        <p className="text-sm text-gray-500">Clique em "Inserir aposta" para começar</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <SurebetModal
                isOpen={showInsertModal}
                onClose={() => setShowInsertModal(false)}
                onSuccess={handleInsertSuccess}
            />

            {selectedSurebet && (
                <ResultModal
                    isOpen={showResultModal}
                    onClose={() => {
                        setShowResultModal(false);
                        setSelectedSurebet(null);
                    }}
                    surebetId={selectedSurebet.id}
                    house1Name={selectedSurebet.house1}
                    house2Name={selectedSurebet.house2}
                    onSuccess={handleResultSuccess}
                />
            )}
        </DashboardLayout>
    );
}
