# 🔑 Como Obter as Credenciais Corretas do Supabase

## ❌ Problema Atual
Erro: **"Tenant or user not found"**

Isso significa que a **senha** ou o **formato da URL** no arquivo `.env` está incorreto.

## ✅ Solução: Obter Connection String Correta

### Passo 1: Acessar o Supabase Dashboard

1. Acesse: https://app.supabase.com
2. Faça login
3. Selecione seu projeto: **lcvplwlxwwftflnqcfzx**

### Passo 2: Obter a Connection String

1. No menu lateral, clique em **Settings** (ícone de engrenagem)
2. Clique em **Database**
3. Role a página até encontrar **"Connection string"**
4. Você verá várias abas. Clique na aba **"URI"**

### Passo 3: Copiar as Strings de Conexão

Você verá algo assim:

#### **Session mode (porta 5432)** - Para DIRECT_URL
```
postgresql://postgres.lcvplwlxwwftflnqcfzx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

#### **Transaction mode (porta 6543)** - Para DATABASE_URL
```
postgresql://postgres.lcvplwlxwwftflnqcfzx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Passo 4: Obter a Senha

**Opção A: Se você lembra da senha**
- Use a senha que você definiu ao criar o projeto

**Opção B: Se esqueceu a senha**
1. Na mesma página (**Settings** → **Database**)
2. Role até **"Database password"**
3. Clique em **"Reset database password"**
4. Copie a nova senha gerada
5. **⚠️ IMPORTANTE:** Salve essa senha em um lugar seguro!

### Passo 5: Atualizar o arquivo `.env`

Abra o arquivo `.env` e atualize estas linhas:

```env
# Substitua [YOUR-PASSWORD] pela senha real (SEM colchetes!)
DATABASE_URL="postgresql://postgres.lcvplwlxwwftflnqcfzx:SUA_SENHA_AQUI@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

DIRECT_URL="postgresql://postgres.lcvplwlxwwftflnqcfzx:SUA_SENHA_AQUI@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

**⚠️ ATENÇÃO:**
- Remova os colchetes `[` e `]`
- Não deixe espaços antes ou depois da senha
- A senha é case-sensitive (maiúsculas e minúsculas importam)

### Passo 6: Obter a Service Role Key (Opcional mas Recomendado)

1. No Supabase, vá em **Settings** → **API**
2. Role até **"Project API keys"**
3. Copie a chave **"service_role"** (não a "anon"!)
4. Cole no `.env`:

```env
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key-aqui"
```

### Passo 7: Testar Novamente

Depois de atualizar o `.env`, execute:

```bash
node test-db-connection.mjs
```

Se der certo, você verá:
```
✅ Conexão estabelecida com sucesso!
✅ Query executada com sucesso!
✅ Tabelas encontradas:
```

## 🎯 Checklist

- [ ] Acessei o Supabase Dashboard
- [ ] Fui em Settings → Database
- [ ] Copiei a Connection String (URI format)
- [ ] Obtive/resetei a senha do banco
- [ ] Atualizei DATABASE_URL no `.env` com a senha correta
- [ ] Atualizei DIRECT_URL no `.env` com a senha correta
- [ ] Removi os colchetes `[YOUR-PASSWORD]`
- [ ] Salvei o arquivo `.env`
- [ ] Executei `node test-db-connection.mjs`

## 🆘 Se Ainda Não Funcionar

### Teste 1: Verificar se o projeto está ativo
- No Supabase Dashboard, veja se o projeto está com status "Active"
- Se estiver "Paused", clique em "Restore"

### Teste 2: Verificar se as tabelas foram criadas
1. No Supabase, vá em **Table Editor**
2. Você deve ver as tabelas: User, Session, Subscription, etc.
3. Se não vê nenhuma tabela, execute o script `supabase_setup.sql` no **SQL Editor**

### Teste 3: Testar conexão direta
Tente usar apenas a DIRECT_URL temporariamente:

No arquivo `.env`, comente a DATABASE_URL e use apenas DIRECT_URL:
```env
# DATABASE_URL="..."
DIRECT_URL="postgresql://postgres.lcvplwlxwwftflnqcfzx:SUA_SENHA@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

No `schema.prisma`, temporariamente use:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DIRECT_URL")
}
```

Execute novamente: `node test-db-connection.mjs`

---

## 📸 Exemplo Visual

Quando você estiver em **Settings → Database**, procure por esta seção:

```
Connection string
┌─────────────────────────────────────────┐
│ URI  │  JDBC  │  .NET  │  Golang  │     │
├─────────────────────────────────────────┤
│ Session mode                            │
│ postgresql://postgres.lcvplwlxwwftfl... │
│                                         │
│ Transaction mode                        │
│ postgresql://postgres.lcvplwlxwwftfl... │
└─────────────────────────────────────────┘
```

Copie exatamente como está mostrado, depois substitua `[YOUR-PASSWORD]` pela sua senha real.

---

**💡 Dica:** Se você me enviar a Connection String (COM `[YOUR-PASSWORD]` no lugar da senha real), posso ajudar a formatar corretamente!
