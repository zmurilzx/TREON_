"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    TrendingUp,
    Calculator,
    BarChart3,
    Target,
    Crown,
    Users,
    Download,
    HelpCircle,
    LogOut,
    Home,
    Percent,
    Sparkles,
    FileSpreadsheet,
    Menu,
    X,
    Gift,
    Crosshair,
    Shield,
    DollarSign,
    UserCircle,
    Building2,
    Calendar
} from "lucide-react";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

interface SidebarProps {
    className?: string;
}

export default function Sidebar({ className = "" }: SidebarProps) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    const menuSections = [
        {
            title: "PRINCIPAL",
            items: [
                { icon: Home, label: "Dashboard", href: "/dashboard", badge: null },
                { icon: Building2, label: "Casas de Apostas", href: "/casas", badge: null },
            ]
        },
        {
            title: "PLANILHAS",
            items: [
                { icon: Calculator, label: "Gestão de Banca", href: "/spreadsheets/bankroll", badge: null },
                { icon: Calendar, label: "Histórico de Meses", href: "/spreadsheets/bankroll/historico", badge: null },
                { icon: Shield, label: "Procedimentos", href: "/spreadsheets/procedures", badge: null },
                { icon: DollarSign, label: "Planilha de Ganhos", href: "/spreadsheets/earnings", badge: null },
                { icon: UserCircle, label: "Gestão de Contas", href: "/spreadsheets/accounts", badge: null },
            ]
        },
        {
            title: "FERRAMENTAS",
            items: [
                { icon: TrendingUp, label: "Surebet", href: "/calculators/arbitrage", badge: null },
                { icon: Percent, label: "Cashback", href: "/calculators/cashback", badge: null },
                { icon: Target, label: "Dutching", href: "/calculators/dutching", badge: null },
                { icon: Gift, label: "Freebet", href: "/calculators/freebet", badge: null },
                { icon: Crosshair, label: "Gols HA", href: "/calculators/gols-ha", badge: null },
                { icon: BarChart3, label: "ROI Estimator", href: "/calculators/roi-estimator", badge: null },
                { icon: FileSpreadsheet, label: "Gerenciamento", href: "/dashboard/transactions", badge: null },
                { icon: Sparkles, label: "Tips do Dia", href: "/tips", badge: "Novo" },
            ]
        },
        {
            title: "ÚTEIS",
            items: [
                { icon: Crown, label: "Planos VIP", href: "/checkout", badge: null },
                { icon: Users, label: "Indicações", href: "/referrals", badge: null },
                { icon: Download, label: "Extensão", href: "/extension", badge: null },
                { icon: HelpCircle, label: "Suporte", href: "/help", badge: null },
            ]
        }
    ];



    const SidebarContent = () => (
        <>
            {/* Header */}
            <div className="sidebar-header">
                <div className="w-10 h-10 bg-gradient-to-br from-chrome-400 to-chrome-600 rounded-lg flex items-center justify-center animate-pulse-slow">
                    <TrendingUp className="w-6 h-6 text-[#0a0e1a]" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-chrome-400 to-chrome-600">
                    TREON
                </span>
                <button
                    onClick={() => setIsOpen(false)}
                    className="md:hidden ml-auto p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation Sections */}
            <div className="flex-1 overflow-y-auto">
                {menuSections.map((section, idx) => (
                    <div key={idx} className="sidebar-section">
                        <div className="sidebar-section-title">{section.title}</div>
                        {section.items.map((item, itemIdx) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={itemIdx}
                                    href={item.href}
                                    className={active ? "sidebar-item-active" : "sidebar-item"}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <span className="flex-1 font-medium">{item.label}</span>
                                    {item.badge && (
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${item.badge === "Premium"
                                            ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                            : item.badge === "Novo"
                                                ? "bg-purple-500/10 text-purple-400 border border-purple-500/20 animate-pulse"
                                                : "bg-chrome-500/10 text-chrome-400 border border-chrome-500/20"
                                            }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Footer - User Info */}
            {session?.user && (
                <div className="border-t border-white/10 p-4">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-chrome-500 to-chrome-700 rounded-full flex items-center justify-center text-sm font-bold">
                            {session.user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-white truncate">
                                {session.user.name || "Usuário"}
                            </div>
                            <div className="text-xs text-gray-400 truncate">
                                {session.user.email}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="sidebar-item w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            )}
        </>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-3.5 left-6 z-[60] p-3 bg-[#0f1419] border border-white/10 rounded-xl hover:border-chrome-500/50 transition-all shadow-lg"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar flex flex-col ${isOpen ? 'sidebar-open' : ''} ${className}`}>
                <SidebarContent />
            </aside>
        </>
    );
}
