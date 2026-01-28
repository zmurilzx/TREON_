import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Criar usuário de teste
    const hashedPassword = await bcrypt.hash('Senha123', 12);

    const user = await prisma.user.upsert({
        where: { email: 'admin@treon.com' },
        update: {},
        create: {
            email: 'admin@treon.com',
            name: 'Admin TREON',
            password: hashedPassword,
            birthDate: new Date('1990-01-01'),
            emailVerified: new Date(), // Auto-verificado
            role: 'ADMIN',
        },
    });

    console.log('✅ Usuário criado:', {
        email: user.email,
        name: user.name,
        role: user.role,
    });

    console.log('\n📝 Credenciais de acesso:');
    console.log('Email: admin@treon.com');
    console.log('Senha: Senha123');
    console.log('\n✨ Seed concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
