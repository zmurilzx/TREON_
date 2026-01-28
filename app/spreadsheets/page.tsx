'use client';

import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { Calculator, Shield, TrendingUp, Users } from 'lucide-react';

const spreadsheets = [
  {
    id: 'bankroll',
    title: 'Gestão de Banca',
    description: 'Controle diário de lucros, depósitos e saques. Acompanhe sua evolução com gráficos e metas personalizadas.',
    icon: Calculator,
    color: 'emerald',
    gradient: 'from-emerald-500 to-cyan-500',
    href: '/spreadsheets/bankroll'
  },
  {
    id: 'procedures',
    title: 'Procedimentos',
    description: 'Planilha para Hedging, Dutching e Arbitragem. Suporte para 5+ casas, Odds Boost e Exchange com cálculo automático.',
    icon: Shield,
    color: 'yellow',
    gradient: 'from-yellow-500 to-orange-500',
    href: '/spreadsheets/procedures'
  },
  {
    id: 'earnings',
    title: 'Planilha de Ganhos',
    description: 'Acompanhe suas operações por método (DG, Delay, Tip) e casa de apostas. Análise completa de ROI e taxa de acerto.',
    icon: TrendingUp,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    href: '/spreadsheets/earnings'
  },
  {
    id: 'accounts',
    title: 'Gestão de Contas',
    description: 'Gerencie contas de terceiros (compra, aluguel, % lucro). Controle total de parceiros, status, lucros e repasses.',
    icon: Users,
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',
    href: '/spreadsheets/accounts'
  }
];

export default function SpreadsheetsPage() {
  return (
    <DashboardLayout
      title="Planilhas Profissionais"
      subtitle="Gerencie sua banca e operações com planilhas completas e intuitivas"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {spreadsheets.map((sheet) => {
          const Icon = sheet.icon;
          return (
            <Link
              key={sheet.id}
              href={sheet.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f1419] p-6 transition-all hover:border-white/20 hover:shadow-2xl"
            >
              {/* Gradient Border Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${sheet.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              {/* Icon */}
              <div className={`relative mb-4 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${sheet.gradient} shadow-lg`}>
                <Icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all">
                  {sheet.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {sheet.description}
                </p>
              </div>

              {/* Arrow */}
              <div className="relative mt-6 flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-emerald-400 transition-colors">
                <span>Acessar Planilha</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Decorative Grid */}
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
            </Link>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
        <h3 className="text-lg font-bold mb-2 text-white">💡 Dica Profissional</h3>
        <p className="text-gray-300">
          Use as planilhas em conjunto para ter controle total da sua operação. 
          A Gestão de Banca mostra sua evolução geral, enquanto as outras planilhas 
          detalham cada aspecto específico do seu trabalho.
        </p>
      </div>
    </DashboardLayout>
  );
}
