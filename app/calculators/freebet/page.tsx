'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, X } from 'lucide-react';

interface Coverage {
    id: string;
    odd: string;
    commission: string;
    isLay: boolean;
}

export default function FreebetPage() {
    // Casa Promo (Freebet)
    const [promoOdd, setPromoOdd] = useState('3.0');
    const [promoCommission, setPromoCommission] = useState('0');
    const [qualifyingStake, setQualifyingStake] = useState('500');
    const [freebetValue, setFreebetValue] = useState('250');
    const [extractionRate, setExtractionRate] = useState('70');

    // Coberturas
    const [coverages, setCoverages] = useState<Coverage[]>([
        { id: '1', odd: '3', commission: '0', isLay: false },
        { id: '2', odd: '3', commission: '0', isLay: false }
    ]);

    const [results, setResults] = useState<{
        totalStake: number;
        roi: number;
        scenarios: {
            name: string;
            odd: number;
            commission: number;
            stake: number;
            deficit: number;
            profit: number;
        }[];
    } | null>(null);

    const addCoverage = () => {
        const newId = (coverages.length + 1).toString();
        setCoverages([...coverages, { id: newId, odd: '3', commission: '0', isLay: false }]);
    };

    const removeCoverage = (id: string) => {
        if (coverages.length > 1) {
            setCoverages(coverages.filter(c => c.id !== id));
        }
    };

    const updateCoverage = (id: string, field: keyof Coverage, value: string | boolean) => {
        setCoverages(coverages.map(c =>
            c.id === id ? { ...c, [field]: value } : c
        ));
    };

    const calculate = () => {
        const freebet = parseFloat(freebetValue) || 0;
        const qualifying = parseFloat(qualifyingStake) || 0;
        const extraction = parseFloat(extractionRate) / 100;
        const promoOddNum = parseFloat(promoOdd) || 1;
        const promoCommNum = parseFloat(promoCommission) / 100;

        if (!freebet || !promoOddNum) {
            setResults(null);
            return;
        }

        const scenarios: {
            name: string;
            odd: number;
            commission: number;
            stake: number;
            deficit: number;
            profit: number;
        }[] = [];

        // Verificar se alguma cobertura tem Lay ativo
        const hasLayActive = coverages.some(c => c.isLay);

        if (hasLayActive) {
            // MODO LAY/POSSÍVEL EXCHANGE
            const promoStake = qualifying;
            const freebetRecovery = freebet * extraction;

            // Calcular stakes para coberturas
            coverages.forEach((coverage, index) => {
                const odd = parseFloat(coverage.odd) || 1;
                const comm = parseFloat(coverage.commission) / 100;

                let calculatedStake = 0;

                if (coverage.isLay) {
                    // MODO LAY (Exchange)
                    const denominator = odd - comm;
                    if (denominator !== 0) {
                        calculatedStake = (promoStake * promoOddNum - freebetRecovery) / denominator;
                    }
                } else {
                    // MODO BACK (Dutching)
                    calculatedStake = (promoStake * promoOddNum - freebetRecovery) / odd;
                }

                scenarios.push({
                    name: `${index + 2} vence (Casa ${index + 2})`,
                    odd: odd,
                    commission: comm * 100,
                    stake: calculatedStake,
                    deficit: 0,
                    profit: 0
                });
            });

            // Adicionar cenário promo no início
            scenarios.unshift({
                name: '1 vence (Casa Promo)',
                odd: promoOddNum,
                commission: promoCommNum * 100,
                stake: promoStake,
                deficit: 0,
                profit: 0
            });

            // Stake Total: PromoStake + (Lay ? Liability : Stake) para as coberturas
            // No Shark com Lay, o "Stake Total" reflete o dinheiro em risco (Liability na Exchange + Stakes nas Books)
            const totalStake = scenarios.reduce((sum: number, s, idx) => {
                if (idx === 0) return sum + s.stake; // Promo Stake
                const cov = coverages[idx - 1];
                if (cov.isLay) {
                    return sum + (s.stake * (s.odd - 1)); // Liability
                }
                return sum + s.stake; // Back Stake
            }, 0);

            // Atualizar lucros e déficits
            let maxProfit = -Infinity;

            scenarios.forEach((s, index) => {
                let currentProfit = 0;

                if (index === 0) {
                    // CENÁRIO 1: PROMO VENCE
                    let totalLossFromHedges = 0;
                    for (let i = 1; i < scenarios.length; i++) {
                        const h = scenarios[i];
                        const c = coverages[i - 1];
                        if (c.isLay) {
                            // Lay perde: Paga Liability = Stake * (Odd - 1)
                            totalLossFromHedges += h.stake * (h.odd - 1);
                        } else {
                            // Back perde: Perde Stake
                            totalLossFromHedges += h.stake;
                        }
                    }

                    const promoWinLiquid = (s.stake * s.odd * (1 - s.commission / 100)) - s.stake;
                    currentProfit = promoWinLiquid - totalLossFromHedges;

                } else {
                    // CENÁRIO 2+: COBERTURA VENCE
                    const h = scenarios[index];
                    const c = coverages[index - 1];

                    let coverageNetGain = 0;
                    if (c.isLay) {
                        // Lay Ganha: Stake * (1 - Comm)
                        coverageNetGain = h.stake * (1 - h.commission / 100);
                    } else {
                        // Back Ganha: (Stake * Odd) - Stake
                        coverageNetGain = h.stake * (h.odd - 1) * (1 - h.commission / 100);
                    }

                    currentProfit = coverageNetGain + freebetRecovery - promoStake;
                }

                s.profit = currentProfit;
                if (s.profit > maxProfit) maxProfit = s.profit;
            });

            scenarios.forEach(s => {
                s.deficit = maxProfit - s.profit;
            });

            const avgProfit = scenarios.reduce((sum: number, s) => sum + s.profit, 0) / scenarios.length;
            const roi = (avgProfit / totalStake) * 100;

            setResults({
                totalStake,
                roi,
                scenarios
            });

        } else {
            // MODO SIMPLES - Sem Lay
            const promoProfit = freebet * (promoOddNum - 1) * (1 - promoCommNum);

            scenarios.push({
                name: '1 vence (Casa Promo)',
                odd: promoOddNum,
                commission: promoCommNum * 100,
                stake: qualifying,
                deficit: 0,
                profit: promoProfit
            });

            coverages.forEach((coverage, index) => {
                const odd = parseFloat(coverage.odd) || 1;
                const comm = parseFloat(coverage.commission) / 100;
                scenarios.push({
                    name: `${index + 2} vence (Casa ${index + 2})`,
                    odd: odd,
                    commission: comm * 100,
                    stake: freebet,
                    deficit: 0,
                    profit: freebet * (odd - 1) * (1 - comm)
                });
            });

            const totalStake = qualifying;
            const avgProfit = scenarios.reduce((sum: number, s) => sum + s.profit, 0) / scenarios.length;
            const roi = (avgProfit / totalStake) * 100;

            setResults({
                totalStake,
                roi,
                scenarios
            });
        }
    };

    useEffect(() => {
        calculate();
    }, [promoOdd, promoCommission, qualifyingStake, freebetValue, extractionRate, coverages]);

    return (
        <DashboardLayout
            title="Calculadora de Freebet"
            subtitle="Proteção em múltiplas casas com extração otimizada"
        >
            <div className="max-w-6xl mx-auto">

                {/* Casa Promo (Freebet) */}
                <div className="bg-[#0f1419] border border-cyan-500/30 rounded-2xl p-6 mb-6">
                    <h2 className="text-xl font-bold text-cyan-400 mb-4">Casa Promo (Freebet)</h2>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300 uppercase">
                                Odd da Casa
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                value={promoOdd}
                                onChange={(e) => setPromoOdd(e.target.value)}
                                onFocus={(e) => e.target.select()}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300 uppercase">
                                Comissão (%)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                value={promoCommission}
                                onChange={(e) => setPromoCommission(e.target.value)}
                                onFocus={(e) => e.target.select()}
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300 uppercase">
                                Stake Qualificação
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                value={qualifyingStake}
                                onChange={(e) => setQualifyingStake(e.target.value)}
                                onFocus={(e) => e.target.select()}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300 uppercase">
                                Valor da Freebet
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                value={freebetValue}
                                onChange={(e) => setFreebetValue(e.target.value)}
                                onFocus={(e) => e.target.select()}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-2 text-gray-300 uppercase">
                            Taxa de Extração (%)
                        </label>
                        <input
                            type="number"
                            step="1"
                            className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            value={extractionRate}
                            onChange={(e) => setExtractionRate(e.target.value)}
                            onFocus={(e) => e.target.select()}
                        />
                    </div>
                </div>

                {/* Coberturas */}
                <div className="bg-[#0f1419] border border-white/10 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-cyan-400">Coberturas</h2>
                        {coverages.length < 10 && (
                            <button
                                onClick={addCoverage}
                                className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition"
                            >
                                <Plus className="w-4 h-4" />
                                Adicionar Casa
                            </button>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {coverages.map((coverage, index) => (
                            <div key={coverage.id} className="bg-[#0a0e1a] border border-white/10 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold">Casa {index + 2}</h3>
                                    {coverages.length > 1 && (
                                        <button
                                            onClick={() => removeCoverage(coverage.id)}
                                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-xs font-medium mb-1 text-gray-400 uppercase">
                                            Odd
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full px-3 py-2 bg-[#0f1419] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                                            value={coverage.odd}
                                            onChange={(e) => updateCoverage(coverage.id, 'odd', e.target.value)}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1 text-gray-400 uppercase">
                                            Comissão (%)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            className="w-full px-3 py-2 bg-[#0f1419] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                                            value={coverage.commission}
                                            onChange={(e) => updateCoverage(coverage.id, 'commission', e.target.value)}
                                            onFocus={(e) => e.target.select()}
                                            placeholder="ex: 0"
                                        />
                                    </div>
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={coverage.isLay}
                                        onChange={(e) => updateCoverage(coverage.id, 'isLay', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0 bg-[#0f1419]"
                                    />
                                    <span className="text-sm text-gray-300">Lay (Contra)</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Resultados */}
                {results && (
                    <div className="bg-[#0f1419] border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-cyan-400 mb-6">Resultados Shark FreePro</h2>

                        {/* Summary */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-[#0a0e1a] rounded-lg p-6 text-center">
                                <p className="text-gray-400 text-sm mb-2 uppercase">Stake Total</p>
                                <p className="text-3xl font-bold">R$ {results.totalStake.toFixed(2)}</p>
                            </div>
                            <div className="bg-[#0a0e1a] rounded-lg p-6 text-center">
                                <p className="text-gray-400 text-sm mb-2 uppercase">ROI</p>
                                <p className={`text-3xl font-bold ${results.roi >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                                    {results.roi >= 0 ? '+' : ''}{results.roi.toFixed(2)}%
                                </p>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-cyan-500/30">
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-cyan-400 uppercase">Mercado</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-cyan-400 uppercase">Odd</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-cyan-400 uppercase">Comissão</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-cyan-400 uppercase">Stake</th>
                                        {coverages.some(c => c.isLay) && (
                                            <th className="px-4 py-3 text-center text-sm font-semibold text-cyan-400 uppercase">Responsabilidade</th>
                                        )}
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-cyan-400 uppercase">Déficit</th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-cyan-400 uppercase">Lucro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.scenarios.map((scenario, index) => {
                                        const isLayScenario = index > 0 && coverages[index - 1]?.isLay;
                                        const liability = isLayScenario ? scenario.stake * (scenario.odd - 1) : 0;

                                        return (
                                            <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition">
                                                <td className="px-4 py-3 text-sm">{scenario.name}</td>
                                                <td className="px-4 py-3 text-center text-sm">{scenario.odd.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-center text-sm">{scenario.commission.toFixed(2)}%</td>
                                                <td className="px-4 py-3 text-center text-sm">
                                                    {scenario.stake.toFixed(2)}
                                                    {isLayScenario && <span className="text-gray-400 text-xs ml-1">(LAY)</span>}
                                                </td>
                                                {coverages.some(c => c.isLay) && (
                                                    <td className="px-4 py-3 text-center text-sm">
                                                        {isLayScenario ? `R$ ${liability.toFixed(2)}` : '-'}
                                                    </td>
                                                )}
                                                <td className="px-4 py-3 text-center text-sm">
                                                    {scenario.deficit > 0.01 ? ( // Tolerância para float
                                                        <span className="text-red-400">-R$ {scenario.deficit.toFixed(2)}</span>
                                                    ) : (
                                                        <span className="text-gray-500">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm font-semibold">
                                                    <span className={scenario.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                                        R$ {scenario.profit >= 0 ? '+' : ''}{scenario.profit.toFixed(2)}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
