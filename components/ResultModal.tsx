"use client";

import { useState } from "react";
import { X, CheckCircle, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface ResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    surebetId: string;
    house1Name: string;
    house2Name: string;
    onSuccess: (surebetId: string, winningHouse: number) => void;
}

export default function ResultModal({
    isOpen,
    onClose,
    surebetId,
    house1Name,
    house2Name,
    onSuccess
}: ResultModalProps) {
    const [loading, setLoading] = useState(false);
    const [selectedHouse, setSelectedHouse] = useState<number | null>(null);

    const handleSubmit = async () => {
        if (!selectedHouse) {
            toast.error('Selecione onde a aposta bateu');
            return;
        }

        setLoading(true);

        try {
            toast.success('Resultado registrado com sucesso!');
            onSuccess(surebetId, selectedHouse);
            onClose();
        } catch (error) {
            console.error('Erro:', error);
            toast.error('Erro ao registrar resultado');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0f1419] border border-white/10 rounded-2xl max-w-md w-full">
                {/* Header */}
                <div className="border-b border-white/10 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-chrome-500/10 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-chrome-400" />
                        </div>
                        <h2 className="text-xl font-bold">Registrar Resultado</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <p className="text-gray-400 text-center">
                        Onde a aposta bateu?
                    </p>

                    {/* House Selection */}
                    <div className="space-y-3">
                        <button
                            onClick={() => setSelectedHouse(1)}
                            className={`w-full p-4 rounded-xl border-2 transition-all ${selectedHouse === 1
                                    ? 'bg-chrome-500/20 border-chrome-500 shadow-chrome-md'
                                    : 'bg-white/5 border-white/10 hover:border-chrome-500/50'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedHouse === 1
                                            ? 'border-chrome-500 bg-chrome-500'
                                            : 'border-gray-500'
                                        }`}>
                                        {selectedHouse === 1 && (
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-lg">Casa 1</p>
                                        <p className="text-sm text-gray-400">{house1Name}</p>
                                    </div>
                                </div>
                                <TrendingUp className={`w-6 h-6 ${selectedHouse === 1 ? 'text-chrome-400' : 'text-gray-500'
                                    }`} />
                            </div>
                        </button>

                        <button
                            onClick={() => setSelectedHouse(2)}
                            className={`w-full p-4 rounded-xl border-2 transition-all ${selectedHouse === 2
                                    ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/20'
                                    : 'bg-white/5 border-white/10 hover:border-purple-500/50'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedHouse === 2
                                            ? 'border-purple-500 bg-purple-500'
                                            : 'border-gray-500'
                                        }`}>
                                        {selectedHouse === 2 && (
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-lg">Casa 2</p>
                                        <p className="text-sm text-gray-400">{house2Name}</p>
                                    </div>
                                </div>
                                <TrendingUp className={`w-6 h-6 ${selectedHouse === 2 ? 'text-purple-400' : 'text-gray-500'
                                    }`} />
                            </div>
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="btn-secondary flex-1"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="btn-primary flex-1"
                            disabled={loading || !selectedHouse}
                        >
                            {loading ? 'Salvando...' : 'Confirmar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
