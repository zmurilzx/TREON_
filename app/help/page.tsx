"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { MessageCircle, Clock, CheckCircle2 } from "lucide-react";

export default function HelpPage() {
    const whatsappNumber = "5543999888724"; // Formato internacional
    const whatsappMessage = encodeURIComponent("Olá! Preciso de suporte com a plataforma TREON.");
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <DashboardLayout
            title="Suporte"
            subtitle="Estamos aqui para ajudar você"
        >
            <div className="max-w-2xl mx-auto">
                {/* Main Card */}
                <div className="card-gamified text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-premium-glow">
                        <MessageCircle className="w-10 h-10 text-white" />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold mb-3">
                        Fale Conosco
                    </h1>
                    <p className="text-gray-400 mb-8 text-lg">
                        Entre em contato direto pelo WhatsApp
                    </p>

                    {/* WhatsApp Button */}
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl font-bold text-lg text-white transition-all transform hover:scale-105 shadow-lg hover:shadow-xl mb-8"
                    >
                        <MessageCircle className="w-6 h-6" />
                        Abrir WhatsApp
                    </a>

                    {/* Divider */}
                    <div className="my-8 border-t border-white/10"></div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-chrome-500/10 rounded-lg flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-chrome-400" />
                                </div>
                                <h3 className="font-semibold">Horário de Atendimento</h3>
                            </div>
                            <p className="text-sm text-gray-400">
                                Segunda a Sexta: 9h às 18h<br />
                                Sábado: 9h às 13h
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-chrome-500/10 rounded-lg flex items-center justify-center">
                                    <CheckCircle2 className="w-4 h-4 text-chrome-400" />
                                </div>
                                <h3 className="font-semibold">Resposta Rápida</h3>
                            </div>
                            <p className="text-sm text-gray-400">
                                Respondemos em até 2 horas<br />
                                durante o horário comercial
                            </p>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-8 p-4 rounded-lg bg-chrome-500/5 border border-chrome-500/20">
                        <p className="text-sm text-gray-400">
                            💡 <span className="text-chrome-400 font-semibold">Dica:</span> Tenha em mãos seu email cadastrado para agilizar o atendimento
                        </p>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="card-gamified mt-6">
                    <h2 className="text-xl font-bold mb-4">Perguntas Frequentes</h2>

                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <h3 className="font-semibold mb-2">Como renovar minha assinatura?</h3>
                            <p className="text-sm text-gray-400">
                                Acesse a página de Planos VIP e selecione o plano desejado para renovação automática.
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <h3 className="font-semibold mb-2">Como usar as calculadoras?</h3>
                            <p className="text-sm text-gray-400">
                                Cada calculadora possui instruções específicas. Acesse o menu lateral e escolha a ferramenta desejada.
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <h3 className="font-semibold mb-2">Esqueci minha senha</h3>
                            <p className="text-sm text-gray-400">
                                Na tela de login, clique em "Esqueci minha senha" e siga as instruções enviadas por email.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
