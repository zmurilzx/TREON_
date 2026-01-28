'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function MatchedBettingPage() {
    const [qualifyingStake, setQualifyingStake] = useState('');
    const [backOdd, setBackOdd] = useState('');
    const [layOdd, setLayOdd] = useState('');
    const [layCommission, setLayCommission] = useState('2');
    const [freebetValue, setFreebetValue] = useState('');
    const [freebetBackOdd, setFreebetBackOdd] = useState('');
    const [freebetLayOdd, setFreebetLayOdd] = useState('');
    const [result, setResult] = useState<{
        qualifyingLayStake: number;
        qualifyingLoss: number;
        freebetLayStake: number;
        freebetProfit: number;
        totalProfit: number;
        roi: number;
    } | null>(null);

    const handleCalculate = () => {
        const qStake = parseFloat(qualifyingStake);
        const qBack = parseFloat(backOdd);
        const qLay = parseFloat(layOdd);
        const commission = parseFloat(layCommission) / 100;
        const freebet = parseFloat(freebetValue);
        const fBack = parseFloat(freebetBackOdd);
        const fLay = parseFloat(freebetLayOdd);

        if (!qStake || !qBack || !qLay || !freebet || !fBack || !fLay) return;

        // Qualifying Bet
        const qLayStake = (qStake * qBack) / (qLay - commission);
        const qLayLiability = qLayStake * (qLay - 1);
        const qualifyingLoss = qLayLiability - qStake;

        // Freebet
        const fLayStake = (freebet * (fBack - 1)) / (fLay - commission);
        const fLayLiability = fLayStake * (fLay - 1);
        const freebetReturn = freebet * (fBack - 1); // Freebet não retorna stake
        const freebetProfit = freebetReturn - fLayLiability;

        // Total
        const totalProfit = freebetProfit - qualifyingLoss;
        const totalInvested = qStake;
        const roi = (totalProfit / totalInvested) * 100;

        setResult({
            qualifyingLayStake: Math.round(qLayStake * 100) / 100,
            qualifyingLoss: Math.round(qualifyingLoss * 100) / 100,
            freebetLayStake: Math.round(fLayStake * 100) / 100,
            freebetProfit: Math.round(freebetProfit * 100) / 100,
            totalProfit: Math.round(totalProfit * 100) / 100,
            roi: Math.round(roi * 100) / 100,
        });
    };

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-white">
            <div className="container mx-auto px-4 py-16">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-8">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </Link>

                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">
                            <span className="text-yellow-400">Matched Betting</span>
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Aproveite bônus com risco zero usando lay betting
                        </p>
                    </div>

                    <div className="bg-[#0f1419] border border-white/10 rounded-2xl p-8">
                        {/* Qualifying Bet Section */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-4 text-yellow-400">1. Aposta Qualificadora</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Stake Qualificador (R$)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                        placeholder="50.00"
                                        value={qualifyingStake}
                                        onChange={(e) => setQualifyingStake(e.target.value)}
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-300">
                                            Odd Back
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                            placeholder="2.00"
                                            value={backOdd}
                                            onChange={(e) => setBackOdd(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-300">
                                            Odd Lay
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                            placeholder="2.10"
                                            value={layOdd}
                                            onChange={(e) => setLayOdd(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Freebet Section */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-4 text-yellow-400">2. Freebet</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Valor da Freebet (R$)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                        placeholder="50.00"
                                        value={freebetValue}
                                        onChange={(e) => setFreebetValue(e.target.value)}
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-300">
                                            Odd Back (Freebet)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                            placeholder="3.00"
                                            value={freebetBackOdd}
                                            onChange={(e) => setFreebetBackOdd(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-300">
                                            Odd Lay (Freebet)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                            placeholder="3.10"
                                            value={freebetLayOdd}
                                            onChange={(e) => setFreebetLayOdd(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Commission */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                Comissão da Exchange (%)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                placeholder="2"
                                value={layCommission}
                                onChange={(e) => setLayCommission(e.target.value)}
                            />
                        </div>

                        {/* Calculate Button */}
                        <button
                            onClick={handleCalculate}
                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-yellow-500/50 transition-all"
                        >
                            Calcular Matched Betting
                        </button>

                        {/* Results */}
                        {result && (
                            <div className="mt-8 space-y-6 fade-in">
                                {/* Total Profit */}
                                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-6">
                                    <div className="text-center">
                                        <p className="text-gray-400 mb-2">Lucro Total Livre de Risco</p>
                                        <p className={`text-4xl font-bold ${result.totalProfit > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                                            R$ {result.totalProfit > 0 ? '+' : ''}{result.totalProfit.toFixed(2)}
                                        </p>
                                        <p className="text-xl text-yellow-400">
                                            ROI: {result.roi.toFixed(2)}%
                                        </p>
                                    </div>
                                </div>

                                {/* Qualifying Bet Results */}
                                <div className="bg-[#0a0e1a] rounded-lg p-6">
                                    <h3 className="font-semibold mb-4 text-yellow-400">Aposta Qualificadora</h3>
                                    <div className="space-y-3">
                                        <ResultRow label="Lay Stake" value={`R$ ${result.qualifyingLayStake.toFixed(2)}`} />
                                        <ResultRow
                                            label="Perda Qualificadora"
                                            value={`R$ ${result.qualifyingLoss.toFixed(2)}`}
                                        />
                                    </div>
                                </div>

                                {/* Freebet Results */}
                                <div className="bg-[#0a0e1a] rounded-lg p-6">
                                    <h3 className="font-semibold mb-4 text-yellow-400">Freebet</h3>
                                    <div className="space-y-3">
                                        <ResultRow label="Lay Stake" value={`R$ ${result.freebetLayStake.toFixed(2)}`} />
                                        <ResultRow
                                            label="Lucro da Freebet"
                                            value={`R$ ${result.freebetProfit.toFixed(2)}`}
                                            highlight
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Info Card */}
                    <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                        <h3 className="font-semibold mb-3 text-yellow-400">O que é Matched Betting?</h3>
                        <p className="text-sm text-gray-300 mb-3">
                            Matched betting é uma técnica para extrair lucro de bônus e freebets das casas de apostas com risco zero.
                        </p>
                        <ul className="text-sm text-gray-400 space-y-1">
                            <li>• <strong>Passo 1:</strong> Faça aposta qualificadora (back + lay) para desbloquear o bônus</li>
                            <li>• <strong>Passo 2:</strong> Use a freebet com odds altas e faça lay correspondente</li>
                            <li>• <strong>Resultado:</strong> Lucro garantido independente do resultado</li>
                            <li>• <strong>Risco:</strong> Zero (quando feito corretamente)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-gray-400">{label}</span>
            <span className={`font-semibold ${highlight ? 'text-yellow-400' : 'text-white'}`}>
                {value}
            </span>
        </div>
    );
}
