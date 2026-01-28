-- ============================================
-- TREON BETTING PLATFORM - SUPABASE SQL SETUP
-- ============================================
-- Este script cria todas as tabelas, enums, índices e políticas RLS
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Limpar schema existente (CUIDADO: Remove todas as tabelas!)
-- Descomente apenas se quiser resetar o banco completamente
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;
-- GRANT ALL ON SCHEMA public TO postgres;
-- GRANT ALL ON SCHEMA public TO public;

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');
CREATE TYPE "PlanType" AS ENUM (
  'MONTHLY_METHOD',
  'CALCULATOR_ACCESS',
  'VIP_TIER_1',
  'VIP_TIER_2',
  'VIP_TIER_3',
  'DELAY_ESPORTIVO'
);
CREATE TYPE "SubscriptionStatus" AS ENUM (
  'ACTIVE',
  'EXPIRED',
  'CANCELLED',
  'GRACE_PERIOD',
  'DUNNING'
);
CREATE TYPE "TransactionType" AS ENUM (
  'PURCHASE',
  'SUBSCRIPTION',
  'REFUND',
  'CHARGEBACK'
);
CREATE TYPE "TransactionStatus" AS ENUM (
  'PENDING',
  'COMPLETED',
  'FAILED',
  'REFUNDED'
);
CREATE TYPE "AccessLevel" AS ENUM ('FREE', 'PAID', 'VIP');
CREATE TYPE "ContentType" AS ENUM ('METHOD', 'SPREADSHEET', 'VIDEO');
CREATE TYPE "AccessSource" AS ENUM (
  'PURCHASE',
  'SUBSCRIPTION',
  'ADMIN_GRANT',
  'PROMOTION'
);
CREATE TYPE "BetStatus" AS ENUM ('PENDING', 'SETTLED');

-- ============================================
-- USER MANAGEMENT TABLES
-- ============================================

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "birthDate" TIMESTAMP(3) NOT NULL,
  "isVerified" BOOLEAN DEFAULT false NOT NULL,
  "role" "UserRole" DEFAULT 'USER' NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Session" (
  "id" TEXT PRIMARY KEY,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") 
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "VerificationToken" (
  "id" TEXT PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "token" TEXT UNIQUE NOT NULL,
  "type" "TokenType" NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  "userId" TEXT,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT "VerificationToken_userId_fkey" FOREIGN KEY ("userId") 
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "VerificationToken_identifier_token_key" UNIQUE ("identifier", "token")
);

-- ============================================
-- SUBSCRIPTION & PAYMENT TABLES
-- ============================================

CREATE TABLE "Subscription" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "planType" "PlanType" NOT NULL,
  "status" "SubscriptionStatus" DEFAULT 'ACTIVE' NOT NULL,
  "startDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  "abacatePaySubId" TEXT UNIQUE,
  "autoRenew" BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") 
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Transaction" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "subscriptionId" TEXT,
  "amount" DECIMAL(10,2) NOT NULL,
  "type" "TransactionType" NOT NULL,
  "status" "TransactionStatus" DEFAULT 'PENDING' NOT NULL,
  "abacatePayTxId" TEXT UNIQUE,
  "idempotencyKey" TEXT UNIQUE NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") 
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Transaction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") 
    REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "PaymentEvent" (
  "id" TEXT PRIMARY KEY,
  "eventType" TEXT NOT NULL,
  "signature" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "processed" BOOLEAN DEFAULT false NOT NULL,
  "retryCount" INTEGER DEFAULT 0 NOT NULL,
  "error" TEXT,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "processedAt" TIMESTAMP(3)
);

-- ============================================
-- CONTENT MANAGEMENT TABLES
-- ============================================

CREATE TABLE "Method" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "isPublished" BOOLEAN DEFAULT false NOT NULL,
  "category" TEXT NOT NULL,
  "accessLevel" "AccessLevel" DEFAULT 'PAID' NOT NULL,
  "fileUrl" TEXT,
  "thumbnailUrl" TEXT,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Spreadsheet" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "templateType" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "accessLevel" "AccessLevel" DEFAULT 'PAID' NOT NULL,
  "downloadCount" INTEGER DEFAULT 0 NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Calculator" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "type" TEXT UNIQUE NOT NULL,
  "config" JSONB NOT NULL,
  "isActive" BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- ============================================
-- ACCESS CONTROL TABLES
-- ============================================

CREATE TABLE "UserAccess" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "contentType" "ContentType" NOT NULL,
  "contentId" TEXT NOT NULL,
  "methodId" TEXT,
  "spreadsheetId" TEXT,
  "grantedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "expiresAt" TIMESTAMP(3),
  "source" "AccessSource" NOT NULL,
  CONSTRAINT "UserAccess_userId_fkey" FOREIGN KEY ("userId") 
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "UserAccess_methodId_fkey" FOREIGN KEY ("methodId") 
    REFERENCES "Method"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "UserAccess_spreadsheetId_fkey" FOREIGN KEY ("spreadsheetId") 
    REFERENCES "Spreadsheet"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "UserAccess_userId_contentType_contentId_key" 
    UNIQUE ("userId", "contentType", "contentId")
);

-- ============================================
-- BET MANAGEMENT TABLES
-- ============================================

CREATE TABLE "Surebet" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "event" TEXT NOT NULL,
  "sport" TEXT NOT NULL,
  "betDate" TIMESTAMP(3) NOT NULL,
  
  -- Casa 1
  "house1" TEXT NOT NULL,
  "odd1" DOUBLE PRECISION NOT NULL,
  "stake1" DOUBLE PRECISION NOT NULL,
  "market1" TEXT NOT NULL,
  
  -- Casa 2
  "house2" TEXT NOT NULL,
  "odd2" DOUBLE PRECISION NOT NULL,
  "stake2" DOUBLE PRECISION NOT NULL,
  "market2" TEXT NOT NULL,
  
  -- Cálculos
  "totalStake" DOUBLE PRECISION NOT NULL,
  "potentialProfit" DOUBLE PRECISION NOT NULL,
  
  -- Resultado
  "status" "BetStatus" DEFAULT 'PENDING' NOT NULL,
  "winningHouse" INTEGER,
  "actualProfit" DOUBLE PRECISION,
  "roi" DOUBLE PRECISION,
  "resultDate" TIMESTAMP(3),
  
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  
  CONSTRAINT "Surebet_userId_fkey" FOREIGN KEY ("userId") 
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- AUDIT & LOGGING TABLES
-- ============================================

CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT,
  "metadata" JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- INDEXES
-- ============================================

-- User indexes
CREATE INDEX "User_email_idx" ON "User"("email");

-- Session indexes
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- VerificationToken indexes
CREATE INDEX "VerificationToken_userId_idx" ON "VerificationToken"("userId");

-- Subscription indexes
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");
CREATE INDEX "Subscription_endDate_idx" ON "Subscription"("endDate");

-- Transaction indexes
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");
CREATE INDEX "Transaction_abacatePayTxId_idx" ON "Transaction"("abacatePayTxId");
CREATE INDEX "Transaction_idempotencyKey_idx" ON "Transaction"("idempotencyKey");

-- PaymentEvent indexes
CREATE INDEX "PaymentEvent_eventType_idx" ON "PaymentEvent"("eventType");
CREATE INDEX "PaymentEvent_processed_idx" ON "PaymentEvent"("processed");
CREATE INDEX "PaymentEvent_createdAt_idx" ON "PaymentEvent"("createdAt");

-- Method indexes
CREATE INDEX "Method_isPublished_idx" ON "Method"("isPublished");
CREATE INDEX "Method_category_idx" ON "Method"("category");
CREATE INDEX "Method_accessLevel_idx" ON "Method"("accessLevel");

-- Spreadsheet indexes
CREATE INDEX "Spreadsheet_category_idx" ON "Spreadsheet"("category");
CREATE INDEX "Spreadsheet_accessLevel_idx" ON "Spreadsheet"("accessLevel");

-- Calculator indexes
CREATE INDEX "Calculator_type_idx" ON "Calculator"("type");
CREATE INDEX "Calculator_isActive_idx" ON "Calculator"("isActive");

-- UserAccess indexes
CREATE INDEX "UserAccess_userId_idx" ON "UserAccess"("userId");
CREATE INDEX "UserAccess_expiresAt_idx" ON "UserAccess"("expiresAt");

-- Surebet indexes
CREATE INDEX "Surebet_userId_idx" ON "Surebet"("userId");
CREATE INDEX "Surebet_status_idx" ON "Surebet"("status");
CREATE INDEX "Surebet_betDate_idx" ON "Surebet"("betDate");

-- AuditLog indexes
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PaymentEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Method" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Spreadsheet" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Calculator" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserAccess" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Surebet" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS - USER
-- ============================================

-- Usuários podem ver apenas seus próprios dados
CREATE POLICY "Users can view own data" ON "User"
  FOR SELECT
  USING (auth.uid()::text = id);

-- Usuários podem atualizar apenas seus próprios dados
CREATE POLICY "Users can update own data" ON "User"
  FOR UPDATE
  USING (auth.uid()::text = id);

-- Admins podem ver todos os usuários
CREATE POLICY "Admins can view all users" ON "User"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- ============================================
-- POLÍTICAS RLS - SESSION
-- ============================================

CREATE POLICY "Users can view own sessions" ON "Session"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own sessions" ON "Session"
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- ============================================
-- POLÍTICAS RLS - SUBSCRIPTION
-- ============================================

CREATE POLICY "Users can view own subscriptions" ON "Subscription"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Admins can view all subscriptions" ON "Subscription"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can manage subscriptions" ON "Subscription"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- ============================================
-- POLÍTICAS RLS - TRANSACTION
-- ============================================

CREATE POLICY "Users can view own transactions" ON "Transaction"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Admins can view all transactions" ON "Transaction"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- ============================================
-- POLÍTICAS RLS - METHOD & SPREADSHEET
-- ============================================

-- Todos podem ver métodos publicados
CREATE POLICY "Anyone can view published methods" ON "Method"
  FOR SELECT
  USING ("isPublished" = true);

-- Admins podem gerenciar métodos
CREATE POLICY "Admins can manage methods" ON "Method"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- Todos podem ver planilhas
CREATE POLICY "Anyone can view spreadsheets" ON "Spreadsheet"
  FOR SELECT
  USING (true);

-- Admins podem gerenciar planilhas
CREATE POLICY "Admins can manage spreadsheets" ON "Spreadsheet"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- ============================================
-- POLÍTICAS RLS - CALCULATOR
-- ============================================

-- Todos podem ver calculadoras ativas
CREATE POLICY "Anyone can view active calculators" ON "Calculator"
  FOR SELECT
  USING ("isActive" = true);

-- Admins podem gerenciar calculadoras
CREATE POLICY "Admins can manage calculators" ON "Calculator"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- ============================================
-- POLÍTICAS RLS - USER ACCESS
-- ============================================

CREATE POLICY "Users can view own access" ON "UserAccess"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Admins can manage access" ON "UserAccess"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- ============================================
-- POLÍTICAS RLS - SUREBET
-- ============================================

CREATE POLICY "Users can view own surebets" ON "Surebet"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create own surebets" ON "Surebet"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own surebets" ON "Surebet"
  FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own surebets" ON "Surebet"
  FOR DELETE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Admins can view all surebets" ON "Surebet"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- ============================================
-- POLÍTICAS RLS - AUDIT LOG
-- ============================================

CREATE POLICY "Users can view own audit logs" ON "AuditLog"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Admins can view all audit logs" ON "AuditLog"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- ============================================
-- FUNÇÕES AUXILIARES
-- ============================================

-- Função para atualizar o campo updatedAt automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas com updatedAt
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_updated_at BEFORE UPDATE ON "Subscription"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transaction_updated_at BEFORE UPDATE ON "Transaction"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_method_updated_at BEFORE UPDATE ON "Method"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spreadsheet_updated_at BEFORE UPDATE ON "Spreadsheet"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calculator_updated_at BEFORE UPDATE ON "Calculator"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_surebet_updated_at BEFORE UPDATE ON "Surebet"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DADOS INICIAIS (SEED)
-- ============================================

-- Inserir calculadoras padrão
INSERT INTO "Calculator" ("id", "name", "type", "config", "isActive", "createdAt", "updatedAt")
VALUES 
  ('calc_dutching', 'Dutching Calculator', 'dutching', '{"description": "Calculadora de Dutching"}', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('calc_freebet', 'Freebet Calculator', 'freebet', '{"description": "Calculadora de Freebet"}', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('calc_gols_ha', 'Gols HA Calculator', 'gols-ha', '{"description": "Calculadora de Gols HA"}', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('calc_surebet', 'Surebet Calculator', 'surebet', '{"description": "Calculadora de Surebet"}', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("type") DO NOTHING;

-- ============================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- ============================================

COMMENT ON TABLE "User" IS 'Tabela de usuários do sistema';
COMMENT ON TABLE "Subscription" IS 'Assinaturas e planos dos usuários';
COMMENT ON TABLE "Transaction" IS 'Transações financeiras e pagamentos';
COMMENT ON TABLE "Surebet" IS 'Registro de apostas em surebet dos usuários';
COMMENT ON TABLE "Method" IS 'Métodos e estratégias de apostas';
COMMENT ON TABLE "Calculator" IS 'Configuração das calculadoras disponíveis';
COMMENT ON TABLE "AuditLog" IS 'Log de auditoria de ações do sistema';

-- ============================================
-- FIM DO SCRIPT
-- ============================================

-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
