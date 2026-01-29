'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Trash2, Edit, Search, Calendar, Tag, Users, Upload, Download, TrendingUp, DollarSign, Target, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

type TipoOperacao = 'DG' | 'Delay' | 'TIP' | 'OUTRO';
type ResultadoOperacao = 'green' | 'red' | 'pending';

interface Operacao {
  id: string;
  data: string;
  hora: string;
  jogo: string;
  tipo: TipoOperacao;
  stake: number;
  odd: number;
  casa: string;
  resultado: ResultadoOperacao;
  lucroLiquido: number;
  lucroParceria: number;
  parceria?: string;
}

export default function EarningsPage() {
  const [operacoes, setOperacoes] = useState<Operacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [metaMensal, setMetaMensal] = useState(50000);
  const [showEditMeta, setShowEditMeta] = useState(false);

  // Carregar operações do banco de dados
  useEffect(() => {
    loadOperacoes();
  }, []);

  const loadOperacoes = async () => {
    try {
      const response = await fetch('/api/earnings');
      if (response.ok) {
        const data = await response.json();
        setOperacoes(data.operacoes || []);
      }
    } catch (error) {
      console.error('Erro ao carregar operações:', error);
      toast.error('Erro ao carregar operações');
    } finally {
      setLoading(false);
    }
  };

  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<TipoOperacao | ''>('');
  const [filtroParceria, setFiltroParceria] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // Calcular estatísticas
  const lucroTotal = operacoes
    .filter(op => op.resultado === 'green')
    .reduce((sum, op) => sum + op.lucroLiquido, 0);
  
  const totalInvestido = operacoes.reduce((sum, op) => sum + op.stake, 0);
  const roi = totalInvestido > 0 ? (lucroTotal / totalInvestido) * 100 : 0;
  
  const operacoesFinalizadas = operacoes.filter(op => op.resultado !== 'pending');
  const greens = operacoes.filter(op => op.resultado === 'green').length;
  const taxaAcerto = operacoesFinalizadas.length > 0 
    ? (greens / operacoesFinalizadas.length) * 100 
    : 0;

  const progressoMeta = (lucroTotal / metaMensal) * 100;
  const faltaMeta = metaMensal - lucroTotal;

  // Filtrar operações
  const operacoesFiltradas = operacoes.filter(op => {
    if (busca && !op.jogo.toLowerCase().includes(busca.toLowerCase())) return false;
    if (filtroTipo && op.tipo !== filtroTipo) return false;
    if (filtroParceria && op.parceria !== filtroParceria) return false;
    if (dataInicio && op.data < dataInicio) return false;
    if (dataFim && op.data > dataFim) return false;
    return true;
  });

  const adicionarOperacao = async (op: Omit<Operacao, 'id'>) => {
    try {
      if (editingId) {
        // Atualizar operação existente
        const response = await fetch('/api/earnings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...op, id: editingId })
        });

        if (response.ok) {
          const data = await response.json();
          setOperacoes(operacoes.map(o => o.id === editingId ? data.operacao : o));
          toast.success('Operação atualizada!');
          setEditingId(null);
        } else {
          toast.error('Erro ao atualizar operação');
        }
      } else {
        // Criar nova operação
        const response = await fetch('/api/earnings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(op)
        });

        if (response.ok) {
          const data = await response.json();
          setOperacoes([data.operacao, ...operacoes]);
          toast.success('Operação adicionada!');
        } else {
          toast.error('Erro ao adicionar operação');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar operação:', error);
      toast.error('Erro ao salvar operação');
    }
  };

  const removerOperacao = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta operação?')) {
      console.log('Deletando operação com ID:', id);
      try {
        const response = await fetch(`/api/earnings?id=${id}`, {
          method: 'DELETE'
        });

        console.log('Resposta da API:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Operação deletada com sucesso:', data);
          setOperacoes(operacoes.filter(op => op.id !== id));
          toast.success('Operação removida permanentemente!');
        } else {
          const errorData = await response.json();
          console.error('Erro ao deletar:', errorData);
          toast.error(`Erro: ${errorData.error || 'Erro ao remover operação'}`);
        }
      } catch (error) {
        console.error('Erro ao remover operação:', error);
        toast.error('Erro ao remover operação');
      }
    }
  };

  const editarOperacao = (id: string) => {
    setEditingId(id);
    setShowModal(true);
  };

  const parcerias = Array.from(new Set(operacoes.map(op => op.parceria).filter(Boolean)));

  return (
    <DashboardLayout
      title="Planilha de Ganhos"
      subtitle="Gerencie e analise suas operações"
    >
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
        <div className="bg-[#111] border border-gray-800 rounded-lg md:rounded-xl p-3 md:p-6 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
            </div>
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-white mb-0.5 md:mb-1">
            R$ {lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-gray-400 text-xs md:text-sm">Lucro Total</p>
          <p className="text-gray-500 text-[10px] md:text-xs mt-0.5 md:mt-1">Este mês</p>
        </div>

        <div className="bg-[#111] border border-gray-800 rounded-lg md:rounded-xl p-3 md:p-6 hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
            </div>
            <span className="text-xs md:text-sm font-semibold text-emerald-500">+{roi.toFixed(1)}%</span>
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-white mb-0.5 md:mb-1">{roi.toFixed(1)}%</h3>
          <p className="text-gray-400 text-xs md:text-sm">ROI</p>
          <p className="text-gray-500 text-[10px] md:text-xs mt-0.5 md:mt-1">Média mensal</p>
        </div>

        <div className="bg-[#111] border border-gray-800 rounded-lg md:rounded-xl p-3 md:p-6 hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
            </div>
            <span className="text-xs md:text-sm font-semibold text-emerald-500">
              <CheckCircle className="w-3 h-3 md:w-4 md:h-4 inline" />
            </span>
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-white mb-0.5 md:mb-1">{taxaAcerto.toFixed(1)}%</h3>
          <p className="text-gray-400 text-xs md:text-sm">Taxa de Acerto</p>
          <p className="text-gray-500 text-[10px] md:text-xs mt-0.5 md:mt-1">Últimos 30 dias</p>
        </div>

        <div className="bg-[#111] border border-gray-800 rounded-lg md:rounded-xl p-3 md:p-6 hover:border-yellow-500/30 transition-all">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Target className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
            </div>
            <span className="text-xs md:text-sm font-semibold text-emerald-500 flex items-center gap-0.5 md:gap-1">
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
              +{operacoes.filter(op => {
                const hoje = new Date();
                const opData = new Date(op.data);
                return opData.getMonth() === hoje.getMonth();
              }).length}
            </span>
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-white mb-0.5 md:mb-1">{operacoes.length}</h3>
          <p className="text-gray-400 text-xs md:text-sm">Total Operações</p>
          <p className="text-gray-500 text-[10px] md:text-xs mt-0.5 md:mt-1">Este mês</p>
        </div>
      </div>

      {/* Card de Meta */}
      <div className="bg-gradient-to-br from-purple-950/40 via-[#111] to-indigo-950/40 border-2 border-purple-500/30 rounded-2xl md:rounded-3xl p-4 md:p-8 mb-4 md:mb-6 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform duration-300">
              <Target className="w-5 h-5 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg md:text-2xl font-black text-white mb-0.5 md:mb-1">Meta a Buscar</h3>
              <p className="text-purple-400 text-xs md:text-sm font-medium">
                {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })} 🎯
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowEditMeta(true)}
            className="w-full md:w-auto px-3 md:px-4 py-2 md:py-2.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-white rounded-lg md:rounded-xl transition-all font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/30"
          >
            <Edit className="w-3 h-3 md:w-4 md:h-4" />
            Alterar Meta
          </button>
        </div>

        <div className="relative z-10">
          <div className="flex items-end justify-between mb-3 md:mb-4">
            <div>
              <p className="text-gray-400 text-xs md:text-sm mb-0.5 md:mb-1">Progresso Atual</p>
              <p className="text-2xl md:text-4xl font-black text-white">
                R$ {lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs md:text-sm mb-0.5 md:mb-1">Meta</p>
              <p className="text-lg md:text-2xl font-bold text-purple-400">
                R$ {metaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="relative h-5 md:h-6 bg-black/40 rounded-full overflow-hidden border border-purple-900/50 mb-3 md:mb-4">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3"
              style={{ width: `${Math.min(progressoMeta, 100)}%` }}
            >
              <span className="text-white font-bold text-xs drop-shadow-lg">
                {progressoMeta.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
              </div>
              <p className="text-purple-400 font-bold text-xs md:text-base">
                {progressoMeta >= 100 ? '🎉 Meta atingida!' : '🚀 Vamos começar!'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-[10px] md:text-xs">Faltam</p>
              <p className="text-sm md:text-lg font-bold text-purple-400">
                R$ {Math.max(faltaMeta, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e Ações */}
      <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="flex flex-col gap-2 md:gap-3 w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="bg-[#111] border border-gray-800 rounded-lg px-3 md:px-4 py-2 pl-9 md:pl-10 text-sm md:text-base text-white placeholder-gray-500 focus:border-emerald-500/50 focus:outline-none w-full"
            />
            <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-500 absolute left-2.5 md:left-3 top-2.5" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                placeholder="Início"
                className="bg-[#111] border border-gray-800 rounded-lg px-3 py-2 pl-9 text-xs md:text-sm text-white focus:border-emerald-500/50 focus:outline-none w-full"
                style={{ colorScheme: 'dark' }}
              />
              <Calendar className="w-4 h-4 text-gray-500 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
            <div className="relative">
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                placeholder="Fim"
                className="bg-[#111] border border-gray-800 rounded-lg px-3 py-2 pl-9 text-xs md:text-sm text-white focus:border-emerald-500/50 focus:outline-none w-full"
                style={{ colorScheme: 'dark' }}
              />
              <Calendar className="w-4 h-4 text-gray-500 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as TipoOperacao | '')}
                className="bg-[#111] border border-gray-800 rounded-lg px-3 py-2 pl-9 pr-8 text-xs md:text-sm text-white focus:border-emerald-500/50 focus:outline-none w-full appearance-none cursor-pointer"
              >
                <option value="">Todos os Tipos</option>
                <option value="DG">DG</option>
                <option value="Delay">Delay</option>
                <option value="TIP">TIP</option>
                <option value="OUTRO">OUTRO</option>
              </select>
              <Tag className="w-4 h-4 text-gray-500 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={filtroParceria}
                onChange={(e) => setFiltroParceria(e.target.value)}
                className="bg-[#111] border border-gray-800 rounded-lg px-3 py-2 pl-9 pr-8 text-xs md:text-sm text-white focus:border-emerald-500/50 focus:outline-none w-full appearance-none cursor-pointer"
              >
                <option value="">Todas Parcerias</option>
                {parcerias.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <Users className="w-4 h-4 text-gray-500 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full">
          <button className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm">
            <Upload className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Importar</span>
          </button>
          <button className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm">
            <Download className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          <button
            onClick={() => {
              setEditingId(null);
              setShowModal(true);
            }}
            className="flex-1 md:flex-none px-4 md:px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            Nova
          </button>
        </div>
      </div>

      {/* Tabela de Operações - Desktop */}
      <div className="hidden md:block bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/50 border-b border-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Jogo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Stake</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Odd</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Casa</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Resultado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Lucro Líq.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Lucro Parceria</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {operacoesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-gray-400">
                    Nenhuma operação encontrada
                  </td>
                </tr>
              ) : (
                operacoesFiltradas.map((op) => (
                  <tr key={op.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-white whitespace-nowrap">
                      <div>{new Date(op.data).toLocaleDateString('pt-BR')}</div>
                      <div className="text-xs text-gray-500">{op.hora}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      <div className="font-medium">{op.jogo}</div>
                      {op.parceria && <div className="text-xs text-gray-500">{op.parceria}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        op.tipo === 'DG' ? 'bg-emerald-500/10 text-emerald-500' :
                        op.tipo === 'Delay' ? 'bg-red-500/10 text-red-500' :
                        op.tipo === 'TIP' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-gray-500/10 text-gray-500'
                      }`}>
                        {op.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-medium">
                      R$ {op.stake.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-mono">{op.odd.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{op.casa}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {op.resultado === 'green' && (
                          <>
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            <span className="text-emerald-500">Green</span>
                          </>
                        )}
                        {op.resultado === 'red' && (
                          <>
                            <X className="w-5 h-5 text-red-500" />
                            <span className="text-red-500">Red</span>
                          </>
                        )}
                        {op.resultado === 'pending' && (
                          <>
                            <Clock className="w-5 h-5 text-yellow-500" />
                            <span className="text-yellow-500">Pendente</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm font-semibold ${
                      op.lucroLiquido >= 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {op.lucroLiquido >= 0 ? '+' : ''}R$ {op.lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-sm text-yellow-500 font-medium">
                      R$ {op.lucroParceria.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => editarOperacao(op.id)}
                          className="p-1.5 hover:bg-blue-500/10 text-blue-500 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removerOperacao(op.id)}
                          className="p-1.5 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards Mobile */}
      <div className="md:hidden space-y-2">
        {operacoesFiltradas.length === 0 ? (
          <div className="bg-[#111] border border-gray-800 rounded-lg p-8 text-center text-gray-400">
            Nenhuma operação encontrada
          </div>
        ) : (
          operacoesFiltradas.map((op) => (
            <div key={op.id} className="bg-[#111] border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      op.tipo === 'DG' ? 'bg-emerald-500/10 text-emerald-500' :
                      op.tipo === 'Delay' ? 'bg-red-500/10 text-red-500' :
                      op.tipo === 'TIP' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-gray-500/10 text-gray-500'
                    }`}>
                      {op.tipo}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {new Date(op.data).toLocaleDateString('pt-BR')} • {op.hora}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-0.5">{op.jogo}</h4>
                  {op.parceria && <p className="text-[10px] text-gray-500">{op.parceria}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => editarOperacao(op.id)}
                    className="p-1.5 hover:bg-blue-500/10 text-blue-500 rounded transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removerOperacao(op.id)}
                    className="p-1.5 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div className="bg-black/30 rounded p-2">
                  <div className="text-gray-500 text-[10px] mb-0.5">Stake</div>
                  <div className="text-white font-semibold">R$ {op.stake.toFixed(2)}</div>
                </div>
                <div className="bg-black/30 rounded p-2">
                  <div className="text-gray-500 text-[10px] mb-0.5">Odd</div>
                  <div className="text-white font-semibold font-mono">{op.odd.toFixed(2)}</div>
                </div>
                <div className="bg-black/30 rounded p-2">
                  <div className="text-gray-500 text-[10px] mb-0.5">Casa</div>
                  <div className="text-white font-semibold truncate">{op.casa}</div>
                </div>
                <div className="bg-black/30 rounded p-2">
                  <div className="text-gray-500 text-[10px] mb-0.5">Resultado</div>
                  <div className="flex items-center gap-1">
                    {op.resultado === 'green' && (
                      <>
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500 font-semibold text-[10px]">Green</span>
                      </>
                    )}
                    {op.resultado === 'red' && (
                      <>
                        <X className="w-3 h-3 text-red-500" />
                        <span className="text-red-500 font-semibold text-[10px]">Red</span>
                      </>
                    )}
                    {op.resultado === 'pending' && (
                      <>
                        <Clock className="w-3 h-3 text-yellow-500" />
                        <span className="text-yellow-500 font-semibold text-[10px]">Pendente</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                <div>
                  <div className="text-[10px] text-gray-500">Lucro Líquido</div>
                  <div className={`text-sm font-bold ${
                    op.lucroLiquido >= 0 ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {op.lucroLiquido >= 0 ? '+' : ''}R$ {op.lucroLiquido.toFixed(2)}
                  </div>
                </div>
                {op.lucroParceria > 0 && (
                  <div className="text-right">
                    <div className="text-[10px] text-gray-500">Parceria</div>
                    <div className="text-sm font-bold text-yellow-500">
                      R$ {op.lucroParceria.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Operação */}
      {showModal && (
        <ModalOperacao
          operacao={editingId ? operacoes.find(op => op.id === editingId) : undefined}
          onClose={() => {
            setShowModal(false);
            setEditingId(null);
          }}
          onSave={adicionarOperacao}
        />
      )}

      {/* Modal de Editar Meta */}
      {showEditMeta && (
        <ModalEditarMeta
          metaAtual={metaMensal}
          onClose={() => setShowEditMeta(false)}
          onSave={(novaMeta) => {
            setMetaMensal(novaMeta);
            setShowEditMeta(false);
            toast.success('Meta atualizada!');
          }}
        />
      )}
    </DashboardLayout>
  );
}

function ModalOperacao({ 
  operacao, 
  onClose, 
  onSave 
}: { 
  operacao?: Operacao;
  onClose: () => void; 
  onSave: (op: Omit<Operacao, 'id'>) => void;
}) {
  const [formData, setFormData] = useState({
    data: operacao?.data || new Date().toISOString().split('T')[0],
    hora: operacao?.hora || '12:00',
    jogo: operacao?.jogo || '',
    tipo: operacao?.tipo || 'DG' as TipoOperacao,
    stake: operacao?.stake || 0,
    odd: operacao?.odd || 0,
    casa: operacao?.casa || '',
    resultado: operacao?.resultado || 'pending' as ResultadoOperacao,
    lucroLiquido: operacao?.lucroLiquido || 0,
    lucroParceria: operacao?.lucroParceria || 0,
    parceria: operacao?.parceria || ''
  });

  const calcularLucro = () => {
    if (formData.resultado === 'green') {
      return formData.stake * (formData.odd - 1);
    } else if (formData.resultado === 'red') {
      return -formData.stake;
    }
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lucro = calcularLucro();
    onSave({ ...formData, lucroLiquido: lucro });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f1419] border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-6">
          {operacao ? 'Editar Operação' : 'Nova Operação'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Data</label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Hora</label>
              <input
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Jogo / Evento</label>
            <input
              type="text"
              value={formData.jogo}
              onChange={(e) => setFormData({ ...formData, jogo: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="Ex: Flamengo x Palmeiras"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoOperacao })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              >
                <option value="DG">DG</option>
                <option value="Delay">Delay</option>
                <option value="TIP">TIP</option>
                <option value="OUTRO">OUTRO</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Casa</label>
              <input
                type="text"
                value={formData.casa}
                onChange={(e) => setFormData({ ...formData, casa: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                placeholder="Ex: Bet365"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Stake (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.stake}
                onChange={(e) => setFormData({ ...formData, stake: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Odd</label>
              <input
                type="number"
                step="0.01"
                value={formData.odd}
                onChange={(e) => setFormData({ ...formData, odd: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Resultado</label>
            <select
              value={formData.resultado}
              onChange={(e) => setFormData({ ...formData, resultado: e.target.value as ResultadoOperacao })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            >
              <option value="pending">Pendente</option>
              <option value="green">Green</option>
              <option value="red">Red</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Parceria (opcional)</label>
              <input
                type="text"
                value={formData.parceria}
                onChange={(e) => setFormData({ ...formData, parceria: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                placeholder="Ex: João Primo"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Lucro Parceria (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.lucroParceria}
                onChange={(e) => setFormData({ ...formData, lucroParceria: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-medium transition-all"
            >
              {operacao ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalEditarMeta({ 
  metaAtual, 
  onClose, 
  onSave 
}: { 
  metaAtual: number;
  onClose: () => void; 
  onSave: (meta: number) => void;
}) {
  const [novaMeta, setNovaMeta] = useState(metaAtual);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f1419] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-white mb-6">Alterar Meta Mensal</h3>
        
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Nova Meta (R$)</label>
          <input
            type="number"
            step="0.01"
            value={novaMeta}
            onChange={(e) => setNovaMeta(Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-2xl font-bold text-center"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(novaMeta)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium transition-all"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
