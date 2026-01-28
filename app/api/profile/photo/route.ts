import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { photoUrl: true }
    })

    return NextResponse.json({
      photoUrl: user?.photoUrl || null
    })

  } catch (error: any) {
    console.error('Error fetching photo:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
