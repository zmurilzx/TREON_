# 🔧 Obter Connection String Correta do Supabase

## Passo a Passo

1. Acesse https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Settings** → **Database**
4. Role até **"Connection string"**
5. Clique na aba **"URI"**

## Copie EXATAMENTE o que está escrito

Você verá duas opções:

### Session mode (porta 5432)
```
postgresql://postgres.lcvplwlxwwftflnqcfzx:[YOUR-PASSWORD]@...
```

### Transaction mode (porta 6543)
```
postgresql://postgres.lcvplwlxwwftflnqcfzx:[YOUR-PASSWORD]@...
```

## ⚠️ IMPORTANTE

**Me envie a connection string COMPLETA** que aparece no Supabase (pode deixar `[YOUR-PASSWORD]` no lugar da senha).

Exemplo do que eu preciso ver:
```
postgresql://postgres.lcvplwlxwwftflnqcfzx:[YOUR-PASSWORD]@db.exemplo.supabase.co:5432/postgres
```

O problema pode estar no **host** (a parte depois do @). Estou usando:
```
aws-0-us-east-1.pooler.supabase.com
```

Mas pode ser que o correto seja diferente, como:
- `db.lcvplwlxwwftflnqcfzx.supabase.co`
- `aws-0-sa-east-1.pooler.supabase.com`
- Ou outro formato

## 📋 O que fazer agora

1. Abra o Supabase Dashboard
2. Vá em Settings → Database → Connection string → URI
3. Copie a string **Session mode** completa
4. Cole aqui (pode deixar [YOUR-PASSWORD])
5. Eu vou atualizar o `.env` com o formato correto

---

**Aguardando a connection string do Supabase!** 🔍
