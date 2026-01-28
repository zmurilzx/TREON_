import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    try {
        await prisma.$connect()
        
        const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`
        
        const tables = await prisma.$queryRaw`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `
        
        await prisma.$disconnect()
        
        return NextResponse.json({
            success: true,
            message: 'Conexão com banco de dados estabelecida com sucesso!',
            data: {
                connection: result,
                tables: tables
            }
        })
        
    } catch (error: any) {
        await prisma.$disconnect()
        
        return NextResponse.json({
            success: false,
            message: 'Erro ao conectar com o banco de dados',
            error: error.message,
            suggestions: [
                'Verifique se a senha no .env está correta',
                'Verifique se o script SQL foi executado no Supabase',
                'Verifique se o projeto Supabase está ativo'
            ]
        }, { status: 500 })
    }
}
