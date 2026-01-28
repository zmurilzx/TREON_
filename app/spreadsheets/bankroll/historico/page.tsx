'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Calendar, TrendingUp, DollarSign, Trash2, Eye, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface ArchivedMonth {
  id: string;
  name: string;
  date: string;
  archivedAt: string;
  bancaInicial: number;
  metaMensal: number;
  lucroTotal: number;
  totalDias: number;
  rows: any[];
}

export default function HistoricoPage() {
  const [archives, setArchives] = useState<ArchivedMonth[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<ArchivedMonth | null>(null);

  useEffect(() => {
    loadArchives();
  }, []);

  const loadArchives = async () => {
    try {
      const response = await fetch('/api/spreadsheets/bankroll/archive');
      if (response.ok) {
        const data = await response.json();
        setArchives(data);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      toast.error('Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  };

  const deleteArchive = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja deletar o mês "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/spreadsheets/bankroll/archive?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Mês deletado com sucesso!');
        loadArchives();
      } else {
        toast.error('Erro ao deletar mês');
      }
    } catch (error) {
      console.error('Erro ao deletar mês:', error);
      toast.error('Erro ao deletar mês');
    }
  };

  if (selectedMonth) {
    return (
      <DashboardLayout
        title={`📅 ${selectedMonth.name}`}
        subtitle="Detalhes do mês arquivado"
      >
        <button
          onClick={() => setSelectedMonth(null)}
          className="flex items-center gap-2 mb-6 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao histórico
        </button>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium">LUCRO TOTAL</span>
            </div>
            <div className={`text-2xl font-bold ${selectedMonth.lucroTotal > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              R$ {selectedMonth.lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">TOTAL DE DIAS</span>
            </div>
            <div className="text-2xl font-bold text-white">{selectedMonth.totalDias}</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">MÉDIA DIÁRIA</span>
            </div>
            <div className="text-2xl font-bold text-white">
              R$ {(selectedMonth.lucroTotal / selectedMonth.totalDias).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-orange-400 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium">META MENSAL</span>
            </div>
            <div className="text-2xl font-bold text-white">
              R$ {selectedMonth.metaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Tabela de Dias */}
        <div className="bg-[#0f1419] border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">DIA</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-400 uppercase">🏦 BANCA</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-blue-400 uppercase">CASA 1</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-purple-400 uppercase">CASA 2</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-400 uppercase">💰 DEPÓSITO</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-red-400 uppercase">💸 SAQUE</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">📊 TOTAL</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-orange-400 uppercase">💵 DEP. RETIRADO</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-400 uppercase">💰 LUCRO</th>
                </tr>
              </thead>
              <tbody>
                {selectedMonth.rows.map((row: any) => (
                  <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-gray-400 font-medium">{row.id}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-emerald-400 font-bold">
                        R$ {row.banca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-blue-400">{row.casa1 || '-'}</td>
                    <td className="px-4 py-3 text-right text-purple-400">{row.casa2 || '-'}</td>
                    <td className="px-4 py-3 text-right text-emerald-400">{row.deposito || '-'}</td>
                    <td className="px-4 py-3 text-right text-red-400">{row.saque || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-white font-bold">
                        {row.total > 0 ? `R$ ${row.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-orange-400 font-bold">
                        {row.depositoRetirado ? `R$ ${row.depositoRetirado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold ${row.lucro > 0 ? 'text-emerald-400' : row.lucro < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                        {row.lucro !== 0 ? `R$ ${row.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="📚 Histórico de Meses"
      subtitle="Visualize e gerencie seus meses arquivados"
    >
      <div className="mb-6">
        <Link
          href="/spreadsheets/bankroll"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para planilha atual
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando histórico...</p>
          </div>
        </div>
      ) : archives.length === 0 ? (
        <div className="bg-[#0f1419] border border-white/10 rounded-xl p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Nenhum mês arquivado</h3>
          <p className="text-gray-400 mb-6">
            Quando você finalizar um mês na planilha, ele aparecerá aqui.
          </p>
          <Link
            href="/spreadsheets/bankroll"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-emerald-500/50 text-white rounded-lg font-medium transition-all"
          >
            Ir para planilha
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {archives.map((archive) => (
            <div
              key={archive.id}
              className="bg-[#0f1419] border border-white/10 rounded-xl p-6 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{archive.name}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(archive.archivedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Calendar className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Total de Dias:</span>
                  <span className="text-white font-bold">{archive.totalDias}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Lucro Total:</span>
                  <span className={`font-bold ${archive.lucroTotal > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    R$ {archive.lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Média Diária:</span>
                  <span className="text-white font-bold">
                    R$ {(archive.lucroTotal / archive.totalDias).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMonth(archive)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 rounded-lg transition-all"
                >
                  <Eye className="w-4 h-4" />
                  Ver Detalhes
                </button>
                <button
                  onClick={() => deleteArchive(archive.id, archive.name)}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-lg transition-all"
                  title="Deletar mês"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
