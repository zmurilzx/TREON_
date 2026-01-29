'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Trash2, Edit, Search, Upload, Download, Users, DollarSign, TrendingUp, Clock, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import React from 'react';

type StatusConta = 'Ativa' | 'Boa' | 'Limitada' | 'Ruim' | 'Banida';
type TipoConta = 'Compra' | 'Aluguel' | '% Lucro';

interface Conta {
  id: string;
  parceiro: string;
  telefone: string;
  casa: string;
  metodo: string;
  status: StatusConta;
  tipo: TipoConta;
  percentual?: number;
  lucroLiquido: number;
  repasse: number;
  repassePago: boolean;
  roi: number;
}

export default function AccountsPage() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Carregar contas do banco de dados
  useEffect(() => {
    loadContas();
  }, []);

  const loadContas = async () => {
    try {
      const response = await fetch('/api/accounts');
      if (response.ok) {
        const data = await response.json();
        setContas(data.contas || []);
      }
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      toast.error('Erro ao carregar contas');
    } finally {
      setLoading(false);
    }
  };
  
  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<StatusConta | ''>('');
  const [filtroTipo, setFiltroTipo] = useState<TipoConta | ''>('');

  // Calcular estatísticas
  const contasAtivas = contas.filter(c => c.status === 'Ativa' || c.status === 'Boa').length;
  const lucroMensal = contas.reduce((sum, c) => sum + c.lucroLiquido, 0);
  const roiMedio = contas.length > 0 ? contas.reduce((sum, c) => sum + c.roi, 0) / contas.length : 0;
  const repassesPendentes = contas.filter(c => !c.repassePago).length;

  // Filtrar contas
  const contasFiltradas = contas.filter(conta => {
    if (busca && !conta.parceiro.toLowerCase().includes(busca.toLowerCase()) && 
        !conta.casa.toLowerCase().includes(busca.toLowerCase())) return false;
    if (filtroStatus && conta.status !== filtroStatus) return false;
    if (filtroTipo && conta.tipo !== filtroTipo) return false;
    return true;
  });

  const adicionarConta = async (conta: Omit<Conta, 'id'>) => {
    try {
      if (editingId) {
        // Atualizar conta existente
        const response = await fetch('/api/accounts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...conta, id: editingId })
        });

        if (response.ok) {
          const data = await response.json();
          setContas(contas.map(c => c.id === editingId ? data.conta : c));
          toast.success('Conta atualizada!');
          setEditingId(null);
        } else {
          toast.error('Erro ao atualizar conta');
        }
      } else {
        // Criar nova conta
        const response = await fetch('/api/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(conta)
        });

        if (response.ok) {
          const data = await response.json();
          setContas([data.conta, ...contas]);
          toast.success('Conta adicionada!');
        } else {
          toast.error('Erro ao adicionar conta');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
      toast.error('Erro ao salvar conta');
    }
  };

  const removerConta = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
      console.log('Deletando conta com ID:', id);
      try {
        const response = await fetch(`/api/accounts?id=${id}`, {
          method: 'DELETE'
        });

        console.log('Resposta da API:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Conta deletada com sucesso:', data);
          setContas(contas.filter(c => c.id !== id));
          toast.success('Conta removida permanentemente!');
        } else {
          const errorData = await response.json();
          console.error('Erro ao deletar:', errorData);
          toast.error(`Erro: ${errorData.error || 'Erro ao remover conta'}`);
        }
      } catch (error) {
        console.error('Erro ao remover conta:', error);
        toast.error('Erro ao remover conta');
      }
    }
  };

  const editarConta = (id: string) => {
    setEditingId(id);
    setShowModal(true);
  };

  const getStatusColor = (status: StatusConta) => {
    switch (status) {
      case 'Ativa': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
      case 'Boa': return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'Limitada': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'Ruim': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'Banida': return 'bg-red-500/10 text-red-500 border-red-500/30';
    }
  };

  return (
    <DashboardLayout
      title="Gestão de Contas de Terceiros"
      subtitle="Controle completo de contas compradas, alugadas ou por porcentagem de lucro"
    >
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
        <div className="bg-[#111] border border-gray-800 rounded-lg md:rounded-xl p-3 md:p-6 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
            </div>
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-white mb-0.5 md:mb-1">{contasAtivas}</h3>
          <p className="text-gray-400 text-xs md:text-sm">Contas Ativas</p>
        </div>

        <div className="bg-[#111] border border-gray-800 rounded-lg md:rounded-xl p-3 md:p-6 hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
            </div>
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-white mb-0.5 md:mb-1">
            R$ {lucroMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-gray-400 text-xs md:text-sm">Lucro Mensal</p>
        </div>

        <div className="bg-[#111] border border-gray-800 rounded-lg md:rounded-xl p-3 md:p-6 hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
            </div>
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-white mb-0.5 md:mb-1">{roiMedio.toFixed(1)}%</h3>
          <p className="text-gray-400 text-xs md:text-sm">ROI Médio</p>
        </div>

        <div className="bg-[#111] border border-gray-800 rounded-lg md:rounded-xl p-3 md:p-6 hover:border-yellow-500/30 transition-all">
          <div className="flex items-center justify-between mb-1 md:mb-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
            </div>
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-white mb-0.5 md:mb-1">{repassesPendentes}</h3>
          <p className="text-gray-400 text-xs md:text-sm">Repasses Pendentes</p>
        </div>
      </div>

      {/* Filtros e Ações */}
      <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="flex flex-col gap-2 md:gap-3 w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por parceiro ou casa..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="bg-[#111] border border-gray-800 rounded-lg px-3 md:px-4 py-2 pl-9 md:pl-10 text-sm md:text-base text-white placeholder-gray-500 focus:border-orange-500/50 focus:outline-none w-full"
            />
            <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-500 absolute left-2.5 md:left-3 top-2.5" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value as StatusConta | '')}
              className="bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-xs md:text-sm text-white focus:border-orange-500/50 focus:outline-none w-full appearance-none cursor-pointer"
            >
              <option value="">Todos os Status</option>
              <option value="Ativa">Ativa</option>
              <option value="Boa">Boa</option>
              <option value="Limitada">Limitada</option>
              <option value="Ruim">Ruim</option>
              <option value="Banida">Banida</option>
            </select>

            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as TipoConta | '')}
              className="bg-[#111] border border-gray-800 rounded-lg px-3 py-2 text-xs md:text-sm text-white focus:border-orange-500/50 focus:outline-none w-full appearance-none cursor-pointer"
            >
              <option value="">Todos os Tipos</option>
              <option value="Compra">Compra</option>
              <option value="Aluguel">Aluguel</option>
              <option value="% Lucro">% Lucro</option>
            </select>
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
            className="flex-1 md:flex-none px-4 md:px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm shadow-lg hover:shadow-orange-500/30"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            Nova Conta
          </button>
        </div>
      </div>

      {/* Tabela Desktop */}
      <div className="hidden md:block bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/50 border-b border-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Parceiro</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Casa</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Lucro Líq.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Repasse</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ROI</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {contasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    Nenhuma conta encontrada
                  </td>
                </tr>
              ) : (
                contasFiltradas.map((conta) => (
                  <tr key={conta.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-white">
                      <div className="font-medium">{conta.parceiro}</div>
                      <div className="text-xs text-gray-500">{conta.telefone}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      <div className="font-medium">{conta.casa}</div>
                      <div className="text-xs text-gray-500">{conta.metodo}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${getStatusColor(conta.status)}`}>
                        {conta.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {conta.tipo}
                      {conta.percentual && <div className="text-xs text-gray-500">{conta.percentual}%</div>}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      <span className="text-emerald-500">
                        R$ {conta.lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-white">
                        R$ {conta.repasse.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <div className={`text-xs ${conta.repassePago ? 'text-emerald-500' : 'text-yellow-500'}`}>
                        {conta.repassePago ? '✓ Pago' : '⏱ Pendente'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="font-mono font-semibold text-emerald-500">
                        +{conta.roi.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${conta.telefone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-green-500/10 text-green-500 rounded-lg transition-colors"
                          title="Enviar WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => editarConta(conta.id)}
                          className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removerConta(conta.id)}
                          className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
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
        {contasFiltradas.length === 0 ? (
          <div className="bg-[#111] border border-gray-800 rounded-lg p-8 text-center text-gray-400">
            Nenhuma conta encontrada
          </div>
        ) : (
          contasFiltradas.map((conta) => (
            <div key={conta.id} className="bg-[#111] border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(conta.status)}`}>
                      {conta.status}
                    </span>
                    <span className="text-[10px] text-gray-500">{conta.tipo}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-0.5">{conta.parceiro}</h4>
                  <p className="text-[10px] text-gray-500">{conta.telefone}</p>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={`https://wa.me/${conta.telefone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-green-500/10 text-green-500 rounded transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => editarConta(conta.id)}
                    className="p-1.5 hover:bg-blue-500/10 text-blue-500 rounded transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removerConta(conta.id)}
                    className="p-1.5 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div className="bg-black/30 rounded p-2">
                  <div className="text-gray-500 text-[10px] mb-0.5">Casa</div>
                  <div className="text-white font-semibold truncate">{conta.casa}</div>
                  <div className="text-gray-500 text-[10px]">{conta.metodo}</div>
                </div>
                <div className="bg-black/30 rounded p-2">
                  <div className="text-gray-500 text-[10px] mb-0.5">ROI</div>
                  <div className="text-emerald-500 font-semibold font-mono">+{conta.roi.toFixed(1)}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                <div>
                  <div className="text-[10px] text-gray-500">Lucro Líquido</div>
                  <div className="text-sm font-bold text-emerald-500">
                    R$ {conta.lucroLiquido.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-500">Repasse</div>
                  <div className="text-sm font-bold text-white">
                    R$ {conta.repasse.toFixed(2)}
                  </div>
                  <div className={`text-[10px] ${conta.repassePago ? 'text-emerald-500' : 'text-yellow-500'}`}>
                    {conta.repassePago ? '✓ Pago' : '⏱ Pendente'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ModalConta
          conta={editingId ? contas.find(c => c.id === editingId) : undefined}
          onClose={() => {
            setShowModal(false);
            setEditingId(null);
          }}
          onSave={adicionarConta}
        />
      )}
    </DashboardLayout>
  );
}

function ModalConta({
  conta,
  onClose,
  onSave
}: {
  conta?: Conta;
  onClose: () => void;
  onSave: (conta: Omit<Conta, 'id'>) => void;
}) {
  const [formData, setFormData] = useState({
    parceiro: conta?.parceiro || '',
    telefone: conta?.telefone || '',
    casa: conta?.casa || '',
    metodo: conta?.metodo || '',
    status: conta?.status || 'Ativa' as StatusConta,
    tipo: conta?.tipo || 'Compra' as TipoConta,
    percentual: conta?.percentual || 0,
    lucroLiquido: conta?.lucroLiquido || 0,
    repasse: conta?.repasse || 0,
    repassePago: conta?.repassePago || false,
    roi: conta?.roi || 0
  });

  // Cálculo automático baseado no tipo de parceria
  useEffect(() => {
    let novoRepasse = 0;
    let novoROI = 0;

    if (formData.tipo === 'Compra') {
      // Compra: sem repasse, todo lucro é seu
      novoRepasse = 0;
      novoROI = formData.lucroLiquido > 0 ? formData.lucroLiquido : 0;
    } else if (formData.tipo === 'Aluguel') {
      // Aluguel: repasse = lucro líquido (você paga tudo ao dono)
      novoRepasse = formData.lucroLiquido;
      novoROI = 0; // Sem ROI pois você não fica com nada
    } else if (formData.tipo === '% Lucro') {
      // % Lucro: repasse = percentual do lucro
      novoRepasse = (formData.lucroLiquido * formData.percentual) / 100;
      novoROI = formData.lucroLiquido - novoRepasse;
    }

    setFormData(prev => ({
      ...prev,
      repasse: Number(novoRepasse.toFixed(2)),
      roi: Number(novoROI.toFixed(2))
    }));
  }, [formData.tipo, formData.lucroLiquido, formData.percentual]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f1419] border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-6">
          {conta ? 'Editar Conta' : 'Nova Conta'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Parceiro</label>
              <input
                type="text"
                value={formData.parceiro}
                onChange={(e) => setFormData({ ...formData, parceiro: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Telefone</label>
              <input
                type="text"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                placeholder="43999211532"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Casa</label>
              <input
                type="text"
                value={formData.casa}
                onChange={(e) => setFormData({ ...formData, casa: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Método</label>
              <input
                type="text"
                value={formData.metodo}
                onChange={(e) => setFormData({ ...formData, metodo: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                placeholder="Delay, DG, etc"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusConta })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              >
                <option value="Ativa">Ativa</option>
                <option value="Boa">Boa</option>
                <option value="Limitada">Limitada</option>
                <option value="Ruim">Ruim</option>
                <option value="Banida">Banida</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoConta })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              >
                <option value="Compra">Compra</option>
                <option value="Aluguel">Aluguel</option>
                <option value="% Lucro">% Lucro</option>
              </select>
            </div>
          </div>

          {/* Explicação do tipo de parceria */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-200">
              {formData.tipo === 'Compra' && (
                <><strong>💰 Compra:</strong> Você comprou a conta. Todo o lucro é seu, sem repasse ao parceiro.</>
              )}
              {formData.tipo === 'Aluguel' && (
                <><strong>🏠 Aluguel:</strong> Você aluga a conta. Todo o lucro vai para o dono (repasse = lucro total).</>
              )}
              {formData.tipo === '% Lucro' && (
                <><strong>📊 % Lucro:</strong> Você divide o lucro com o parceiro. Defina o percentual que vai para ele.</>
              )}
            </p>
          </div>

          {formData.tipo === '% Lucro' && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">Percentual do Parceiro (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.percentual}
                onChange={(e) => setFormData({ ...formData, percentual: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                placeholder="Ex: 50 (para 50%)"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Lucro Líquido (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.lucroLiquido}
                onChange={(e) => setFormData({ ...formData, lucroLiquido: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Repasse (R$) <span className="text-[10px] text-emerald-400">• Automático</span></label>
              <input
                type="number"
                step="0.01"
                value={formData.repasse}
                readOnly
                className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2 text-emerald-400 font-bold cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">ROI (R$) <span className="text-[10px] text-purple-400">• Automático</span></label>
              <input
                type="number"
                step="0.01"
                value={formData.roi}
                readOnly
                className="w-full bg-purple-500/10 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-400 font-bold cursor-not-allowed"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.repassePago}
                  onChange={(e) => setFormData({ ...formData, repassePago: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-700 bg-white/5 text-emerald-500 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-400">Repasse Pago</span>
              </label>
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
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg font-medium transition-all"
            >
              {conta ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
