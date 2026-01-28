"use client";

import { useState, useEffect } from "react";
import DashboardLayout from '@/components/DashboardLayout';
import { Calculator, Copy, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";

// Goal lines available for Over/Under
const GOAL_LINES = [
    0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3,
    3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5, 5.25, 5.5, 5.75, 6, 6.25, 6.5
];

interface BetResult {
    goals: number;
    overResult: number; // -1 = loss, 0 = refund, 0.5 = half win, 1 = win
    underResult: number;
    profit: number;
    roi: number;
    status: 'double-green' | 'single-green' | 'loss' | 'neutral';
}

export default function GolsHACalculator() {
    const [investment, setInvestment] = useState<string>("100");
    const [overLine, setOverLine] = useState<number>(2.5);
    const [overOdd, setOverOdd] = useState<string>("2.00");
    const [underLine, setUnderLine] = useState<number>(4.5);
    const [underOdd, setUnderOdd] = useState<string>("2.00");
    const [copiedStake, setCopiedStake] = useState<string | null>(null);
    const [stakeCasa1Input, setStakeCasa1Input] = useState<string>("");
    const [stakeCasa2Input, setStakeCasa2Input] = useState<string>("");
    const [lastEditedStake, setLastEditedStake] = useState<'casa1' | 'casa2' | 'investment' | null>(null);

    const [results, setResults] = useState<BetResult[]>([]);
    const [stakeCasa1, setStakeCasa1] = useState<number>(0);
    const [stakeCasa2, setStakeCasa2] = useState<number>(0);

    // Calculate Asian Handicap result for a given line and goals
    const calculateAsianHandicapResult = (line: number, goals: number, isOver: boolean): number => {
        const diff = goals - line;

        if (isOver) {
            // Over bet
            if (diff > 0) return 1; // Win
            if (diff === 0) return 0; // Refund
            if (diff === -0.25) return -0.5; // Half loss
            if (diff === -0.5) return -1; // Full loss
            if (diff < -0.5) return -1; // Full loss
        } else {
            // Under bet
            if (diff < 0) return 1; // Win
            if (diff === 0) return 0; // Refund
            if (diff === 0.25) return -0.5; // Half loss
            if (diff === 0.5) return -1; // Full loss
            if (diff > 0.5) return -1; // Full loss
        }

        return -1;
    };

    // Calculate results for all goal scenarios
    useEffect(() => {
        let stake1: number;
        let stake2: number;
        let inv: number;

        const odd1 = parseFloat(overOdd) || 1;
        const odd2 = parseFloat(underOdd) || 1;

        if (lastEditedStake === 'casa1') {
            // User edited Casa 1 stake, calculate Casa 2 and investment
            if (stakeCasa1Input === '' || stakeCasa1Input === undefined) {
                // Field is empty, keep everything empty/zero
                setStakeCasa1(0);
                setStakeCasa2(0);
                setStakeCasa2Input('');
                setInvestment('');
                stake1 = 0;
                stake2 = 0;
            } else {
                stake1 = parseFloat(stakeCasa1Input) || 0;
                stake2 = stake1 * (odd1 / odd2);
                inv = stake1 + stake2;
                setStakeCasa1(stake1);
                setStakeCasa2(stake2);
                setStakeCasa2Input(stake2.toFixed(2));
                setInvestment(inv.toFixed(2));
            }
        } else if (lastEditedStake === 'casa2') {
            // User edited Casa 2 stake, calculate Casa 1 and investment
            if (stakeCasa2Input === '' || stakeCasa2Input === undefined) {
                // Field is empty, keep everything empty/zero
                setStakeCasa1(0);
                setStakeCasa2(0);
                setStakeCasa1Input('');
                setInvestment('');
                stake1 = 0;
                stake2 = 0;
            } else {
                stake2 = parseFloat(stakeCasa2Input) || 0;
                stake1 = stake2 * (odd2 / odd1);
                inv = stake1 + stake2;
                setStakeCasa1(stake1);
                setStakeCasa2(stake2);
                setStakeCasa1Input(stake1.toFixed(2));
                setInvestment(inv.toFixed(2));
            }
        } else {
            // User edited investment or odds, calculate stakes from investment
            if (investment === '' || investment === undefined) {
                // Investment is empty, clear stakes
                setStakeCasa1(0);
                setStakeCasa2(0);
                setStakeCasa1Input('');
                setStakeCasa2Input('');
                stake1 = 0;
                stake2 = 0;
            } else {
                inv = parseFloat(investment) || 0;
                stake1 = inv / (1 + (odd1 / odd2));
                stake2 = inv - stake1;
                setStakeCasa1(stake1);
                setStakeCasa2(stake2);
                setStakeCasa1Input(stake1.toFixed(2));
                setStakeCasa2Input(stake2.toFixed(2));
            }
        }

        // Calculate results for each goal scenario (0 to 10)
        const newResults: BetResult[] = [];

        for (let goals = 0; goals <= 10; goals++) {
            const overResult = calculateAsianHandicapResult(overLine, goals, true);
            const underResult = calculateAsianHandicapResult(underLine, goals, false);

            // Calculate profit/loss
            let profit = 0;

            // Over bet profit
            if (overResult === 1) {
                profit += stake1 * (odd1 - 1);
            } else if (overResult === 0.5) {
                profit += (stake1 / 2) * (odd1 - 1) - (stake1 / 2);
            } else if (overResult === -0.5) {
                profit -= stake1 / 2;
            } else if (overResult === -1) {
                profit -= stake1;
            }

            // Under bet profit
            if (underResult === 1) {
                profit += stake2 * (odd2 - 1);
            } else if (underResult === 0.5) {
                profit += (stake2 / 2) * (odd2 - 1) - (stake2 / 2);
            } else if (underResult === -0.5) {
                profit -= stake2 / 2;
            } else if (underResult === -1) {
                profit -= stake2;
            }

            const totalInv = stake1 + stake2;
            const roi = totalInv > 0 ? (profit / totalInv) * 100 : 0;

            // Determine status
            let status: BetResult['status'] = 'loss';
            if (overResult > 0 && underResult > 0) {
                status = 'double-green';
            } else if (overResult > 0 || underResult > 0) {
                status = 'single-green';
            } else if (profit === 0) {
                status = 'neutral';
            }

            newResults.push({
                goals,
                overResult,
                underResult,
                profit,
                roi,
                status
            });
        }

        setResults(newResults);
    }, [investment, overLine, overOdd, underLine, underOdd, stakeCasa1Input, stakeCasa2Input, lastEditedStake]);

    const handleInvestmentChange = (value: string) => {
        setInvestment(value);
        setLastEditedStake('investment');
    };

    const handleStakeCasa1Change = (value: string) => {
        setStakeCasa1Input(value);
        setLastEditedStake('casa1');
    };

    const handleStakeCasa2Change = (value: string) => {
        setStakeCasa2Input(value);
        setLastEditedStake('casa2');
    };

    const copyToClipboard = (value: number, label: string) => {
        navigator.clipboard.writeText(value.toFixed(2));
        setCopiedStake(label);
        setTimeout(() => setCopiedStake(null), 2000);
    };

    const bestProfit = Math.max(...results.map(r => r.profit));
    const worstLoss = Math.min(...results.map(r => r.profit));
    const doubleGreenScenarios = results.filter(r => r.status === 'double-green');

    return (
        <DashboardLayout
            title="Gols HA"
            subtitle="Calculadora profissional para Handicap Asiático de Gols"
        >
            <div className="max-w-7xl mx-auto">
                {/* Info Alert */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-300">
                            <strong>Duplo Green:</strong> Encontre oportunidades onde ambas as apostas ganham no mesmo cenário de gols.
                            Exemplo: Over 2.5 + Under 4.5 = Duplo Green com 3 gols.
                        </div>
                    </div>
                </div>

                {/* Investment Input */}
                <div className="bg-[#0f1419] border border-white/10 rounded-xl p-6 mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Investimento Total
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">R$</span>
                        <input
                            type="number"
                            value={investment}
                            onChange={(e) => handleInvestmentChange(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            className="w-full bg-[#0a0e1a] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="100"
                        />
                    </div>
                </div>

                {/* Markets Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Casa 1 - Over */}
                    <div className="bg-[#0f1419] border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 text-sm font-bold">1</span>
                            Casa 1 - Over
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Linha Over</label>
                                <select
                                    value={overLine}
                                    onChange={(e) => setOverLine(parseFloat(e.target.value))}
                                    className="w-full bg-[#0a0e1a] border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    {GOAL_LINES.map(line => (
                                        <option key={line} value={line}>Over {line}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Odd</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={overOdd}
                                    onChange={(e) => setOverOdd(e.target.value)}
                                    className="w-full bg-[#0a0e1a] border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="2.00"
                                />
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-400">Stake</span>
                                    <button
                                        onClick={() => copyToClipboard(stakeCasa1, 'casa1')}
                                        className="text-emerald-400 hover:text-emerald-300 transition"
                                    >
                                        {copiedStake === 'casa1' ? (
                                            <CheckCircle2 className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={stakeCasa1Input}
                                        onChange={(e) => handleStakeCasa1Change(e.target.value)}
                                        onFocus={(e) => e.target.select()}
                                        className="w-full bg-[#0a0e1a] border border-emerald-500/50 rounded-lg pl-10 pr-4 py-2 text-xl font-bold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Casa 2 - Under */}
                    <div className="bg-[#0f1419] border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 text-sm font-bold">2</span>
                            Casa 2 - Under
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Linha Under</label>
                                <select
                                    value={underLine}
                                    onChange={(e) => setUnderLine(parseFloat(e.target.value))}
                                    className="w-full bg-[#0a0e1a] border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                >
                                    {GOAL_LINES.map(line => (
                                        <option key={line} value={line}>Under {line}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Odd</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={underOdd}
                                    onChange={(e) => setUnderOdd(e.target.value)}
                                    className="w-full bg-[#0a0e1a] border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="1.80"
                                />
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-400">Stake</span>
                                    <button
                                        onClick={() => copyToClipboard(stakeCasa2, 'casa2')}
                                        className="text-cyan-400 hover:text-cyan-300 transition"
                                    >
                                        {copiedStake === 'casa2' ? (
                                            <CheckCircle2 className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={stakeCasa2Input}
                                        onChange={(e) => handleStakeCasa2Change(e.target.value)}
                                        onFocus={(e) => e.target.select()}
                                        className="w-full bg-[#0a0e1a] border border-cyan-500/50 rounded-lg pl-10 pr-4 py-2 text-xl font-bold text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#0f1419] border border-white/10 rounded-xl p-4">
                        <div className="text-sm text-gray-400 mb-1">Investimento</div>
                        <div className="text-xl font-bold">R$ {parseFloat(investment || "0").toFixed(2)}</div>
                    </div>
                    <div className="bg-[#0f1419] border border-emerald-500/20 rounded-xl p-4">
                        <div className="text-sm text-gray-400 mb-1">Melhor Lucro</div>
                        <div className="text-xl font-bold text-emerald-400">R$ +{bestProfit.toFixed(2)}</div>
                    </div>
                    <div className={`bg-[#0f1419] border ${worstLoss >= 0 ? 'border-emerald-500/20' : 'border-red-500/20'} rounded-xl p-4`}>
                        <div className="text-sm text-gray-400 mb-1">Pior Resultado</div>
                        <div className={`text-xl font-bold ${worstLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            R$ {worstLoss >= 0 ? '+' : ''}{worstLoss.toFixed(2)}
                        </div>
                    </div>
                    <div className="bg-[#0f1419] border border-yellow-500/20 rounded-xl p-4">
                        <div className="text-sm text-gray-400 mb-1">Duplo Green</div>
                        <div className="text-xl font-bold text-yellow-400">{doubleGreenScenarios.length} cenários</div>
                    </div>
                </div>

                {/* Results Table */}
                <div className="bg-[#0f1419] border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-yellow-400" />
                        Resultados por Cenário de Gols
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Gols</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Over {overLine}</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Under {underLine}</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Lucro/Perda</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">ROI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((result) => {
                                    const bgColor =
                                        result.status === 'double-green' ? 'bg-emerald-500/10 border-l-4 border-emerald-500' :
                                            result.status === 'single-green' ? 'bg-emerald-500/5' :
                                                result.status === 'neutral' ? 'bg-gray-500/5' :
                                                    'bg-red-500/5';

                                    const getResultIcon = (res: number) => {
                                        if (res === 1) return '✓';
                                        if (res === 0.5) return '½✓';
                                        if (res === 0) return '↺';
                                        if (res === -0.5) return '½✗';
                                        return '✗';
                                    };

                                    const getResultColor = (res: number) => {
                                        if (res > 0) return 'text-emerald-400';
                                        if (res === 0) return 'text-gray-400';
                                        return 'text-red-400';
                                    };

                                    return (
                                        <tr key={result.goals} className={`${bgColor} transition-colors`}>
                                            <td className="py-3 px-4 font-semibold">
                                                {result.goals} {result.goals === 1 ? 'gol' : 'gols'}
                                            </td>
                                            <td className={`py-3 px-4 text-center font-medium ${getResultColor(result.overResult)}`}>
                                                {getResultIcon(result.overResult)}
                                            </td>
                                            <td className={`py-3 px-4 text-center font-medium ${getResultColor(result.underResult)}`}>
                                                {getResultIcon(result.underResult)}
                                            </td>
                                            <td className={`py-3 px-4 text-right font-semibold ${result.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                R$ {result.profit.toFixed(2)}
                                            </td>
                                            <td className={`py-3 px-4 text-right font-semibold ${result.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {result.roi >= 0 ? '+' : ''}{result.roi.toFixed(2)}%
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Legend */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="text-sm text-gray-400 mb-3 font-medium">Legenda:</div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-400 font-bold">✓</span>
                                <span className="text-gray-400">Ganho</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-400 font-bold">½✓</span>
                                <span className="text-gray-400">Meio Ganho</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-bold">↺</span>
                                <span className="text-gray-400">Reembolso</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-red-400 font-bold">½✗</span>
                                <span className="text-gray-400">Meia Perda</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-red-400 font-bold">✗</span>
                                <span className="text-gray-400">Perda</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
