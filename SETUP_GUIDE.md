# 🚀 Guia de Configuração - Meu Livro de Receitas

Este guia irá te ajudar a configurar o Supabase para o aplicativo "Meu Livro de Receitas".

## 📋 Passo a Passo para Configurar o Supabase

### 1. Criar Conta no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub, Google ou crie uma conta com email

### 2. Criar Novo Projeto

1. No dashboard, clique em "New Project"
2. Escolha uma organização (ou crie uma nova)
3. Preencha os dados do projeto:
   - **Name**: `meu-livro-receitas`
   - **Database Password**: Crie uma senha forte (anote ela!)
   - **Region**: Escolha a região mais próxima (ex: South America)
4. Clique em "Create new project"
5. Aguarde alguns minutos para o projeto ser criado

### 3. Obter as Credenciais

1. No dashboard do seu projeto, vá para **Settings** > **API**
2. Você verá duas informações importantes:
   - **Project URL**: `https://seu-projeto-id.supabase.co`
   - **anon public key**: Uma chave longa que começa com `eyJ...`

### 4. Configurar o Banco de Dados

1. No dashboard, vá para **SQL Editor**
2. Clique em "New query"
3. Cole o seguinte código SQL:

```sql
-- Habilitar RLS (Row Level Security)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Tabela de receitas
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  cuisine VARCHAR(100)
);

-- Tabela de favoritos
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- Habilitar RLS nas tabelas
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para receitas
CREATE POLICY "Usuários podem ver todas as receitas" ON recipes
  FOR SELECT USING (true);

CREATE POLICY "Usuários podem inserir suas próprias receitas" ON recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias receitas" ON recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias receitas" ON recipes
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para favoritos
CREATE POLICY "Usuários podem ver seus próprios favoritos" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios favoritos" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios favoritos" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Índices para melhor performance
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_recipe_id ON favorites(recipe_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at na tabela recipes
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. Clique em "Run" para executar o script
5. Você deve ver a mensagem "Success. No rows returned"

### 5. Configurar Autenticação

1. Vá para **Authentication** > **Settings**
2. Em **Site URL**, adicione: `exp://localhost:8081` (para desenvolvimento)
3. Em **Redirect URLs**, adicione: `exp://localhost:8081`
4. Salve as configurações

### 6. Configurar o App

1. Abra o arquivo `app.json` no seu projeto
2. Substitua os valores de exemplo pelas suas credenciais:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://seu-projeto-id.supabase.co",
      "supabaseAnonKey": "sua-chave-anonima-aqui"
    }
  }
}
```

**Exemplo real:**
```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://abcdefghijklmnop.supabase.co",
      "supabaseAnonKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5..."
    }
  }
}
```

### 7. Testar a Configuração

1. Execute o app: `npm start`
2. Abra no simulador ou dispositivo
3. Tente criar uma conta na tela de cadastro
4. Se tudo estiver correto, você receberá um email de confirmação

## 🔧 Solução de Problemas

### Erro: "Invalid API key"
- Verifique se copiou a chave corretamente
- Certifique-se de usar a "anon public key", não a "service_role key"

### Erro: "Database connection failed"
- Verifique se a URL do projeto está correta
- Certifique-se de que o projeto Supabase está ativo

### Erro: "Row Level Security"
- Verifique se executou todo o script SQL
- Confirme se as políticas RLS foram criadas corretamente

### Email de confirmação não chega
- Verifique a pasta de spam
- No Supabase, vá para Auth > Settings e configure um provedor de email personalizado

## 📞 Precisa de Ajuda?

Se você encontrar problemas:

1. Verifique a documentação do Supabase: [https://supabase.com/docs](https://supabase.com/docs)
2. Consulte os logs no dashboard do Supabase
3. Verifique o console do React Native para erros específicos

## ✅ Checklist Final

- [ ] Projeto Supabase criado
- [ ] Credenciais copiadas para app.json
- [ ] Script SQL executado com sucesso
- [ ] Configurações de autenticação definidas
- [ ] App testado com cadastro de usuário

Parabéns! Seu app está configurado e pronto para uso! 🎉
