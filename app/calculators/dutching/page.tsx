'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Trash2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Selection {
    id: number;
    odd: string;
}

export default function DutchingPage() {
    const [totalStake, setTotalStake] = useState('');
    const [selections, setSelections] = useState<Selection[]>([
        { id: 1, odd: '' },
        { id: 2, odd: '' },
    ]);
    const [result, setResult] = useState<{
        stakes: number[];
        returns: number[];
        profit: number;
        profitPercentage: number;
    } | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const copyStake = (stake: number, index: number) => {
        navigator.clipboard.writeText(stake.toFixed(2));
        setCopiedIndex(index);
        toast.success(`R$ ${stake.toFixed(2)} copiado!`);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const addSelection = () => {
        setSelections([...selections, { id: Date.now(), odd: '' }]);
    };

    const removeSelection = (id: number) => {
        if (selections.length > 2) {
            setSelections(selections.filter(s => s.id !== id));
        }
    };

    const updateOdd = (id: number, value: string) => {
        setSelections(selections.map(s => s.id === id ? { ...s, odd: value } : s));
    };

    const calculateDutching = () => {
        const stake = parseFloat(totalStake);
        const odds = selections.map(s => parseFloat(s.odd)).filter(o => !isNaN(o));

        if (!stake || odds.length < 2) {
            setResult(null);
            return;
        }

        // Calcular soma das probabilidades implícitas
        const sumProbabilities = odds.reduce((sum, odd) => sum + (1 / odd), 0);

        // Calcular stakes individuais
        const stakes = odds.map(odd => stake / (odd * sumProbabilities));

        // Calcular retornos
        const returns = stakes.map((s, i) => s * odds[i]);

        // Calcular lucro (todos os retornos são iguais no dutching)
        const profit = returns[0] - stake;
        const profitPercentage = (profit / stake) * 100;

        setResult({
            stakes: stakes.map(s => Math.round(s * 100) / 100),
            returns: returns.map(r => Math.round(r * 100) / 100),
            profit: Math.round(profit * 100) / 100,
            profitPercentage: Math.round(profitPercentage * 100) / 100,
        });
    };

    // Recalcular automaticamente quando totalStake ou odds mudarem
    useEffect(() => {
        calculateDutching();
    }, [totalStake, selections]);

    const handleCalculate = () => {
        calculateDutching();
    };

    return (
        <DashboardLayout
            title="Calculadora de Dutching"
            subtitle="Distribua stakes em múltiplas seleções para lucro igual"
        >
            <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-2 border-gray-700 rounded-2xl p-8">
                    <div className="space-y-6 mb-6">
                        {/* Total Stake */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                Investimento Total (R$)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="100.00"
                                value={totalStake}
                                onChange={(e) => setTotalStake(e.target.value)}
                            />
                        </div>

                        {/* Selections */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-medium text-gray-300">
                                    Seleções
                                </label>
                                <button
                                    onClick={addSelection}
                                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition"
                                >
                                    <Plus className="w-4 h-4" />
                                    Adicionar Seleção
                                </button>
                            </div>
                            <div className="space-y-3">
                                {selections.map((selection, index) => (
                                    <div key={selection.id} className="flex items-center gap-3">
                                        <span className="text-gray-400 w-8">#{index + 1}</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="flex-1 px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Odd (ex: 3.50)"
                                            value={selection.odd}
                                            onChange={(e) => updateOdd(selection.id, e.target.value)}
                                        />
                                        {selections.length > 2 && (
                                            <button
                                                onClick={() => removeSelection(selection.id)}
                                                className="p-2 text-red-400 hover:text-red-300 transition"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Calculate Button */}
                    <button
                        onClick={handleCalculate}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                    >
                        Calcular Dutching
                    </button>

                    {/* Results */}
                    {result && (
                        <div className="mt-8 space-y-6 fade-in">
                            {/* Profit */}
                            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-6">
                                <div className="text-center">
                                    <p className="text-gray-400 mb-2">Lucro por Seleção Vencedora</p>
                                    <p className={`text-4xl font-bold ${result.profit > 0 ? 'text-blue-400' : 'text-red-400'}`}>
                                        R$ {result.profit > 0 ? '+' : ''}{result.profit.toFixed(2)}
                                    </p>
                                    <p className={`text-xl ${result.profitPercentage > 0 ? 'text-blue-400' : 'text-red-400'}`}>
                                        {result.profitPercentage > 0 ? '+' : ''}{result.profitPercentage.toFixed(2)}%
                                    </p>
                                </div>
                            </div>

                            {/* Stakes per Selection */}
                            <div className="bg-[#0a0e1a] rounded-lg p-6">
                                <h3 className="font-semibold mb-4 text-blue-400">Stakes por Seleção</h3>
                                <div className="space-y-3">
                                    {result.stakes.map((stake, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-[#0f1419] rounded-lg">
                                            <div>
                                                <span className="text-gray-400">Seleção #{index + 1}</span>
                                                <span className="text-gray-500 text-sm ml-2">
                                                    (Odd: {selections[index].odd})
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="font-semibold text-white">R$ {stake.toFixed(2)}</p>
                                                    <p className="text-sm text-blue-400">Retorno: R$ {result.returns[index].toFixed(2)}</p>
                                                </div>
                                                <button
                                                    onClick={() => copyStake(stake, index)}
                                                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all group"
                                                    title="Copiar valor"
                                                >
                                                    {copiedIndex === index ? (
                                                        <Check className="w-5 h-5 text-green-400" />
                                                    ) : (
                                                        <Copy className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Card */}
                <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                    <h3 className="font-semibold mb-3 text-blue-400">O que é Dutching?</h3>
                    <p className="text-sm text-gray-300 mb-3">
                        Dutching é uma estratégia que distribui seu investimento entre múltiplas seleções de forma que o lucro seja igual, independente de qual seleção vencer.
                    </p>
                    <ul className="text-sm text-gray-400 space-y-1">
                        <li>• Útil quando você acredita em mais de um resultado</li>
                        <li>• Garante lucro igual em qualquer cenário vencedor</li>
                        <li>• Requer odds que permitam lucro positivo</li>
                        <li>• Comum em corridas de cavalos e mercados com múltiplos favoritos</li>
                    </ul>
                </div>
            </div>
        </DashboardLayout>
    );
}
