'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Bet {
    id: number;
    bookmaker: string;
    odd: string;
    stake: string;
    commission: boolean;
    commissionPercent: string;
    freebet: boolean;
    oddBoost: boolean;
    oddBoostPercent: string;
    distribute: boolean;
}

type FixedAnchor = { type: 'none' } | { type: 'total' } | { type: 'bet', id: number };

export default function SurebetCalculatorPage() {
    const router = useRouter();
    const [totalInvestment, setTotalInvestment] = useState('100');
    const [fixedAnchor, setFixedAnchor] = useState<FixedAnchor>({ type: 'none' });
    const [oddMultiplier, setOddMultiplier] = useState(100);
    const [bets, setBets] = useState<Bet[]>([
        { id: 1, bookmaker: 'CASA 1', odd: '', stake: '', commission: false, commissionPercent: '', freebet: false, oddBoost: false, oddBoostPercent: '', distribute: true },
        { id: 2, bookmaker: 'CASA 2', odd: '', stake: '', commission: false, commissionPercent: '', freebet: false, oddBoost: false, oddBoostPercent: '', distribute: true },
    ]);

    const [calculationResult, setCalculationResult] = useState<any>(null);
    const [showCopyToast, setShowCopyToast] = useState(false);
    const [copiedValue, setCopiedValue] = useState('');

    const updateBet = (id: number, field: keyof Bet, value: any) => {
        setBets(prev => prev.map(bet => bet.id === id ? { ...bet, [field]: value } : bet));
    };

    const addBet = () => {
        const newId = Math.max(...bets.map(b => b.id)) + 1;
        setBets([...bets, {
            id: newId,
            bookmaker: `CASA ${newId}`,
            odd: '',
            stake: '',
            commission: false,
            commissionPercent: '',
            freebet: false,
            oddBoost: false,
            oddBoostPercent: '',
            distribute: true
        }]);
    };

    const removeBet = (id: number) => {
        if (bets.length > 2) {
            setBets(bets.filter(bet => bet.id !== id));
        }
    };

    const calculateSurebet = useCallback((currentBets: Bet[], investment: string, anchor: FixedAnchor) => {
        const validBets = currentBets.filter(bet => parseFloat(bet.odd) > 0);
        if (validBets.length < 2) return null;

        const effectiveOdds = validBets.map(bet => {
            let odd = parseFloat(bet.odd);

            if (bet.oddBoost && parseFloat(bet.oddBoostPercent) > 0) {
                const boostPercent = parseFloat(bet.oddBoostPercent) / 100;
                odd = odd * (1 + boostPercent);
            }

            if (bet.commission && parseFloat(bet.commissionPercent) > 0) {
                const comm = parseFloat(bet.commissionPercent) / 100;
                odd = 1 + (odd - 1) * (1 - comm);
            }

            if (bet.freebet) {
                odd = odd - 1;
            }

            return {
                id: bet.id,
                effectiveOdd: odd,
                originalOdd: parseFloat(bet.odd),
                distribute: bet.distribute,
                manualStake: parseFloat(bet.stake) || 0
            };
        });

        if (effectiveOdds.some(o => o.effectiveOdd <= 0)) return null;

        if (anchor.type === 'none') {
            const hasManualStakes = effectiveOdds.some(o => o.manualStake > 0);

            if (hasManualStakes) {
                const manualStakes = effectiveOdds.map(o => o.manualStake);
                const totalInvested = manualStakes.reduce((sum, stake) => sum + stake, 0);
                const returns = manualStakes.map((stake, i) => stake * effectiveOdds[i].effectiveOdd);
                const profits = returns.map((ret, i) => {
                    if (effectiveOdds[i].distribute) {
                        return ret - totalInvested;
                    } else {
                        return 0;
                    }
                });

                const totalProbability = effectiveOdds.reduce((sum, o) => sum + (1 / o.effectiveOdd), 0);
                const roi = totalProbability < 1 ? ((1 / totalProbability) - 1) * 100 : 0;
                const distributedProfits = profits.filter((_, i) => effectiveOdds[i].distribute);
                const representativeProfit = distributedProfits.length > 0 ? distributedProfits[0] : Math.min(...profits);

                return {
                    profitPercent: ((1 / totalProbability) - 1) * 100,
                    isSurebet: totalProbability < 1,
                    stakes: manualStakes,
                    validBetIds: effectiveOdds.map(o => o.id),
                    totalProfit: representativeProfit,
                    roi,
                    totalInvested,
                    profits
                };
            }
        }

        let I = parseFloat(investment) || 0;

        if (anchor.type === 'bet') {
            const fixedBet = currentBets.find(b => b.id === anchor.id);
            const fixedEffOdd = effectiveOdds.find(o => o.id === anchor.id);

            if (fixedBet && fixedEffOdd && parseFloat(fixedBet.stake) > 0) {
                const S_fixed = parseFloat(fixedBet.stake);
                let K_unchecked = 0;
                let K_checked = 0;

                effectiveOdds.forEach(o => {
                    if (!o.distribute) K_unchecked += (1 / o.effectiveOdd);
                    else K_checked += (1 / o.effectiveOdd);
                });

                if (!fixedEffOdd.distribute) {
                    I = S_fixed * fixedEffOdd.effectiveOdd;
                } else {
                    if (K_checked === 0) return null;
                    const R = S_fixed * fixedEffOdd.effectiveOdd;
                    if (K_unchecked >= 1) return null;
                    I = R * K_checked / (1 - K_unchecked);
                }
            }
        }

        let sumInvOddsUnchecked = 0;
        let sumInvOddsChecked = 0;

        effectiveOdds.forEach(o => {
            if (!o.distribute) sumInvOddsUnchecked += (1 / o.effectiveOdd);
            else sumInvOddsChecked += (1 / o.effectiveOdd);
        });

        if (sumInvOddsUnchecked >= 1 && sumInvOddsChecked > 0) return null;

        let targetReturn = 0;
        if (sumInvOddsChecked > 0) {
            targetReturn = (I * (1 - sumInvOddsUnchecked)) / sumInvOddsChecked;
        } else {
            const totalProb = sumInvOddsUnchecked;
            targetReturn = I / totalProb;
        }

        const stakes = effectiveOdds.map(o => {
            if (sumInvOddsChecked === 0) {
                const totalProb = sumInvOddsUnchecked;
                const prob = 1 / o.effectiveOdd;
                return (I * prob) / totalProb;
            }

            if (!o.distribute) {
                return I / o.effectiveOdd;
            } else {
                return targetReturn / o.effectiveOdd;
            }
        });

        const returns = stakes.map((stake, i) => stake * effectiveOdds[i].effectiveOdd);
        const profits = returns.map(ret => ret - I);
        const checkedProfits = profits.filter((_, i) => effectiveOdds[i].distribute);
        const profitValue = checkedProfits.length > 0 ? checkedProfits[0] : profits[0];
        const roi = I > 0 ? (profitValue / I) * 100 : 0;
        const totalProbability = effectiveOdds.reduce((sum, o) => sum + (1 / o.effectiveOdd), 0);

        return {
            profitPercent: ((1 / totalProbability) - 1) * 100,
            isSurebet: totalProbability < 1,
            stakes,
            validBetIds: effectiveOdds.map(o => o.id),
            totalProfit: profitValue,
            roi,
            totalInvested: I,
            profits
        };
    }, []);

    useEffect(() => {
        const result = calculateSurebet(bets, totalInvestment, fixedAnchor);
        setCalculationResult(result);

        if (result) {
            if (fixedAnchor.type === 'bet') {
                if (Math.abs(parseFloat(totalInvestment) - result.totalInvested) > 0.01) {
                    setTotalInvestment(result.totalInvested.toFixed(2));
                }
            }

            const shouldAutoUpdateInputs = fixedAnchor.type !== 'none';

            if (shouldAutoUpdateInputs) {
                setBets(prevBets => {
                    const needsUpdate = prevBets.some((bet) => {
                        const resultIndex = result.validBetIds.indexOf(bet.id);
                        if (resultIndex === -1) return false;
                        if (fixedAnchor.type === 'bet' && fixedAnchor.id === bet.id) return false;
                        const newStake = result.stakes[resultIndex].toFixed(2);
                        return bet.stake !== newStake;
                    });

                    if (!needsUpdate) return prevBets;

                    return prevBets.map(bet => {
                        const resultIndex = result.validBetIds.indexOf(bet.id);
                        if (resultIndex !== -1) {
                            if (fixedAnchor.type === 'bet' && fixedAnchor.id === bet.id) return bet;
                            return { ...bet, stake: result.stakes[resultIndex].toFixed(2) };
                        }
                        return bet;
                    });
                });
            }
        }
    }, [
        totalInvestment,
        fixedAnchor,
        JSON.stringify(bets.map(b => ({
            id: b.id,
            odd: b.odd,
            stake: b.stake,
            commission: b.commission,
            commissionPercent: b.commissionPercent,
            freebet: b.freebet,
            oddBoost: b.oddBoost,
            oddBoostPercent: b.oddBoostPercent,
            distribute: b.distribute
        }))),
        calculateSurebet]);

    const clearAll = () => {
        setBets(bets.map(bet => ({
            ...bet,
            odd: '',
            stake: '',
            commission: false,
            commissionPercent: '',
            freebet: false,
            oddBoost: false,
            oddBoostPercent: '',
            distribute: true
        })));
        setTotalInvestment('100');
        setFixedAnchor({ type: 'none' });
    };

    const copyStake = (stake: string) => {
        if (!stake || stake.trim() === '' || stake === '0' || stake === '0.00') return;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(stake);
                setCopiedValue(stake);
                setShowCopyToast(true);
                setTimeout(() => setShowCopyToast(false), 2000);
            }
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const handleStakeChange = (id: number, val: string) => {
        updateBet(id, 'stake', val);
    };

    const swapOdds = () => {
        if (bets.length >= 2) {
            const casa2OddValue = parseFloat(bets[1].odd) || 0;
            const casa1OddValue = parseFloat(bets[0].odd) || 0;

            const newStake1 = (casa2OddValue * oddMultiplier).toFixed(2);
            const newStake2 = (casa1OddValue * oddMultiplier).toFixed(2);

            const updatedBets = bets.map((bet, index) => {
                if (index === 0) return { ...bet, stake: newStake1 };
                if (index === 1) return { ...bet, stake: newStake2 };
                return bet;
            });

            const totalCapital = updatedBets.reduce((sum, bet) => {
                return sum + (parseFloat(bet.stake) || 0);
            }, 0);

            console.log('🔄 Inverter Odds:', {
                newStake1,
                newStake2,
                totalCapital: totalCapital.toFixed(2),
                allStakes: updatedBets.map(b => b.stake),
                beforeUpdate: totalInvestment
            });

            setBets(updatedBets);

            setTimeout(() => {
                const newTotal = totalCapital.toFixed(2);
                console.log('💰 Updating Total Capital to:', newTotal);
                setTotalInvestment(newTotal);
                setFixedAnchor({ type: 'total' });
            }, 0);
        }
    };

    return (
        <div className="min-h-screen bg-[#1a1d29] text-white">
            <button
                onClick={() => router.back()}
                className="fixed top-3 left-3 z-50 p-2 bg-[#1E2433]/80 border border-gray-700/50 rounded-lg text-gray-400 hover:text-[#00FFA3] transition-all"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>

            <main className="container mx-auto px-6 py-8 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-display font-bold mb-2 uppercase tracking-tight">Surebet Calculator</h1>
                </div>

                {/* ROI Header Card */}
                <div className={`mb-6 rounded-2xl border-2 p-6 transition-all ${calculationResult?.isSurebet ? 'bg-gradient-to-r from-dg-green/20 to-emerald-500/20 border-dg-green shadow-lg shadow-dg-green/30' : 'bg-[#252b3b] border-gray-600'}`}>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <div className="text-sm text-gray-300 mb-1 uppercase tracking-wider">ROI</div>
                            <div className={`text-5xl font-black transition-all ${calculationResult?.roi > 0 ? 'text-dg-green drop-shadow-[0_0_10px_rgba(0,255,163,0.5)]' : 'text-gray-400'}`}>
                                {calculationResult ? `${calculationResult.roi > 0 ? '+' : ''}${calculationResult.roi.toFixed(2)}%` : '+0.00%'}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="mb-2">
                                <span className="text-xs text-gray-300 uppercase tracking-wider">Investido: </span>
                                <span className="text-lg font-bold">R$ {calculationResult?.totalInvested.toFixed(2) || '0.00'}</span>
                            </div>
                            <div>
                                <span className="text-xs text-gray-300 uppercase tracking-wider">Retorno: </span>
                                <span className={`text-lg font-bold transition-all ${calculationResult?.roi > 0 ? 'text-dg-green drop-shadow-[0_0_8px_rgba(0,255,163,0.4)]' : 'text-white'}`}>
                                    R$ {calculationResult ? (calculationResult.totalInvested + calculationResult.totalProfit).toFixed(2) : '0.00'}
                                </span>
                            </div>
                        </div>
                        {calculationResult?.isSurebet && (
                            <div>
                                <div className="px-4 py-2 bg-dg-green text-black rounded-full font-bold text-sm flex items-center gap-2 uppercase tracking-wide">
                                    <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                                    Lucro Garantido
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Total Capital */}
                <div className={`mb-6 rounded-2xl border-2 p-5 transition-all ${fixedAnchor.type === 'total' ? 'border-dg-green bg-[#252b3b]' : 'bg-[#252b3b] border-gray-600'}`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div
                                onClick={() => setFixedAnchor(fixedAnchor.type === 'total' ? { type: 'none' } : { type: 'total' })}
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${fixedAnchor.type === 'total' ? 'border-dg-green bg-dg-green/20' : 'border-gray-600 hover:border-gray-500'}`}
                            >
                                {fixedAnchor.type === 'total' && <div className="w-2.5 h-2.5 bg-dg-green rounded-full"></div>}
                            </div>
                            <h3 className="text-lg font-bold uppercase tracking-wide">Total Capital</h3>
                        </div>
                        {calculationResult?.isSurebet && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-dg-green/20 border border-dg-green rounded-lg">
                                <span className="w-2 h-2 bg-dg-green rounded-full animate-pulse"></span>
                                <span className="text-xs font-bold text-dg-green uppercase">Surebet</span>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-bold">R$</span>
                        <input
                            type="number"
                            value={totalInvestment}
                            onChange={(e) => {
                                setTotalInvestment(e.target.value);
                                if (e.target.value && parseFloat(e.target.value) > 0) {
                                    setFixedAnchor({ type: 'total' });
                                }
                            }}
                            className="w-full bg-[#1a1d29] border-2 border-gray-600 rounded-xl pl-14 pr-4 py-4 text-3xl font-black text-white focus:outline-none focus:border-dg-green transition-all"
                            placeholder="0,00"
                        />
                    </div>
                </div>

                {/* Bet Cards */}
                <div className="space-y-3 mb-6">
                    {bets.map((bet, index) => {
                        const resIndex = calculationResult?.validBetIds.indexOf(bet.id);
                        const profit = resIndex !== -1 && calculationResult ? calculationResult.profits[resIndex] : 0;
                        
                        return (
                            <div key={bet.id} className={`rounded-xl border-2 p-3 transition-all ${fixedAnchor.type === 'bet' && fixedAnchor.id === bet.id ? 'border-dg-green bg-[#252b3b]' : 'bg-[#252b3b] border-gray-600'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                                            <span className="text-xs font-bold text-gray-300">{index + 1}</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">Casa {index + 1}</span>
                                    </div>
                                    {bets.length > 2 && (
                                        <button onClick={() => removeBet(bet.id)} className="text-gray-600 hover:text-red-500 p-1">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-xs uppercase text-gray-500 mb-1 font-bold tracking-wider">ODD</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={bet.odd}
                                            onChange={(e) => updateBet(bet.id, 'odd', e.target.value)}
                                            className="w-full bg-[#1a1d29] border-2 border-gray-600 rounded-lg px-3 py-2 text-lg font-bold text-white focus:outline-none focus:border-dg-green transition-all"
                                            placeholder="0,00"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="block text-xs uppercase text-gray-500 font-bold tracking-wider">STAKE</label>
                                            <div className="flex items-center gap-3">
                                                <label className="flex items-center gap-1 cursor-pointer group" title="Distribuir Lucro">
                                                    <span className="text-[10px] font-bold text-gray-500 group-hover:text-blue-400">D</span>
                                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${bet.distribute ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}>
                                                        {bet.distribute && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                    </div>
                                                    <input type="checkbox" checked={bet.distribute} onChange={(e) => updateBet(bet.id, 'distribute', e.target.checked)} className="hidden" />
                                                </label>
                                                <label className="flex items-center gap-1 cursor-pointer group" title="Fixar Stake">
                                                    <span className="text-[10px] font-bold text-gray-500 group-hover:text-dg-green">C</span>
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${fixedAnchor.type === 'bet' && fixedAnchor.id === bet.id ? 'border-dg-green bg-dg-green/20' : 'border-gray-600'}`}>
                                                        {fixedAnchor.type === 'bet' && fixedAnchor.id === bet.id && <div className="w-2 h-2 bg-dg-green rounded-full"></div>}
                                                    </div>
                                                    <input type="checkbox" checked={fixedAnchor.type === 'bet' && fixedAnchor.id === bet.id} onChange={(e) => setFixedAnchor(e.target.checked ? { type: 'bet', id: bet.id } : { type: 'none' })} className="hidden" />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">R$</span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={bet.stake}
                                                    onChange={(e) => handleStakeChange(bet.id, e.target.value)}
                                                    className="w-full bg-[#1a1d29] border-2 border-gray-600 rounded-lg pl-10 pr-3 py-2 text-lg font-bold text-white focus:outline-none focus:border-dg-green transition-all"
                                                    placeholder="0,00"
                                                />
                                            </div>
                                            <button onClick={() => copyStake(bet.stake)} className="px-2 bg-[#1a1d29] border-2 border-gray-600 hover:border-dg-green rounded-lg transition-all">
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Profit Display */}
                                {calculationResult && resIndex !== -1 && (
                                    <div className={`rounded-lg p-3 border-2 transition-all ${profit > 0 ? 'bg-dg-green/20 border-dg-green shadow-lg shadow-dg-green/20' : 'bg-[#1a1d29] border-gray-600'}`}>
                                        <div className="flex items-center justify-center">
                                            <span className={`text-xl font-black transition-all ${profit > 0 ? 'text-dg-green drop-shadow-[0_0_8px_rgba(0,255,163,0.5)]' : 'text-gray-500'}`}>
                                                {profit > 0 ? '+' : ''}R$ {Math.abs(profit).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Options */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${bet.commission ? 'bg-dg-green border-dg-green' : 'border-gray-600'}`}>
                                            {bet.commission && <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <input type="checkbox" checked={bet.commission} onChange={(e) => updateBet(bet.id, 'commission', e.target.checked)} className="hidden" />
                                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Comissão</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${bet.freebet ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}>
                                            {bet.freebet && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <input type="checkbox" checked={bet.freebet} onChange={(e) => updateBet(bet.id, 'freebet', e.target.checked)} className="hidden" />
                                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors">FreeBet</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${bet.oddBoost ? 'bg-yellow-500 border-yellow-500' : 'border-gray-600'}`}>
                                            {bet.oddBoost && <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <input type="checkbox" checked={bet.oddBoost} onChange={(e) => updateBet(bet.id, 'oddBoost', e.target.checked)} className="hidden" />
                                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Aumento de ODD</span>
                                    </label>
                                </div>

                                {bet.commission && (
                                    <div className="mt-2">
                                        <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Comissão (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={bet.commissionPercent}
                                            onChange={(e) => updateBet(bet.id, 'commissionPercent', e.target.value)}
                                            className="w-full bg-[#1a1d29] border-2 border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-dg-green"
                                            placeholder="0,0"
                                        />
                                    </div>
                                )}

                                {bet.oddBoost && (
                                    <div className="mt-2">
                                        <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Aumento de ODD (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={bet.oddBoostPercent}
                                            onChange={(e) => updateBet(bet.id, 'oddBoostPercent', e.target.value)}
                                            className="w-full bg-[#1a1d29] border-2 border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
                                            placeholder="25"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button onClick={addBet} className="flex-1 py-4 border-2 border-dashed border-gray-600 rounded-2xl text-gray-300 hover:border-dg-green hover:text-dg-green hover:bg-dg-green/10 transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-wide">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Adicionar Casa
                    </button>
                    <button onClick={swapOdds} className="px-6 py-4 bg-transparent border-2 border-gray-600 rounded-2xl text-gray-300 hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500 transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-wide">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                        Inverter
                    </button>
                    <button onClick={clearAll} className="px-6 py-4 bg-transparent border-2 border-gray-600 rounded-2xl text-gray-300 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500 transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-wide">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Limpar
                    </button>
                </div>
            </main>

            {/* Copy Toast Notification */}
            {showCopyToast && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-dg-green text-black px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border-2 border-dg-green">
                        <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-bold text-sm">Copiado!</div>
                            <div className="text-xs opacity-80">R$ {copiedValue}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
