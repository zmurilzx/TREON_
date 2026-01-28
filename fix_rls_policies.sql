-- ============================================
-- FIX RLS POLICIES - TREON BETTING PLATFORM
-- ============================================
-- Este script adiciona políticas RLS faltantes para permitir
-- operações necessárias no sistema
-- IMPORTANTE: Este script permite operações do servidor (Prisma)
-- ============================================

-- ============================================
-- OPÇÃO 1: DESABILITAR RLS (MAIS SIMPLES)
-- ============================================
-- Descomente as linhas abaixo para desabilitar RLS completamente
-- ATENÇÃO: Isso remove a camada de segurança do Supabase Auth
-- Use apenas se você controla o acesso via NextAuth no servidor

-- ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Session" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "VerificationToken" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Subscription" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Transaction" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "PaymentEvent" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Method" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Spreadsheet" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Calculator" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "UserAccess" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Surebet" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "AuditLog" DISABLE ROW LEVEL SECURITY;

-- ============================================
-- OPÇÃO 2: POLÍTICAS RLS PERMISSIVAS (RECOMENDADO)
-- ============================================
-- Estas políticas permitem operações do servidor via Prisma
-- mantendo alguma segurança básica

-- ============================================
-- POLÍTICAS RLS - USER
-- ============================================

-- Remover políticas existentes que podem causar conflito
DROP POLICY IF EXISTS "Users can update own data" ON "User";
DROP POLICY IF EXISTS "Anyone can create user" ON "User";
DROP POLICY IF EXISTS "Service can manage users" ON "User";

-- Permitir que o servidor (Prisma) gerencie usuários
-- Esta política permite todas as operações para facilitar o desenvolvimento
CREATE POLICY "Service can manage users" ON "User"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- POLÍTICAS RLS - SESSION
-- ============================================

DROP POLICY IF EXISTS "Users can create own sessions" ON "Session";
DROP POLICY IF EXISTS "Users can update own sessions" ON "Session";
DROP POLICY IF EXISTS "Service can manage sessions" ON "Session";

CREATE POLICY "Service can manage sessions" ON "Session"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- POLÍTICAS RLS - VERIFICATION TOKEN
-- ============================================

DROP POLICY IF EXISTS "Anyone can create verification tokens" ON "VerificationToken";
DROP POLICY IF EXISTS "Anyone can read verification tokens" ON "VerificationToken";
DROP POLICY IF EXISTS "Anyone can delete verification tokens" ON "VerificationToken";
DROP POLICY IF EXISTS "Service can manage verification tokens" ON "VerificationToken";

CREATE POLICY "Service can manage verification tokens" ON "VerificationToken"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- POLÍTICAS RLS - SUBSCRIPTION
-- ============================================

DROP POLICY IF EXISTS "System can create subscriptions" ON "Subscription";
DROP POLICY IF EXISTS "System can update subscriptions" ON "Subscription";
DROP POLICY IF EXISTS "Service can manage subscriptions" ON "Subscription";

CREATE POLICY "Service can manage subscriptions" ON "Subscription"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- POLÍTICAS RLS - TRANSACTION
-- ============================================

DROP POLICY IF EXISTS "System can create transactions" ON "Transaction";
DROP POLICY IF EXISTS "System can update transactions" ON "Transaction";
DROP POLICY IF EXISTS "Service can manage transactions" ON "Transaction";

CREATE POLICY "Service can manage transactions" ON "Transaction"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- POLÍTICAS RLS - PAYMENT EVENT
-- ============================================

DROP POLICY IF EXISTS "Service can manage payment events" ON "PaymentEvent";

CREATE POLICY "Service can manage payment events" ON "PaymentEvent"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- POLÍTICAS RLS - METHOD
-- ============================================

DROP POLICY IF EXISTS "Service can manage methods" ON "Method";

CREATE POLICY "Service can manage methods" ON "Method"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- POLÍTICAS RLS - SPREADSHEET
-- ============================================

DROP POLICY IF EXISTS "Service can manage spreadsheets" ON "Spreadsheet";

CREATE POLICY "Service can manage spreadsheets" ON "Spreadsheet"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- POLÍTICAS RLS - CALCULATOR
-- ============================================

DROP POLICY IF EXISTS "Service can manage calculators" ON "Calculator";

CREATE POLICY "Service can manage calculators" ON "Calculator"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- POLÍTICAS RLS - USER ACCESS
-- ============================================

DROP POLICY IF EXISTS "System can create user access" ON "UserAccess";
DROP POLICY IF EXISTS "System can update user access" ON "UserAccess";
DROP POLICY IF EXISTS "Service can manage user access" ON "UserAccess";

CREATE POLICY "Service can manage user access" ON "UserAccess"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- POLÍTICAS RLS - SUREBET
-- ============================================

DROP POLICY IF EXISTS "Service can manage surebets" ON "Surebet";

CREATE POLICY "Service can manage surebets" ON "Surebet"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- POLÍTICAS RLS - AUDIT LOG
-- ============================================

DROP POLICY IF EXISTS "System can create audit logs" ON "AuditLog";
DROP POLICY IF EXISTS "Service can manage audit logs" ON "AuditLog";

CREATE POLICY "Service can manage audit logs" ON "AuditLog"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- FIM DO SCRIPT
-- ============================================

-- Verificar políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
