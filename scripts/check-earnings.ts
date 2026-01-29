import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Verificando dados de Earnings...\n');

  const earnings = await prisma.earning.findMany({
    include: {
      user: {
        select: {
          email: true,
          name: true
        }
      }
    }
  });

  console.log(`Total de operações encontradas: ${earnings.length}\n`);

  earnings.forEach((earning, index) => {
    console.log(`${index + 1}. ID: ${earning.id}`);
    console.log(`   Usuário: ${earning.user.email}`);
    console.log(`   Jogo: ${earning.jogo}`);
    console.log(`   Data: ${earning.data} ${earning.hora}`);
    console.log(`   Tipo: ${earning.tipo}`);
    console.log(`   Resultado: ${earning.resultado}`);
    console.log('---');
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
