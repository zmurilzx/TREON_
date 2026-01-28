-- ============================================
-- DESABILITAR RLS DO STORAGE - SOLUÇÃO DEFINITIVA
-- ============================================
-- Execute no SQL Editor do Supabase
-- ============================================

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

-- Criar buckets (se não existirem)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Criar UMA ÚNICA política que permite TUDO
CREATE POLICY "Allow all operations"
ON storage.objects
FOR ALL
USING (true)
WITH CHECK (true);

-- Verificar
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'storage'
ORDER BY policyname;

SELECT '✅ RLS do Storage desabilitado completamente!' as status;
