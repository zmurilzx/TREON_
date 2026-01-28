# 📦 Configuração do Supabase Storage

## Passo 1: Executar Script SQL

1. Acesse o **SQL Editor** no Supabase Dashboard
2. Cole o conteúdo do arquivo `supabase_storage_setup.sql`
3. Execute o script

Isso vai criar 3 buckets:

### Buckets Criados

| Bucket | Tipo | Tamanho Máx | Arquivos Permitidos |
|--------|------|-------------|---------------------|
| **methods** | Privado | 50 MB | PDF, MP4, WebM, QuickTime |
| **spreadsheets** | Privado | 10 MB | Excel, CSV |
| **thumbnails** | Público | 5 MB | JPEG, PNG, WebP, GIF |

## Passo 2: Verificar Buckets

1. Vá em **Storage** no Supabase Dashboard
2. Você deve ver os 3 buckets criados
3. Clique em cada um para verificar as políticas de acesso

## Passo 3: Usar no Sistema

### Upload de Arquivo

```typescript
import { uploadFile } from '@/lib/storage'

// Upload de método (PDF ou vídeo)
const result = await uploadFile(file, 'methods', 'user-123')

if (result.success) {
  console.log('URL:', result.url)
  console.log('Path:', result.path)
  // Salvar result.url no banco de dados
}

// Upload de planilha
const result = await uploadFile(file, 'spreadsheets')

// Upload de thumbnail
const result = await uploadFile(file, 'thumbnails')
```

### Deletar Arquivo

```typescript
import { deleteFile } from '@/lib/storage'

await deleteFile('methods', 'path/to/file.pdf')
```

### Obter URL Assinada (para arquivos privados)

```typescript
import { getSignedUrl } from '@/lib/storage'

// URL válida por 1 hora (3600 segundos)
const result = await getSignedUrl('methods', 'path/to/file.pdf', 3600)

if (result.success) {
  console.log('Signed URL:', result.url)
}
```

## Estrutura de Pastas Recomendada

```
methods/
  ├── user-{userId}/
  │   ├── {timestamp}-{random}.pdf
  │   └── {timestamp}-{random}.mp4

spreadsheets/
  ├── {timestamp}-{random}.xlsx
  └── {timestamp}-{random}.csv

thumbnails/
  ├── methods/
  │   └── {timestamp}-{random}.jpg
  └── spreadsheets/
      └── {timestamp}-{random}.jpg
```

## Políticas de Acesso

### Methods & Spreadsheets (Privados)
- ✅ Usuários autenticados podem fazer upload
- ✅ Usuários podem visualizar arquivos que têm acesso
- ✅ Apenas admins podem deletar

### Thumbnails (Público)
- ✅ Qualquer pessoa pode visualizar
- ✅ Usuários autenticados podem fazer upload
- ✅ Apenas admins podem deletar

## Exemplo de API Route para Upload

```typescript
// app/api/upload/method/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/storage'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const result = await uploadFile(file, 'methods', session.user.id)

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({
    url: result.url,
    path: result.path,
  })
}
```

## Troubleshooting

### Erro: "new row violates row-level security policy"
- Verifique se as políticas RLS foram criadas corretamente
- Confirme que o usuário está autenticado

### Erro: "The resource already exists"
- Os buckets já foram criados
- Não é necessário executar o script novamente

### Erro: "File size exceeds limit"
- Verifique os limites de tamanho de cada bucket
- Methods: 50 MB
- Spreadsheets: 10 MB
- Thumbnails: 5 MB

---

**Pronto!** Seus buckets estão configurados e prontos para uso. 🎉
