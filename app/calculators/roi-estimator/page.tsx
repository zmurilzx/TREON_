'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function ROIEstimatorPage() {
    const [totalStaked, setTotalStaked] = useState('');
    const [totalReturned, setTotalReturned] = useState('');
    const [numberOfBets, setNumberOfBets] = useState('');
    const [result, setResult] = useState<{
        roi: number;
        profit: number;
        averageOdds: number;
        winRate: number;
    } | null>(null);

    const handleCalculate = () => {
        const staked = parseFloat(totalStaked);
        const returned = parseFloat(totalReturned);
        const bets = parseInt(numberOfBets);

        if (!staked || !returned || !bets) return;

        const profit = returned - staked;
        const roi = (profit / staked) * 100;
        const averageOdds = returned / staked;
        const winRate = (returned / staked) * 100;

        setResult({
            roi: Math.round(roi * 100) / 100,
            profit: Math.round(profit * 100) / 100,
            averageOdds: Math.round(averageOdds * 100) / 100,
            winRate: Math.round(winRate * 100) / 100,
        });
    };

    return (
        <DashboardLayout
            title="ROI Estimator"
            subtitle="Analise o retorno sobre investimento das suas apostas"
        >
            <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-2 border-gray-700 rounded-2xl p-8">
                    <div className="space-y-6">
                        {/* Total Staked */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Total Apostado (R$)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="1000.00"
                                value={totalStaked}
                                onChange={(e) => setTotalStaked(e.target.value)}
                            />
                        </div>

                        {/* Total Returned */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Total Retornado (R$)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="1200.00"
                                value={totalReturned}
                                onChange={(e) => setTotalReturned(e.target.value)}
                            />
                        </div>

                        {/* Number of Bets */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Número de Apostas</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="50"
                                value={numberOfBets}
                                onChange={(e) => setNumberOfBets(e.target.value)}
                            />
                        </div>

                        {/* Calculate Button */}
                        <button
                            onClick={handleCalculate}
                            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
                        >
                            Calcular ROI
                        </button>

                        {/* Results */}
                        {result && (
                            <div className="mt-6 space-y-4 fade-in">
                                <h3 className="text-xl font-semibold mb-4">Resultados:</h3>
                                <ResultRow
                                    label="ROI"
                                    value={`${result.roi > 0 ? '+' : ''}${result.roi.toFixed(2)}%`}
                                    highlight
                                    positive={result.roi > 0}
                                />
                                <ResultRow
                                    label="Lucro/Prejuízo"
                                    value={`R$ ${result.profit > 0 ? '+' : ''}${result.profit.toFixed(2)}`}
                                    positive={result.profit > 0}
                                />
                                <ResultRow label="Odd Média" value={result.averageOdds.toFixed(2)} />
                                <ResultRow label="Média por Aposta" value={`R$ ${(result.profit / parseInt(numberOfBets)).toFixed(2)}`} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Card */}
                <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                    <h3 className="font-semibold mb-3 text-blue-400">Como interpretar o ROI:</h3>
                    <ul className="text-sm text-gray-300 space-y-1">
                        <li>• <strong>ROI Positivo:</strong> Você está lucrando</li>
                        <li>• <strong>ROI Negativo:</strong> Você está tendo prejuízo</li>
                        <li>• <strong>ROI acima de 5%:</strong> Excelente performance</li>
                        <li>• <strong>ROI entre 0-5%:</strong> Boa performance</li>
                        <li>• <strong>ROI abaixo de 0%:</strong> Revise sua estratégia</li>
                    </ul>
                </div>
            </div>
        </DashboardLayout>
    );
}

function ResultRow({
    label,
    value,
    highlight,
    positive,
}: {
    label: string;
    value: string;
    highlight?: boolean;
    positive?: boolean;
}) {
    const bgClass = highlight
        ? positive
            ? 'bg-success-50 dark:bg-success-900/20'
            : 'bg-danger-50 dark:bg-danger-900/20'
        : 'bg-gray-50 dark:bg-gray-800';

    const textClass = highlight ? (positive ? 'text-success-600' : 'text-danger-600') : '';

    return (
        <div className={`flex justify-between items-center p-4 rounded-lg ${bgClass}`}>
            <span className="font-medium">{label}</span>
            <span className={`text-lg font-bold ${textClass}`}>{value}</span>
        </div>
    );
}
