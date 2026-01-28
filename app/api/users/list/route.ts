import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    try {
        await prisma.$connect()
        
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                birthDate: true,
                isVerified: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        
        await prisma.$disconnect()
        
        return NextResponse.json({
            success: true,
            count: users.length,
            users: users
        })
        
    } catch (error: any) {
        await prisma.$disconnect()
        
        return NextResponse.json({
            success: false,
            message: 'Erro ao buscar usuários',
            error: error.message
        }, { status: 500 })
    }
}
