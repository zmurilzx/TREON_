// Script de teste de conexão com Supabase
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

async function testConnection() {
    try {
        console.log('🔍 Testando conexão com o banco de dados...\n')

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
        console.log('✅ Tabelas encontradas:')
        console.log(tables)

    } catch (error) {
        console.error('❌ Erro ao conectar:', error.message)
        console.error('\n📋 Detalhes do erro:', error)

        console.log('\n💡 Possíveis soluções:')
        console.log('1. Verifique se a senha no .env está correta')
        console.log('2. Verifique se o script SQL foi executado no Supabase')
        console.log('3. Tente usar a DIRECT_URL em vez da DATABASE_URL')
        console.log('4. Verifique se o projeto Supabase está ativo')

    } finally {
        await prisma.$disconnect()
    }
}

testConnection()
