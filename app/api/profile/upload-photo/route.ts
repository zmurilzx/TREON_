import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'

// Criar cliente Supabase com autenticação do usuário
function createAuthenticatedClient(accessToken?: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  const client = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`
      } : {}
    }
  })
  
  return client
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.' }, { status: 400 })
    }

    // Validar tamanho (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 2MB.' }, { status: 400 })
    }

    // Criar cliente autenticado
    const supabase = createAuthenticatedClient()

    // Deletar foto antiga se existir
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { photoUrl: true }
    })

    if (user?.photoUrl) {
      try {
        const oldPath = user.photoUrl.split('/').slice(-2).join('/')
        await supabase.storage.from('avatars').remove([oldPath])
      } catch (e) {
        console.log('Could not delete old photo:', e)
      }
    }

    // Upload nova foto
    const fileExt = file.name.split('.').pop()
    const fileName = `${session.user.id}/avatar.${fileExt}`
    
    // Converter File para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true,
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path)

    // Atualizar banco de dados
    await prisma.user.update({
      where: { id: session.user.id },
      data: { photoUrl: urlData.publicUrl }
    })

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      message: 'Foto atualizada com sucesso!'
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
