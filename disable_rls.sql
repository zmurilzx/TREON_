-- ============================================
-- DESABILITAR RLS - TREON BETTING PLATFORM
-- ============================================
-- Este script desabilita o RLS em todas as tabelas
-- Use isso quando você controla o acesso via NextAuth no servidor
-- ============================================

-- Desabilitar RLS em todas as tabelas
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

-- Verificar status do RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================
-- SUCESSO!
-- ============================================
-- RLS desabilitado em todas as tabelas.
-- A segurança agora é controlada pelo NextAuth no servidor.
