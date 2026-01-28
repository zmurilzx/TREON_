'use client';

import { X, CreditCard, QrCode } from 'lucide-react';
import { useState } from 'react';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    planName: string;
    price: string;
}

export default function CheckoutModal({ isOpen, onClose, planName, price }: CheckoutModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | null>(null);

    if (!isOpen) return null;

    const handlePaymentSelect = (method: 'pix' | 'credit') => {
        setPaymentMethod(method);
        // Aqui você pode adicionar a lógica de pagamento
        console.log(`Método selecionado: ${method}`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-emerald-500/30 rounded-2xl max-w-md w-full p-8 shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-emerald-400 mb-2">
                        Escolha a forma de pagamento
                    </h2>
                    <p className="text-gray-400 text-sm mb-4">
                        Você selecionou
                    </p>
                    <p className="text-xl font-bold text-white mb-1">{planName}</p>
                    <p className="text-3xl font-bold text-emerald-400">{price}</p>
                </div>

                {/* Payment Methods */}
                <div className="grid grid-cols-2 gap-4">
                    {/* PIX */}
                    <button
                        onClick={() => handlePaymentSelect('pix')}
                        className="flex flex-col items-center gap-3 p-6 bg-gray-800/50 border-2 border-gray-700 hover:border-emerald-500 rounded-xl transition-all group"
                    >
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/30 transition">
                            <QrCode className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-white mb-1">Pagar com PIX</p>
                            <p className="text-xs text-gray-400">QR Code • Confirmação rápida</p>
                        </div>
                    </button>

                    {/* Credit Card */}
                    <button
                        onClick={() => handlePaymentSelect('credit')}
                        className="flex flex-col items-center gap-3 p-6 bg-gray-800/50 border-2 border-gray-700 hover:border-emerald-500 rounded-xl transition-all group"
                    >
                        <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition">
                            <CreditCard className="w-8 h-8 text-blue-400" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-white mb-1">Cartão de Crédito</p>
                            <p className="text-xs text-gray-400">Checkout seguro Mercado Pago</p>
                        </div>
                    </button>
                </div>

                {/* Info */}
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-xs text-gray-300 text-center">
                        🔒 Pagamento 100% seguro e criptografado
                    </p>
                </div>
            </div>
        </div>
    );
}
