# 🔧 Guia de Troubleshooting - Erro de Conexão

## ❌ Erro Encontrado:
```
FATAL: Tenant or user not found
```

Este erro geralmente ocorre quando:
1. A senha do banco de dados está incorreta
2. O formato da URL de conexão está errado
3. O projeto Supabase não está ativo

## 🔍 Como Resolver:

### Opção 1: Obter a Connection String Correta do Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Settings** → **Database**
4. Role até **Connection String**
5. Selecione a aba **URI**
6. Copie a string completa (ela já vem com a estrutura correta)

**Exemplo do formato correto:**
```
postgresql://postgres.lcvplwlxwwftflnqcfzx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Opção 2: Usar Connection Pooling vs Direct Connection

O Supabase oferece dois tipos de conexão:

**Connection Pooling (porta 6543)** - Para aplicações serverless:
```env
DATABASE_URL="postgresql://postgres.lcvplwlxwwftflnqcfzx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**Direct Connection (porta 5432)** - Para Prisma migrations:
```env
DIRECT_URL="postgresql://postgres.lcvplwlxwwftflnqcfzx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

### Opção 3: Atualizar o schema.prisma

Adicione suporte para ambas as URLs:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## ✅ Passo a Passo para Corrigir:

### 1. Obter a senha correta

No Supabase Dashboard:
- **Settings** → **Database** → **Database password**
- Se esqueceu a senha, você pode resetá-la clicando em **Reset database password**

### 2. Atualizar o arquivo `.env`

Substitua as URLs com os valores corretos do Supabase:

```env
# Use a Connection String exata do Supabase
DATABASE_URL="postgresql://postgres.lcvplwlxwwftflnqcfzx:[SUA-SENHA]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct URL para migrations
DIRECT_URL="postgresql://postgres.lcvplwlxwwftflnqcfzx:[SUA-SENHA]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

### 3. Testar a conexão

Execute o script de teste:

```bash
node test-db-connection.mjs
```

### 4. Se ainda não funcionar, tente o formato alternativo:

No Supabase, vá em **Settings** → **Database** e copie:
- **Host**: `aws-0-us-east-1.pooler.supabase.com`
- **Database name**: `postgres`
- **Port**: `5432` (direct) ou `6543` (pooler)
- **User**: `postgres.lcvplwlxwwftflnqcfzx`
- **Password**: [sua senha]

Monte a URL manualmente:
```
postgresql://postgres.lcvplwlxwwftflnqcfzx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

## 🧪 Testar Novamente

Depois de atualizar o `.env`:

```bash
# Testar com o script
node test-db-connection.mjs

# Ou testar com Prisma
npx prisma db pull
```

## 📋 Checklist de Verificação

- [ ] Senha do banco está correta no `.env`
- [ ] URL de conexão está no formato correto
- [ ] Projeto Supabase está ativo
- [ ] Script SQL foi executado no Supabase
- [ ] Tabelas estão visíveis no Table Editor do Supabase
- [ ] Arquivo `.env` foi salvo

## 💡 Dica Extra

Se você acabou de executar o script SQL, aguarde alguns segundos para o Supabase processar todas as mudanças antes de tentar conectar novamente.

---

**Precisa de ajuda?** Me avise qual erro específico você está vendo!
