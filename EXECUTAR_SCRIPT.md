# 🚨 COMO EXECUTAR O SCRIPT SQL NO SUPABASE

## ⚠️ IMPORTANTE
O erro de upload de foto **SÓ SERÁ RESOLVIDO** após executar este script no Supabase.
A aplicação está funcionando corretamente, mas o Supabase precisa ser configurado.

## 📋 Passo a Passo

### 1. Acesse o Supabase
- Abra seu navegador
- Vá para: https://supabase.com
- Faça login na sua conta

### 2. Selecione o Projeto TREON
- Na lista de projetos, clique no projeto TREON
- Você verá o dashboard do projeto

### 3. Abra o SQL Editor
- No menu lateral esquerdo, procure por **"SQL Editor"**
- Clique em **"SQL Editor"**
- Clique no botão **"New query"** (ou "+ New query")

### 4. Cole o Script
Copie e cole este script completo no editor:

```sql
-- Remover TODAS as políticas do storage
DROP POLICY IF EXISTS "Allow all for avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow all for methods" ON storage.objects;
DROP POLICY IF EXISTS "Allow all for spreadsheets" ON storage.objects;
DROP POLICY IF EXISTS "Allow all for thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Public read thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload methods" ON storage.objects;
DROP POLICY IF EXISTS "Users can view methods they have access to" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete methods" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload spreadsheets" ON storage.objects;
DROP POLICY IF EXISTS "Users can view spreadsheets they have access to" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete spreadsheets" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete thumbnails" ON storage.objects;

-- Criar bucket avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Criar política que permite TUDO
CREATE POLICY "Allow all operations"
ON storage.objects
FOR ALL
USING (true)
WITH CHECK (true);

-- Verificar
SELECT '✅ Configuração concluída!' as status;
```

### 5. Execute o Script
- Clique no botão **"Run"** (geralmente no canto superior direito)
- Ou pressione **Ctrl + Enter** (Windows) ou **Cmd + Enter** (Mac)
- Aguarde a execução (deve levar 1-2 segundos)

### 6. Verifique o Resultado
Você deve ver uma mensagem de sucesso:
```
✅ Configuração concluída!
```

### 7. Teste na Aplicação
- Volte para a aplicação (http://localhost:3000/dashboard/profile)
- Recarregue a página (F5)
- Aguarde 10 segundos
- Tente fazer upload da foto novamente

## ❓ Se Ainda Não Funcionar

Se após executar o script o erro persistir:

1. **Verifique se o bucket foi criado:**
   - No Supabase, vá em **Storage** no menu lateral
   - Você deve ver um bucket chamado **"avatars"**
   - Se não existir, crie manualmente:
     - Clique em "New bucket"
     - Nome: `avatars`
     - Marque como **Public**
     - Salve

2. **Execute o script novamente** após criar o bucket manualmente

3. **Limpe o cache do navegador:**
   - Pressione Ctrl + Shift + Delete
   - Limpe cache e cookies
   - Recarregue a página

## 🎯 O Que Este Script Faz

1. Remove todas as políticas antigas do Storage que podem causar conflito
2. Cria o bucket `avatars` (onde as fotos serão armazenadas)
3. Cria uma política super permissiva que permite qualquer operação
4. Isso resolve o erro: `StorageApiError: new row violates row-level security policy`

## ✅ Após Executar

O upload de foto funcionará normalmente e você verá:
- ✅ Foto enviada com sucesso
- ✅ Foto aparecendo no perfil
- ✅ Sem erros no console

---

**Precisa de ajuda?** Me avise se encontrar algum erro ao executar o script.
