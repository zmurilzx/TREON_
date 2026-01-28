'use client';

import Link from 'next/link';
import { ArrowLeft, Users, ExternalLink, MessageCircle } from 'lucide-react';

export default function GrupoGratisPage() {
    const telegramLink = 'https://t.me/+6-oNPdyn_RNmM2Vh';

    const handleJoinTelegram = () => {
        window.open(telegramLink, '_blank');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#0a0e1a] text-white">
            {/* Header */}
            <div className="bg-[#0f1419]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="w-9 h-9 bg-gradient-to-br from-emerald-600/20 to-green-600/20 hover:from-emerald-600/30 hover:to-green-600/30 rounded-xl flex items-center justify-center transition-all border border-emerald-500/20">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                                Grupo Grátis
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    {/* Main Card */}
                    <div className="bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] border border-emerald-500/30 rounded-2xl p-8 shadow-2xl shadow-emerald-500/20">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-500 blur-2xl opacity-50 rounded-full"></div>
                                <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Users className="w-12 h-12 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                            Grupo Grátis
                        </h2>

                        {/* Description */}
                        <p className="text-gray-300 text-center mb-8 text-lg leading-relaxed">
                            Entre no nosso grupo para participar de sorteios importantes no Brasil
                        </p>

                        {/* Benefits */}
                        <div className="space-y-4 mb-8">
                            <BenefitItem text="Sorteios exclusivos toda semana" />
                            <BenefitItem text="Comunidade ativa com milhares de membros" />
                            <BenefitItem text="Dicas e estratégias compartilhadas" />
                            <BenefitItem text="Notificações de promoções especiais" />
                            <BenefitItem text="100% Gratuito, sem custos escondidos" />
                        </div>

                        {/* Telegram Button */}
                        <button
                            onClick={handleJoinTelegram}
                            className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative flex items-center justify-center gap-3">
                                <MessageCircle className="w-6 h-6" />
                                <span className="text-lg">Entrar no Grupo Telegram</span>
                                <ExternalLink className="w-5 h-5" />
                            </div>
                        </button>

                        {/* Additional Info */}
                        <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            <p className="text-sm text-emerald-400 text-center">
                                ⚡ Clique no botão acima para ser redirecionado ao Telegram
                            </p>
                        </div>
                    </div>

                    {/* Extra Info Card */}
                    <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <span className="text-emerald-400">📱</span>
                            Como entrar?
                        </h3>
                        <ol className="space-y-2 text-sm text-gray-400">
                            <li>1. Certifique-se de ter o Telegram instalado no seu celular ou PC</li>
                            <li>2. Clique no botão verde acima</li>
                            <li>3. Você será redirecionado para o Telegram</li>
                            <li>4. Clique em "Entrar no grupo" ou "Join"</li>
                            <li>5. Pronto! Você já está no grupo e pode começar a participar 🎉</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BenefitItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-emerald-500/20">
            <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <span className="text-gray-300">{text}</span>
        </div>
    );
}
