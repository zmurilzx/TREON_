-- ============================================
-- TREON BETTING PLATFORM - SUPABASE STORAGE SETUP
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- ============================================

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

-- Permitir que todos visualizem avatares (bucket público)
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Permitir que usuários autenticados façam upload de seus avatares
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Permitir que usuários atualizem seus próprios avatares
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Permitir que usuários deletem seus próprios avatares
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- POLÍTICAS DE ACESSO - METHODS BUCKET
-- ============================================

-- Permitir que usuários autenticados façam upload de métodos
CREATE POLICY "Authenticated users can upload methods"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'methods');

-- Permitir que usuários autenticados visualizem métodos que têm acesso
CREATE POLICY "Users can view methods they have access to"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'methods');

-- Permitir que admins deletem métodos
CREATE POLICY "Admins can delete methods"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'methods' AND
  auth.jwt() ->> 'role' = 'ADMIN'
);

-- ============================================
-- POLÍTICAS DE ACESSO - SPREADSHEETS BUCKET
-- ============================================

-- Permitir que usuários autenticados façam upload de planilhas
CREATE POLICY "Authenticated users can upload spreadsheets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'spreadsheets');

-- Permitir que usuários autenticados visualizem planilhas que têm acesso
CREATE POLICY "Users can view spreadsheets they have access to"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'spreadsheets');

-- Permitir que admins deletem planilhas
CREATE POLICY "Admins can delete spreadsheets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'spreadsheets' AND
  auth.jwt() ->> 'role' = 'ADMIN'
);

-- ============================================
-- POLÍTICAS DE ACESSO - THUMBNAILS BUCKET (PÚBLICO)
-- ============================================

-- Permitir que todos visualizem thumbnails (bucket público)
CREATE POLICY "Anyone can view thumbnails"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'thumbnails');

-- Permitir que usuários autenticados façam upload de thumbnails
CREATE POLICY "Authenticated users can upload thumbnails"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'thumbnails');

-- Permitir que admins deletem thumbnails
CREATE POLICY "Admins can delete thumbnails"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'thumbnails' AND
  auth.jwt() ->> 'role' = 'ADMIN'
);

-- ============================================
-- COMPLETED
-- ============================================

SELECT 'Storage buckets setup completed successfully!' as message;
