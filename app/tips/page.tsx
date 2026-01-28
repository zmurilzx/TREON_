'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Copy, Trophy, TrendingUp, Sparkles, Clock, Users, CheckCircle, XCircle } from 'lucide-react';

type TipStatus = 'all' | 'available' | 'live' | 'finished';

interface Tip {
    id: string;
    title: string;
    coplarem: number;
    totalOdd: number;
    status: 'available' | 'live' | 'finished';
    agendadoPara?: string;
    match: string;
    time: string;
    market: string;
    odd: number;
    result?: 'green' | 'red';
}

const mockTips: Tip[] = [
    {
        id: 'RE0216',
        title: 'ODD 106 DO DIA',
        coplarem: 2209,
        totalOdd: 106.0,
        status: 'finished',
        match: 'Europa',
        time: 'Hoje às 16:30',
        market: 'Múltipla Personalizada',
        odd: 106.57,
        result: 'green'
    },
    {
        id: 'RE0217',
        title: 'Over 3.5 Cartões',
        coplarem: 1837,
        totalOdd: 1.57,
        status: 'available',
        agendadoPara: 'Agendado',
        match: 'St. Pauli x FC Heidenheim',
        time: 'Amanhã às 11:30',
        market: 'Cartões',
        odd: 1.57,
    },
    {
        id: 'RE0216',
        title: 'Yan Diomande - Finalizações',
        coplarem: 2254,
        totalOdd: 1.62,
        status: 'finished',
        agendadoPara: 'Agendado',
        match: 'Union Berlion x Leipzig',
        time: 'Hoje às 16:30',
        market: 'Over 0.5 gols',
        odd: 1.62,
        result: 'green'
    },
];

export default function TipsPage() {
    const [activeTab, setActiveTab] = useState<TipStatus>('all');

    const filteredTips = mockTips.filter(tip => {
        if (activeTab === 'all') return true;
        return tip.status === activeTab;
    });

    const getStatusCount = (status: TipStatus) => {
        if (status === 'all') return mockTips.length;
        return mockTips.filter(t => t.status === status).length;
    };

    return (
        <DashboardLayout
            title="Top 3 Dicas do Dia"
            subtitle="As melhores dicas selecionadas para você"
        >
            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-8">
                <TabButton
                    active={activeTab === 'all'}
                    onClick={() => setActiveTab('all')}
                    count={getStatusCount('all')}
                    icon={<Sparkles className="w-4 h-4" />}
                >
                    Todas
                </TabButton>
                <TabButton
                    active={activeTab === 'available'}
                    onClick={() => setActiveTab('available')}
                    count={getStatusCount('available')}
                    icon={<Clock className="w-4 h-4" />}
                >
                    Disponíveis
                </TabButton>
                <TabButton
                    active={activeTab === 'live'}
                    onClick={() => setActiveTab('live')}
                    count={getStatusCount('live')}
                    icon={<TrendingUp className="w-4 h-4" />}
                >
                    Ao vivo
                </TabButton>
                <TabButton
                    active={activeTab === 'finished'}
                    onClick={() => setActiveTab('finished')}
                    count={getStatusCount('finished')}
                    icon={<CheckCircle className="w-4 h-4" />}
                >
                    Finalizadas
                </TabButton>
            </div>

            {/* Tips Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTips.map((tip, index) => (
                    <TipCard key={`${tip.id}-${index}`} tip={tip} />
                ))}
            </div>

            {filteredTips.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-white/5 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <XCircle className="w-10 h-10 text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-lg">Nenhuma dica disponível nesta categoria</p>
                </div>
            )}
        </DashboardLayout>
    );
}

function TabButton({
    active,
    onClick,
    children,
    count,
    icon
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    count: number;
    icon: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`group relative px-5 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${active
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
        >
            <div className="flex items-center gap-2">
                {icon}
                <span>{children}</span>
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${active ? 'bg-white/20' : 'bg-white/10'
                    }`}>
                    {count}
                </span>
            </div>
        </button>
    );
}

function TipCard({ tip }: { tip: Tip }) {
    const handleCopyBet = () => {
        alert('Bilhete copiado para área de transferência!');
    };

    return (
        <div className="group bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-1">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
                <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-400 transition-all">
                        {tip.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        <span className="bg-white/5 px-2 py-1 rounded-md">#{tip.id}</span>
                        <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{tip.coplarem.toLocaleString()}</span>
                        </div>
                        {tip.status === 'available' && (
                            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md font-semibold">
                                1u
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Trophy className="w-7 h-7 text-white" />
                    </div>
                    {tip.agendadoPara && (
                        <span className="text-[10px] text-emerald-400 font-medium">{tip.agendadoPara}</span>
                    )}
                </div>
            </div>

            {/* ODD Total - Enhanced */}
            <div className="relative mb-5 overflow-hidden">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-5 border border-emerald-500/30">
                    <p className="text-gray-400 text-xs mb-2 font-medium tracking-wide">ODD TOTAL</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-5xl font-black text-emerald-400">
                            {tip.totalOdd.toFixed(2)}
                        </p>
                        {tip.result === 'green' && (
                            <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-1 rounded-lg">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs text-emerald-400 font-bold">GREEN</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Match Details */}
            <div className="space-y-3 mb-6">
                <div className="flex items-start justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex-1">
                        <p className="font-bold text-white mb-1">{tip.match}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{tip.time}</span>
                            {tip.status === 'finished' && (
                                <span className="text-purple-400 font-medium">• FINALIZADO</span>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-400">{tip.odd}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 pl-3">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <p className="text-sm text-gray-300">{tip.market}</p>
                </div>
            </div>

            {/* Actions - Enhanced */}
            <button
                onClick={handleCopyBet}
                className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98]"
            >
                <div className="relative flex items-center justify-center gap-2">
                    <Copy className="w-5 h-5" />
                    <span>Copiar Bilhete</span>
                </div>
            </button>
            <div className="text-center mt-3">
                <button className="text-xs text-gray-500 hover:text-emerald-400 transition">
                    Dúvidas? <span className="underline">Veja como apostar</span>
                </button>
            </div>
        </div>
    );
}
