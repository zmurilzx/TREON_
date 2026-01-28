'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Zap,
    Trophy,
    Users,
    Clock,
    CheckCircle,
    Star,
    Headphones,
    Target,
    ArrowLeft,
    ExternalLink,
    Sparkles,
    Loader2,
} from 'lucide-react';

export default function DelayEsportivoPage() {
    const discordLink = 'https://discord.gg/seu-servidor'; // Link que será enviado após pagamento
    const [isProcessing, setIsProcessing] = useState(false);

    const handleJoinDiscord = async () => {
        setIsProcessing(true);

        try {
            const response = await fetch('/api/checkout/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productType: 'DELAY_ESPORTIVO',
                    amount: 99.90, // Valor da assinatura
                    discordLink,
                }),
            });

            const data = await response.json();

            if (data.checkoutUrl) {
                // Redirecionar para página de pagamento
                window.location.href = data.checkoutUrl;
            } else {
                alert('Erro ao criar checkout. Tente novamente.');
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Erro ao processar. Tente novamente.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#0a0e1a] text-white">
            {/* Header */}
            <div className="bg-[#0f1419]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="w-9 h-9 bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 hover:from-emerald-600/30 hover:to-cyan-600/30 rounded-xl flex items-center justify-center transition-all border border-emerald-500/20">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                Delay Esportivo
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full mb-6 animate-pulse">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold text-sm">DELAY PROFISSIONAL</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                        <span className="text-white">Entre </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">3 Segundos</span>
                        <br />
                        <span className="text-white">na Frente do Mercado</span>
                    </h2>

                    <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                        Call AO VIVO no Discord com <span className="text-emerald-400 font-bold">Narrador Exclusivo</span> te avisando das oportunidades antes das casas trancar os mercados.
                    </p>

                    {/* CTA Button */}
                    <button
                        onClick={handleJoinDiscord}
                        disabled={isProcessing}
                        className="group relative px-10 py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-bold text-xl hover:shadow-2xl hover:shadow-emerald-500/50 transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative flex items-center gap-3">
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Processando...
                                </>
                            ) : (
                                <>
                                    <Users className="w-6 h-6" />
                                    Assinar Delay Esportivo
                                    <ExternalLink className="w-5 h-5" />
                                </>
                            )}
                        </span>
                    </button>
                    <p className="text-sm text-gray-500">R$ 99,90/mês • Acesso ao Discord • Narrador ao vivo</p>
                </div>

                {/* O que você recebe */}
                <div className="mb-16">
                    <h3 className="text-3xl font-bold text-center mb-10">
                        O que você <span className="text-emerald-400">recebe</span>
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <BenefitCard
                            icon={<Headphones className="w-8 h-8" />}
                            title="Narrador Profissional"
                            description="Call ao vivo no Discord acompanhando cada lance do jogo"
                        />
                        <BenefitCard
                            icon={<Zap className="w-8 h-8" />}
                            title="Avisos Instantâneos"
                            description="Te avisamos ANTES da odd atualizar nas casas de apostas"
                        />
                        <BenefitCard
                            icon={<Target className="w-8 h-8" />}
                            title="Entradas Precisas"
                            description="Oportunidades identificadas com análise em tempo real"
                        />
                        <BenefitCard
                            icon={<Users className="w-8 h-8" />}
                            title="Comunidade Exclusiva"
                            description="Grupo Discord VIP com +250 traders ativos"
                        />
                        <BenefitCard
                            icon={<Trophy className="w-8 h-8" />}
                            title="Material Completo"
                            description="Aulas de delay esportivo do básico ao avançado"
                        />
                        <BenefitCard
                            icon={<CheckCircle className="w-8 h-8" />}
                            title="Suporte VIP"
                            description="Atendimento prioritário para dúvidas e suporte"
                        />
                    </div>
                </div>

                {/* Como funciona - Simplificado */}
                <div className="mb-16 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl p-8">
                    <h3 className="text-3xl font-bold text-center mb-8">
                        Como <span className="text-emerald-400">funciona</span>
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <StepCard
                            number="1"
                            title="Lance Acontece"
                            description="Um evento ocorre no jogo real (gol, escanteio, cartão)"
                            icon="⚽"
                        />
                        <StepCard
                            number="2"
                            title="Narrador Te Avisa"
                            description="Nosso narrador vê e te avisa na call do Discord ANTES da odd cair"
                            icon="🎤"
                        />
                        <StepCard
                            number="3"
                            title="Você Entra com Vantagem"
                            description="Você entra 1-3 segundos antes do mercado reagir"
                            icon="💰"
                            highlight
                        />
                    </div>
                </div>

                {/* Depoimentos */}
                <div className="mb-16">
                    <h3 className="text-3xl font-bold text-center mb-10">
                        O que nossos <span className="text-emerald-400">alunos dizem</span>
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <TestimonialCard
                            name="Carlos M."
                            text="Em 30 dias já recuperei o investimento. O narrador é sensacional!"
                            rating={5}
                        />
                        <TestimonialCard
                            name="Ana P."
                            text="Nunca imaginei que delay funcionasse tão bem. Lucro consistente!"
                            rating={5}
                        />
                        <TestimonialCard
                            name="Roberto S."
                            text="Melhor método de delay que já testei. Recomendo 100%!"
                            rating={5}
                        />
                    </div>
                </div>

                {/* CTA Final */}
                <div className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border-2 border-emerald-500/50 rounded-2xl p-10 text-center">
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full mb-4">
                            <Trophy className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 font-semibold text-sm">VAGAS LIMITADAS</span>
                        </div>
                        <h3 className="text-4xl font-bold mb-4">
                            Pronto para começar a lucrar com <span className="text-emerald-400">vantagem?</span>
                        </h3>
                        <p className="text-xl text-gray-300 mb-8">
                            Junte-se a +250 traders que já estão lucrando no delay todos os dias
                        </p>
                    </div>

                    <button
                        onClick={handleJoinDiscord}
                        disabled={isProcessing}
                        className="px-12 py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-bold text-xl hover:shadow-2xl hover:shadow-emerald-500/50 transition-all inline-flex items-center gap-3 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Processando...
                            </>
                        ) : (
                            <>
                                <Users className="w-6 h-6" />
                                Assinar Agora - R$ 99,90/mês
                                <ExternalLink className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span>Acesso Imediato</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span>Narrador ao Vivo</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span>Suporte VIP</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-500/50 transition-all group">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h4 className="text-lg font-bold mb-2">{title}</h4>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    );
}

function StepCard({ number, title, description, icon, highlight }: { number: string; title: string; description: string; icon: string; highlight?: boolean }) {
    return (
        <div className={`relative bg-white/5 border ${highlight ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-white/10'} rounded-xl p-6 text-center`}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center font-bold">
                {number}
            </div>
            <div className={`text-4xl mb-4 ${highlight ? 'animate-pulse' : ''}`}>{icon}</div>
            <h4 className="font-bold mb-2">{title}</h4>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    );
}

function TestimonialCard({ name, text, rating }: { name: string; text: string; rating: number }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-emerald-500/50 transition-all">
            <div className="flex gap-1 mb-4">
                {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
            </div>
            <p className="text-gray-300 mb-4 italic">"{text}"</p>
            <p className="font-bold">{name}</p>
        </div>
    );
}
