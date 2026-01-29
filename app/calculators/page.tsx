import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { Calculator, TrendingUp, DollarSign, Target, Gift, Shield } from 'lucide-react';

export default function CalculatorsPage() {
    return (
        <DashboardLayout
            title="Calculadoras Profissionais"
            subtitle="Ferramentas gratuitas para otimizar suas apostas e maximizar lucros"
        >
            {/* Free Calculators */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="text-emerald-400">Calculadoras Gratuitas</span>
                    <span className="text-sm bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">100% Grátis</span>
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <CalculatorCard
                        icon={<TrendingUp className="w-8 h-8" />}
                        title="Surebet"
                        description="Detecte oportunidades de surebet e calcule stakes para lucro garantido"
                        href="/calculators/arbitrage"
                        gradient="from-emerald-500 to-cyan-500"
                        badge="Grátis"
                    />
                    <CalculatorCard
                        icon={<Gift className="w-8 h-8" />}
                        title="Freebet"
                        description="Maximize o valor das suas freebets com matched betting"
                        href="/calculators/freebet"
                        gradient="from-purple-500 to-pink-500"
                        badge="Grátis"
                    />
                    <CalculatorCard
                        icon={<DollarSign className="w-8 h-8" />}
                        title="Cashback"
                        description="Calcule o valor real do cashback considerando rollover"
                        href="/calculators/cashback"
                        gradient="from-green-500 to-emerald-500"
                        badge="Grátis"
                    />
                    <CalculatorCard
                        icon={<Target className="w-8 h-8" />}
                        title="Gols HA"
                        description="Encontre duplo green em mercados de Handicap Asiático de Gols"
                        href="/calculators/gols-ha"
                        gradient="from-yellow-500 to-orange-500"
                        badge="Grátis"
                    />
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Por que usar nossas calculadoras?</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <FeatureItem
                        icon={<Calculator className="w-6 h-6 text-emerald-400" />}
                        title="100% Gratuitas"
                        description="Todas as calculadoras básicas são completamente grátis, sem limites de uso"
                    />
                    <FeatureItem
                        icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
                        title="Precisão Profissional"
                        description="Fórmulas validadas e testadas por apostadores profissionais"
                    />
                    <FeatureItem
                        icon={<Shield className="w-6 h-6 text-emerald-400" />}
                        title="Privacidade Total"
                        description="Seus dados nunca são armazenados. Tudo é calculado localmente"
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}

function CalculatorCard({
    icon,
    title,
    description,
    href,
    gradient,
    badge
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
    gradient: string;
    badge: string;
}) {
    return (
        <Link
            href={href}
            className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all group relative hover:shadow-xl hover:shadow-emerald-500/10"
        >
            {badge && (
                <span className={`absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full ${badge === 'Premium'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                    {badge}
                </span>
            )}
            <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <div className="text-white">{icon}</div>
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-400 transition">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
        </Link>
    );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-lg mb-3">
                {icon}
            </div>
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    );
}
