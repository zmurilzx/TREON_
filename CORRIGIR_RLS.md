# Como Corrigir o Erro de RLS no Supabase

## Problema
O erro **"new row violates row-level security policy"** ocorre porque as políticas de segurança RLS (Row Level Security) estão bloqueando operações necessárias no banco de dados.

## Solução

### Passo 1: Acessar o Supabase
1. Acesse https://supabase.com
2. Faça login na sua conta
3. Selecione o projeto TREON

### Passo 2: Abrir o SQL Editor
1. No menu lateral, clique em **SQL Editor**
2. Clique em **New query** para criar uma nova consulta

### Passo 3: Executar o Script de Correção
1. Abra o arquivo `fix_rls_policies.sql` neste projeto
2. Copie todo o conteúdo do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** ou pressione `Ctrl + Enter`

### Passo 4: Verificar se Funcionou
Após executar o script, você verá uma lista de políticas criadas. Volte para a aplicação e tente fazer upload da foto novamente.

## O Que o Script Faz

O script adiciona as seguintes políticas RLS:

- ✅ **User**: Permite que usuários atualizem seus próprios dados (incluindo foto)
- ✅ **User**: Permite criação de novos usuários (registro)
- ✅ **Session**: Permite criação e atualização de sessões
- ✅ **VerificationToken**: Permite operações com tokens de verificação
- ✅ **Transaction**: Permite que o sistema crie e atualize transações
- ✅ **Subscription**: Permite que o sistema gerencie assinaturas
- ✅ **PaymentEvent**: Permite que o sistema processe eventos de pagamento
- ✅ **UserAccess**: Permite que o sistema gerencie acessos
- ✅ **AuditLog**: Permite que o sistema crie logs de auditoria

## Alternativa: Desabilitar RLS Temporariamente (NÃO RECOMENDADO)

Se você quiser apenas testar rapidamente, pode desabilitar o RLS temporariamente:

```sql
-- ATENÇÃO: Isso remove a segurança! Use apenas para testes!
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
```

Para reabilitar depois:

```sql
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
```

## Próximos Passos

Após corrigir o RLS, você poderá:
- ✅ Fazer upload de fotos de perfil
- ✅ Atualizar informações pessoais
- ✅ Criar novos usuários (registro)
- ✅ Gerenciar sessões normalmente
