# TrilhaJusta (mobile)

Este repositório contém o cliente móvel do projeto TrilhaJusta — um aplicativo React Native usando Expo que consome a API Java Spring Boot em /api/v1.

Conteúdo
- Visão geral
- Pré-requisitos
- Variáveis de ambiente (.env)
- Como rodar (desenvolvimento)
- Smoke-test da API
- Abrir no navegador / emulador
- Troubleshooting rápido
- Notas e próximas ações


Visão geral
----------
O app móvel serve como cliente para a API Java (Spring Boot). Funcionalidades chave:
- Autenticação via JWT (signup/login).
- Listagem de trilhas e cursos.
- Listagem de vagas e candidatura a vagas.
- Gestão de candidaturas e competências do usuário.

Pré-requisitos
--------------
- Node.js (recomendado v18+)
- npm (ou yarn) — este projeto usou npm
- Expo CLI (opcional, mas útil): `npm install -g expo-cli`
- Backend Java (API) rodando e acessível pela rede — o app consome endpoints em `/api/v1`
- Para testar em Android: Android SDK / Emulador configurado
- Para testar em iOS: dispositivo ou simulador macOS

Variáveis de ambiente (.env)
---------------------------
Crie um arquivo `.env` na raiz do projeto (já existe `.env.example`). Variáveis úteis:

- `EXPO_PUBLIC_API_URL` — URL base da API incluindo `/api/v1` (ex: `http://localhost:8080/api/v1` ou `http://192.168.0.10:8080/api/v1`).
- `EXPO_PUBLIC_API_TOKEN` — token JWT estático para testes manuais (opcional).
- `EXPO_PUBLIC_DEFAULT_USER_ID` — ID de usuário de demonstração (opcional, ex: `1`).
- `EXPO_ENABLE_DEV_AUTH` — se `true`, o app usará um token de desenvolvimento quando o backend estiver inacessível (útil para desenvolvimento local). Padrão: `false`.
- `EXPO_SMOKE_EMAIL` e `EXPO_SMOKE_PASS` — credenciais para o script de smoke-test (opcional).

Exemplo mínimo (`.env`):

```properties
EXPO_PUBLIC_API_URL=http://localhost:8080/api/v1
EXPO_PUBLIC_DEFAULT_USER_ID=1
# EXPO_PUBLIC_API_TOKEN=seu_token_aqui
# EXPO_SMOKE_EMAIL=usuario@exemplo.com
# EXPO_SMOKE_PASS=senha
```

Instalação e execução (dev)
--------------------------
No diretório do projeto:

```powershell
# instalar dependências (use --legacy-peer-deps se houver conflitos de peer deps)
npm install --legacy-peer-deps

# iniciar Expo (Metro)
npm start
```

No terminal do Expo:
- pressione `w` para abrir no navegador web;
- pressione `a` para abrir em um emulador Android conectado;
- escaneie o QR code com Expo Go (Android) ou a câmera do iOS.

Smoke-test automático (útil para validar backend)
------------------------------------------------
Um script de smoke-test foi adicionado para testar autenticação e `/trilhas`:

```powershell
npm run smoke-test
```

O script (`scripts/smoke-test.js`) usa as variáveis `.env`: `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_API_TOKEN` ou `EXPO_SMOKE_EMAIL`/`EXPO_SMOKE_PASS`.

Abrir no navegador (web)
------------------------
Com o Expo rodando (com `npm start`), pressione `w` no terminal do Expo para abrir o app no navegador (localhost:8081). Se preferir, abra manualmente:

http://localhost:8081

Abrir em Android
----------------
- Pressione `a` no terminal do Expo (requer emulador/adb configurado).

Troubleshooting rápido
----------------------
- Erro de CORS / conexão: verifique `EXPO_PUBLIC_API_URL` e se a máquina que roda o backend está acessível na mesma rede.
- Token/Autenticação: confirme o formato retornado por `POST /auth/login` (espera-se `{ token: string }` ou `accessToken`).
- Dependências: o repositório foi instalado com `--legacy-peer-deps` para contornar conflitos; considerar atualizar as dependências do Expo se necessário.
- Avisos do Expo no terminal (por exemplo, falta de `google-services.json` para notificações): essas são mensagens informativas — o app ainda pode rodar sem os arquivos de config do Firebase para alguns fluxos.
- Rota faltando export default: se vir warning como "Route ./types.ts is missing the required default export", verifique os arquivos de rota que não exportam componentes padrão.

Próximos passos recomendados
---------------------------
1. Garantir que o backend Java esteja rodando e acessível na URL definida em `.env`.
2. Rodar `npm run smoke-test` para validar autenticação e listagem de trilhas.
3. Abrir o app no navegador (`w`) e verificar telas principais (login, trilhas, vagas, perfil, candidaturas).
4. Atualizar dependências do Expo quando conveniente para alinhar as versões recomendadas.

Integrantes do Grupo
---------------
 RM556652 -  Miguel Barros - turma 2TDSPG
 RM555323 - Thomaz Bartol - turma 2TDSPG
 RM556826 - Pedro Valentim - turma 2TDSPG

## Stack

- Expo SDK 54
- React Native 0.81
- Expo Router 6
- React Navigation
- Axios (via `src/services/axiosApi.ts`)
- Context API para autenticação (`AuthProvider`)
- Integração com API Java (Usuários, Competências, Trilhas, Cursos, Vagas e Candidaturas)

## Principais Telas

- **Onboarding** (`app/index.tsx`)
- **Login / Cadastro** (`app/auth/login.tsx`, `app/auth/register.tsx`)
- **Dashboard** (`app/(tabs)/index.tsx`)
- **Trilhas & Cursos** (`app/(tabs)/trilhas.tsx`)
- **Vagas & Candidatura** (`app/(tabs)/vagas.tsx`)
- **Perfil & Competências** (`app/(tabs)/perfil.tsx`)
- **Minhas Candidaturas** (`app/candidaturas/index.tsx` + detalhe)

## Integração com Backend Java

Configure a URL da API no `.env`:

```bash
EXPO_PUBLIC_API_URL=http://localhost:8080/api/v1
EXPO_PUBLIC_DEFAULT_USER_ID=1
```

Endpoints utilizados:

- `POST /auth/signup` e `POST /auth/login` (autenticação JWT)
- `GET /trilhas` e `GET /trilhas/{id}/cursos`
- `GET /vagas` e `POST /candidaturas?usuarioId=&vagaId=`
- `GET /candidaturas`, `PATCH /candidaturas/{id}/status`, `DELETE /candidaturas/{id}`
- `GET /usuarios/{id}`, `POST /usuarios/{id}/competencias/{compId}`, `DELETE /usuarios/{id}/competencias/{compId}`
- `GET /competencias`

## Executando

```bash
npm install
npm run start
# ou
npx expo start
```

O app foi preparado para atender à rubrica de **Mobile Application Development**, consumindo de forma
real a API Java do projeto TrilhaJusta, com autenticação, navegação e CRUD integrado.


## Video demostrativo:
https://youtube.com/shorts/E8G4fGgsa14?si=dul-gJ6KOyrr8MJr


