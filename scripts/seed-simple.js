const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Populando banco de dados...\n');

  const user = await prisma.user.findFirst();
  
  if (!user) {
    console.error('❌ Nenhum usuário encontrado!');
    return;
  }

  console.log(`✅ Usuário: ${user.email}\n`);

  // Limpar dados antigos
  await prisma.earning.deleteMany({ where: { userId: user.id } });
  await prisma.account.deleteMany({ where: { userId: user.id } });
  await prisma.procedureEntry.deleteMany({ where: { userId: user.id } });

  // 1. EARNINGS
  console.log('💵 Criando earnings...');
  await prisma.earning.createMany({
    data: [
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
        lucroParceria: 0
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
    ]
  });
  console.log('✅ 3 earnings criados\n');

  // 2. ACCOUNTS
  console.log('👥 Criando contas...');
  await prisma.account.createMany({
    data: [
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
    ]
  });
  console.log('✅ 2 contas criadas\n');

  // 3. PROCEDURES
  console.log('🎯 Criando procedimentos...');
  await prisma.procedureEntry.createMany({
    data: [
      {
        userId: user.id,
        data: '2025-01-10',
        dataCompleta: '2025-01-10T14:30:00',
        tipo: 'AUMENTADA 25%',
        evento: 'PSG vs Lyon',
        casas: JSON.stringify([{ nome: 'Bet365', valor: 500, odd: 2.5 }]),
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
        casas: JSON.stringify([{ nome: 'Betano', valor: 300, odd: 2.2 }]),
        totalInvestido: 300,
        retornoTotal: 660,
        lucro: 360,
        roi: 120
      }
    ]
  });
  console.log('✅ 2 procedimentos criados\n');

  // 4. BANKROLL
  console.log('💰 Atualizando Gestão de Banca...');
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
  console.log('✅ Gestão de Banca atualizada\n');

  console.log('🎉 CONCLUÍDO! Dados populados com sucesso!');
  console.log('📊 Resumo:');
  console.log('   - Earnings: R$ 2.240,00');
  console.log('   - Accounts: R$ 2.500,00 (ROI)');
  console.log('   - Procedures: R$ 1.110,00');
  console.log('   - Bankroll: R$ 250,00');
  console.log('   💰 TOTAL: R$ 6.100,00\n');
  console.log('🚀 Acesse http://localhost:3000/dashboard\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
