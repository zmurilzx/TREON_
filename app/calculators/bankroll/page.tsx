'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DayData {
    day: number;
    inicial: number;
    casa1: string;
    casa2: string;
    deposito: string;
    saque: string;
    total: number;
    depositoRetirado: number;
    totalLucro: number;
}

export default function BankrollManagementPage() {
    const router = useRouter();
    const [bancaInicial, setBancaInicial] = useState('2000');
    const [metaMensal, setMetaMensal] = useState('10000');
    const [days, setDays] = useState<DayData[]>([
        { day: 1, inicial: 2000, casa1: '', casa2: '', deposito: '', saque: '', total: 2000, depositoRetirado: 0, totalLucro: 0 }
    ]);

    const parseValues = (valueString: string): number => {
        if (!valueString || valueString.trim() === '') return 0;
        const values = valueString.split('+').map(v => parseFloat(v.trim()) || 0);
        return values.reduce((sum, val) => sum + val, 0);
    };

    const updateDay = (index: number, field: keyof DayData, value: string) => {
        const updatedDays = [...days];
        updatedDays[index] = { ...updatedDays[index], [field]: value };
        
        // Recalculate all days from this point forward
        for (let i = index; i < updatedDays.length; i++) {
            const day = updatedDays[i];
            const casa1Total = parseValues(day.casa1);
            const casa2Total = parseValues(day.casa2);
            const depositoValue = parseValues(day.deposito);
            const saqueValue = parseValues(day.saque);
            
            // Calculate total for this day
            day.total = casa1Total + casa2Total + depositoValue - saqueValue;
            
            // Calculate depositoRetirado (Total - Inicial)
            day.depositoRetirado = day.total - day.inicial;
            
            // Calculate profit for this day (Total - Depósito - BancaInicial)
            const lucroDay = day.total - depositoValue - day.inicial;
            
            // Calculate cumulative totalLucro
            const prevTotalLucro = i === 0 ? 0 : updatedDays[i - 1].totalLucro;
            day.totalLucro = prevTotalLucro + lucroDay;
            
            // Set inicial for next day (use depositoRetirado)
            if (i + 1 < updatedDays.length) {
                updatedDays[i + 1].inicial = day.depositoRetirado;
            }
        }
        
        setDays(updatedDays);
    };

    const addDay = () => {
        const lastDay = days[days.length - 1];
        const newDay: DayData = {
            day: lastDay.day + 1,
            inicial: lastDay.depositoRetirado,
            casa1: '',
            casa2: '',
            deposito: '',
            saque: '',
            total: lastDay.depositoRetirado,
            depositoRetirado: 0,
            totalLucro: lastDay.totalLucro
        };
        setDays([...days, newDay]);
    };

    const clearAll = () => {
        const inicial = parseFloat(bancaInicial) || 0;
        setDays([{ day: 1, inicial, casa1: '', casa2: '', deposito: '', saque: '', total: inicial, depositoRetirado: 0, totalLucro: 0 }]);
    };

    const updateBancaInicial = (newBanca: string) => {
        setBancaInicial(newBanca);
        const inicial = parseFloat(newBanca) || 0;
        const updatedDays = [...days];
        updatedDays[0].inicial = inicial;
        
        // Recalculate all days
        for (let i = 0; i < updatedDays.length; i++) {
            const day = updatedDays[i];
            const casa1Total = parseValues(day.casa1);
            const casa2Total = parseValues(day.casa2);
            const depositoValue = parseValues(day.deposito);
            const saqueValue = parseValues(day.saque);
            
            day.total = casa1Total + casa2Total + depositoValue - saqueValue;
            
            // Calculate depositoRetirado (Total - Inicial)
            day.depositoRetirado = day.total - day.inicial;
            
            const lucroDay = day.total - depositoValue - day.inicial;
            const prevTotalLucro = i === 0 ? 0 : updatedDays[i - 1].totalLucro;
            day.totalLucro = prevTotalLucro + lucroDay;
            
            if (i + 1 < updatedDays.length) {
                updatedDays[i + 1].inicial = day.depositoRetirado;
            }
        }
        
        setDays(updatedDays);
    };

    const getTotalLucro = () => {
        return days.length > 0 ? days[days.length - 1].totalLucro : 0;
    };

    const getMediaDiaria = () => {
        if (days.length === 0) return 0;
        return getTotalLucro() / days.length;
    };

    const getRestante = () => {
        const meta = parseFloat(metaMensal) || 0;
        return meta - getTotalLucro();
    };

    return (
        <div className="min-h-screen bg-[#0f1419] text-white">
            <button
                onClick={() => router.back()}
                className="fixed top-3 left-3 z-50 p-2 bg-[#1E2433]/80 border border-gray-700/50 rounded-lg text-gray-400 hover:text-[#00FFA3] transition-all"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>

            <main className="container mx-auto px-6 py-8 max-w-7xl">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-2 border-emerald-500/50 rounded-xl p-4">
                        <div className="text-xs text-emerald-400 uppercase mb-1 flex items-center gap-2">
                            <span>📈</span> Lucro Total
                        </div>
                        <div className={`text-2xl font-black ${getTotalLucro() >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            R$ {getTotalLucro().toFixed(2)}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-2 border-blue-500/50 rounded-xl p-4">
                        <div className="text-xs text-blue-400 uppercase mb-1 flex items-center gap-2">
                            <span>📊</span> Média Diária
                        </div>
                        <div className="text-2xl font-black text-blue-400">
                            R$ {getMediaDiaria().toFixed(2)}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-2 border-purple-500/50 rounded-xl p-4">
                        <div className="text-xs text-purple-400 uppercase mb-1 flex items-center gap-2">
                            <span>🎯</span> Meta Mensal
                        </div>
                        <div className="text-2xl font-black text-purple-400">
                            R$ {metaMensal}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/50 rounded-xl p-4">
                        <div className="text-xs text-yellow-400 uppercase mb-1 flex items-center gap-2">
                            <span>⏳</span> Restante
                        </div>
                        <div className={`text-2xl font-black ${getRestante() <= 0 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                            R$ {getRestante().toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Configuration */}
                <div className="bg-[#1a1f2e] border-2 border-gray-700 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 uppercase mb-2 flex items-center gap-2">
                                <span>🔥</span> Banca Inicial:
                            </label>
                            <input
                                type="number"
                                value={bancaInicial}
                                onChange={(e) => updateBancaInicial(e.target.value)}
                                className="w-full bg-[#0f1419] border-2 border-gray-600 rounded-lg px-4 py-2 text-white font-bold"
                                placeholder="2000"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 uppercase mb-2 flex items-center gap-2">
                                <span>🎯</span> Meta Mensal:
                            </label>
                            <input
                                type="number"
                                value={metaMensal}
                                onChange={(e) => setMetaMensal(e.target.value)}
                                className="w-full bg-[#0f1419] border-2 border-gray-600 rounded-lg px-4 py-2 text-white font-bold"
                                placeholder="10000"
                            />
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">💡</span>
                        <div className="flex-1">
                            <div className="font-bold text-blue-400 mb-1">Dica:</div>
                            <div className="text-sm text-gray-300">
                                Use a coluna <span className="font-bold text-blue-400">DEPÓSITO</span> quando adicionar dinheiro nas casas e a coluna <span className="font-bold text-red-400">SAQUE</span> quando retirar dinheiro. A banca do próximo dia será ajustada automaticamente.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-[#1a1f2e] border-2 border-gray-700 rounded-xl overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#0f1419] border-b-2 border-gray-700">
                                    <th className="p-3 text-left text-xs uppercase text-gray-400 font-bold">Inicial</th>
                                    <th className="p-3 text-left text-xs uppercase text-gray-400 font-bold">Dia</th>
                                    <th className="p-3 text-left text-xs uppercase text-blue-400 font-bold">BET365</th>
                                    <th className="p-3 text-left text-xs uppercase text-purple-400 font-bold">Casa 2</th>
                                    <th className="p-3 text-left text-xs uppercase text-teal-400 font-bold">💰 Depósito</th>
                                    <th className="p-3 text-left text-xs uppercase text-red-400 font-bold">💸 Saque</th>
                                    <th className="p-3 text-left text-xs uppercase text-emerald-400 font-bold">Total</th>
                                    <th className="p-3 text-left text-xs uppercase text-orange-400 font-bold">Depósito Retirado</th>
                                    <th className="p-3 text-left text-xs uppercase text-yellow-400 font-bold">Total Lucro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {days.map((day, index) => {
                                    const casa1Total = parseValues(day.casa1);
                                    const casa2Total = parseValues(day.casa2);
                                    const depositoValue = parseValues(day.deposito);
                                    const saqueValue = parseValues(day.saque);
                                    
                                    return (
                                        <tr key={day.day} className="border-b border-gray-700/50 hover:bg-[#0f1419] transition-all">
                                            <td className="p-3 font-bold text-gray-300">
                                                R$ {day.inicial.toFixed(2)}
                                            </td>
                                            <td className="p-3 font-bold text-white">{day.day}</td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={day.casa1}
                                                    onChange={(e) => updateDay(index, 'casa1', e.target.value)}
                                                    className="w-full bg-blue-500/10 border-2 border-blue-500/30 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                                                    placeholder=""
                                                />
                                                {casa1Total > 0 && (
                                                    <div className="text-xs text-blue-400 mt-1 font-bold">= R$ {casa1Total.toFixed(2)}</div>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={day.casa2}
                                                    onChange={(e) => updateDay(index, 'casa2', e.target.value)}
                                                    className="w-full bg-purple-500/10 border-2 border-purple-500/30 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-purple-500 focus:outline-none"
                                                    placeholder=""
                                                />
                                                {casa2Total > 0 && (
                                                    <div className="text-xs text-purple-400 mt-1 font-bold">= R$ {casa2Total.toFixed(2)}</div>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={day.deposito}
                                                    onChange={(e) => updateDay(index, 'deposito', e.target.value)}
                                                    className="w-full bg-teal-500/10 border-2 border-teal-500/30 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-teal-500 focus:outline-none"
                                                    placeholder=""
                                                />
                                                {depositoValue > 0 && (
                                                    <div className="text-xs text-teal-400 mt-1 font-bold">
                                                        = R$ {depositoValue.toFixed(2)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={day.saque}
                                                    onChange={(e) => updateDay(index, 'saque', e.target.value)}
                                                    className="w-full bg-red-500/10 border-2 border-red-500/30 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-red-500 focus:outline-none"
                                                    placeholder=""
                                                />
                                                {saqueValue > 0 && (
                                                    <div className="text-xs text-red-400 mt-1 font-bold">
                                                        = R$ {saqueValue.toFixed(2)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3 font-bold text-emerald-400">
                                                R$ {day.total.toFixed(2)}
                                            </td>
                                            <td className="p-3 font-bold text-orange-400">
                                                R$ {day.depositoRetirado.toFixed(2)}
                                            </td>
                                            <td className={`p-3 font-black ${day.totalLucro >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                R$ {day.totalLucro.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={addDay}
                        className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        + Adicionar Dia
                    </button>
                    <button
                        onClick={clearAll}
                        className="px-6 py-4 bg-red-500/20 border-2 border-red-500 text-red-400 rounded-xl font-bold hover:bg-red-500/30 transition-all"
                    >
                        🗑️ Limpar
                    </button>
                </div>
            </main>
        </div>
    );
}
