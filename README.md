# Meu Livro de Receitas - React Native App

Um aplicativo mobile completo para gerenciar receitas culinárias, desenvolvido em React Native com Expo e integração com Supabase.

## 🚀 Funcionalidades

- **Autenticação**: Login e cadastro de usuários
- **Receitas**: Criar, editar, visualizar e excluir receitas
- **Favoritos**: Sistema de curtir receitas
- **Busca**: Pesquisar receitas por título ou ingredientes
- **Perfil**: Gerenciar perfil do usuário
- **Upload de Imagens**: Adicionar fotos às receitas
- **Notificações**: Feedback visual para ações do usuário

## 🛠️ Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- Supabase (Backend)
- Expo Router (Navegação)
- Expo Linear Gradient
- Expo Image Picker
- Expo Notifications

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI
- Conta no Supabase

## 🔧 Configuração do Projeto

### 1. Clone o repositório

```bash
git clone <repository-url>
cd meu-livro-receitas
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configuração do Supabase

#### 3.1. Crie um projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Anote a URL do projeto e a chave anônima (anon key)

#### 3.2. Configure o banco de dados

Execute o seguinte SQL no editor SQL do Supabase:

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

#### 3.3. Configure as variáveis de ambiente

Edite o arquivo `app.json` e substitua os valores de exemplo pelas suas credenciais do Supabase:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://seu-projeto.supabase.co",
      "supabaseAnonKey": "sua-chave-anonima-aqui"
    }
  }
}
```

### 4. Execute o projeto

```bash
npm start
```

## 📱 Estrutura do Projeto

```
src/
├── app/                    # Páginas do app (Expo Router)
│   ├── _layout.tsx        # Layout principal
│   ├── index.tsx          # Página inicial
│   ├── login.tsx          # Tela de login
│   ├── register.tsx       # Tela de cadastro
│   ├── profile.tsx        # Tela de perfil
│   └── recipes/           # Páginas de receitas
│       ├── index.tsx      # Lista de receitas
│       ├── [id].tsx       # Detalhes da receita
│       └── create-edit.tsx # Criar/editar receita
├── context/               # Contextos React
│   └── AuthContext.tsx    # Contexto de autenticação
├── lib/                   # Configurações
│   └── supabaseClient.ts  # Cliente Supabase
└── services/              # Serviços
    └── recipeService.ts   # Serviços de receitas
```

## 🎨 Design System

O app utiliza um tema com cores pastéis e design moderno:

- **Cores principais**: Tons pastéis (rosa, lilás, amarelo)
- **Tipografia**: Fontes system com pesos variados
- **Espaçamento**: Generoso para melhor usabilidade mobile
- **Componentes**: Cards com bordas arredondadas e sombras suaves

## 🔐 Autenticação

O sistema de autenticação utiliza o Supabase Auth com:

- Registro por email e senha
- Login por email e senha
- Gerenciamento de sessão automático
- Proteção de rotas baseada em autenticação

## 📊 Banco de Dados

### Tabelas principais:

1. **recipes**: Armazena as receitas dos usuários
2. **favorites**: Relaciona usuários com receitas favoritas

### Segurança:

- Row Level Security (RLS) habilitado
- Políticas que garantem que usuários só acessem seus próprios dados
- Referências de chave estrangeira para integridade dos dados

## 🚀 Deploy

Para fazer deploy do app:

1. Configure o projeto no Expo
2. Execute `expo build` para gerar os binários
3. Publique nas lojas (App Store/Google Play)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através do email: suporte@meulivroreceitas.com

---

Desenvolvido com ❤️ usando React Native e Supabase
