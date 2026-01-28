'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AvatarUpload from '@/components/AvatarUpload';
import {
    ArrowLeft,
    User,
    Mail,
    Calendar,
    Shield,
    Bell,
    CreditCard,
    Key,
    Save,
    CheckCircle,
} from 'lucide-react';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('personal');
    const [saved, setSaved] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }
    }, [status, router]);

    useEffect(() => {
        async function loadUserPhoto() {
            if (session?.user?.id) {
                try {
                    const response = await fetch('/api/profile/photo');
                    if (response.ok) {
                        const data = await response.json();
                        setPhotoUrl(data.photoUrl);
                    }
                } catch (error) {
                    console.error('Error loading photo:', error);
                } finally {
                    setLoading(false);
                }
            }
        }
        
        if (status === 'authenticated') {
            loadUserPhoto();
        }
    }, [session?.user?.id, status]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!session) return null;

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-white">
            <div className="container mx-auto px-4 py-8">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-8">
                    <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
                </Link>

                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Meu Perfil</h1>
                        <p className="text-gray-400">Gerencie suas informações e preferências</p>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-[#0f1419] border border-white/10 rounded-2xl p-8 mb-6">
                        <AvatarUpload
                            currentPhotoUrl={photoUrl}
                            userName={session.user.name || 'Usuário'}
                            onPhotoUpdate={setPhotoUrl}
                        />
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <h2 className="text-2xl font-bold mb-1">{session.user.name}</h2>
                            <p className="text-gray-400 mb-2">{session.user.email}</p>
                            <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Conta Verificada
                            </span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto">
                        <TabButton
                            active={activeTab === 'personal'}
                            onClick={() => setActiveTab('personal')}
                            icon={<User className="w-4 h-4" />}
                            label="Informações Pessoais"
                        />
                        <TabButton
                            active={activeTab === 'security'}
                            onClick={() => setActiveTab('security')}
                            icon={<Shield className="w-4 h-4" />}
                            label="Segurança"
                        />
                        <TabButton
                            active={activeTab === 'notifications'}
                            onClick={() => setActiveTab('notifications')}
                            icon={<Bell className="w-4 h-4" />}
                            label="Notificações"
                        />
                        <TabButton
                            active={activeTab === 'subscription'}
                            onClick={() => setActiveTab('subscription')}
                            icon={<CreditCard className="w-4 h-4" />}
                            label="Assinatura"
                        />
                    </div>

                    {/* Content */}
                    <div className="bg-[#0f1419] border border-white/10 rounded-2xl p-8">
                        {activeTab === 'personal' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold mb-6">Informações Pessoais</h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-300">
                                            Nome Completo
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            defaultValue={session.user.name || ''}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-300">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            defaultValue={session.user.email || ''}
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Data de Nascimento
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <button
                                    onClick={handleSave}
                                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all inline-flex items-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    Salvar Alterações
                                </button>

                                {saved && (
                                    <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4 flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                                        <span className="text-emerald-400">Alterações salvas com sucesso!</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold mb-6">Segurança da Conta</h3>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Senha Atual
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-300">
                                            Nova Senha
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-300">
                                            Confirmar Nova Senha
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 bg-[#0a0e1a] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                    <p className="text-sm text-gray-300">
                                        <strong>Requisitos de senha:</strong> Mínimo 8 caracteres, incluindo maiúsculas, minúsculas e números.
                                    </p>
                                </div>

                                <button
                                    onClick={handleSave}
                                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all inline-flex items-center gap-2"
                                >
                                    <Key className="w-5 h-5" />
                                    Atualizar Senha
                                </button>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold mb-6">Preferências de Notificação</h3>

                                <NotificationToggle
                                    label="Novos Métodos Mensais"
                                    description="Receba um email quando novos métodos forem publicados"
                                    defaultChecked
                                />
                                <NotificationToggle
                                    label="Atualizações de Planilhas"
                                    description="Notificações sobre novas planilhas e atualizações"
                                    defaultChecked
                                />
                                <NotificationToggle
                                    label="Dicas e Estratégias"
                                    description="Receba dicas semanais sobre apostas esportivas"
                                    defaultChecked={false}
                                />
                                <NotificationToggle
                                    label="Promoções e Ofertas"
                                    description="Fique por dentro de promoções especiais"
                                    defaultChecked={false}
                                />

                                <button
                                    onClick={handleSave}
                                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all inline-flex items-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    Salvar Preferências
                                </button>
                            </div>
                        )}

                        {activeTab === 'subscription' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold mb-6">Gerenciar Assinatura</h3>

                                <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="font-bold text-lg">Plano Gratuito</h4>
                                            <p className="text-gray-400 text-sm">Acesso às calculadoras básicas</p>
                                        </div>
                                        <span className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold">
                                            Ativo
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-300 mb-6">
                                        <p>✓ 8 Calculadoras gratuitas</p>
                                        <p>✓ Acesso ao dashboard</p>
                                        <p>✓ Suporte por email</p>
                                    </div>
                                    <Link
                                        href="/plans"
                                        className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-500/50 transition-all inline-flex items-center gap-2"
                                    >
                                        Fazer Upgrade para VIP
                                    </Link>
                                </div>

                                <div className="bg-[#0a0e1a] rounded-xl p-6">
                                    <h4 className="font-semibold mb-4">Histórico de Pagamentos</h4>
                                    <p className="text-gray-400 text-sm">Nenhum pagamento registrado ainda.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TabButton({
    active,
    onClick,
    icon,
    label
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition whitespace-nowrap ${active
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-[#0a0e1a] text-gray-400 hover:text-white border border-white/10'
                }`}
        >
            {icon}
            {label}
        </button>
    );
}

function NotificationToggle({
    label,
    description,
    defaultChecked
}: {
    label: string;
    description: string;
    defaultChecked: boolean;
}) {
    return (
        <div className="flex items-center justify-between p-4 bg-[#0a0e1a] rounded-lg">
            <div>
                <p className="font-medium mb-1">{label}</p>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
        </div>
    );
}
