# 🚀 Guia de Configuração do Supabase

Este guia explica como configurar o banco de dados Supabase para a plataforma TREON.

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Projeto criado no Supabase

## 🔧 Passo a Passo

### 1️⃣ Criar Projeto no Supabase

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: `treon-betting-platform`
   - **Database Password**: Escolha uma senha forte (anote!)
   - **Region**: Escolha a região mais próxima (ex: `South America (São Paulo)`)
4. Clique em **"Create new project"**
5. Aguarde alguns minutos até o projeto ser provisionado

### 2️⃣ Executar o Script SQL

1. No painel do Supabase, vá em **SQL Editor** (menu lateral)
2. Clique em **"New query"**
3. Abra o arquivo `supabase_setup.sql` deste projeto
4. Copie **TODO** o conteúdo do arquivo
5. Cole no editor SQL do Supabase
6. Clique em **"Run"** (ou pressione `Ctrl+Enter`)
7. Aguarde a execução (pode levar alguns segundos)

### 3️⃣ Verificar Instalação

Após executar o script, você deve ver:

✅ **Tabelas criadas** (12 tabelas):
- User
- Session
- VerificationToken
- Subscription
- Transaction
- PaymentEvent
- Method
- Spreadsheet
- Calculator
- UserAccess
- Surebet
- AuditLog

✅ **Enums criados** (9 enums):
- UserRole
- TokenType
- PlanType
- SubscriptionStatus
- TransactionType
- TransactionStatus
- AccessLevel
- ContentType
- AccessSource
- BetStatus

Para verificar, vá em **Table Editor** no menu lateral e veja todas as tabelas listadas.

### 4️⃣ Obter Credenciais de Conexão

1. No Supabase, vá em **Settings** → **Database**
2. Copie a **Connection String** (formato: `postgresql://...`)
3. Ou vá em **Settings** → **API** e copie:
   - **Project URL**
   - **anon/public key**
   - **service_role key** (⚠️ mantenha secreta!)

### 5️⃣ Configurar Variáveis de Ambiente

Atualize o arquivo `.env` na raiz do projeto:

```env
# Supabase Database
DATABASE_URL="postgresql://postgres:[SUA-SENHA]@db.[SEU-PROJETO-ID].supabase.co:5432/postgres"

# Ou use a URL direta do Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[SEU-PROJETO-ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-anon-key-aqui"
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key-aqui"
```

**Onde encontrar:**
- `[SUA-SENHA]`: A senha que você definiu ao criar o projeto
- `[SEU-PROJETO-ID]`: Visível na URL do projeto (ex: `abcdefghijklmnop`)
- `anon-key` e `service-role-key`: Em **Settings** → **API**

### 6️⃣ Sincronizar Prisma com Supabase

```bash
# Gerar o cliente Prisma
npx prisma generate

# (Opcional) Verificar se o schema está sincronizado
npx prisma db pull
```

### 7️⃣ Criar Usuário Admin (Opcional)

Execute este SQL no **SQL Editor** do Supabase para criar um usuário admin de teste:

```sql
-- Inserir usuário admin
INSERT INTO "User" (
  "id",
  "email",
  "passwordHash",
  "name",
  "birthDate",
  "isVerified",
  "role",
  "createdAt",
  "updatedAt"
) VALUES (
  'admin_' || gen_random_uuid()::text,
  'admin@treon.com',
  '$2a$10$YourHashedPasswordHere', -- Use bcrypt para gerar o hash
  'Administrador',
  '1990-01-01'::timestamp,
  true,
  'ADMIN',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
```

**⚠️ Importante**: Substitua `$2a$10$YourHashedPasswordHere` por um hash bcrypt real. Você pode gerar usando:

```bash
# No terminal do projeto
node -e "console.log(require('bcryptjs').hashSync('SuaSenhaAqui', 10))"
```

## 🔒 Segurança - Row Level Security (RLS)

O script já configura automaticamente as políticas RLS para:

- ✅ Usuários só podem ver/editar seus próprios dados
- ✅ Admins têm acesso total
- ✅ Conteúdo público é acessível a todos
- ✅ Transações e assinaturas são privadas

### Verificar RLS

No Supabase, vá em **Authentication** → **Policies** para ver todas as políticas configuradas.

## 🧪 Testar Conexão

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:3000` e tente:
1. Criar uma conta
2. Fazer login
3. Acessar calculadoras

## 📊 Monitoramento

### Ver Dados no Supabase

1. **Table Editor**: Visualizar e editar dados manualmente
2. **SQL Editor**: Executar queries personalizadas
3. **Database** → **Logs**: Ver logs de queries

### Prisma Studio (Local)

```bash
npx prisma studio
```

Abre interface visual em `http://localhost:5555`

## 🔄 Migrações Futuras

Quando fizer alterações no schema Prisma:

```bash
# 1. Atualizar schema.prisma
# 2. Criar migração
npx prisma migrate dev --name nome_da_migracao

# 3. Aplicar no Supabase
npx prisma db push
```

## 🆘 Troubleshooting

### Erro: "relation does not exist"
- Execute o script SQL novamente
- Verifique se todas as tabelas foram criadas em **Table Editor**

### Erro: "password authentication failed"
- Verifique a senha no `.env`
- Confirme que está usando a senha correta do projeto Supabase

### Erro: "could not connect to server"
- Verifique se o projeto Supabase está ativo
- Confirme a URL de conexão em **Settings** → **Database**

### RLS bloqueando queries
- Verifique as políticas em **Authentication** → **Policies**
- Para desenvolvimento, você pode desabilitar RLS temporariamente (não recomendado):
  ```sql
  ALTER TABLE "NomeDaTabela" DISABLE ROW LEVEL SECURITY;
  ```

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Prisma](https://www.prisma.io/docs)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

## ✅ Checklist de Configuração

- [ ] Projeto criado no Supabase
- [ ] Script SQL executado com sucesso
- [ ] Tabelas visíveis no Table Editor
- [ ] Variáveis de ambiente configuradas no `.env`
- [ ] `npx prisma generate` executado
- [ ] Servidor de desenvolvimento rodando
- [ ] Login/cadastro funcionando
- [ ] Calculadoras acessíveis

---

**🎉 Pronto!** Seu banco de dados Supabase está configurado e pronto para uso.
