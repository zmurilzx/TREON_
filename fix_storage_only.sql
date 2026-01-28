-- ============================================
-- FIX STORAGE RLS - SOLUÇÃO DEFINITIVA
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Remover todas as políticas antigas do storage
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

-- Criar buckets (se não existirem)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('methods', 'methods', false, 52428800, ARRAY['application/pdf', 'video/mp4', 'video/webm', 'video/quicktime'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('spreadsheets', 'spreadsheets', false, 10485760, ARRAY['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('thumbnails', 'thumbnails', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- POLÍTICAS SUPER PERMISSIVAS (PARA DESENVOLVIMENTO)
-- ============================================
-- ATENÇÃO: Estas políticas permitem qualquer operação
-- Use apenas em desenvolvimento ou se você controla o acesso no servidor

-- Avatars - Permitir tudo para usuários autenticados
CREATE POLICY "Allow all for avatars"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

-- Permitir visualização pública de avatars
CREATE POLICY "Public read avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Methods - Permitir tudo para usuários autenticados
CREATE POLICY "Allow all for methods"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'methods')
WITH CHECK (bucket_id = 'methods');

-- Spreadsheets - Permitir tudo para usuários autenticados
CREATE POLICY "Allow all for spreadsheets"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'spreadsheets')
WITH CHECK (bucket_id = 'spreadsheets');

-- Thumbnails - Permitir tudo para usuários autenticados
CREATE POLICY "Allow all for thumbnails"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'thumbnails')
WITH CHECK (bucket_id = 'thumbnails');

-- Permitir visualização pública de thumbnails
CREATE POLICY "Public read thumbnails"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'thumbnails');

-- ============================================
-- VERIFICAÇÃO
-- ============================================

-- Ver buckets criados
SELECT 
  id,
  name,
  public,
  file_size_limit / 1024 / 1024 as size_limit_mb,
  created_at
FROM storage.buckets
ORDER BY name;

-- Ver políticas do storage
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage'
ORDER BY policyname;

-- ============================================
-- SUCESSO!
-- ============================================
SELECT '✅ Storage configurado com políticas permissivas!' as status;
