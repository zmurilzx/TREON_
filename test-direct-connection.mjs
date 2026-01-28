// Script de teste usando DIRECT_URL
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
        db: {
            url: process.env.DIRECT_URL
        }
    }
})

async function testDirectConnection() {
    try {
        console.log('🔍 Testando conexão DIRETA (porta 5432)...\n')
        console.log('URL:', process.env.DIRECT_URL?.replace(/:[^:@]+@/, ':****@'))

        // Tentar conectar
        await prisma.$connect()
        console.log('✅ Conexão estabelecida com sucesso!\n')

        // Tentar fazer uma query simples
        console.log('🔍 Testando query...')
        const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`
        console.log('✅ Query executada com sucesso!')
        console.log('📊 Resultado:', result)

        // Verificar tabelas
        console.log('\n🔍 Verificando tabelas...')
        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `
        console.log('✅ Tabelas encontradas:', tables.length)
        tables.forEach((t, i) => console.log(`  ${i + 1}. ${t.table_name}`))

        console.log('\n🎉 Conexão funcionando perfeitamente!')

    } catch (error) {
        console.error('❌ Erro ao conectar:', error.message)
        console.error('\n📋 Código do erro:', error.code)

        if (error.message.includes('Tenant or user not found')) {
            console.log('\n💡 Este erro geralmente significa:')
            console.log('1. A senha está incorreta')
            console.log('2. O usuário não existe')
            console.log('3. O projeto Supabase está pausado ou inativo')
            console.log('\n🔍 Verifique:')
            console.log('- No Supabase Dashboard, o projeto está "Active"?')
            console.log('- A senha é exatamente a mesma do Supabase?')
            console.log('- Você executou o script SQL no Supabase?')
        }

    } finally {
        await prisma.$disconnect()
    }
}

testDirectConnection()
