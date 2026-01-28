'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, DollarSign } from 'lucide-react';

type StakingMethod = 'flat' | 'percentage' | 'kelly';

export default function StakingCalculatorPage() {
    const [method, setMethod] = useState<StakingMethod>('percentage');
    const [bankroll, setBankroll] = useState('');
    const [percentage, setPercentage] = useState('');
    const [odds, setOdds] = useState('');
    const [winProbability, setWinProbability] = useState('');
    const [result, setResult] = useState<{
        stake: number;
        potentialProfit: number;
        potentialReturn: number;
    } | null>(null);

    const handleCalculate = () => {
        const bankrollNum = parseFloat(bankroll);
        const oddsNum = parseFloat(odds);

        if (!bankrollNum || !oddsNum) return;

        let stake = 0;

        switch (method) {
            case 'flat':
                stake = parseFloat(percentage) || 0;
                break;
            case 'percentage':
                stake = (bankrollNum * parseFloat(percentage)) / 100;
                break;
            case 'kelly':
                const prob = parseFloat(winProbability) / 100;
                const q = 1 - prob;
                const b = oddsNum - 1;
                const kellyFraction = (b * prob - q) / b;
                stake = Math.max(0, bankrollNum * kellyFraction);
                break;
        }

        const potentialProfit = stake * (oddsNum - 1);
        const potentialReturn = stake * oddsNum;

        setResult({
            stake: Math.round(stake * 100) / 100,
            potentialProfit: Math.round(potentialProfit * 100) / 100,
            potentialReturn: Math.round(potentialReturn * 100) / 100,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-success-50 to-success-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-16">
                <Link href="/calculators" className="btn-secondary inline-flex items-center gap-2 mb-8">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </Link>

                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 dark:bg-success-900 rounded-full mb-4">
                            <DollarSign className="w-8 h-8 text-success-600" />
                        </div>
                        <h1 className="text-4xl font-bold mb-2">Staking Calculator</h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Calcule o valor ideal de aposta baseado em sua banca
                        </p>
                    </div>

                    <div className="card">
                        <div className="space-y-6">
                            {/* Staking Method */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Método de Staking</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => setMethod('flat')}
                                        className={`btn ${method === 'flat' ? 'btn-success' : 'btn-secondary'}`}
                                    >
                                        Flat
                                    </button>
                                    <button
                                        onClick={() => setMethod('percentage')}
                                        className={`btn ${method === 'percentage' ? 'btn-success' : 'btn-secondary'}`}
                                    >
                                        Percentual
                                    </button>
                                    <button
                                        onClick={() => setMethod('kelly')}
                                        className={`btn ${method === 'kelly' ? 'btn-success' : 'btn-secondary'}`}
                                    >
                                        Kelly
                                    </button>
                                </div>
                            </div>

                            {/* Bankroll */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Banca (R$)</label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="1000.00"
                                    value={bankroll}
                                    onChange={(e) => setBankroll(e.target.value)}
                                />
                            </div>

                            {/* Stake Input */}
                            {method === 'flat' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Valor da Aposta (R$)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="50.00"
                                        value={percentage}
                                        onChange={(e) => setPercentage(e.target.value)}
                                    />
                                </div>
                            )}

                            {method === 'percentage' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Percentual da Banca (%)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="5"
                                        value={percentage}
                                        onChange={(e) => setPercentage(e.target.value)}
                                    />
                                </div>
                            )}

                            {method === 'kelly' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Probabilidade de Vitória (%)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="55"
                                        value={winProbability}
                                        onChange={(e) => setWinProbability(e.target.value)}
                                    />
                                </div>
                            )}

                            {/* Odds */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Odds (Decimal)</label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="2.00"
                                    value={odds}
                                    onChange={(e) => setOdds(e.target.value)}
                                />
                            </div>

                            {/* Calculate Button */}
                            <button onClick={handleCalculate} className="btn-success w-full py-3">
                                Calcular
                            </button>

                            {/* Results */}
                            {result && (
                                <div className="mt-6 space-y-4 fade-in">
                                    <h3 className="text-xl font-semibold mb-4">Resultados:</h3>
                                    <ResultRow label="Valor da Aposta" value={`R$ ${result.stake.toFixed(2)}`} highlight />
                                    <ResultRow label="Lucro Potencial" value={`R$ ${result.potentialProfit.toFixed(2)}`} />
                                    <ResultRow label="Retorno Total" value={`R$ ${result.potentialReturn.toFixed(2)}`} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className={`flex justify-between items-center p-4 rounded-lg ${highlight ? 'bg-success-50 dark:bg-success-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
            <span className="font-medium">{label}</span>
            <span className={`text-lg font-bold ${highlight ? 'text-success-600' : ''}`}>{value}</span>
        </div>
    );
}
