"use client";

import { Bell, Moon, Sun, LogOut, User, Settings, ChevronDown, X, AlertCircle, Sparkles, CreditCard, TrendingUp, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
    title?: string;
    subtitle?: string;
}

interface Notification {
    id: string;
    type: 'subscription' | 'tip' | 'system' | 'achievement';
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: 'alert' | 'sparkles' | 'card' | 'trophy';
    priority: 'high' | 'medium' | 'low';
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
    const [darkMode, setDarkMode] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    // Mock notifications - substituir com dados reais da API
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'subscription',
            title: 'Mensalidade Expirando',
            message: 'Sua assinatura VIP Tier 2 expira em 3 dias. Renove agora para não perder acesso!',
            time: 'Há 2 horas',
            read: false,
            icon: 'alert',
            priority: 'high'
        },
        {
            id: '2',
            type: 'tip',
            title: 'Novas Tips Disponíveis',
            message: '3 novas dicas do dia foram adicionadas. Confira agora!',
            time: 'Há 5 horas',
            read: false,
            icon: 'sparkles',
            priority: 'medium'
        },
        {
            id: '3',
            type: 'achievement',
            title: 'Conquista Desbloqueada',
            message: 'Parabéns! Você alcançou 10 greens consecutivos.',
            time: 'Há 1 dia',
            read: true,
            icon: 'trophy',
            priority: 'low'
        },
        {
            id: '4',
            type: 'system',
            title: 'Atualização do Sistema',
            message: 'Nova calculadora de Gols HA disponível!',
            time: 'Há 2 dias',
            read: true,
            icon: 'sparkles',
            priority: 'low'
        }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getNotificationIcon = (icon: string) => {
        switch (icon) {
            case 'alert': return AlertCircle;
            case 'sparkles': return Sparkles;
            case 'card': return CreditCard;
            case 'trophy': return TrendingUp;
            default: return Bell;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <header className="fixed top-0 right-0 left-0 md:left-[240px] h-16 bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-white/10 z-20">
            <div className="h-full px-6 md:px-6 flex items-center justify-end md:justify-between">
                {/* Title Section - Hidden on mobile */}
                <div className="flex-1 hidden md:block">
                    {title && (
                        <div>
                            <h1 className="text-xl font-bold text-white">{title}</h1>
                            {subtitle && (
                                <p className="text-sm text-gray-400">{subtitle}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Notifications Dropdown */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative btn-icon"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-96 bg-[#0f1419] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[600px] flex flex-col">
                                {/* Header */}
                                <div className="p-4 border-b border-white/10 bg-gradient-to-br from-chrome-500/5 to-chrome-700/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-bold text-white">Notificações</h3>
                                        <button
                                            onClick={() => setShowNotifications(false)}
                                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <X className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-chrome-400 hover:text-chrome-300 transition-colors flex items-center gap-1"
                                        >
                                            <Check className="w-3 h-3" />
                                            Marcar todas como lidas
                                        </button>
                                    )}
                                </div>

                                {/* Notifications List */}
                                <div className="overflow-y-auto flex-1">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                            <p className="text-gray-400 text-sm">Nenhuma notificação</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-white/5">
                                            {notifications.map((notif) => {
                                                const Icon = getNotificationIcon(notif.icon);
                                                return (
                                                    <div
                                                        key={notif.id}
                                                        className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${!notif.read ? 'bg-chrome-500/5' : ''
                                                            }`}
                                                        onClick={() => markAsRead(notif.id)}
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${getPriorityColor(notif.priority)}`}>
                                                                <Icon className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                                    <h4 className="text-sm font-semibold text-white">
                                                                        {notif.title}
                                                                    </h4>
                                                                    {!notif.read && (
                                                                        <div className="w-2 h-2 bg-chrome-400 rounded-full flex-shrink-0 mt-1"></div>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                                                                    {notif.message}
                                                                </p>
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs text-gray-500">{notif.time}</span>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            deleteNotification(notif.id);
                                                                        }}
                                                                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                                                    >
                                                                        Remover
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                {notifications.length > 0 && (
                                    <div className="p-3 border-t border-white/10 bg-[#0a0e1a]">
                                        <button className="w-full text-sm text-chrome-400 hover:text-chrome-300 transition-colors font-medium">
                                            Ver todas as notificações
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="btn-icon"
                    >
                        {darkMode ? (
                            <Moon className="w-5 h-5" />
                        ) : (
                            <Sun className="w-5 h-5" />
                        )}
                    </button>

                    {/* User Menu */}
                    {session?.user && (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all border border-white/10 hover:border-chrome-500/50"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-chrome-500 to-chrome-700 rounded-full flex items-center justify-center text-sm font-bold">
                                    {session.user.name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <div className="hidden md:block text-left">
                                    <div className="text-sm font-semibold text-white">
                                        {session.user.name || "Usuário"}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {session.user.role === "ADMIN" ? "Admin" : "Usuário"}
                                    </div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-64 bg-[#0f1419] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* User Info */}
                                    <div className="p-4 border-b border-white/10 bg-gradient-to-br from-chrome-500/5 to-chrome-700/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-chrome-500 to-chrome-700 rounded-full flex items-center justify-center text-lg font-bold">
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
                                    </div>

                                    {/* Menu Items */}
                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                setShowUserMenu(false);
                                                router.push('/dashboard/profile');
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left group"
                                        >
                                            <User className="w-5 h-5 text-gray-400 group-hover:text-chrome-400 transition-colors" />
                                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                                                Meu Perfil
                                            </span>
                                        </button>

                                        <div className="my-2 border-t border-white/10"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-colors text-left group"
                                        >
                                            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
                                            <span className="text-sm font-medium text-red-400 group-hover:text-red-300 transition-colors">
                                                Sair
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
