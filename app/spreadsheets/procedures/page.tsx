'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type EntryType = 'TODOS' | 'AUMENTADA 25%' | 'DUPLO GREEN' | 'FREEBET' | 'CASHBACK' | 'SUPERODDS';
type PeriodoType = 'GERAL' | 'HOJE' | '7 DIAS' | 'MÊS' | 'ANO';
type DefesaTipo = 'cashout' | 'protection' | 'duplo_green_protection';
type ResultadoPartida = 'casa' | 'empate' | 'visitante';

interface Casa {
  id: string;
  nome: string;
  valor: number;
  oddOriginal: number;
  aumentoOdd: number;
  ganhou?: boolean;
}

interface Defesa {
  tipo: DefesaTipo;
  apostaDefesa?: ResultadoPartida;
  valorProtecao: number;
  oddProtecao?: number;
  resultadoPartida?: ResultadoPartida;
}

interface Entry {
  id: string;
  data: string;
  dataCompleta: string;
  tipo: EntryType;
  evento: string;
  casas: Casa[];
  totalInvestido: number;
  retornoTotal: number;
  lucro: number;
  roi: number;
  defesa?: Defesa;
}

export default function ProceduresPage() {
  const [activeTab, setActiveTab] = useState<'entrada' | 'historico'>('historico');
  const [filtroTipo, setFiltroTipo] = useState<EntryType>('TODOS');
  const [filtroPeriodo, setFiltroPeriodo] = useState<PeriodoType>('GERAL');
  const [showDefesa, setShowDefesa] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [entries, setEntries] = useState<Entry[]>([]);

  // Carregar entradas do banco de dados
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const response = await fetch('/api/procedures');
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
      }
    } catch (error) {
      console.error('Erro ao carregar entradas:', error);
      toast.error('Erro ao carregar entradas');
    } finally {
      setLoading(false);
    }
  };

  // Dados da entrada atual
  const [data, setData] = useState('');
  const [tipo, setTipo] = useState<EntryType>('AUMENTADA 25%');
  const [evento, setEvento] = useState('');
  const [casas, setCasas] = useState<Casa[]>([
    { id: '1', nome: 'Bet365 +25%', valor: 0, oddOriginal: 0, aumentoOdd: 25 },
    { id: '2', nome: 'Bet365 +25%', valor: 0, oddOriginal: 0, aumentoOdd: 25 },
    { id: '3', nome: 'SuperBet', valor: 0, oddOriginal: 0, aumentoOdd: 0 }
  ]);

  // Estado da defesa - inicializar vazio
  const [defesaData, setDefesaData] = useState<Partial<Defesa>>({});

  const total = casas.reduce((sum, casa) => sum + casa.valor, 0);

  const calcularRetorno = (casa: Casa) => {
    const oddFinal = casa.oddOriginal * (1 + casa.aumentoOdd / 100);
    return casa.valor * oddFinal;
  };

  const adicionarCasa = () => {
    const novaCasa: Casa = {
      id: Date.now().toString(),
      nome: 'Nova Casa',
      valor: 0,
      oddOriginal: 0,
      aumentoOdd: 0
    };
    setCasas([...casas, novaCasa]);
  };

  const removerCasa = (id: string) => {
    if (casas.length <= 1) {
      toast.error('Deve ter pelo menos uma casa!');
      return;
    }
    setCasas(casas.filter(c => c.id !== id));
  };

  const atualizarCasa = (id: string, campo: keyof Casa, valor: any) => {
    setCasas(casas.map(c => c.id === id ? { ...c, [campo]: valor } : c));
  };

  const marcarGanhadora = (id: string) => {
    setCasas(casas.map(c => c.id === id ? { ...c, ganhou: !c.ganhou } : c));
  };

  const jogarParaPlanilha = async () => {
    if (!data) {
      toast.error('Selecione uma data!');
      return;
    }
    if (!evento.trim()) {
      toast.error('Digite o nome do evento!');
      return;
    }
    if (total === 0) {
      toast.error('Adicione valores nas casas!');
      return;
    }

    const casasGanhadoras = casas.filter(c => c.ganhou);
    const retornoTotal = casasGanhadoras.reduce((sum, c) => sum + calcularRetorno(c), 0);
    const lucro = retornoTotal - total;
    const roi = (lucro / total) * 100;

    const novaEntry = {
      data,
      dataCompleta: new Date().toLocaleString('pt-BR'),
      tipo,
      evento,
      casas: [...casas],
      totalInvestido: total,
      retornoTotal,
      lucro,
      roi
    };

    try {
      const response = await fetch('/api/procedures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaEntry)
      });

      if (response.ok) {
        const data = await response.json();
        setEntries([data.entry, ...entries]);
        toast.success('Entrada registrada na planilha!');
        
        setEvento('');
        setCasas(casas.map(c => ({ ...c, valor: 0, oddOriginal: 0, ganhou: false })));
      } else {
        toast.error('Erro ao salvar entrada');
      }
    } catch (error) {
      console.error('Erro ao salvar entrada:', error);
      toast.error('Erro ao salvar entrada');
    }
  };

  const salvarDefesa = async (entryId: string) => {
    if (!defesaData.tipo) {
      toast.error('Selecione o tipo de defesa!');
      return;
    }
    if (!defesaData.valorProtecao || defesaData.valorProtecao <= 0) {
      toast.error('Informe o valor!');
      return;
    }
    // Validar campos específicos para proteção
    if (defesaData.tipo !== 'cashout') {
      if (!defesaData.apostaDefesa || !defesaData.resultadoPartida) {
        toast.error('Preencha todos os campos da defesa!');
        return;
      }
    }
    
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;

    let novoLucro = entry.lucro;
    let novoRetorno = entry.retornoTotal;
    
    // Para cashout, somar o valor ao lucro total
    if (defesaData.tipo === 'cashout' && defesaData.valorProtecao) {
      novoLucro = entry.lucro + defesaData.valorProtecao;
      novoRetorno = entry.retornoTotal + defesaData.valorProtecao;
    }
    // Para proteção, calcular retorno da proteção
    else if (defesaData.oddProtecao && defesaData.valorProtecao) {
      const retornoProtecao = defesaData.valorProtecao * defesaData.oddProtecao;
      novoRetorno = entry.retornoTotal + retornoProtecao - defesaData.valorProtecao;
      novoLucro = novoRetorno - entry.totalInvestido;
    }
    
    const novoROI = entry.totalInvestido > 0 ? (novoLucro / entry.totalInvestido) * 100 : 0;
    
    const updatedEntry = {
      ...entry,
      defesa: defesaData,
      lucro: novoLucro,
      retornoTotal: novoRetorno,
      roi: novoROI
    };

    try {
      const response = await fetch('/api/procedures', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEntry)
      });

      if (response.ok) {
        setEntries(entries.map(e => e.id === entryId ? updatedEntry : e));
        setShowDefesa(null);
        setDefesaData({});
        toast.success('Defesa registrada!');
      } else {
        toast.error('Erro ao salvar defesa');
      }
    } catch (error) {
      console.error('Erro ao salvar defesa:', error);
      toast.error('Erro ao salvar defesa');
    }
  };

  const toggleCasaGanhadora = async (entryId: string, casaId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;

    const casasAtualizadas = entry.casas.map(casa => 
      casa.id === casaId ? { ...casa, ganhou: !casa.ganhou } : casa
    );
    const casasGanhadoras = casasAtualizadas.filter(c => c.ganhou);
    const retornoTotal = casasGanhadoras.reduce((sum, c) => sum + calcularRetorno(c), 0);
    const lucro = retornoTotal - entry.totalInvestido;
    const roi = entry.totalInvestido > 0 ? (lucro / entry.totalInvestido) * 100 : 0;
    
    const updatedEntry = {
      ...entry,
      casas: casasAtualizadas,
      retornoTotal,
      lucro,
      roi
    };

    try {
      const response = await fetch('/api/procedures', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEntry)
      });

      if (response.ok) {
        setEntries(entries.map(e => e.id === entryId ? updatedEntry : e));
      }
    } catch (error) {
      console.error('Erro ao atualizar entrada:', error);
    }
  };

  const abrirModalEdicao = (entry: Entry) => {
    setEditingEntry(entry);
    setShowEditModal(true);
  };

  const salvarEdicao = async (entryEditada: Entry) => {
    const casasGanhadoras = entryEditada.casas.filter(c => c.ganhou);
    const retornoTotal = casasGanhadoras.reduce((sum, c) => sum + calcularRetorno(c), 0);
    const lucro = retornoTotal - entryEditada.totalInvestido;
    const roi = entryEditada.totalInvestido > 0 ? (lucro / entryEditada.totalInvestido) * 100 : 0;

    const updatedEntry = { ...entryEditada, retornoTotal, lucro, roi };

    try {
      const response = await fetch('/api/procedures', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEntry)
      });

      if (response.ok) {
        setEntries(entries.map(e => e.id === entryEditada.id ? updatedEntry : e));
        setShowEditModal(false);
        setEditingEntry(null);
        toast.success('Entrada atualizada!');
      } else {
        toast.error('Erro ao atualizar entrada');
      }
    } catch (error) {
      console.error('Erro ao atualizar entrada:', error);
      toast.error('Erro ao atualizar entrada');
    }
  };

  const abrirDefesa = (entryId: string) => {
    setDefesaData({});
    setShowDefesa(entryId);
  };

  const removerEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/procedures?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setEntries(entries.filter(e => e.id !== id));
        toast.success('Entrada removida!');
      } else {
        toast.error('Erro ao remover entrada');
      }
    } catch (error) {
      console.error('Erro ao remover entrada:', error);
      toast.error('Erro ao remover entrada');
    }
  };

  // Filtrar entries
  const entriesFiltradas = entries.filter(entry => {
    if (filtroTipo !== 'TODOS' && entry.tipo !== filtroTipo) return false;
    
    const entryDate = new Date(entry.data);
    const hoje = new Date();
    
    switch (filtroPeriodo) {
      case 'HOJE':
        return entryDate.toDateString() === hoje.toDateString();
      case '7 DIAS':
        const seteDiasAtras = new Date(hoje);
        seteDiasAtras.setDate(hoje.getDate() - 7);
        return entryDate >= seteDiasAtras;
      case 'MÊS':
        return entryDate.getMonth() === hoje.getMonth() && entryDate.getFullYear() === hoje.getFullYear();
      case 'ANO':
        return entryDate.getFullYear() === hoje.getFullYear();
      default:
        return true;
    }
  });

  // Calcular estatísticas
  const totalInvestidoGeral = entriesFiltradas.reduce((sum, e) => sum + e.totalInvestido, 0);
  const totalRetornoGeral = entriesFiltradas.reduce((sum, e) => sum + e.retornoTotal, 0);
  const lucroTotalGeral = entriesFiltradas.reduce((sum, e) => sum + e.lucro, 0);
  const roiGeral = totalInvestidoGeral > 0 ? (lucroTotalGeral / totalInvestidoGeral) * 100 : 0;

  // Agrupar por data
  const entriesPorData = entriesFiltradas.reduce((acc, entry) => {
    if (!acc[entry.data]) {
      acc[entry.data] = [];
    }
    acc[entry.data].push(entry);
    return acc;
  }, {} as Record<string, Entry[]>);

  return (
    <DashboardLayout
      title="Planilha Aumentada 25%"
      subtitle="Gestão profissional de operações com controle financeiro"
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('entrada')}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === 'entrada' ? 'text-[#00FF88]' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          📝 Entrada
          {activeTab === 'entrada' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00FF88]"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('historico')}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === 'historico' ? 'text-[#00FF88]' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          📊 Histórico
          {entries.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-[#00FF88] text-black text-xs rounded-full font-bold">
              {entries.length}
            </span>
          )}
          {activeTab === 'historico' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00FF88]"></div>
          )}
        </button>
      </div>

      {/* Modal de Edição */}
      {showEditModal && editingEntry && (
        <ModalEdicao
          entry={editingEntry}
          onClose={() => {
            setShowEditModal(false);
            setEditingEntry(null);
          }}
          onSave={salvarEdicao}
          calcularRetorno={calcularRetorno}
        />
      )}

      {activeTab === 'entrada' ? (
        <EntradaTab
          data={data}
          setData={setData}
          tipo={tipo}
          setTipo={setTipo}
          evento={evento}
          setEvento={setEvento}
          casas={casas}
          total={total}
          adicionarCasa={adicionarCasa}
          removerCasa={removerCasa}
          atualizarCasa={atualizarCasa}
          marcarGanhadora={marcarGanhadora}
          calcularRetorno={calcularRetorno}
          jogarParaPlanilha={jogarParaPlanilha}
        />
      ) : (
        <HistoricoTab
          filtroTipo={filtroTipo}
          setFiltroTipo={setFiltroTipo}
          filtroPeriodo={filtroPeriodo}
          setFiltroPeriodo={setFiltroPeriodo}
          totalInvestidoGeral={totalInvestidoGeral}
          totalRetornoGeral={totalRetornoGeral}
          lucroTotalGeral={lucroTotalGeral}
          roiGeral={roiGeral}
          entriesPorData={entriesPorData}
          calcularRetorno={calcularRetorno}
          showDefesa={showDefesa}
          setShowDefesa={setShowDefesa}
          defesaData={defesaData}
          setDefesaData={setDefesaData}
          salvarDefesa={salvarDefesa}
          removerEntry={removerEntry}
          toggleCasaGanhadora={toggleCasaGanhadora}
          abrirDefesa={abrirDefesa}
          abrirModalEdicao={abrirModalEdicao}
          entries={entries}
          setEntries={setEntries}
        />
      )}
    </DashboardLayout>
  );
}

function EntradaTab({ data, setData, tipo, setTipo, evento, setEvento, casas, total, adicionarCasa, removerCasa, atualizarCasa, marcarGanhadora, calcularRetorno, jogarParaPlanilha }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-[#111] border border-gray-800 rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-4">
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="bg-[#1A1A1A] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00FF88]"
          />
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as EntryType)}
            className="bg-[#1A1A1A] border border-gray-800 rounded-lg px-3 py-2 text-sm text-[#00FF88] font-bold focus:outline-none"
          >
            <option value="AUMENTADA 25%">AUMENTADA 25%</option>
            <option value="DUPLO GREEN">DUPLO GREEN</option>
            <option value="FREEBET">FREEBET</option>
            <option value="CASHBACK">CASHBACK</option>
            <option value="SUPERODDS">SUPERODDS</option>
          </select>
          <input
            type="text"
            value={evento}
            onChange={(e) => setEvento(e.target.value)}
            placeholder="Nome do jogo ou evento"
            className="flex-1 bg-[#1A1A1A] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00FF88]"
          />
          <div className="bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-lg px-4 py-2">
            <span className="text-xs text-[#00FF88]">Total: </span>
            <span className="text-sm font-bold text-[#00FF88]">R$ {total.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {casas.map((casa: Casa) => (
            <div key={casa.id} className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-4 relative">
              {casas.length > 1 && (
                <button
                  onClick={() => removerCasa(casa.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center text-xs font-bold"
                >
                  ×
                </button>
              )}
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{casa.aumentoOdd > 0 ? '🎯' : '⚡'}</span>
                <input
                  type="text"
                  value={casa.nome}
                  onChange={(e) => atualizarCasa(casa.id, 'nome', e.target.value)}
                  className="flex-1 bg-transparent text-sm font-semibold text-white border-none outline-none"
                />
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Valor Apostado</label>
                  <input
                    type="number"
                    value={casa.valor || ''}
                    onChange={(e) => atualizarCasa(casa.id, 'valor', Number(e.target.value) || 0)}
                    className="w-full bg-[#0D0D0D] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Odd Original</label>
                  <input
                    type="number"
                    step="0.01"
                    value={casa.oddOriginal || ''}
                    onChange={(e) => atualizarCasa(casa.id, 'oddOriginal', Number(e.target.value) || 0)}
                    className="w-full bg-[#0D0D0D] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Aumento (%)</label>
                  <input
                    type="number"
                    value={casa.aumentoOdd || ''}
                    onChange={(e) => atualizarCasa(casa.id, 'aumentoOdd', Number(e.target.value) || 0)}
                    className="w-full bg-[#0D0D0D] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={casa.ganhou || false}
                    onChange={() => marcarGanhadora(casa.id)}
                    className="w-4 h-4 rounded border-gray-700 bg-[#0D0D0D] text-[#00FF88]"
                  />
                  <span className="text-xs text-[#00FF88] font-semibold">Ganhou</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={adicionarCasa}
          className="w-full border border-dashed border-gray-700 rounded-lg py-2 text-gray-500 hover:border-[#00FF88] hover:text-[#00FF88] transition-all flex items-center justify-center gap-2 text-sm mb-4"
        >
          <Plus className="w-4 h-4" />
          Adicionar Casa
        </button>

        <button
          onClick={jogarParaPlanilha}
          className="w-full px-6 py-4 bg-[#00FF88] text-black font-bold text-lg rounded-xl hover:bg-[#00CC6E] transition-all"
        >
          JOGAR PARA PLANILHA
        </button>
      </div>
    </div>
  );
}

function HistoricoTab({ filtroTipo, setFiltroTipo, filtroPeriodo, setFiltroPeriodo, totalInvestidoGeral, totalRetornoGeral, lucroTotalGeral, roiGeral, entriesPorData, calcularRetorno, showDefesa, setShowDefesa, defesaData, setDefesaData, salvarDefesa, removerEntry, toggleCasaGanhadora, abrirDefesa, abrirModalEdicao, entries, setEntries }: any) {
  const tiposFiltro: EntryType[] = ['TODOS', 'AUMENTADA 25%', 'DUPLO GREEN', 'SUPERODDS', 'FREEBET', 'CASHBACK'];
  const periodosFiltro: PeriodoType[] = ['GERAL', 'HOJE', '7 DIAS', 'MÊS', 'ANO'];

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-[#111] border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {tiposFiltro.map(tipo => (
            <button
              key={tipo}
              onClick={() => setFiltroTipo(tipo)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filtroTipo === tipo
                  ? 'bg-[#00FF88] text-black'
                  : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
              }`}
            >
              {tipo}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 border-t md:border-t-0 border-gray-800 pt-2 md:pt-0">
          {periodosFiltro.map(periodo => (
            <button
              key={periodo}
              onClick={() => setFiltroPeriodo(periodo)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filtroPeriodo === periodo
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
              }`}
            >
              {periodo}
            </button>
          ))}
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111] border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">Total Investido</div>
          <div className="text-xl md:text-2xl font-bold text-white">
            R$ {totalInvestidoGeral.toFixed(2)}
          </div>
        </div>
        <div className="bg-[#111] border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">Total Retorno</div>
          <div className="text-xl md:text-2xl font-bold text-[#00FF88]">
            R$ {totalRetornoGeral.toFixed(2)}
          </div>
        </div>
        <div className="bg-[#111] border rounded-xl p-4 border-[#00FF88]/30">
          <div className="text-xs text-gray-500 mb-1">Lucro Total</div>
          <div className="text-xl md:text-2xl font-bold text-[#00FF88]">
            +R$ {lucroTotalGeral.toFixed(2)}
          </div>
        </div>
        <div className="bg-[#111] border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">ROI Geral</div>
          <div className="text-xl md:text-2xl font-bold text-[#00FF88]">
            +{roiGeral.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Entries por Data */}
      <div className="space-y-4">
        {Object.entries(entriesPorData).map(([data, entries]) => {
          const typedEntries = entries as Entry[];
          const investidoDia = typedEntries.reduce((sum, e) => sum + e.totalInvestido, 0);
          const lucroDia = typedEntries.reduce((sum, e) => sum + e.lucro, 0);
          const roiDia = investidoDia > 0 ? (lucroDia / investidoDia) * 100 : 0;

          return (
            <div key={data}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  📅 {new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-4 text-sm overflow-x-auto pb-1">
                  <span className="text-gray-400 whitespace-nowrap">
                    Investido: <span className="text-white font-semibold">R$ {investidoDia.toFixed(2)}</span>
                  </span>
                  <span className="whitespace-nowrap text-[#00FF88]">
                    Lucro: <span className="font-semibold">+R$ {lucroDia.toFixed(2)}</span>
                  </span>
                  <span className="whitespace-nowrap text-[#00FF88]">
                    ROI: <span className="font-semibold">+{roiDia.toFixed(2)}%</span>
                  </span>
                </div>
              </div>

              {typedEntries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  calcularRetorno={calcularRetorno}
                  showDefesa={showDefesa}
                  setShowDefesa={setShowDefesa}
                  defesaData={defesaData}
                  setDefesaData={setDefesaData}
                  salvarDefesa={salvarDefesa}
                  removerEntry={removerEntry}
                  toggleCasaGanhadora={toggleCasaGanhadora}
                  abrirDefesa={abrirDefesa}
                  abrirModalEdicao={abrirModalEdicao}
                  entries={entries}
                  setEntries={setEntries}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EntryCard({ entry, calcularRetorno, showDefesa, setShowDefesa, defesaData, setDefesaData, salvarDefesa, removerEntry, toggleCasaGanhadora, abrirDefesa, abrirModalEdicao, entries, setEntries }: any) {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            <span className="text-[#00FF88]">{entry.tipo}</span> - {entry.evento}
          </h3>
          <p className="text-xs text-gray-500">Salvo em {entry.dataCompleta}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => abrirModalEdicao(entry)}
            className="p-2 text-gray-500 hover:text-[#00FF88] transition-colors"
            title="Editar"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => removerEntry(entry.id)}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {entry.casas.map((casa: Casa) => (
          <div
            key={casa.id}
            onClick={() => toggleCasaGanhadora(entry.id, casa.id)}
            className={`relative rounded-xl p-4 transition-all duration-300 cursor-pointer hover:scale-105 ${
              casa.ganhou
                ? 'bg-gradient-to-br from-[#00FF88] via-[#00CC88] to-[#00AAFF] shadow-2xl shadow-[#00FF88]/50 scale-105'
                : 'bg-[#1A1A1A] border border-gray-800 hover:border-gray-700'
            }`}
          >
            {casa.ganhou && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-black px-4 py-1.5 rounded-full shadow-lg animate-pulse whitespace-nowrap">
                🏆 GANHOU!
              </div>
            )}
            <div className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded bg-black/50 text-white">
              {casa.ganhou ? '✓' : 'Clique'}
            </div>
            <div className={`flex items-center gap-2 mb-3 ${casa.ganhou ? 'mt-2' : ''}`}>
              <span className="text-xl">{casa.aumentoOdd > 0 ? '🎯' : '⚡'}</span>
              <div className={`text-sm font-bold truncate ${casa.ganhou ? 'text-black' : 'text-white'}`}>
                {casa.nome}
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className={casa.ganhou ? 'text-black/70 font-semibold' : 'text-gray-500'}>Stake:</span>
                <span className={`font-bold ${casa.ganhou ? 'text-black' : 'text-white'}`}>
                  R$ {casa.valor.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={casa.ganhou ? 'text-black/70 font-semibold' : 'text-gray-500'}>Odd:</span>
                <span className={`font-bold ${casa.ganhou ? 'text-black' : 'text-white'}`}>
                  {casa.oddOriginal.toFixed(2)}
                </span>
              </div>
              <div className={`flex justify-between pt-2 ${casa.ganhou ? 'border-t border-black/20' : 'border-t border-gray-800'}`}>
                <span className={casa.ganhou ? 'text-black/70 font-semibold' : 'text-gray-500'}>Retorno:</span>
                <span className={`font-black text-base ${casa.ganhou ? 'text-black' : 'text-gray-400'}`}>
                  R$ {calcularRetorno(casa).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center flex-wrap gap-4">
        <div className="flex gap-4 md:gap-6 text-sm flex-wrap">
          <div>
            <span className="text-gray-500">Total Investido: </span>
            <span className="text-white font-semibold">R$ {entry.totalInvestido.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500">Retorno: </span>
            <span className="text-[#00FF88] font-semibold">R$ {entry.retornoTotal.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500">Lucro: </span>
            <span className={`font-semibold ${
              entry.lucro >= 0 ? 'text-[#00FF88]' : 'text-red-500'
            }`}>
              {entry.lucro >= 0 ? '+' : ''}R$ {entry.lucro.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">ROI: </span>
            <span className={`font-semibold ${
              entry.roi >= 0 ? 'text-[#00FF88]' : 'text-red-500'
            }`}>
              {entry.roi >= 0 ? '+' : ''}{entry.roi.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Exibir Defesa Registrada */}
      {entry.defesa && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                🛡️ Defesa Registrada
              </h4>
              <button
                onClick={() => {
                  setEntries(entries.map((e: Entry) => e.id === entry.id ? { ...e, defesa: undefined } : e));
                  toast.success('Defesa removida!');
                }}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remover
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 text-xs">Tipo:</span>
                  <div className="text-white font-semibold">
                    {entry.defesa.tipo === 'cashout' ? '💰 Cashout' : 
                     entry.defesa.tipo === 'protection' ? '🛡 Proteção' : 
                     '🛡 Proteção DG'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Valor {entry.defesa.tipo === 'cashout' ? 'Cashout' : 'Proteção'}:</span>
                  <div className="text-[#00FF88] font-semibold">
                    R$ {entry.defesa.valorProtecao.toFixed(2)}
                  </div>
                </div>
                {entry.defesa.tipo !== 'cashout' && (
                  <>
                    <div>
                      <span className="text-gray-500 text-xs">Aposta:</span>
                      <div className="text-white font-semibold capitalize">
                        {entry.defesa.apostaDefesa}
                      </div>
                    </div>
                    {entry.defesa.oddProtecao && (
                      <div>
                        <span className="text-gray-500 text-xs">Odd:</span>
                        <div className="text-white font-semibold">
                          {entry.defesa.oddProtecao.toFixed(2)}
                        </div>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500 text-xs">Resultado:</span>
                      <div className="text-white font-semibold capitalize">
                        {entry.defesa.resultadoPartida}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Cálculo do Lucro Protegido */}
              <div className="pt-3 border-t border-blue-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Lucro Protegido:</span>
                  <span className="text-[#00FF88] font-bold text-base">
                    {(() => {
                      // Calcular lucro das casas ganhadoras (pagamento antecipado)
                      const casasGanhadoras = entry.casas.filter((c: Casa) => c.ganhou);
                      const lucroGanhadoras = casasGanhadoras.reduce((sum: number, c: Casa) => {
                        const retorno = calcularRetorno(c);
                        return sum + (retorno - c.valor);
                      }, 0);
                      
                      // Para cashout: lucro das ganhadoras + valor do cashout
                      if (entry.defesa.tipo === 'cashout') {
                        const lucroTotal = lucroGanhadoras + entry.defesa.valorProtecao;
                        return `R$ ${lucroTotal.toFixed(2)}`;
                      }
                      
                      // Para proteção: lucro das ganhadoras + retorno da proteção
                      if (entry.defesa.oddProtecao) {
                        const retornoProtecao = (entry.defesa.valorProtecao * entry.defesa.oddProtecao) - entry.defesa.valorProtecao;
                        const lucroTotal = lucroGanhadoras + retornoProtecao;
                        return `R$ ${lucroTotal.toFixed(2)}`;
                      }
                      
                      return `R$ ${lucroGanhadoras.toFixed(2)}`;
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulário de Defesa */}
      {showDefesa === entry.id && (
        <DefesaForm
          defesaData={defesaData}
          setDefesaData={setDefesaData}
          onSave={() => salvarDefesa(entry.id)}
          onClose={() => setShowDefesa(null)}
        />
      )}

      {/* Botão Registrar Defesa */}
      {!entry.defesa && showDefesa !== entry.id && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <button
            onClick={() => abrirDefesa(entry.id)}
            className="text-sm text-[#00FF88] hover:text-[#00CC6E] font-semibold"
          >
            + Registrar Defesa
          </button>
        </div>
      )}
    </div>
  );
}

function ModalEdicao({ entry, onClose, onSave, calcularRetorno }: any) {
  const [entryEditada, setEntryEditada] = useState<Entry>(JSON.parse(JSON.stringify(entry)));

  const atualizarCasa = (casaId: string, campo: keyof Casa, valor: any) => {
    setEntryEditada({
      ...entryEditada,
      casas: entryEditada.casas.map(c => 
        c.id === casaId ? { ...c, [campo]: valor } : c
      ),
      totalInvestido: entryEditada.casas.reduce((sum, c) => sum + (c.id === casaId && campo === 'valor' ? Number(valor) : c.valor), 0)
    });
  };

  const adicionarCasa = () => {
    const novaCasa: Casa = {
      id: Date.now().toString(),
      nome: 'Nova Casa',
      valor: 0,
      oddOriginal: 0,
      aumentoOdd: 0,
      ganhou: false
    };
    setEntryEditada({
      ...entryEditada,
      casas: [...entryEditada.casas, novaCasa]
    });
  };

  const removerCasa = (casaId: string) => {
    if (entryEditada.casas.length <= 1) {
      toast.error('Deve ter pelo menos uma casa!');
      return;
    }
    setEntryEditada({
      ...entryEditada,
      casas: entryEditada.casas.filter(c => c.id !== casaId),
      totalInvestido: entryEditada.casas.filter(c => c.id !== casaId).reduce((sum, c) => sum + c.valor, 0)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f1419] border border-white/10 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#0f1419] border-b border-white/10 p-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Editar Entrada</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Data, Tipo e Evento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Data</label>
              <input
                type="date"
                value={entryEditada.data}
                onChange={(e) => setEntryEditada({ ...entryEditada, data: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Tipo</label>
              <select
                value={entryEditada.tipo}
                onChange={(e) => setEntryEditada({ ...entryEditada, tipo: e.target.value as EntryType })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              >
                <option value="AUMENTADA 25%">AUMENTADA 25%</option>
                <option value="DUPLO GREEN">DUPLO GREEN</option>
                <option value="FREEBET">FREEBET</option>
                <option value="CASHBACK">CASHBACK</option>
                <option value="SUPERODDS">SUPERODDS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Total Investido</label>
              <div className="w-full bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-lg px-4 py-2 text-[#00FF88] font-bold">
                R$ {entryEditada.totalInvestido.toFixed(2)}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Evento</label>
            <input
              type="text"
              value={entryEditada.evento}
              onChange={(e) => setEntryEditada({ ...entryEditada, evento: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="Nome do jogo ou evento"
            />
          </div>

          {/* Casas */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-white">Casas de Apostas</label>
              <button
                onClick={adicionarCasa}
                className="px-3 py-1.5 bg-[#00FF88] text-black text-sm font-semibold rounded-lg hover:bg-[#00CC6E] transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Adicionar Casa
              </button>
            </div>

            <div className="space-y-4">
              {entryEditada.casas.map((casa, index) => (
                <div key={casa.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">Casa {index + 1}</span>
                    {entryEditada.casas.length > 1 && (
                      <button
                        onClick={() => removerCasa(casa.id)}
                        className="p-1 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Nome</label>
                      <input
                        type="text"
                        value={casa.nome}
                        onChange={(e) => atualizarCasa(casa.id, 'nome', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Valor (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={casa.valor}
                        onChange={(e) => atualizarCasa(casa.id, 'valor', Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Odd</label>
                      <input
                        type="number"
                        step="0.01"
                        value={casa.oddOriginal}
                        onChange={(e) => atualizarCasa(casa.id, 'oddOriginal', Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Aumento (%)</label>
                      <input
                        type="number"
                        value={casa.aumentoOdd}
                        onChange={(e) => atualizarCasa(casa.id, 'aumentoOdd', Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={casa.ganhou || false}
                        onChange={(e) => atualizarCasa(casa.id, 'ganhou', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-700 bg-white/5 text-[#00FF88]"
                      />
                      <span className="text-sm text-[#00FF88] font-semibold">Ganhou</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={() => onSave(entryEditada)}
              className="flex-1 px-4 py-3 bg-[#00FF88] hover:bg-[#00CC6E] text-black rounded-lg font-bold transition-all"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DefesaForm({ defesaData, setDefesaData, onSave, onClose }: any) {
  const isCashout = defesaData.tipo === 'cashout';

  return (
    <div className="mt-4 pt-4 border-t border-gray-800">
      <div className="bg-[#111] p-4 rounded-lg border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-white">Registrar Defesa</h4>
          <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">O que aconteceu?</label>
            <select
              value={defesaData.tipo || ''}
              onChange={(e) => setDefesaData({ ...defesaData, tipo: e.target.value as DefesaTipo })}
              className="w-full bg-[#1A1A1A] border border-gray-800 rounded px-2 py-1.5 text-sm text-white focus:border-[#00FF88] outline-none"
            >
              <option value="">Selecione...</option>
              <option value="cashout">💰 Dei Cashout (Encerrei tudo)</option>
              <option value="protection">🛡 Fiz Proteção (Time vencendo 2x0 ou 2x1)</option>
              <option value="duplo_green_protection">🛡 Proteção Duplo Green (2x2)</option>
            </select>
          </div>

          {isCashout ? (
            // Formulário simplificado para Cashout
            <div>
              <label className="block text-xs text-gray-500 mb-1">Valor Total do Cashout (R$)</label>
              <input
                type="number"
                step="0.01"
                value={defesaData.valorProtecao || ''}
                onChange={(e) => setDefesaData({ ...defesaData, valorProtecao: Number(e.target.value) })}
                placeholder="0.00"
                className="w-full bg-[#1A1A1A] border border-gray-800 rounded px-2 py-1.5 text-sm text-white focus:border-[#00FF88] outline-none"
              />
            </div>
          ) : (
            // Formulário completo para Proteção
            <>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Aposta na Defesa</label>
                <div className="flex gap-2">
                  {['casa', 'empate', 'visitante'].map((opcao) => (
                    <button
                      key={opcao}
                      type="button"
                      onClick={() => setDefesaData({ ...defesaData, apostaDefesa: opcao as ResultadoPartida })}
                      className={`flex-1 py-1.5 rounded text-xs font-bold border ${
                        defesaData.apostaDefesa === opcao
                          ? 'bg-[#00FF88] border-[#00FF88] text-black'
                          : 'bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {opcao === 'casa' ? 'Casa' : opcao === 'empate' ? 'Empate' : 'Visitante'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Valor Proteção (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={defesaData.valorProtecao || ''}
                    onChange={(e) => setDefesaData({ ...defesaData, valorProtecao: Number(e.target.value) })}
                    placeholder="0.00"
                    className="w-full bg-[#1A1A1A] border border-gray-800 rounded px-2 py-1.5 text-sm text-white focus:border-[#00FF88] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Odd Proteção</label>
                  <input
                    type="number"
                    step="0.01"
                    value={defesaData.oddProtecao || ''}
                    onChange={(e) => setDefesaData({ ...defesaData, oddProtecao: Number(e.target.value) })}
                    placeholder="0.00"
                    className="w-full bg-[#1A1A1A] border border-gray-800 rounded px-2 py-1.5 text-sm text-white focus:border-[#00FF88] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Resultado da Partida</label>
                <div className="flex gap-2">
                  {['casa', 'empate', 'visitante'].map((opcao) => (
                    <button
                      key={opcao}
                      type="button"
                      onClick={() => setDefesaData({ ...defesaData, resultadoPartida: opcao as ResultadoPartida })}
                      className={`flex-1 py-1.5 rounded text-xs font-bold border ${
                        defesaData.resultadoPartida === opcao
                          ? 'bg-[#00FF88] border-[#00FF88] text-black'
                          : 'bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {opcao === 'casa' ? 'Casa' : opcao === 'empate' ? 'Empate' : 'Visitante'}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={onSave}
            className="w-full bg-[#00FF88] text-black font-bold py-2 rounded text-sm hover:bg-[#00CC6E] transition-colors"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
