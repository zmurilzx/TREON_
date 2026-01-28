import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/storage'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Buscar foto atual
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { photoUrl: true }
    })

    if (!user?.photoUrl) {
      return NextResponse.json({ error: 'No photo to delete' }, { status: 400 })
    }

    // Extrair path da URL
    const path = user.photoUrl.split('/').slice(-2).join('/')

    // Deletar do storage
    const { error } = await supabase.storage
      .from('avatars')
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Atualizar banco de dados
    await prisma.user.update({
      where: { id: session.user.id },
      data: { photoUrl: null }
    })

    return NextResponse.json({
      success: true,
      message: 'Foto removida com sucesso!'
    })

  } catch (error: any) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
