'use client';

import { signOut } from 'next-auth/react';
import { LogOut, X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleLogout = async () => {
        setLoading(true);
        await signOut({ callbackUrl: '/' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-[#0f1419] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                        <LogOut className="w-8 h-8 text-white" />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Sair da Conta?</h2>
                    <p className="text-gray-400">
                        Tem certeza que deseja sair? Você precisará fazer login novamente para acessar sua conta.
                    </p>
                </div>

                {/* Warning */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-200">
                        Suas sessões ativas serão encerradas em todos os dispositivos.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Saindo...
                            </>
                        ) : (
                            <>
                                <LogOut className="w-4 h-4" />
                                Sair
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
