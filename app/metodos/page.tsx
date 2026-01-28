'use client';

import Link from 'next/link';
import { ArrowLeft, Zap, TrendingUp, Target, BookOpen } from 'lucide-react';

export default function MetodosPage() {
    return (
        <div className="min-h-screen bg-[#0a0e1a] text-white">
            <div className="container mx-auto px-4 py-16">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-8">
                    <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
                </Link>

                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-4">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">
                            Métodos <span className="text-purple-400">Profissionais</span>
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Estratégias comprovadas para maximizar seus lucros
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Delay Esportivo */}
                        <Link href="/delay-esportivo">
                            <div className="group bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-500/50 transition-all cursor-pointer h-full">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 group-hover:text-emerald-400 transition">
                                    Delay Esportivo
                                </h3>
                                <p className="text-gray-400 mb-4">
                                    Aproveite o atraso de transmissão para entrar 1-3 segundos antes das odds atualizarem
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-xs text-emerald-400">
                                        Call ao Vivo
                                    </span>
                                    <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-xs text-cyan-400">
                                        Discord VIP
                                    </span>
                                    <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-xs text-purple-400">
                                        Narrador Exclusivo
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-emerald-400">
                                    <span>Ver método completo</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </div>
                        </Link>

                        {/* Value Betting */}
                        <div className="group bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all cursor-pointer h-full opacity-50">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">
                                Value Betting
                            </h3>
                            <p className="text-gray-400 mb-4">
                                Identifique odds com valor positivo e maximize seu ROI a longo prazo
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-xs text-blue-400">
                                    Análise Estatística
                                </span>
                                <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-xs text-purple-400">
                                    Software Exclusivo
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>Em breve</span>
                            </div>
                        </div>

                        {/* Matched Betting */}
                        <div className="group bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6 hover:border-yellow-500/50 transition-all cursor-pointer h-full opacity-50">
                            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4 text-yellow-400">
                                <Target className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">
                                Matched Betting
                            </h3>
                            <p className="text-gray-400 mb-4">
                                Lucro garantido aproveitando bônus e freebets das casas de apostas
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-xs text-yellow-400">
                                    Sem Risco
                                </span>
                                <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full text-xs text-orange-400">
                                    Lucro Garantido
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>Em breve</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="mt-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold mb-4 text-purple-400">
                            Por que usar métodos profissionais?
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6 text-gray-300">
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm">✓</div>
                                    Resultados Consistentes
                                </h4>
                                <p className="text-sm text-gray-400">
                                    Métodos testados e comprovados por centenas de apostadores profissionais
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm">✓</div>
                                    Redução de Risco
                                </h4>
                                <p className="text-sm text-gray-400">
                                    Estratégias matemáticas que minimizam perdas e maximizam ganhos
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm">✓</div>
                                    Suporte Completo
                                </h4>
                                <p className="text-sm text-gray-400">
                                    Comunidade ativa, aulas detalhadas e suporte para tirar todas as dúvidas
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm">✓</div>
                                    Atualização Constante
                                </h4>
                                <p className="text-sm text-gray-400">
                                    Métodos sempre atualizados conforme mudanças do mercado
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
