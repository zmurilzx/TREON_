import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Populando banco de dados com dados de exemplo...\n');

  // Buscar o usuário atual (primeiro usuário do banco)
  const user = await prisma.user.findFirst();
  
  if (!user) {
    console.error('❌ Nenhum usuário encontrado. Faça login primeiro!');
    return;
  }

  console.log(`✅ Usuário encontrado: ${user.email}\n`);

  // 1. CRIAR SUREBETS DE EXEMPLO
  console.log('📊 Criando surebets...');
  const surebets = [
    {
      userId: user.id,
      match: 'Flamengo vs Palmeiras',
      market: 'Resultado Final',
      betDate: new Date('2025-01-15'),
      totalStake: 1000,
      potentialProfit: 50,
      actualProfit: 45,
      status: 'SETTLED',
      resultDate: new Date('2025-01-15'),
      bets: JSON.stringify([
        { bookmaker: 'Bet365', selection: 'Flamengo', odd: 2.1, stake: 500 },
        { bookmaker: 'Betano', selection: 'Palmeiras', odd: 2.2, stake: 500 }
      ])
    },
    {
      userId: user.id,
      match: 'Real Madrid vs Barcelona',
      market: 'Ambas Marcam',
      betDate: new Date('2025-01-20'),
      totalStake: 800,
      potentialProfit: 40,
      actualProfit: 38,
      status: 'SETTLED',
      resultDate: new Date('2025-01-20'),
      bets: JSON.stringify([
        { bookmaker: 'Superbet', selection: 'Sim', odd: 1.9, stake: 400 },
        { bookmaker: 'Betfair', selection: 'Não', odd: 2.0, stake: 400 }
      ])
    },
    {
      userId: user.id,
      match: 'Liverpool vs Manchester City',
      market: 'Over 2.5',
      betDate: new Date('2025-01-25'),
      totalStake: 1200,
      potentialProfit: 60,
      actualProfit: 55,
      status: 'SETTLED',
      resultDate: new Date('2025-01-25'),
      bets: JSON.stringify([
        { bookmaker: 'Bet365', selection: 'Over', odd: 1.85, stake: 600 },
        { bookmaker: 'Betano', selection: 'Under', odd: 2.1, stake: 600 }
      ])
    }
  ];

  for (const bet of surebets) {
    await prisma.surebet.create({ data: bet });
  }
  console.log(`✅ ${surebets.length} surebets criadas\n`);

  // 2. POPULAR GESTÃO DE BANCA
  console.log('💰 Populando Gestão de Banca...');
  await prisma.bankroll.upsert({
    where: { userId: user.id },
    update: {
      bancaInicial: 2000,
      metaMensal: 10000,
      rows: JSON.stringify([
        { id: 1, banca: 2000, casa1: '100', casa2: '50', deposito: '0', saque: '0', total: 2150, depositoRetirado: 0, lucro: 150 },
        { id: 2, banca: 2150, casa1: '80', casa2: '70', deposito: '0', saque: '50', total: 2250, depositoRetirado: 50, lucro: 100 }
      ])
    },
    create: {
      userId: user.id,
      bancaInicial: 2000,
      metaMensal: 10000,
      rows: JSON.stringify([
        { id: 1, banca: 2000, casa1: '100', casa2: '50', deposito: '0', saque: '0', total: 2150, depositoRetirado: 0, lucro: 150 },
        { id: 2, banca: 2150, casa1: '80', casa2: '70', deposito: '0', saque: '50', total: 2250, depositoRetirado: 50, lucro: 100 }
      ])
    }
  });
  console.log('✅ Gestão de Banca populada\n');

  // 3. CRIAR PROCEDIMENTOS (AUMENTADA 25%)
  console.log('🎯 Criando procedimentos...');
  const procedures = [
    {
      userId: user.id,
      data: '2025-01-10',
      dataCompleta: '2025-01-10T14:30:00',
      tipo: 'AUMENTADA 25%',
      evento: 'PSG vs Lyon',
      casas: JSON.stringify([
        { nome: 'Bet365', valor: 500, odd: 2.5 }
      ]),
      totalInvestido: 500,
      retornoTotal: 1250,
      lucro: 750,
      roi: 150
    },
    {
      userId: user.id,
      data: '2025-01-18',
      dataCompleta: '2025-01-18T16:00:00',
      tipo: 'DUPLO GREEN',
      evento: 'Bayern vs Dortmund',
      casas: JSON.stringify([
        { nome: 'Betano', valor: 300, odd: 2.2 }
      ]),
      totalInvestido: 300,
      retornoTotal: 660,
      lucro: 360,
      roi: 120
    }
  ];

  for (const proc of procedures) {
    await prisma.procedureEntry.create({ data: proc });
  }
  console.log(`✅ ${procedures.length} procedimentos criados\n`);

  // 4. CRIAR EARNINGS (PLANILHA DE GANHOS)
  console.log('💵 Criando earnings...');
  const earnings = [
    {
      userId: user.id,
      data: '2025-01-12',
      hora: '15:30',
      jogo: 'Chelsea vs Arsenal',
      tipo: 'DG',
      stake: 400,
      odd: 2.8,
      casa: 'Superbet',
      resultado: 'green',
      lucroLiquido: 720,
      lucroParceria: 0,
      parceria: 'João Silva'
    },
    {
      userId: user.id,
      data: '2025-01-16',
      hora: '18:00',
      jogo: 'Juventus vs Milan',
      tipo: 'Delay',
      stake: 350,
      odd: 3.2,
      casa: 'Bet365',
      resultado: 'green',
      lucroLiquido: 770,
      lucroParceria: 0
    },
    {
      userId: user.id,
      data: '2025-01-22',
      hora: '20:00',
      jogo: 'Atlético vs Sevilla',
      tipo: 'TIP',
      stake: 500,
      odd: 2.5,
      casa: 'Betano',
      resultado: 'green',
      lucroLiquido: 750,
      lucroParceria: 0
    }
  ];

  for (const earning of earnings) {
    await prisma.earning.create({ data: earning });
  }
  console.log(`✅ ${earnings.length} earnings criados\n`);

  // 5. CRIAR CONTAS (GESTÃO DE CONTAS)
  console.log('👥 Criando contas...');
  const accounts = [
    {
      userId: user.id,
      parceiro: 'Carlos Mendes',
      telefone: '11999887766',
      casa: 'Bet365',
      metodo: 'Delay',
      status: 'Ativa',
      tipo: '% Lucro',
      percentual: 50,
      lucroLiquido: 2000,
      repasse: 1000,
      repassePago: true,
      roi: 1000
    },
    {
      userId: user.id,
      parceiro: 'Ana Paula',
      telefone: '21988776655',
      casa: 'Betano',
      metodo: 'DG',
      status: 'Boa',
      tipo: 'Compra',
      percentual: 0,
      lucroLiquido: 1500,
      repasse: 0,
      repassePago: false,
      roi: 1500
    }
  ];

  for (const account of accounts) {
    await prisma.account.create({ data: account });
  }
  console.log(`✅ ${accounts.length} contas criadas\n`);

  console.log('🎉 Banco de dados populado com sucesso!');
  console.log('🚀 Acesse http://localhost:3000/dashboard para ver os dados\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao popular banco:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
