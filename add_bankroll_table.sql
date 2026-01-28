-- Adicionar tabela Bankroll para planilha de gestão de banca

CREATE TABLE IF NOT EXISTS "Bankroll" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bancaInicial" DOUBLE PRECISION NOT NULL,
    "metaMensal" DOUBLE PRECISION NOT NULL,
    "rows" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bankroll_pkey" PRIMARY KEY ("id")
);

-- Criar índice para userId
CREATE INDEX IF NOT EXISTS "Bankroll_userId_idx" ON "Bankroll"("userId");

-- Criar constraint unique para userId (cada usuário tem apenas uma planilha)
CREATE UNIQUE INDEX IF NOT EXISTS "Bankroll_userId_key" ON "Bankroll"("userId");

-- Adicionar foreign key
ALTER TABLE "Bankroll" ADD CONSTRAINT "Bankroll_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Verificar se foi criado corretamente
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'Bankroll'
ORDER BY ordinal_position;
