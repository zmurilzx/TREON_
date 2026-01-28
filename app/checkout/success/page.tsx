'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [discordLink, setDiscordLink] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // Simulate checking payment status (in reality, this would be checked via API)
        const checkPayment = async () => {
            try {
                // Call API to check payment and get Discord link
                const response = await fetch('/api/checkout/status');
                const data = await response.json();

                if (data.status === 'paid' && data.discordLink) {
                    setDiscordLink(data.discordLink);
                    setStatus('success');

                    // Start countdown
                    const timer = setInterval(() => {
                        setCountdown((prev) => {
                            if (prev <= 1) {
                                clearInterval(timer);
                                window.location.href = data.discordLink;
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);

                    return () => clearInterval(timer);
                } else {
                    setStatus('error');
                }
            } catch (error) {
                console.error('Error checking payment:', error);
                setStatus('error');
            }
        };

        checkPayment();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#0a0e1a] text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {status === 'loading' && (
                    <div className="text-center">
                        <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mx-auto mb-6" />
                        <h2 className="text-2xl font-bold mb-2">Processando pagamento...</h2>
                        <p className="text-gray-400">Aguarde enquanto confirmamos seu pagamento</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] border border-emerald-500/30 rounded-2xl p-8 text-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full mx-auto w-24 h-24"></div>
                            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-12 h-12 text-white" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            Pagamento Confirmado!
                        </h2>

                        <p className="text-xl text-gray-300 mb-6">
                            Bem-vindo ao <span className="text-emerald-400 font-bold">Delay Esportivo</span>
                        </p>

                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6">
                            <p className="text-sm text-emerald-400 mb-2">Você será redirecionado para o Discord em</p>
                            <p className="text-4xl font-bold text-emerald-400">{countdown}s</p>
                        </div>

                        {discordLink && (
                            <a
                                href={discordLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full block px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all mb-4"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Entrar no Discord Agora
                                    <ExternalLink className="w-5 h-5" />
                                </span>
                            </a>
                        )}

                        <Link
                            href="/dashboard"
                            className="text-sm text-gray-400 hover:text-white transition"
                        >
                            Voltar para Dashboard
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] border border-red-500/30 rounded-2xl p-8 text-center">
                        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">❌</span>
                        </div>

                        <h2 className="text-3xl font-bold mb-4 text-red-400">
                            Erro no Pagamento
                        </h2>

                        <p className="text-gray-300 mb-6">
                            Não conseguimos confirmar seu pagamento. Entre em contato com o suporte.
                        </p>

                        <Link
                            href="/delay-esportivo"
                            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-bold hover:shadow-lg transition-all inline-block"
                        >
                            Tentar Novamente
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
