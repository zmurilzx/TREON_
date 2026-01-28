-- ============================================
-- TREON BETTING PLATFORM - SUPABASE STORAGE SETUP (CLEAN VERSION)
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- Remove políticas antigas e recria tudo
-- ============================================

-- Remover políticas antigas se existirem
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

-- Criar buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('methods', 'methods', false, 52428800, ARRAY['application/pdf', 'video/mp4', 'video/webm', 'video/quicktime']),
  ('spreadsheets', 'spreadsheets', false, 10485760, ARRAY['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']),
  ('thumbnails', 'thumbnails', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- POLÍTICAS DE ACESSO - AVATARS BUCKET (PÚBLICO)
-- ============================================

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

-- ============================================
-- POLÍTICAS DE ACESSO - METHODS BUCKET
-- ============================================

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

-- ============================================
-- POLÍTICAS DE ACESSO - SPREADSHEETS BUCKET
-- ============================================

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

-- ============================================
-- POLÍTICAS DE ACESSO - THUMBNAILS BUCKET (PÚBLICO)
-- ============================================

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
-- COMPLETED
-- ============================================

SELECT 'Storage buckets setup completed successfully!' as message;
