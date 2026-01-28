-- ============================================
-- TREON BETTING PLATFORM - SUPABASE SQL SETUP (SAFE MODE)
-- ============================================
-- Este script cria todas as tabelas, enums, índices e políticas RLS
-- Versão segura que verifica existência antes de criar
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- ============================================
-- ENUMS (com verificação de existência)
-- ============================================

DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PlanType" AS ENUM (
      'MONTHLY_METHOD',
      'CALCULATOR_ACCESS',
      'VIP_TIER_1',
      'VIP_TIER_2',
      'VIP_TIER_3',
      'DELAY_ESPORTIVO'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "SubscriptionStatus" AS ENUM (
      'ACTIVE',
      'EXPIRED',
      'CANCELLED',
      'GRACE_PERIOD',
      'DUNNING'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TransactionType" AS ENUM (
      'PURCHASE',
      'SUBSCRIPTION',
      'REFUND',
      'CHARGEBACK'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TransactionStatus" AS ENUM (
      'PENDING',
      'COMPLETED',
      'FAILED',
      'REFUNDED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "AccessLevel" AS ENUM ('FREE', 'PAID', 'VIP');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ContentType" AS ENUM ('METHOD', 'SPREADSHEET', 'VIDEO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "AccessSource" AS ENUM ('PURCHASE', 'SUBSCRIPTION', 'ADMIN_GRANT', 'PROMOTION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "BetStatus" AS ENUM ('PENDING', 'SETTLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- TABLES
-- ============================================

-- User Table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "birthDate" TIMESTAMP(3) NOT NULL,
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "role" "UserRole" NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Session Table
CREATE TABLE IF NOT EXISTS "Session" (
  "id" TEXT PRIMARY KEY,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- VerificationToken Table
CREATE TABLE IF NOT EXISTS "VerificationToken" (
  "id" TEXT PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "token" TEXT UNIQUE NOT NULL,
  "type" "TokenType" NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  "userId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "VerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "VerificationToken_identifier_token_key" UNIQUE ("identifier", "token")
);

-- Subscription Table
CREATE TABLE IF NOT EXISTS "Subscription" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "planType" "PlanType" NOT NULL,
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
  "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endDate" TIMESTAMP(3) NOT NULL,
  "abacatePaySubId" TEXT UNIQUE,
  "autoRenew" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Transaction Table
CREATE TABLE IF NOT EXISTS "Transaction" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "subscriptionId" TEXT,
  "amount" DECIMAL(10,2) NOT NULL,
  "type" "TransactionType" NOT NULL,
  "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
  "abacatePayTxId" TEXT UNIQUE,
  "idempotencyKey" TEXT UNIQUE NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Transaction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- PaymentEvent Table
CREATE TABLE IF NOT EXISTS "PaymentEvent" (
  "id" TEXT PRIMARY KEY,
  "eventType" TEXT NOT NULL,
  "signature" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "processed" BOOLEAN NOT NULL DEFAULT false,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "error" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP(3)
);

-- Method Table
CREATE TABLE IF NOT EXISTS "Method" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "category" TEXT NOT NULL,
  "accessLevel" "AccessLevel" NOT NULL DEFAULT 'PAID',
  "fileUrl" TEXT,
  "thumbnailUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Spreadsheet Table
CREATE TABLE IF NOT EXISTS "Spreadsheet" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "templateType" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "accessLevel" "AccessLevel" NOT NULL DEFAULT 'PAID',
  "downloadCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Calculator Table
CREATE TABLE IF NOT EXISTS "Calculator" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "type" TEXT UNIQUE NOT NULL,
  "config" JSONB NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- UserAccess Table
CREATE TABLE IF NOT EXISTS "UserAccess" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "contentType" "ContentType" NOT NULL,
  "contentId" TEXT NOT NULL,
  "methodId" TEXT,
  "spreadsheetId" TEXT,
  "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3),
  "source" "AccessSource" NOT NULL,
  CONSTRAINT "UserAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "UserAccess_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "Method"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "UserAccess_spreadsheetId_fkey" FOREIGN KEY ("spreadsheetId") REFERENCES "Spreadsheet"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "UserAccess_userId_contentType_contentId_key" UNIQUE ("userId", "contentType", "contentId")
);

-- Surebet Table
CREATE TABLE IF NOT EXISTS "Surebet" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "event" TEXT NOT NULL,
  "sport" TEXT NOT NULL,
  "betDate" TIMESTAMP(3) NOT NULL,
  "house1" TEXT NOT NULL,
  "odd1" DOUBLE PRECISION NOT NULL,
  "stake1" DOUBLE PRECISION NOT NULL,
  "market1" TEXT NOT NULL,
  "house2" TEXT NOT NULL,
  "odd2" DOUBLE PRECISION NOT NULL,
  "stake2" DOUBLE PRECISION NOT NULL,
  "market2" TEXT NOT NULL,
  "totalStake" DOUBLE PRECISION NOT NULL,
  "potentialProfit" DOUBLE PRECISION NOT NULL,
  "status" "BetStatus" NOT NULL DEFAULT 'PENDING',
  "winningHouse" INTEGER,
  "actualProfit" DOUBLE PRECISION,
  "roi" DOUBLE PRECISION,
  "resultDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Surebet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- AuditLog Table
CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT,
  "metadata" JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
CREATE INDEX IF NOT EXISTS "VerificationToken_userId_idx" ON "VerificationToken"("userId");
CREATE INDEX IF NOT EXISTS "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX IF NOT EXISTS "Subscription_status_idx" ON "Subscription"("status");
CREATE INDEX IF NOT EXISTS "Subscription_endDate_idx" ON "Subscription"("endDate");
CREATE INDEX IF NOT EXISTS "Transaction_userId_idx" ON "Transaction"("userId");
CREATE INDEX IF NOT EXISTS "Transaction_status_idx" ON "Transaction"("status");
CREATE INDEX IF NOT EXISTS "Transaction_abacatePayTxId_idx" ON "Transaction"("abacatePayTxId");
CREATE INDEX IF NOT EXISTS "Transaction_idempotencyKey_idx" ON "Transaction"("idempotencyKey");
CREATE INDEX IF NOT EXISTS "PaymentEvent_eventType_idx" ON "PaymentEvent"("eventType");
CREATE INDEX IF NOT EXISTS "PaymentEvent_processed_idx" ON "PaymentEvent"("processed");
CREATE INDEX IF NOT EXISTS "PaymentEvent_createdAt_idx" ON "PaymentEvent"("createdAt");
CREATE INDEX IF NOT EXISTS "Method_isPublished_idx" ON "Method"("isPublished");
CREATE INDEX IF NOT EXISTS "Method_category_idx" ON "Method"("category");
CREATE INDEX IF NOT EXISTS "Method_accessLevel_idx" ON "Method"("accessLevel");
CREATE INDEX IF NOT EXISTS "Spreadsheet_category_idx" ON "Spreadsheet"("category");
CREATE INDEX IF NOT EXISTS "Spreadsheet_accessLevel_idx" ON "Spreadsheet"("accessLevel");
CREATE INDEX IF NOT EXISTS "Calculator_type_idx" ON "Calculator"("type");
CREATE INDEX IF NOT EXISTS "Calculator_isActive_idx" ON "Calculator"("isActive");
CREATE INDEX IF NOT EXISTS "UserAccess_userId_idx" ON "UserAccess"("userId");
CREATE INDEX IF NOT EXISTS "UserAccess_expiresAt_idx" ON "UserAccess"("expiresAt");
CREATE INDEX IF NOT EXISTS "Surebet_userId_idx" ON "Surebet"("userId");
CREATE INDEX IF NOT EXISTS "Surebet_status_idx" ON "Surebet"("status");
CREATE INDEX IF NOT EXISTS "Surebet_betDate_idx" ON "Surebet"("betDate");
CREATE INDEX IF NOT EXISTS "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX IF NOT EXISTS "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- ============================================
-- RLS (Row Level Security) POLICIES
-- ============================================

-- Enable RLS on all tables
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

-- User policies
DROP POLICY IF EXISTS "Users can view own data" ON "User";
CREATE POLICY "Users can view own data" ON "User" FOR SELECT USING (auth.uid()::text = id);

DROP POLICY IF EXISTS "Users can update own data" ON "User";
CREATE POLICY "Users can update own data" ON "User" FOR UPDATE USING (auth.uid()::text = id);

-- Session policies
DROP POLICY IF EXISTS "Users can view own sessions" ON "Session";
CREATE POLICY "Users can view own sessions" ON "Session" FOR SELECT USING (auth.uid()::text = "userId");

-- Subscription policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON "Subscription";
CREATE POLICY "Users can view own subscriptions" ON "Subscription" FOR SELECT USING (auth.uid()::text = "userId");

-- Transaction policies
DROP POLICY IF EXISTS "Users can view own transactions" ON "Transaction";
CREATE POLICY "Users can view own transactions" ON "Transaction" FOR SELECT USING (auth.uid()::text = "userId");

-- Method policies (public read for published)
DROP POLICY IF EXISTS "Published methods are viewable by all" ON "Method";
CREATE POLICY "Published methods are viewable by all" ON "Method" FOR SELECT USING ("isPublished" = true);

-- Spreadsheet policies (public read based on access level)
DROP POLICY IF EXISTS "Spreadsheets viewable based on access" ON "Spreadsheet";
CREATE POLICY "Spreadsheets viewable based on access" ON "Spreadsheet" FOR SELECT USING (true);

-- Calculator policies (public read for active)
DROP POLICY IF EXISTS "Active calculators viewable by all" ON "Calculator";
CREATE POLICY "Active calculators viewable by all" ON "Calculator" FOR SELECT USING ("isActive" = true);

-- UserAccess policies
DROP POLICY IF EXISTS "Users can view own access" ON "UserAccess";
CREATE POLICY "Users can view own access" ON "UserAccess" FOR SELECT USING (auth.uid()::text = "userId");

-- Surebet policies
DROP POLICY IF EXISTS "Users can view own surebets" ON "Surebet";
CREATE POLICY "Users can view own surebets" ON "Surebet" FOR SELECT USING (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Users can create own surebets" ON "Surebet";
CREATE POLICY "Users can create own surebets" ON "Surebet" FOR INSERT WITH CHECK (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Users can update own surebets" ON "Surebet";
CREATE POLICY "Users can update own surebets" ON "Surebet" FOR UPDATE USING (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Users can delete own surebets" ON "Surebet";
CREATE POLICY "Users can delete own surebets" ON "Surebet" FOR DELETE USING (auth.uid()::text = "userId");

-- ============================================
-- COMPLETED
-- ============================================

SELECT 'Database setup completed successfully!' as message;
