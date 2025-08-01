# Pitada Perfeita - App de Receitas em React Native

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**Explore, crie e compartilhe suas receitas favoritas.**

Pitada Perfeita é um aplicativo mobile completo, construído com React Native e Expo, que serve como uma comunidade vibrante para amantes da culinária. Ele permite que os usuários descubram, publiquem e organizem receitas de forma simples e intuitiva, com um backend robusto fornecido pelo Supabase.

## 🎨 Galeria do App

|                                  Login                                  |                           Cadastro                            |                                Receitas                                |
| :---------------------------------------------------------------------: | :-----------------------------------------------------------: | :--------------------------------------------------------------------: |
|                    ![Tela de Login](docs/login.png)                     |              ![Tela de Cadastro](docs/cadastro)               |      ![Tela de Receitas](docs/Screenshot_2025-08-01_02-53-47.png)      |
|                              **Detalhes**                               |                         **Favoritos**                         |                           **Criar Receita**                            |
| ![Tela de Detalhes da Receita](docs/Screenshot_2025-08-01_03-17-33.png) | ![Tela de Favoritos](docs/Screenshot_2025-08-01_02-53-57.png) | ![Tela de Criação de Receita](docs/Screenshot_2025-08-01_03-20-23.png) |

## 🚀 Funcionalidades

- **Autenticação de Usuários**: Sistema completo de cadastro e login com Supabase Auth.
- **Gerenciamento de Receitas (CRUD)**: Crie, edite, visualize e apague suas próprias receitas.
- **Comunidade**: Veja receitas publicadas por outros usuários da plataforma.
- **Sistema de Favoritos**: Salve suas receitas preferidas para acesso rápido.
- **Busca Inteligente**: Pesquise receitas por título de forma eficiente.
- **Perfil de Usuário**: Visualize e edite suas informações de perfil.
- **Upload de Imagens**: Adicione fotos às suas receitas usando o Supabase Storage.
- **Navegação por Abas**: Interface organizada com acesso rápido às seções principais do app.

## 🛠️ Tecnologias Utilizadas

- **React Native**: Estrutura principal para o desenvolvimento multiplataforma.
- **Expo**: Ecossistema para facilitar o desenvolvimento, build e deploy.
- **TypeScript**: Para um código mais robusto e escalável.
- **Supabase**: Backend completo com banco de dados PostgreSQL, autenticação e armazenamento.
- **Expo Router**: Sistema de navegação baseado em arquivos, otimizado para o ecossistema Expo.
- **Expo Image Picker**: Para seleção de imagens da galeria do usuário.

## 🔧 Configuração e Execução

### 1. Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Uma conta gratuita no [Supabase](https://supabase.com).

### 2. Clone o Repositório

```bash
git clone <url-do-seu-repositorio>
cd pitada-perfeita
```

### 3. Instale as Dependências

```bash
npm install
```

### 4. Configure o Supabase

#### 4.1. Crie o Projeto

1.  Acesse sua conta no **Supabase**.
2.  Crie um novo projeto e guarde a **URL do Projeto** e a **Chave Anônima (anon key)**.

### 5. Configure as Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do seu projeto e adicione as suas credenciais do Supabase:

```env
EXPO_PUBLIC_SUPABASE_URL="SUA_URL_DO_PROJETO_SUPABASE"
EXPO_PUBLIC_SUPABASE_ANON_KEY="SUA_CHAVE_ANONIMA_SUPABASE"
```

### 6. Execute o Projeto

```bash
npm start
```

Abra o aplicativo no seu celular usando o app Expo Go ou execute em um emulador.

## 📱 Estrutura do Projeto

A estrutura de arquivos foi organizada para escalar, utilizando a navegação baseada em arquivos do Expo Router.

```
src/
├── app/                      # Rotas e telas da aplicação
│   ├── (tabs)/               # Layout principal com navegação por abas
│   │   ├── _layout.tsx       # Define a estrutura das abas (NavBar)
│   │   ├── about.tsx         # Tela "Sobre"
│   │   ├── profile.tsx       # Tela "Perfil"
│   │   └── recipes/          # Navegação em pilha para a seção de receitas
│   │       ├── _layout.tsx   # Define a pilha (Receitas -> Detalhes)
│   │       ├── [id].tsx      # Tela de detalhes da receita
│   │       ├── create-edit.tsx # Tela de criação/edição
│   │       └── index.tsx     # Tela de listagem de receitas
│   ├── _layout.tsx           # Layout raiz (provedor de autenticação)
│   ├── edit-profile.tsx      # Tela modal para editar perfil
│   ├── index.tsx             # Tela inicial (boas-vindas/login)
│   └── login.tsx             # Tela de login
│   └── register.tsx          # Tela de cadastro
│
├── assets/                   # Fontes e imagens estáticas
├── components/               # Componentes reutilizáveis
├── context/                  # Contextos React (ex: AuthContext)
├── lib/                      # Configuração de bibliotecas (ex: Supabase)
└── services/                 # Lógica de negócio (ex: recipeService)
```

## 🎨 Identidade Visual

O aplicativo possui um tema escuro, elegante e convidativo, com foco na legibilidade e na experiência do usuário.

- **Cores Principais**: Fundo em tom de marrom escuro (`#4A2E2A`) com laranja vibrante (`#FF9800`) para botões e destaques, criando um contraste forte e agradável.
- **Tipografia**: Utiliza a fonte padrão do sistema, garantindo ótima legibilidade em qualquer dispositivo.
- **Componentes**: Cards com bordas arredondadas e fundo semitransparente para criar uma sensação de profundidade e organização.

## 🤝 Contribuição

Contribuições são bem-vindas! Se você tem ideias para melhorar o app, sinta-se à vontade para:

1.  Fazer um "Fork" do projeto.
2.  Criar uma nova branch (`git checkout -b feature/MinhaFeature`).
3.  Fazer o commit de suas mudanças (`git commit -m 'Adiciona MinhaFeature'`).
4.  Fazer o "Push" para a branch (`git push origin feature/MinhaFeature`).
5.  Abrir um "Pull Request".

---
