# ⚠️ Checklist de Diagnóstico - Erro "Tenant or user not found"

## Status Atual
❌ Conexão falhou tanto com pooler (porta 6543) quanto com conexão direta (porta 5432)

## 🔍 Possíveis Causas

### 1. ❓ Você executou o script SQL no Supabase?

**IMPORTANTE:** Antes de conectar, você PRECISA executar o script `supabase_setup.sql` no Supabase!

#### Como fazer:
1. Acesse https://app.supabase.com
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**
4. Clique em **"New query"**
5. Abra o arquivo `supabase_setup.sql` deste projeto
6. Copie TODO o conteúdo (Ctrl+A, Ctrl+C)
7. Cole no SQL Editor do Supabase
8. Clique em **"Run"** (ou Ctrl+Enter)
9. Aguarde a execução (pode levar 10-30 segundos)

**✅ Você deve ver:** "Success. No rows returned"

### 2. ❓ O projeto Supabase está ativo?

1. No Supabase Dashboard
2. Veja o status do projeto no topo
3. Se estiver **"Paused"**, clique em **"Restore"**
4. Aguarde alguns minutos para o projeto ficar ativo

### 3. ❓ A senha está correta?

A senha que você me passou: `GCZySr0IUFhEIAWq`

**Verifique:**
1. No Supabase, vá em **Settings** → **Database**
2. Role até **"Database password"**
3. Clique em **"Reset database password"** se tiver dúvida
4. Copie a nova senha e me informe

### 4. ❓ O formato da URL está correto?

Vamos verificar se a URL está no formato certo.

**No Supabase:**
1. Vá em **Settings** → **Database**
2. Role até **"Connection string"**
3. Clique na aba **"URI"**
4. Você deve ver algo como:

```
Session mode:
postgresql://postgres.lcvplwlxwwftflnqcfzx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres

Transaction mode:
postgresql://postgres.lcvplwlxwwftflnqcfzx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**⚠️ IMPORTANTE:** Me envie exatamente o que você vê (pode deixar [YOUR-PASSWORD] no lugar da senha)

## 🎯 Próximos Passos

Por favor, me informe:

- [ ] Você executou o script `supabase_setup.sql` no SQL Editor? (Sim/Não)
- [ ] O projeto está com status "Active"? (Sim/Não)
- [ ] Você consegue ver as tabelas no Table Editor? (Sim/Não)
- [ ] A Connection String do Supabase (copie e cole aqui, pode deixar [YOUR-PASSWORD])

## 💡 Teste Rápido

Se você executou o script SQL, tente isto:

1. No Supabase, vá em **Table Editor**
2. Você deve ver várias tabelas: User, Session, Subscription, etc.
3. Se não vê nenhuma tabela, o script SQL não foi executado!

---

**Aguardando suas respostas para continuar o diagnóstico!** 🔍
