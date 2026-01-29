'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { TrendingUp, DollarSign, Target, Trophy, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface BankrollRow {
  id: number;
  banca: number;
  casa1: string;
  casa2: string;
  deposito: string;
  saque: string;
  total: number;
  depositoRetirado: number;
  lucro: number;
}

export default function BankrollPage() {
  const [bancaInicial, setBancaInicial] = useState<number | ''>('');
  const [metaMensal, setMetaMensal] = useState<number | ''>('');
  const [rows, setRows] = useState<BankrollRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [monthName, setMonthName] = useState('');

  const parseValues = (valueString: string): number => {
    if (!valueString || valueString.trim() === '') return 0;
    const values = valueString.split('+').map(v => parseFloat(v.trim()) || 0);
    return values.reduce((sum, val) => sum + val, 0);
  };

  // Carregar dados do banco de dados
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/spreadsheets/bankroll');
        if (response.ok) {
          const data = await response.json();
          setBancaInicial(data.bancaInicial || '');
          setMetaMensal(data.metaMensal || '');
          
          if (data.rows && Array.isArray(data.rows) && data.rows.length > 0) {
            setRows(data.rows);
          } else {
            // Inicializar com 1 linha vazia
            const initialRows: BankrollRow[] = [{
              id: 1,
              banca: data.bancaInicial || 0,
              casa1: '',
              casa2: '',
              deposito: '',
              saque: '',
              total: 0,
              depositoRetirado: 0,
              lucro: 0
            }];
            setRows(initialRows);
          }
        } else {
          // Se houver erro na API, inicializar com valores padrão
          const initialRows: BankrollRow[] = [{
            id: 1,
            banca: bancaInicial === '' ? 0 : bancaInicial,
            casa1: '',
            casa2: '',
            deposito: '',
            saque: '',
            total: 0,
            depositoRetirado: 0,
            lucro: 0
          }];
          setRows(initialRows);
        }
      } catch (error) {
        console.error('Erro ao carregar planilha:', error);
        // Mesmo com erro, inicializar a planilha
        const initialRows: BankrollRow[] = [{
          id: 1,
          banca: bancaInicial === '' ? 0 : bancaInicial,
          casa1: '',
          casa2: '',
          deposito: '',
          saque: '',
          total: 0,
          depositoRetirado: 0,
          lucro: 0
        }];
        setRows(initialRows);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  // Recalcular quando bancaInicial mudar
  useEffect(() => {
    if (rows.length > 0 && isLoaded) {
      const newRows = [...rows];
      newRows[0].banca = bancaInicial === '' ? 0 : bancaInicial;
      recalculate(newRows);
      triggerAutoSave();
    }
  }, [bancaInicial]);

  // Auto-save quando metaMensal mudar
  useEffect(() => {
    if (isLoaded) {
      triggerAutoSave();
    }
  }, [metaMensal]);

  const recalculate = (updatedRows: BankrollRow[]) => {
    const newRows = [...updatedRows];
    
    for (let i = 0; i < newRows.length; i++) {
      const row = newRows[i];
      
      const casa1Total = parseValues(row.casa1);
      const casa2Total = parseValues(row.casa2);
      const depositoValue = parseValues(row.deposito);
      const saqueValue = parseValues(row.saque);
      
      // Calcular total (Casa 1 + Casa 2)
      row.total = casa1Total + casa2Total;
      
      // Calcular depositoRetirado (Total - (Depósito - Saque))
      const movimentacaoLiquida = depositoValue - saqueValue;
      row.depositoRetirado = row.total - movimentacaoLiquida;
      
      // Calcular lucro (DepositoRetirado - Banca)
      if (row.total > 0) {
        row.lucro = row.depositoRetirado - row.banca;
      } else {
        row.lucro = 0;
      }
      
      // Atualizar banca da próxima linha (usa Total do dia anterior)
      if (i < newRows.length - 1) {
        if (row.total > 0) {
          newRows[i + 1].banca = row.total;
        } else {
          newRows[i + 1].banca = row.banca;
        }
      }
    }
    
    setRows(newRows);
  };

  const autoSave = async (data: { bancaInicial: number | ''; metaMensal: number | ''; rows: BankrollRow[] }) => {
    setAutoSaving(true);
    try {
      await fetch('/api/spreadsheets/bankroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Erro ao salvar automaticamente:', error);
    } finally {
      setAutoSaving(false);
    }
  };

  const triggerAutoSave = () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    const timeout = setTimeout(() => {
      autoSave({ bancaInicial: bancaInicial === '' ? 0 : bancaInicial, metaMensal: metaMensal === '' ? 0 : metaMensal, rows });
    }, 1000);
    setSaveTimeout(timeout);
  };

  const updateCell = (rowId: number, field: keyof BankrollRow, value: string | number) => {
    const newRows = rows.map(row => {
      if (row.id === rowId) {
        return { ...row, [field]: value };
      }
      return row;
    });
    recalculate(newRows);
    triggerAutoSave();
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/spreadsheets/bankroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bancaInicial: bancaInicial === '' ? 0 : bancaInicial,
          metaMensal: metaMensal === '' ? 0 : metaMensal,
          rows
        })
      });

      if (response.ok) {
        toast.success('Planilha salva com sucesso!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao salvar planilha');
      }
    } catch (error) {
      console.error('Erro ao salvar planilha:', error);
      toast.error('Erro ao salvar planilha');
    } finally {
      setLoading(false);
    }
  };

  const addDay = () => {
    const lastRow = rows[rows.length - 1];
    const nextBanca = lastRow.total > 0 ? lastRow.total : lastRow.banca;
    
    const newRow: BankrollRow = {
      id: lastRow.id + 1,
      banca: nextBanca,
      casa1: '',
      casa2: '',
      deposito: '',
      saque: '',
      total: 0,
      depositoRetirado: 0,
      lucro: 0
    };
    
    const newRows = [...rows, newRow];
    setRows(newRows);
    toast.success('Novo dia adicionado!');
    triggerAutoSave();
  };

  const deleteDay = (rowId: number) => {
    if (rows.length === 1) {
      toast.error('Não é possível deletar o último dia!');
      return;
    }
    
    const newRows = rows.filter(row => row.id !== rowId);
    recalculate(newRows);
    toast.success('Dia removido!');
    triggerAutoSave();
  };

  const handleFinishMonth = () => {
    const now = new Date();
    const defaultName = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    setMonthName(defaultName.charAt(0).toUpperCase() + defaultName.slice(1));
    setShowFinishModal(true);
  };

  const confirmFinishMonth = async () => {
    try {
      const monthData = {
        name: monthName,
        date: new Date().toISOString(),
        bancaInicial: bancaInicial === '' ? 0 : bancaInicial,
        metaMensal: metaMensal === '' ? 0 : metaMensal,
        rows: rows,
        lucroTotal: rows.reduce((sum, row) => sum + row.lucro, 0),
        totalDias: rows.length
      };

      const response = await fetch('/api/spreadsheets/bankroll/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(monthData)
      });

      if (response.ok) {
        // Resetar planilha mantendo banca e meta
        const lastRow = rows[rows.length - 1];
        const newBanca = lastRow.total > 0 ? lastRow.total : (bancaInicial === '' ? 0 : bancaInicial);
        
        const initialRows: BankrollRow[] = [{
          id: 1,
          banca: newBanca,
          casa1: '',
          casa2: '',
          deposito: '',
          saque: '',
          total: 0,
          depositoRetirado: 0,
          lucro: 0
        }];
        
        setRows(initialRows);
        setShowFinishModal(false);
        toast.success(`Mês "${monthName}" arquivado com sucesso!`);
        triggerAutoSave();
      } else {
        toast.error('Erro ao arquivar mês');
      }
    } catch (error) {
      console.error('Erro ao arquivar mês:', error);
      toast.error('Erro ao arquivar mês');
    }
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados?')) {
      const initialRows: BankrollRow[] = [{
        id: 1,
        banca: bancaInicial === '' ? 0 : bancaInicial,
        casa1: '',
        casa2: '',
        deposito: '',
        saque: '',
        total: 0,
        depositoRetirado: 0,
        lucro: 0
      }];
      setRows(initialRows);
      toast.success('Planilha resetada!');
    }
  };

  // Calcular estatísticas
  const lucroTotal = rows.reduce((sum, row) => sum + row.lucro, 0);
  const mediaDiaria = rows.length > 0 ? lucroTotal / rows.filter(r => r.total > 0).length : 0;
  const metaMensalNumber = metaMensal === '' ? 0 : metaMensal;
  const restante = metaMensalNumber - lucroTotal;

  return (
    <DashboardLayout
      title="Planilha de Gestão de Banca"
      subtitle="Acompanhe seu desempenho diário, gerencie depósitos e saques, e visualize seu progresso em direção à meta mensal"
    >
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-lg sm:rounded-xl p-2.5 sm:p-4">
          <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-400 mb-1 sm:mb-2">
            <TrendingUp className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-sm font-medium">LUCRO TOTAL</span>
          </div>
          <div className="text-lg sm:text-3xl font-bold text-white">
            R$ {lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg sm:rounded-xl p-2.5 sm:p-4">
          <div className="flex items-center gap-1.5 sm:gap-2 text-blue-400 mb-1 sm:mb-2">
            <DollarSign className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-sm font-medium">MÉDIA DIÁRIA</span>
          </div>
          <div className="text-lg sm:text-3xl font-bold text-white">
            R$ {mediaDiaria.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg sm:rounded-xl p-2.5 sm:p-4">
          <div className="flex items-center gap-1.5 sm:gap-2 text-purple-400 mb-1 sm:mb-2">
            <Target className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-sm font-medium">META MENSAL</span>
          </div>
          <div className="text-lg sm:text-3xl font-bold text-white">
            R$ {metaMensal.toLocaleString('pt-BR')}
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg sm:rounded-xl p-2.5 sm:p-4">
          <div className="flex items-center gap-1.5 sm:gap-2 text-yellow-400 mb-1 sm:mb-2">
            <Trophy className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-sm font-medium">RESTANTE</span>
          </div>
          <div className={`text-lg sm:text-3xl font-bold ${restante > 0 ? 'text-yellow-400' : 'text-emerald-400'}`}>
            R$ {Math.abs(restante).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Configurações */}
      <div className="bg-[#0f1419] border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-6 mb-3 sm:mb-6">
        <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between mb-3 sm:mb-4">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-6">
            <div>
              <label className="block text-[10px] sm:text-sm text-gray-400 mb-1 sm:mb-2">💰 BANCA:</label>
              <input
                type="number"
                value={bancaInicial}
                onChange={(e) => setBancaInicial(e.target.value === '' ? '' : Number(e.target.value))}
                className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 text-white font-bold w-full sm:w-40 text-sm sm:text-base"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-[10px] sm:text-sm text-gray-400 mb-1 sm:mb-2">🎯 META:</label>
              <input
                type="number"
                value={metaMensal}
                onChange={(e) => setMetaMensal(e.target.value === '' ? '' : Number(e.target.value))}
                className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 text-white font-bold w-full sm:w-40 text-sm sm:text-base"
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3 items-center">
            {autoSaving && (
              <span className="text-[10px] sm:text-sm text-emerald-400 flex items-center gap-1 sm:gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="hidden sm:inline">Salvando...</span>
              </span>
            )}
            <button
              onClick={handleFinishMonth}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg hover:shadow-blue-500/50 text-white rounded-lg transition-all font-medium text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Finalizar Mês</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg transition-all text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Limpar</span>
            </button>
          </div>
        </div>
        
        {/* Dica de uso */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 sm:p-3">
          <p className="text-[10px] sm:text-sm text-blue-200">
            <strong>💡 Dica:</strong> Use <strong className="text-emerald-400">DEPÓSITO</strong> ao adicionar e <strong className="text-red-400">SAQUE</strong> ao retirar dinheiro.
          </p>
        </div>
      </div>

      {/* Botão Adicionar Dia */}
      <div className="mb-3 sm:mb-4">
        <button
          onClick={addDay}
          className="w-full py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-emerald-500/50 text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all"
        >
          + Adicionar Dia
        </button>
      </div>

      {/* Cards Mobile / Tabela Desktop */}
      <div className="bg-[#0f1419] border border-white/10 rounded-lg sm:rounded-xl overflow-hidden">
        {!isLoaded ? (
          <div className="flex items-center justify-center py-12 sm:py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-emerald-500 mx-auto mb-3 sm:mb-4"></div>
              <p className="text-gray-400 text-sm sm:text-base">Carregando...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Layout Mobile - Cards */}
            <div className="block lg:hidden space-y-3 p-3">
              {rows.map((row, index) => (
                <div key={row.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                  {/* Header do Card */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold text-lg">Dia {row.id}</span>
                      {row.banca > 0 && (
                        <span className="text-[10px] text-gray-400">Banca: R$ {row.banca.toFixed(2)}</span>
                      )}
                    </div>
                    <button
                      onClick={() => deleteDay(row.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded p-1.5 transition-all"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Inputs em Grid 2x2 */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <label className="block text-[9px] text-blue-400 mb-1 font-semibold">CASA 1</label>
                      <input
                        type="text"
                        value={row.casa1}
                        onChange={(e) => updateCell(row.id, 'casa1', e.target.value)}
                        className="w-full bg-blue-500/10 border border-blue-500/30 rounded px-2 py-1.5 text-right text-white text-sm focus:outline-none focus:border-blue-500/50 font-mono"
                        placeholder="0"
                      />
                      {parseValues(row.casa1) > 0 && (
                        <div className="text-[9px] text-blue-400 mt-0.5 font-bold text-right">
                          = R$ {parseValues(row.casa1).toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-[9px] text-purple-400 mb-1 font-semibold">CASA 2</label>
                      <input
                        type="text"
                        value={row.casa2}
                        onChange={(e) => updateCell(row.id, 'casa2', e.target.value)}
                        className="w-full bg-purple-500/10 border border-purple-500/30 rounded px-2 py-1.5 text-right text-white text-sm focus:outline-none focus:border-purple-500/50 font-mono"
                        placeholder="0"
                      />
                      {parseValues(row.casa2) > 0 && (
                        <div className="text-[9px] text-purple-400 mt-0.5 font-bold text-right">
                          = R$ {parseValues(row.casa2).toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-[9px] text-emerald-400 mb-1 font-semibold">💰 DEPÓSITO</label>
                      <input
                        type="text"
                        value={row.deposito}
                        onChange={(e) => updateCell(row.id, 'deposito', e.target.value)}
                        className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded px-2 py-1.5 text-right text-white text-sm focus:outline-none focus:border-emerald-500/50 font-mono"
                        placeholder="0"
                      />
                      {parseValues(row.deposito) > 0 && (
                        <div className="text-[9px] text-emerald-400 mt-0.5 font-bold text-right">
                          = R$ {parseValues(row.deposito).toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-[9px] text-red-400 mb-1 font-semibold">💸 SAQUE</label>
                      <input
                        type="text"
                        value={row.saque}
                        onChange={(e) => updateCell(row.id, 'saque', e.target.value)}
                        className="w-full bg-red-500/10 border border-red-500/30 rounded px-2 py-1.5 text-right text-white text-sm focus:outline-none focus:border-red-500/50 font-mono"
                        placeholder="0"
                      />
                      {parseValues(row.saque) > 0 && (
                        <div className="text-[9px] text-red-400 mt-0.5 font-bold text-right">
                          = R$ {parseValues(row.saque).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resultados */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-[9px] text-gray-400 mb-0.5">TOTAL</div>
                      <div className="text-sm font-bold text-white">
                        {row.total > 0 ? `R$ ${row.total.toFixed(2)}` : '-'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[9px] text-gray-400 mb-0.5">DEP. RET.</div>
                      <div className="text-sm font-bold text-orange-400">
                        {row.depositoRetirado && row.depositoRetirado !== 0 ? `R$ ${row.depositoRetirado.toFixed(2)}` : '-'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[9px] text-gray-400 mb-0.5">LUCRO</div>
                      <div className={`text-sm font-bold ${row.lucro > 0 ? 'text-emerald-400' : row.lucro < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                        {row.lucro !== 0 ? `R$ ${row.lucro.toFixed(2)}` : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Layout Desktop - Tabela */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-400 uppercase">DIA</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-emerald-400 uppercase">🏦 BANCA</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-blue-400 uppercase">CASA 1</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-purple-400 uppercase">CASA 2</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-emerald-400 uppercase">💰 DEP.</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-red-400 uppercase">💸 SAQ.</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-400 uppercase">📊 TOTAL</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-orange-400 uppercase">💵 D.RET.</th>
                    <th className="px-2 py-2 text-right text-[10px] font-semibold text-emerald-400 uppercase">💰 LUCRO</th>
                    <th className="px-2 py-2 text-center text-[10px] font-semibold text-gray-400 uppercase">AÇÕES</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                  <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-2 py-2 text-gray-400 font-medium text-sm">{row.id}</td>
                    <td className="px-2 py-2 text-right">
                      {row.banca > 0 ? (
                        <span className="text-emerald-400 font-bold text-xs">
                          R$ {row.banca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-gray-600 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={row.casa1}
                        onChange={(e) => updateCell(row.id, 'casa1', e.target.value)}
                        className="w-full bg-blue-500/10 border border-blue-500/30 rounded px-2 py-1 text-right text-white text-sm focus:outline-none focus:border-blue-500/50 font-mono"
                        placeholder=""
                      />
                      {parseValues(row.casa1) > 0 && (
                        <div className="text-[10px] text-blue-400 mt-0.5 font-bold text-right">
                          = R$ {parseValues(row.casa1).toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={row.casa2}
                        onChange={(e) => updateCell(row.id, 'casa2', e.target.value)}
                        className="w-full bg-purple-500/10 border border-purple-500/30 rounded px-2 py-1 text-right text-white text-sm focus:outline-none focus:border-purple-500/50 font-mono"
                        placeholder=""
                      />
                      {parseValues(row.casa2) > 0 && (
                        <div className="text-[10px] text-purple-400 mt-0.5 font-bold text-right">
                          = R$ {parseValues(row.casa2).toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={row.deposito}
                        onChange={(e) => updateCell(row.id, 'deposito', e.target.value)}
                        className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded px-2 py-1 text-right text-white text-sm focus:outline-none focus:border-emerald-500/50 font-mono"
                        placeholder=""
                        title="Valor depositado nas casas de apostas"
                      />
                      {parseValues(row.deposito) > 0 && (
                        <div className="text-[10px] text-emerald-400 mt-0.5 font-bold text-right">
                          = R$ {parseValues(row.deposito).toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={row.saque}
                        onChange={(e) => updateCell(row.id, 'saque', e.target.value)}
                        className="w-full bg-red-500/10 border border-red-500/30 rounded px-2 py-1 text-right text-white text-sm focus:outline-none focus:border-red-500/50 font-mono"
                        placeholder=""
                        title="Valor sacado das casas de apostas"
                      />
                      {parseValues(row.saque) > 0 && (
                        <div className="text-[10px] text-red-400 mt-0.5 font-bold text-right">
                          = R$ {parseValues(row.saque).toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-2 text-right">
                      <span className="text-white font-bold text-xs">
                        {row.total > 0 ? `R$ ${row.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-right">
                      <span className="text-orange-400 font-bold text-xs">
                        {row.depositoRetirado && row.depositoRetirado !== 0 ? `R$ ${row.depositoRetirado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-right">
                      <span className={`font-bold text-xs ${
                        row.lucro > 0 ? 'text-emerald-400' : 
                        row.lucro < 0 ? 'text-red-400' : 
                        'text-gray-500'
                      }`}>
                        {row.lucro !== 0 ? `R$ ${row.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => deleteDay(row.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded p-1 transition-all text-sm"
                        title="Deletar dia"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      {/* Modal de Finalizar Mês */}
      {showFinishModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-[#0f1419] border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">📅 Finalizar Mês</h3>
            
            <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
              <div className="text-xs sm:text-sm text-gray-400 mb-2">Resumo do Mês:</div>
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-300">Total de Dias:</span>
                  <span className="text-white font-bold">{rows.length}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-300">Lucro Total:</span>
                  <span className={`font-bold ${lucroTotal > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    R$ {lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-300">Banca Final:</span>
                  <span className="text-white font-bold">
                    R$ {(rows[rows.length - 1]?.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">Nome do Mês:</label>
              <input
                type="text"
                value={monthName}
                onChange={(e) => setMonthName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-white text-sm sm:text-base focus:outline-none focus:border-emerald-500/50"
                placeholder="Ex: Janeiro 2026"
              />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-blue-200">
                <strong>💡 Atenção:</strong> Ao finalizar, este mês será arquivado e uma nova planilha será iniciada.
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowFinishModal(false)}
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 text-gray-300 rounded-lg transition-all text-sm sm:text-base"
              >
                Cancelar
              </button>
              <button
                onClick={confirmFinishMonth}
                className="flex-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-emerald-500/50 text-white rounded-lg font-bold transition-all text-sm sm:text-base"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
