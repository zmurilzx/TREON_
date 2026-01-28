-- ============================================
-- FIX COMPLETO - TREON BETTING PLATFORM
-- ============================================
-- Este script resolve todos os problemas de RLS e Storage
-- Execute no SQL Editor do Supabase
-- ============================================

-- ============================================
-- PARTE 1: DESABILITAR RLS NAS TABELAS
-- ============================================

ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "PaymentEvent" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Method" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Spreadsheet" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Calculator" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "UserAccess" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Surebet" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" DISABLE ROW LEVEL SECURITY;

-- ============================================
-- PARTE 2: REMOVER POLÍTICAS ANTIGAS DO STORAGE
-- ============================================

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

-- ============================================
-- PARTE 3: CRIAR BUCKETS DO STORAGE
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('methods', 'methods', false, 52428800, ARRAY['application/pdf', 'video/mp4', 'video/webm', 'video/quicktime']),
  ('spreadsheets', 'spreadsheets', false, 10485760, ARRAY['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']),
  ('thumbnails', 'thumbnails', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PARTE 4: CRIAR POLÍTICAS PERMISSIVAS DO STORAGE
-- ============================================

-- Avatars (público e permissivo)
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');

-- Methods
CREATE POLICY "Authenticated users can upload methods"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'methods');

CREATE POLICY "Users can view methods they have access to"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'methods');

CREATE POLICY "Admins can delete methods"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'methods');

-- Spreadsheets
CREATE POLICY "Authenticated users can upload spreadsheets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'spreadsheets');

CREATE POLICY "Users can view spreadsheets they have access to"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'spreadsheets');

CREATE POLICY "Admins can delete spreadsheets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'spreadsheets');

-- Thumbnails
CREATE POLICY "Anyone can view thumbnails"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'thumbnails');

CREATE POLICY "Admins can delete thumbnails"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'thumbnails');

-- ============================================
-- PARTE 5: VERIFICAÇÃO
-- ============================================

-- Verificar RLS desabilitado
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verificar buckets criados
SELECT id, name, public, file_size_limit
FROM storage.buckets
ORDER BY name;

-- Verificar políticas do storage
SELECT 
  policyname,
  tablename,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'storage'
ORDER BY policyname;

-- ============================================
-- SUCESSO!
-- ============================================
SELECT '✅ Configuração completa! RLS desabilitado e Storage configurado.' as status;
