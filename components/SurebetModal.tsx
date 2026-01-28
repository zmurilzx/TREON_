"use client";

import { useState, useEffect } from "react";
import { X, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface SurebetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (surebet: any) => void;
}

export default function SurebetModal({ isOpen, onClose, onSuccess }: SurebetModalProps) {
    const [loading, setLoading] = useState(false);

    // Form data
    const [event, setEvent] = useState("");
    const [sport, setSport] = useState("");
    const [betDate, setBetDate] = useState("");

    // Casa 1
    const [house1, setHouse1] = useState("");
    const [odd1, setOdd1] = useState("");
    const [stake1, setStake1] = useState("");
    const [market1, setMarket1] = useState("");

    // Casa 2
    const [house2, setHouse2] = useState("");
    const [odd2, setOdd2] = useState("");
    const [stake2, setStake2] = useState("");
    const [market2, setMarket2] = useState("");

    // Cálculos automáticos
    const [totalStake, setTotalStake] = useState(0);
    const [potentialProfit, setPotentialProfit] = useState(0);

    // Recalcular quando stakes ou odds mudarem
    useEffect(() => {
        const s1 = parseFloat(stake1) || 0;
        const s2 = parseFloat(stake2) || 0;
        const o1 = parseFloat(odd1) || 0;
        const o2 = parseFloat(odd2) || 0;

        const total = s1 + s2;
        setTotalStake(total);

        if (total > 0 && o1 > 0 && o2 > 0) {
            const return1 = s1 * o1;
            const return2 = s2 * o2;
            const profit = Math.max(return1, return2) - total;
            setPotentialProfit(profit);
        } else {
            setPotentialProfit(0);
        }
    }, [stake1, stake2, odd1, odd2]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create surebet object
            const surebet = {
                id: Date.now().toString(),
                event,
                sport,
                betDate,
                house1,
                odd1: parseFloat(odd1),
                stake1: parseFloat(stake1),
                market1,
                house2,
                odd2: parseFloat(odd2),
                stake2: parseFloat(stake2),
                market2,
                totalStake,
                potentialProfit,
                status: 'PENDING' as const,
                winningHouse: null,
                actualProfit: null,
                roi: null,
                resultDate: null,
                createdAt: new Date().toISOString()
            };

            toast.success('Surebet criada com sucesso!');
            onSuccess(surebet);
            resetForm();
        } catch (error) {
            console.error('Erro:', error);
            toast.error('Erro ao criar surebet');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEvent("");
        setSport("");
        setBetDate("");
        setHouse1("");
        setOdd1("");
        setStake1("");
        setMarket1("");
        setHouse2("");
        setOdd2("");
        setStake2("");
        setMarket2("");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0f1419] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-[#0f1419] border-b border-white/10 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-chrome-500/10 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-chrome-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-chrome-400">Inserir Aposta de Surebet</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <p className="text-gray-400 text-sm">
                        Preencha o formulário abaixo para inserir nos seus registros de gerenciamento:
                    </p>

                    {/* Informações Básicas */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Evento
                            </label>
                            <input
                                type="text"
                                value={event}
                                onChange={(e) => setEvent(e.target.value)}
                                className="input"
                                placeholder="Ex: Flamengo vs Palmeiras"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Esporte
                            </label>
                            <input
                                type="text"
                                value={sport}
                                onChange={(e) => setSport(e.target.value)}
                                className="input"
                                placeholder="Ex: Futebol"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Data
                            </label>
                            <input
                                type="date"
                                value={betDate}
                                onChange={(e) => setBetDate(e.target.value)}
                                className="input"
                                required
                            />
                        </div>
                    </div>

                    {/* Casa 1 */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-lg font-semibold mb-4 text-chrome-400">Casa 1</h3>
                        <div className="grid md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                value={house1}
                                onChange={(e) => setHouse1(e.target.value)}
                                className="input"
                                placeholder="Nome da casa"
                                required
                            />
                            <input
                                type="number"
                                step="0.01"
                                value={odd1}
                                onChange={(e) => setOdd1(e.target.value)}
                                className="input"
                                placeholder="ODD"
                                required
                            />
                            <input
                                type="number"
                                step="0.01"
                                value={stake1}
                                onChange={(e) => setStake1(e.target.value)}
                                className="input"
                                placeholder="Stake"
                                required
                            />
                            <input
                                type="text"
                                value={market1}
                                onChange={(e) => setMarket1(e.target.value)}
                                className="input"
                                placeholder="Mercado"
                                required
                            />
                        </div>
                    </div>

                    {/* Casa 2 */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-lg font-semibold mb-4 text-purple-400">Casa 2</h3>
                        <div className="grid md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                value={house2}
                                onChange={(e) => setHouse2(e.target.value)}
                                className="input"
                                placeholder="Nome da casa"
                                required
                            />
                            <input
                                type="number"
                                step="0.01"
                                value={odd2}
                                onChange={(e) => setOdd2(e.target.value)}
                                className="input"
                                placeholder="ODD"
                                required
                            />
                            <input
                                type="number"
                                step="0.01"
                                value={stake2}
                                onChange={(e) => setStake2(e.target.value)}
                                className="input"
                                placeholder="Stake"
                                required
                            />
                            <input
                                type="text"
                                value={market2}
                                onChange={(e) => setMarket2(e.target.value)}
                                className="input"
                                placeholder="Mercado"
                                required
                            />
                        </div>
                    </div>

                    {/* Cálculos Automáticos */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-chrome-500/10 border border-chrome-500/30 rounded-xl p-4">
                            <p className="text-sm text-gray-400 mb-1">Stake Total</p>
                            <p className="text-2xl font-bold text-chrome-400">
                                R$ {totalStake.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                            <p className="text-sm text-gray-400 mb-1">ROI</p>
                            <p className="text-2xl font-bold text-blue-400">
                                {totalStake > 0 ? ((potentialProfit / totalStake) * 100).toFixed(2) : '0.00'}%
                            </p>
                        </div>
                        <div className={`border rounded-xl p-4 ${potentialProfit >= 0
                                ? 'bg-chrome-500/10 border-chrome-500/30'
                                : 'bg-red-500/10 border-red-500/30'
                            }`}>
                            <p className="text-sm text-gray-400 mb-1">Lucro</p>
                            <p className={`text-2xl font-bold ${potentialProfit >= 0 ? 'text-chrome-400' : 'text-red-400'
                                }`}>
                                R$ {potentialProfit.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-primary flex-1"
                            disabled={loading}
                        >
                            {loading ? 'Salvando...' : 'Adicionar registro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
