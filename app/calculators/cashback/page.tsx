'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Minus, TrendingUp, DollarSign, Target, Award, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Via {
    id: string;
    label: string;
    color: string;
    odd: string;
    cashback: string;
    comissao: string;
    stake: string;
    tipo: 'BACK' | 'LAY';
}

export default function CashbackCalculatorPage() {
    const [vias, setVias] = useState<Via[]>([
        { id: 'A', label: 'Via A', color: 'chrome', odd: '', cashback: '', comissao: '', stake: '', tipo: 'BACK' },
        { id: 'B', label: 'Via B', color: 'purple', odd: '', cashback: '', comissao: '', stake: '', tipo: 'BACK' }
    ]);

    const [results, setResults] = useState({
        lucroLiquido: 0,
        roi: 0,
        totalInvestido: 0,
        cashbackTotal: 0,
        isArbitragem: false
    });

    const [copiedStake, setCopiedStake] = useState<string | null>(null);

    // Efeito 1: Calcular stakes automaticamente quando Via A ou odds mudarem
    useEffect(() => {
        const viaA = vias.find(v => v.id === 'A');
        if (!viaA || !viaA.stake || !viaA.odd) return;

        const todasOddsPreenchidas = vias.every(v => v.odd);
        if (!todasOddsPreenchidas) return;

        const stakeA = parseFloat(viaA.stake);
        const oddA = parseFloat(viaA.odd);
        const retornoEsperado = stakeA * oddA;

        let precisaAtualizar = false;
        const novosStakes = vias.map(via => {
            if (via.id === 'A') return via;

            const odd = parseFloat(via.odd);
            const stakeCalculado = retornoEsperado / odd;
            const stakeFormatado = stakeCalculado.toFixed(2);

            if (via.stake !== stakeFormatado) {
                precisaAtualizar = true;
                return { ...via, stake: stakeFormatado };
            }
            return via;
        });

        if (precisaAtualizar) {
            setVias(novosStakes);
        }
    }, [vias.find(v => v.id === 'A')?.stake, vias.find(v => v.id === 'A')?.odd, vias.map(v => v.odd).join(',')]);

    // Efeito 2: Recalcular resultados sempre que vias mudarem
    useEffect(() => {
        calcular();
    }, [vias]);

    const addVia = () => {
        if (vias.length >= 5) {
            toast.error('Máximo de 5 vias atingido');
            return;
        }

        const labels = ['A', 'B', 'C', 'D', 'E'];
        const colors = ['chrome', 'purple', 'blue', 'orange', 'pink'];
        const newId = labels[vias.length];

        setVias([...vias, {
            id: newId,
            label: `Via ${newId}`,
            color: colors[vias.length],
            odd: '',
            cashback: '',
            comissao: '',
            stake: '',
            tipo: 'BACK'
        }]);

        toast.success(`Via ${newId} adicionada!`);
    };

    const removeVia = () => {
        if (vias.length <= 2) {
            toast.error('Mínimo de 2 vias necessário');
            return;
        }

        const newVias = vias.slice(0, -1);
        setVias(newVias);
        toast.success('Via removida!');
    };

    const updateVia = (id: string, field: keyof Via, value: string) => {
        setVias(vias.map(via =>
            via.id === id ? { ...via, [field]: value } : via
        ));
    };

    const toggleTipo = (id: string) => {
        setVias(vias.map(via =>
            via.id === id ? { ...via, tipo: via.tipo === 'BACK' ? 'LAY' : 'BACK' } : via
        ));
    };

    const calcular = () => {
        // Verificar se todos os campos necessários estão preenchidos
        const viasValidas = vias.filter(v => v.odd && v.stake);
        if (viasValidas.length < 2) {
            setResults({
                lucroLiquido: 0,
                roi: 0,
                totalInvestido: 0,
                cashbackTotal: 0,
                isArbitragem: false
            });
            return;
        }

        let totalInvestido = 0;
        let totalCashback = 0;

        // Calcular total investido e cashback total
        vias.forEach(via => {
            if (via.stake) {
                const stake = parseFloat(via.stake);
                const odd = parseFloat(via.odd) || 0;

                // Para LAY: total investido = responsabilidade (stake × (odd - 1))
                // Para BACK: total investido = stake
                if (via.tipo === 'LAY') {
                    const responsabilidade = stake * (odd - 1);
                    totalInvestido += responsabilidade;
                } else {
                    totalInvestido += stake;
                }

                // Cashback total = soma de todos os cashbacks possíveis
                const cashbackPct = parseFloat(via.cashback) || 0;
                const cashback = stake * (cashbackPct / 100);
                totalCashback += cashback;
            }
        });

        // Calcular lucro em cada cenário
        let lucrosPorCenario: number[] = [];

        vias.forEach((viaGanhadora, indexGanhadora) => {
            if (!viaGanhadora.odd || !viaGanhadora.stake) return;

            let lucroNesteCenario = 0;
            let cashbackNesteCenario = 0;

            vias.forEach((via, index) => {
                if (!via.odd || !via.stake) return;

                const stake = parseFloat(via.stake);
                const odd = parseFloat(via.odd);
                const cashbackPct = parseFloat(via.cashback) || 0;
                const comissaoPct = parseFloat(via.comissao) || 0;

                if (index === indexGanhadora) {
                    // Esta via ganhou
                    if (via.tipo === 'BACK') {
                        const retornoBruto = stake * odd;
                        const lucroAposta = retornoBruto - stake;
                        const comissao = lucroAposta * (comissaoPct / 100);
                        lucroNesteCenario += (lucroAposta - comissao);
                    } else {
                        // LAY ganha
                        lucroNesteCenario += stake;
                    }
                } else {
                    // Esta via perdeu
                    if (via.tipo === 'BACK') {
                        lucroNesteCenario -= stake;
                        // NÃO adicionar cashback aqui - será somado no final
                    } else {
                        // LAY perde
                        const responsabilidade = stake * (odd - 1);
                        lucroNesteCenario -= responsabilidade;
                    }
                }
            });

            lucrosPorCenario.push(lucroNesteCenario);
        });

        // Lucro líquido = menor lucro entre todos os cenários
        const lucroMinimo = Math.min(...lucrosPorCenario);

        // SEMPREGREEN mostra: lucro mínimo (sem cashback) + cashback total
        // Exemplo: 37.04 (lucro puro) + 250 (cashback) = 287.04
        const lucroLiquidoExibido = lucroMinimo + totalCashback;

        const roi = totalInvestido > 0 ? (lucroLiquidoExibido / totalInvestido) * 100 : 0;
        const isArbitragem = lucroLiquidoExibido > 0;

        setResults({
            lucroLiquido: Math.round(lucroLiquidoExibido * 100) / 100,
            roi: Math.round(roi * 100) / 100,
            totalInvestido: Math.round(totalInvestido * 100) / 100,
            cashbackTotal: Math.round(totalCashback * 100) / 100,
            isArbitragem
        });
    };

    const copyStake = (stake: string, id: string) => {
        navigator.clipboard.writeText(stake);
        setCopiedStake(id);
        toast.success('Stake copiado!');
        setTimeout(() => setCopiedStake(null), 2000);
    };

    const getColorClasses = (color: string) => {
        const colors: Record<string, { border: string; bg: string; text: string; badge: string }> = {
            chrome: {
                border: 'border-chrome-500',
                bg: 'bg-chrome-500/10',
                text: 'text-chrome-400',
                badge: 'bg-chrome-500'
            },
            purple: {
                border: 'border-purple-500',
                bg: 'bg-purple-500/10',
                text: 'text-purple-400',
                badge: 'bg-purple-500'
            },
            blue: {
                border: 'border-blue-500',
                bg: 'bg-blue-500/10',
                text: 'text-blue-400',
                badge: 'bg-blue-500'
            },
            orange: {
                border: 'border-orange-500',
                bg: 'bg-orange-500/10',
                text: 'text-orange-400',
                badge: 'bg-orange-500'
            },
            pink: {
                border: 'border-pink-500',
                bg: 'bg-pink-500/10',
                text: 'text-pink-400',
                badge: 'bg-pink-500'
            }
        };
        return colors[color] || colors.chrome;
    };

    return (
        <DashboardLayout
            title="Calculadora de Arbitragem"
            subtitle="Calcule arbitragem com cashback e comissão"
        >
            {/* Controls */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={addVia}
                    disabled={vias.length >= 5}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Adicionar Via
                </button>
                <button
                    onClick={removeVia}
                    disabled={vias.length <= 2}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
                >
                    <Minus className="w-5 h-5" />
                    {vias.length <= 2 ? 'Mínimo atingido' : 'Remover Via'}
                </button>
                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <span className="text-emerald-400 font-semibold">{vias.length} vias ativas</span>
                </div>
            </div>

            {/* Vias Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {vias.map((via, index) => {
                    const cashbackValor = via.stake && via.cashback
                        ? (parseFloat(via.stake) * parseFloat(via.cashback) / 100).toFixed(2)
                        : '0.00';

                    const isViaA = via.id === 'A';
                    const borderColor = isViaA ? 'border-emerald-500' : 'border-gray-700';
                    const bgGradient = isViaA ? 'bg-gradient-to-br from-emerald-500/5 to-emerald-600/10' : 'bg-gray-800/50';

                    return (
                        <div
                            key={via.id}
                            className={`relative border-2 ${borderColor} ${bgGradient} backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 ${isViaA ? 'bg-emerald-600' : 'bg-gray-700'} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                        {via.id}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{via.label}</h3>
                                        {isViaA && (
                                            <span className="text-xs text-emerald-400">Base de cálculo</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleTipo(via.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${via.tipo === 'BACK'
                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30'
                                        : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30'
                                        }`}
                                >
                                    {via.tipo === 'BACK' ? 'BACK' : 'LAY'}
                                </button>
                            </div>

                            {/* Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Odd</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        placeholder="ex. 2.50"
                                        value={via.odd}
                                        onChange={(e) => updateVia(via.id, 'odd', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Cashback (%)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        placeholder="ex. 10"
                                        value={via.cashback}
                                        onChange={(e) => updateVia(via.id, 'cashback', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Comissão (%)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        placeholder="ex. 4.5"
                                        value={via.comissao}
                                        onChange={(e) => updateVia(via.id, 'comissao', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        {via.tipo === 'LAY' ? 'Stake (R$)' : 'Stake (R$)'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            className={`w-full bg-gray-900/50 border ${isViaA ? 'border-emerald-500/50' : 'border-gray-700'} rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all`}
                                            placeholder={isViaA ? 'ex. 1000' : 'Automático'}
                                            value={via.stake}
                                            onChange={(e) => updateVia(via.id, 'stake', e.target.value)}
                                            readOnly={!isViaA}
                                        />
                                        {via.stake && (
                                            <button
                                                onClick={() => copyStake(via.stake, via.id)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-emerald-500/20 rounded-lg transition-all"
                                            >
                                                {copiedStake === via.id ? (
                                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                                ) : (
                                                    <Copy className="w-5 h-5 text-gray-400 hover:text-emerald-400" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    {!isViaA && (
                                        <p className="text-xs text-gray-500 mt-1">Calculado automaticamente</p>
                                    )}
                                </div>

                                {/* Responsabilidade LAY */}
                                {via.tipo === 'LAY' && via.stake && via.odd && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-xs text-gray-400">Responsabilidade</p>
                                            <button
                                                onClick={() => {
                                                    const resp = (parseFloat(via.stake) * (parseFloat(via.odd) - 1)).toFixed(2);
                                                    navigator.clipboard.writeText(resp);
                                                    toast.success('Responsabilidade copiada!');
                                                }}
                                                className="p-1 hover:bg-red-500/20 rounded transition-all"
                                            >
                                                <Copy className="w-4 h-4 text-red-400" />
                                            </button>
                                        </div>
                                        <p className="text-2xl font-bold text-red-400">
                                            R$ {(parseFloat(via.stake) * (parseFloat(via.odd) - 1)).toFixed(2)}
                                        </p>
                                    </div>
                                )}

                                {/* Cashback */}
                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                                    <p className="text-xs text-gray-400 mb-1">Cashback</p>
                                    <p className="text-2xl font-bold text-emerald-400">
                                        R$ {cashbackValor}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Results */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-2 border-gray-700 rounded-2xl p-8">
                <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                        <span>📊</span>
                        Resultados da Arbitragem
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Lucro Líquido */}
                    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-gray-400 uppercase tracking-wider">Lucro Líquido</p>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(results.lucroLiquido.toFixed(2));
                                    toast.success('Lucro copiado!');
                                }}
                                className="p-2 hover:bg-emerald-500/20 rounded-lg transition-all"
                            >
                                <Copy className="w-4 h-4 text-gray-400 hover:text-emerald-400" />
                            </button>
                        </div>
                        <p className={`text-4xl font-bold ${results.lucroLiquido > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            R$ {results.lucroLiquido.toFixed(2)}
                        </p>
                    </div>

                    {/* ROI */}
                    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-gray-400 uppercase tracking-wider">ROI</p>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(results.roi.toFixed(2) + '%');
                                    toast.success('ROI copiado!');
                                }}
                                className="p-2 hover:bg-emerald-500/20 rounded-lg transition-all"
                            >
                                <Copy className="w-4 h-4 text-gray-400 hover:text-emerald-400" />
                            </button>
                        </div>
                        <p className={`text-4xl font-bold ${results.roi > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {results.roi.toFixed(2)}%
                        </p>
                    </div>

                    {/* Total Investido */}
                    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-gray-400 uppercase tracking-wider">Total Investido</p>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(results.totalInvestido.toFixed(2));
                                    toast.success('Total copiado!');
                                }}
                                className="p-2 hover:bg-emerald-500/20 rounded-lg transition-all"
                            >
                                <Copy className="w-4 h-4 text-gray-400 hover:text-emerald-400" />
                            </button>
                        </div>
                        <p className="text-4xl font-bold text-blue-400">
                            R$ {results.totalInvestido.toFixed(2)}
                        </p>
                    </div>

                    {/* Cashback Total */}
                    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-gray-400 uppercase tracking-wider">Cashback Total</p>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(results.cashbackTotal.toFixed(2));
                                    toast.success('Cashback copiado!');
                                }}
                                className="p-2 hover:bg-emerald-500/20 rounded-lg transition-all"
                            >
                                <Copy className="w-4 h-4 text-gray-400 hover:text-emerald-400" />
                            </button>
                        </div>
                        <p className="text-4xl font-bold text-emerald-400">
                            R$ {results.cashbackTotal.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Status */}
                <div className={`rounded-xl p-6 text-center transition-all duration-300 ${results.isArbitragem
                    ? 'bg-emerald-500/10 border-2 border-emerald-500'
                    : 'bg-red-500/10 border-2 border-red-500'
                    }`}>
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="text-3xl">{results.isArbitragem ? '✅' : '⚠️'}</span>
                        <span className={`text-xl font-bold ${results.isArbitragem ? 'text-emerald-400' : 'text-red-400'}`}>
                            {results.isArbitragem ? 'Arbitragem com lucro garantido!' : 'Sem arbitragem - ajuste os valores'}
                        </span>
                    </div>
                    <p className={`text-sm ${results.isArbitragem ? 'text-emerald-300/80' : 'text-red-300/80'}`}>
                        {results.isArbitragem
                            ? 'Lucro garantido independente do resultado'
                            : 'Os valores atuais não garantem lucro em todos os cenários'}
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
