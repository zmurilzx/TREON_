"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Settings, Bell, Lock, User, Palette, Globe, Shield } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [tipsNotifications, setTipsNotifications] = useState(true);

    return (
        <DashboardLayout
            title="Configurações"
            subtitle="Gerencie suas preferências e configurações da conta"
        >
            <div className="max-w-4xl">
                {/* Notificações */}
                <div className="card-gamified mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-chrome-500/10 rounded-lg flex items-center justify-center">
                            <Bell className="w-5 h-5 text-chrome-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Notificações</h2>
                            <p className="text-sm text-gray-400">Gerencie como você recebe notificações</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div>
                                <h3 className="font-semibold mb-1">Notificações por Email</h3>
                                <p className="text-sm text-gray-400">Receba atualizações importantes por email</p>
                            </div>
                            <button
                                onClick={() => setEmailNotifications(!emailNotifications)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${emailNotifications ? 'bg-chrome-500' : 'bg-gray-600'
                                    }`}
                            >
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${emailNotifications ? 'translate-x-6' : ''
                                    }`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div>
                                <h3 className="font-semibold mb-1">Notificações Push</h3>
                                <p className="text-sm text-gray-400">Receba notificações no navegador</p>
                            </div>
                            <button
                                onClick={() => setPushNotifications(!pushNotifications)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${pushNotifications ? 'bg-chrome-500' : 'bg-gray-600'
                                    }`}
                            >
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${pushNotifications ? 'translate-x-6' : ''
                                    }`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div>
                                <h3 className="font-semibold mb-1">Novas Tips</h3>
                                <p className="text-sm text-gray-400">Seja notificado quando novas tips forem publicadas</p>
                            </div>
                            <button
                                onClick={() => setTipsNotifications(!tipsNotifications)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${tipsNotifications ? 'bg-chrome-500' : 'bg-gray-600'
                                    }`}
                            >
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${tipsNotifications ? 'translate-x-6' : ''
                                    }`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Segurança */}
                <div className="card-gamified mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Segurança</h2>
                            <p className="text-sm text-gray-400">Mantenha sua conta segura</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                            <div className="flex items-center gap-3">
                                <Lock className="w-5 h-5 text-gray-400" />
                                <div>
                                    <h3 className="font-semibold">Alterar Senha</h3>
                                    <p className="text-sm text-gray-400">Última alteração há 30 dias</p>
                                </div>
                            </div>
                            <span className="text-chrome-400">→</span>
                        </button>

                        <button className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-gray-400" />
                                <div>
                                    <h3 className="font-semibold">Autenticação em Dois Fatores</h3>
                                    <p className="text-sm text-gray-400">Adicione uma camada extra de segurança</p>
                                </div>
                            </div>
                            <span className="text-chrome-400">→</span>
                        </button>
                    </div>
                </div>

                {/* Aparência */}
                <div className="card-gamified mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                            <Palette className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Aparência</h2>
                            <p className="text-sm text-gray-400">Personalize a interface</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="p-4 rounded-lg bg-[#0a0e1a] border-2 border-chrome-500 flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-[#0a0e1a] rounded-lg border border-white/20"></div>
                            <span className="text-sm font-semibold">Escuro</span>
                            <span className="text-xs text-chrome-400">Ativo</span>
                        </button>
                        <button className="p-4 rounded-lg bg-white/5 border-2 border-transparent hover:border-white/20 flex flex-col items-center gap-2 transition-colors">
                            <div className="w-12 h-12 bg-white rounded-lg"></div>
                            <span className="text-sm font-semibold">Claro</span>
                            <span className="text-xs text-gray-500">Em breve</span>
                        </button>
                    </div>
                </div>

                {/* Idioma */}
                <div className="card-gamified">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Idioma e Região</h2>
                            <p className="text-sm text-gray-400">Escolha seu idioma preferido</p>
                        </div>
                    </div>

                    <select className="w-full p-3 rounded-lg bg-white/5 border border-white/10 hover:border-chrome-500/50 transition-colors">
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                    </select>
                </div>
            </div>
        </DashboardLayout>
    );
}
