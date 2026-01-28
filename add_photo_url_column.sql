-- Adicionar coluna photoUrl na tabela User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "photoUrl" TEXT;
