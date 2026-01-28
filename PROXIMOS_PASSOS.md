# ⚡ Configuração Rápida - Próximos Passos

## ✅ O que já foi feito:

1. ✅ Arquivo `.env` criado com suas credenciais do Supabase
2. ✅ NEXTAUTH_SECRET gerado automaticamente
3. ✅ Supabase URL e ANON_KEY configurados

## 🔧 O que você precisa fazer agora:

### 1️⃣ Obter a senha do banco de dados

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Settings** → **Database**
3. Role até **Connection String** e copie a senha (ou use a senha que você definiu ao criar o projeto)

### 2️⃣ Obter a Service Role Key

1. No Supabase, vá em **Settings** → **API**
2. Copie a **service_role** key (⚠️ mantenha secreta!)

### 3️⃣ Atualizar o arquivo `.env`

Abra o arquivo `.env` e substitua:

```env
# Substitua [YOUR-PASSWORD] pela senha do banco
DATABASE_URL="postgresql://postgres.lcvplwlxwwftflnqcfzx:[SUA-SENHA-AQUI]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.lcvplwlxwwftflnqcfzx:[SUA-SENHA-AQUI]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Substitua [YOUR-SERVICE-ROLE-KEY] pela service role key
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key-aqui"
```

### 4️⃣ Executar o script SQL no Supabase

1. No Supabase, vá em **SQL Editor**
2. Clique em **New query**
3. Abra o arquivo `supabase_setup.sql` deste projeto
4. Copie **TODO** o conteúdo
5. Cole no editor SQL
6. Clique em **Run** (ou `Ctrl+Enter`)
7. Aguarde a execução (pode levar alguns segundos)

### 5️⃣ Gerar o cliente Prisma

```bash
npx prisma generate
```

### 6️⃣ (Opcional) Verificar a conexão

```bash
npx prisma db pull
```

### 7️⃣ Reiniciar o servidor

Se o servidor já estiver rodando, reinicie:

```bash
# Pressione Ctrl+C para parar
# Depois execute:
npm run dev
```

## 🎯 Verificar se está tudo funcionando

1. Acesse http://localhost:3000
2. Tente criar uma conta
3. Verifique se os dados aparecem no Supabase (**Table Editor** → **User**)

## 🆘 Problemas comuns

### Erro: "Environment variable not found: DATABASE_URL"
- Certifique-se que salvou o arquivo `.env`
- Reinicie o servidor de desenvolvimento

### Erro: "password authentication failed"
- Verifique se a senha no `.env` está correta
- Confirme que está usando a senha do projeto Supabase

### Erro: "relation does not exist"
- Execute o script `supabase_setup.sql` no SQL Editor do Supabase
- Verifique se as tabelas foram criadas em **Table Editor**

## 📋 Checklist Final

- [ ] Senha do banco adicionada no `.env`
- [ ] Service Role Key adicionada no `.env`
- [ ] Script SQL executado no Supabase
- [ ] Tabelas visíveis no Table Editor
- [ ] `npx prisma generate` executado
- [ ] Servidor reiniciado
- [ ] Login/cadastro funcionando

---

**🎉 Depois disso, seu sistema estará 100% configurado e pronto para uso!**
