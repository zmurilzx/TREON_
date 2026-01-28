'use client';

import DashboardLayout from '@/components/DashboardLayout';
import CheckoutModal from '@/components/CheckoutModal';
import { Crown, Zap, Trophy, Check, Clock } from 'lucide-react';
import { useState } from 'react';

export default function CheckoutPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);
    const [showPlanDetails, setShowPlanDetails] = useState<string | null>(null);
    const plans = [
        {
            id: 'delay-esportivo',
            name: 'Delay Esportivo',
            price: 'R$ 97,90',
            period: '/mês',
            description: 'Acesso completo ao sistema de delay esportivo',
            icon: Zap,
            gradient: 'from-emerald-500 to-teal-500',
            available: true,
            features: [
                'Delay em tempo real',
                'Múltiplos esportes',
                'Alertas instantâneos',
                'Suporte prioritário',
                'Atualizações constantes',
            ],
            href: '/delay-esportivo'
        },
        {
            id: 'duplo-green',
            name: 'Duplo Green',
            price: 'Em Breve',
            period: '',
            description: 'Estratégia avançada de duplo green',
            icon: Trophy,
            gradient: 'from-yellow-500 to-green-500',
            available: false,
            features: [
                'Análise de duplo green',
                'Alertas automáticos',
                'Histórico de oportunidades',
                'ROI otimizado',
                'Suporte especializado',
            ],
        },
        {
            id: 'sure-fifa-dgf',
            name: 'Sure FIFA + DGF',
            price: 'Em Breve',
            period: '',
            description: 'Surebets FIFA e DGF combinados',
            icon: Crown,
            gradient: 'from-blue-500 to-purple-500',
            available: false,
            features: [
                'Surebets FIFA',
                'DGF automático',
                'Múltiplas casas',
                'Cálculo automático',
                'Alertas em tempo real',
            ],
        },
    ];

    return (
        <DashboardLayout
            title="Planos VIP"
            subtitle="Escolha o plano ideal para maximizar seus lucros"
        >
            <div className="max-w-7xl mx-auto">
                {/* Plans Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {plans.map((plan) => {
                        const Icon = plan.icon;
                        return (
                            <div
                                key={plan.id}
                                className={`relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-2 ${plan.available ? 'border-emerald-500/50' : 'border-gray-700'
                                    } rounded-2xl p-8 transition-all duration-300 ${plan.available ? 'hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-105' : 'opacity-75'
                                    }`}
                            >
                                {/* Coming Soon Badge */}
                                {!plan.available && (
                                    <div className="absolute -top-3 right-6">
                                        <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                            EM BREVE
                                        </span>
                                    </div>
                                )}

                                {/* Icon */}
                                <div className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-xl flex items-center justify-center mb-6`}>
                                    <Icon className="w-8 h-8 text-white" />
                                </div>

                                {/* Plan Name */}
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

                                {/* Description */}
                                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                                {/* Price */}
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-4xl font-bold ${plan.available ? 'text-emerald-400' : 'text-gray-400'}`}>
                                            {plan.price}
                                        </span>
                                        {plan.period && (
                                            <span className="text-gray-500">{plan.period}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <Check className={`w-5 h-5 flex-shrink-0 ${plan.available ? 'text-emerald-400' : 'text-gray-500'}`} />
                                            <span className="text-sm text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                {plan.available ? (
                                    <button
                                        onClick={() => {
                                            setSelectedPlan({ name: plan.name, price: plan.price });
                                            setIsModalOpen(true);
                                        }}
                                        className={`w-full bg-gradient-to-r ${plan.gradient} text-white font-semibold py-4 rounded-lg text-center hover:shadow-lg hover:shadow-emerald-500/50 transition-all`}
                                    >
                                        Assinar Agora
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setShowPlanDetails(showPlanDetails === plan.id ? null : plan.id)}
                                        className="w-full bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white font-semibold py-4 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Clock className="w-5 h-5" />
                                        {showPlanDetails === plan.id ? 'Fechar Detalhes' : 'Ver Como Funciona'}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Duplo Green Details */}
                {showPlanDetails === 'duplo-green' && (
                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-2 border-yellow-500/30 rounded-2xl p-8 mb-12 animate-fade-in">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-green-500 rounded-xl flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold">Como Funciona o Duplo Green?</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-400 mb-3">O que é Duplo Green?</h3>
                                <p className="text-gray-300 mb-4">
                                    O Duplo Green é uma estratégia baseada no <strong>pagamento antecipado de 2 gols de vantagem</strong> das casas de apostas.
                                </p>
                                <p className="text-gray-300 mb-4">
                                    A operação é feita com <strong>3 casas de apostas</strong>, cobrindo:
                                </p>
                                <ul className="space-y-2 mb-4">
                                    <li className="flex items-center gap-2 text-gray-300">
                                        <Check className="w-4 h-4 text-yellow-400" />
                                        Vitória do mandante
                                    </li>
                                    <li className="flex items-center gap-2 text-gray-300">
                                        <Check className="w-4 h-4 text-yellow-400" />
                                        Empate
                                    </li>
                                    <li className="flex items-center gap-2 text-gray-300">
                                        <Check className="w-4 h-4 text-yellow-400" />
                                        Vitória do visitante
                                    </li>
                                </ul>
                                <p className="text-gray-300">
                                    Assim, sempre temos o jogo <strong>totalmente coberto</strong>.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Como funciona na prática?</h3>
                                <div className="space-y-3 text-gray-300 text-sm">
                                    <p>
                                        <strong>1.</strong> Se um time abre <strong>2x0</strong>, ocorre o pagamento antecipado
                                    </p>
                                    <p>
                                        <strong>2.</strong> Após isso, ficamos posicionados no <strong>empate</strong> e no <strong>outro time</strong>
                                    </p>
                                    <p>
                                        <strong>3.</strong> A partir daí, podemos:
                                    </p>
                                    <ul className="ml-6 space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-400">•</span>
                                            Fazer cashout
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-400">•</span>
                                            Proteger a operação
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-400">•</span>
                                            Buscar lucro maior se o jogo equilibrar
                                        </li>
                                    </ul>
                                    <p className="mt-3 text-xs text-gray-400">
                                        * Se o pagamento antecipado não acontecer, a estratégia se comporta como uma SURE, com risco controlado.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-yellow-400 mb-4">Benefícios</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-300">
                                        <strong>Lucro em mais de um cenário:</strong> Múltiplas possibilidades de ganho
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-300">
                                        <strong>Risco controlado:</strong> Jogo totalmente coberto
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-300">
                                        <strong>Lucro alto:</strong> Possibilidade de ganho com empate ou virada
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-300">
                                        <strong>Estratégia profissional:</strong> Estruturada e testada
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Trophy className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-yellow-400 mb-2">Em Breve!</h4>
                                    <p className="text-sm text-gray-300">
                                        Estamos finalizando o sistema de Duplo Green. Em breve você poderá acessar
                                        esta estratégia avançada e maximizar seus lucros!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sure FIFA + DGF Details */}
                {showPlanDetails === 'sure-fifa-dgf' && (
                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-2 border-blue-500/30 rounded-2xl p-8 mb-12 animate-fade-in">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                <Crown className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold">Como Funciona Sure FIFA + DGF?</h2>
                        </div>

                        <div className="space-y-8">
                            {/* Sure FIFA */}
                            <div>
                                <h3 className="text-lg font-semibold text-blue-400 mb-3">Sure FIFA - Métodos de Surebet no FIFA (e-sports)</h3>
                                <p className="text-gray-300 mb-4">
                                    O <strong>Sure FIFA</strong> é um treinamento prático onde você aprende como fazer <strong>Surebet no FIFA</strong>,
                                    explorando falhas temporárias de odds em diferentes mercados.
                                </p>
                                <p className="text-gray-300 mb-4">
                                    <strong>Aqui não tem palpite.</strong><br />
                                    O foco é <strong>leitura de mercado + execução rápida</strong>.
                                </p>

                                <h4 className="text-md font-semibold text-blue-300 mb-3">O que você vai aprender:</h4>
                                <div className="grid md:grid-cols-2 gap-3 mb-4">
                                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                                        <Check className="w-4 h-4 text-blue-400" />
                                        Surebet em gols
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                                        <Check className="w-4 h-4 text-blue-400" />
                                        Surebet em ambas marcam
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                                        <Check className="w-4 h-4 text-blue-400" />
                                        Empate anula
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                                        <Check className="w-4 h-4 text-blue-400" />
                                        Total de jogador
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                                        <Check className="w-4 h-4 text-blue-400" />
                                        Dupla chance
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                                        <Check className="w-4 h-4 text-blue-400" />
                                        Inversão de odds para ganhar velocidade
                                    </div>
                                </div>
                            </div>

                            {/* DGF */}
                            <div className="border-t border-gray-700 pt-6">
                                <h3 className="text-lg font-semibold text-purple-400 mb-3">DGF - Duplo Green FIFA</h3>
                                <p className="text-gray-300 mb-4">
                                    Estratégia baseada em <strong>discrepância de odds entre mercados correlacionados</strong>.
                                </p>
                                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-gray-300 mb-2"><strong>Exemplo:</strong></p>
                                    <p className="text-sm text-gray-300 mb-2">
                                        <strong className="text-purple-400">Over 2.5 + Under 3.5</strong>
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        Se o jogo termina com <strong>3 gols</strong>, você <strong className="text-green-400">lucra dos dois lados</strong>.
                                    </p>
                                </div>
                            </div>

                            {/* Ferramentas */}
                            <div className="border-t border-gray-700 pt-6">
                                <h3 className="text-lg font-semibold text-blue-400 mb-3">Ferramentas</h3>
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                    <p className="text-gray-300 mb-2">
                                        <strong>Calculadora de odds e valores de entrada</strong>
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Cálculo rápido para não perder a oportunidade.
                                    </p>
                                </div>
                            </div>

                            {/* Formato */}
                            <div className="border-t border-gray-700 pt-6">
                                <h3 className="text-lg font-semibold text-blue-400 mb-3">Formato</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                                        <div className="text-2xl mb-2">🎥</div>
                                        <p className="text-sm font-semibold text-gray-300">Aulas gravadas</p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                                        <div className="text-2xl mb-2">📚</div>
                                        <p className="text-sm font-semibold text-gray-300">Estratégias do zero</p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                                        <div className="text-2xl mb-2">🎯</div>
                                        <p className="text-sm font-semibold text-gray-300">Foco em método</p>
                                    </div>
                                </div>
                            </div>

                            {/* Diferencial */}
                            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
                                <div className="text-center space-y-2">
                                    <p className="text-gray-300"><strong>Sem sinais.</strong></p>
                                    <p className="text-gray-300"><strong>Sem promessas irreais.</strong></p>
                                    <p className="text-lg font-bold text-blue-400">Aqui você aprende o processo.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Crown className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-blue-400 mb-2">Em Breve!</h4>
                                    <p className="text-sm text-gray-300">
                                        Estamos desenvolvendo o sistema de Sure FIFA + DGF. Em breve você terá acesso
                                        a esta poderosa combinação de estratégias para e-sports!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* How Delay Works Section - Only show when no plan details are open */}
                {!showPlanDetails && (
                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-2 border-gray-700 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold">Como Funciona o Delay Esportivo?</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-emerald-400 mb-3">O que é Delay?</h3>
                                <p className="text-gray-300 mb-4">
                                    O delay esportivo é uma técnica que aproveita a diferença de tempo entre o evento ao vivo
                                    e a atualização das odds nas casas de apostas. Isso permite identificar oportunidades
                                    de apostas com vantagem estatística.
                                </p>
                                <p className="text-gray-300">
                                    Com nosso sistema, você recebe alertas em tempo real quando essas oportunidades surgem,
                                    permitindo que você faça apostas informadas antes que as odds sejam ajustadas.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-emerald-400 mb-3">Benefícios</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-300">
                                            <strong>Vantagem Competitiva:</strong> Aja antes dos outros apostadores
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-300">
                                            <strong>Alertas Instantâneos:</strong> Notificações em tempo real
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-300">
                                            <strong>Múltiplos Esportes:</strong> Futebol, tênis, basquete e mais
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-300">
                                            <strong>ROI Otimizado:</strong> Maximize seus lucros com precisão
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Zap className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-blue-400 mb-2">Comece Agora!</h4>
                                    <p className="text-sm text-gray-300">
                                        Assine o Delay Esportivo e comece a receber alertas de oportunidades em tempo real.
                                        Cancele quando quiser, sem compromisso de longo prazo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Checkout Modal */}
            {selectedPlan && (
                <CheckoutModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    planName={selectedPlan.name}
                    price={selectedPlan.price}
                />
            )}
        </DashboardLayout>
    );
}
