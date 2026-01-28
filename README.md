# TREON Betting Platform MVP

Plataforma profissional para apostadores com calculadoras avançadas, planilhas exclusivas, métodos mensais e sistema de pagamentos automatizado via AbacatePay.

## 🚀 Funcionalidades Implementadas

### ✅ Core Infrastructure
- Next.js 14 com TypeScript e Tailwind CSS
- Prisma ORM com PostgreSQL
- Autenticação completa com NextAuth.js
- Sistema de sessões JWT

### ✅ Autenticação
- Registro de usuários com validação de idade (18+)
- Validação de senha forte (8+ caracteres, maiúscula, minúscula, número)
- Login com NextAuth
- Proteção de rotas

### ✅ Dashboard
- Painel principal com overview de performance
- Cards de acesso rápido para ferramentas
- Estatísticas de uso
- CTA para upgrade VIP

### ✅ Calculadoras
1. **Odds Converter**
   - Conversão entre formatos: Decimal, Fracionário, Americano
   - Cálculo de probabilidade implícita
   - Interface intuitiva

2. **Staking Calculator**
   - Três métodos: Flat, Percentual, Kelly Criterion
   - Cálculo de stake ideal baseado na banca
   - Estimativa de lucro potencial

3. **ROI Estimator**
   - Análise de retorno sobre investimento
   - Cálculo de lucro/prejuízo
   - Odd média e performance por aposta
   - Guia de interpretação de resultados

### ✅ Pagamentos (AbacatePay)
- Integração completa com AbacatePay API
- Webhook handler com verificação HMAC
- Processamento idempotente de eventos
- Liberação automática de acesso
- Sistema de dunning para pagamentos falhados

## 📋 Pré-requisitos

- Node.js 20.x ou superior
- PostgreSQL 14+ instalado e rodando
- Conta AbacatePay (dev mode para testes)

## 🛠️ Instalação

### 1. Clone o repositório
```bash
cd TREON
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados

Crie um banco PostgreSQL:
```sql
CREATE DATABASE treon_betting;
```

### 4. Configure as variáveis de ambiente

Copie o arquivo `.env.example` e renomeie para `.env`:
```bash
copy .env.example .env
```

Edite o `.env` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/treon_betting?schema=public"

# NextAuth
NEXTAUTH_SECRET="gere-uma-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"

# AbacatePay (use dev mode para testes)
ABACATEPAY_API_KEY="sua-api-key-aqui"
ABACATEPAY_WEBHOOK_SECRET="seu-webhook-secret"
ABACATEPAY_ENV="development"

# AWS S3 (opcional para MVP)
AWS_S3_BUCKET=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="us-east-1"

# Email (opcional para MVP)
RESEND_API_KEY=""
EMAIL_FROM="noreply@treon.com"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="TREON Betting Platform"
```

**Gerar NEXTAUTH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 5. Execute as migrações do banco
```bash
npx prisma migrate dev --name init
```

### 6. (Opcional) Popule o banco com dados de teste
```bash
npx prisma db seed
```

## 🚀 Executando a Aplicação

### Modo de Desenvolvimento
```bash
npm run dev
```

Acesse: http://localhost:3000

### Build de Produção
```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
TREON/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Autenticação
│   │   │   ├── [...nextauth]/   # NextAuth handler
│   │   │   └── register/        # Registro de usuários
│   │   └── webhooks/            # Webhooks
│   │       └── abacatepay/      # Webhook AbacatePay
│   ├── auth/                     # Páginas de autenticação
│   │   ├── login/
│   │   └── register/
│   ├── calculators/              # Calculadoras
│   │   ├── odds-converter/
│   │   ├── staking/
│   │   └── roi-estimator/
│   ├── dashboard/                # Dashboard do usuário
│   ├── layout.tsx                # Layout raiz
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Estilos globais
├── lib/                          # Bibliotecas e utilitários
│   ├── prisma.ts                 # Cliente Prisma
│   ├── abacatepay.ts             # Serviço AbacatePay
│   └── auth.ts                   # Utilitários de autenticação
├── prisma/
│   └── schema.prisma             # Schema do banco de dados
├── types/
│   └── next-auth.d.ts            # Tipos TypeScript
├── .env.example                  # Template de variáveis de ambiente
├── package.json
└── README.md
```

## 🗄️ Modelos do Banco de Dados

### User
- Informações do usuário
- Senha hash (bcrypt)
- Verificação de idade (18+)
- Role (USER/ADMIN)

### Subscription
- Assinaturas ativas/expiradas
- Planos (MONTHLY_METHOD, VIP_TIER_1, etc.)
- Integração com AbacatePay

### Transaction
- Histórico de pagamentos
- Status (PENDING, COMPLETED, FAILED)
- Idempotency key

### PaymentEvent
- Log de webhooks
- Processamento idempotente
- Retry tracking

### Method, Spreadsheet, Calculator
- Conteúdo da plataforma
- Níveis de acesso (FREE, PAID, VIP)

### UserAccess
- Controle de acesso a conteúdo
- Expiração automática
- Fonte (PURCHASE, SUBSCRIPTION, ADMIN_GRANT)

## 🔐 Segurança

- ✅ Senhas hash com bcrypt (salt rounds: 12)
- ✅ Sessões JWT com NextAuth
- ✅ Verificação HMAC de webhooks
- ✅ Headers de segurança (X-Frame-Options, CSP, etc.)
- ✅ Validação de idade (18+)
- ✅ Proteção de rotas autenticadas
- ✅ Processamento idempotente de pagamentos

## 🧪 Testando a Aplicação

### 1. Criar uma conta
1. Acesse http://localhost:3000
2. Clique em "Criar Conta"
3. Preencha o formulário (use data de nascimento com 18+ anos)
4. Faça login

### 2. Testar Calculadoras
1. Acesse http://localhost:3000/calculators
2. Teste cada calculadora:
   - **Odds Converter**: Converta 2.50 (decimal) para fracionário e americano
   - **Staking**: Calcule stake com banca de R$ 1000 e 5% percentual
   - **ROI Estimator**: Analise ROI com R$ 1000 apostado e R$ 1200 retornado

### 3. Testar Webhooks (Sandbox AbacatePay)
1. Configure ngrok: `ngrok http 3000`
2. Configure webhook no AbacatePay: `https://seu-ngrok-url.ngrok.io/api/webhooks/abacatepay`
3. Faça um pagamento teste
4. Verifique logs no console

## 📊 Próximos Passos (Roadmap)

### Sprint Atual
- [ ] Implementar área de métodos mensais
- [ ] Sistema de upload de planilhas
- [ ] Painel admin completo
- [ ] Integração de email (Resend)

### Próximas Sprints
- [ ] Sistema de assinaturas recorrentes
- [ ] Jobs agendados (expiração, dunning)
- [ ] Gestão de conteúdo (CMS)
- [ ] Armazenamento S3 para arquivos
- [ ] Testes automatizados
- [ ] Deploy em produção

## 🐛 Troubleshooting

### Erro: "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### Erro: "Database connection failed"
Verifique se o PostgreSQL está rodando e as credenciais no `.env` estão corretas.

### Erro: "Invalid signature" no webhook
Verifique se o `ABACATEPAY_WEBHOOK_SECRET` no `.env` corresponde ao configurado no AbacatePay.

## 📝 Licença

Propriedade privada. Todos os direitos reservados.

## 👥 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para apostadores profissionais**
