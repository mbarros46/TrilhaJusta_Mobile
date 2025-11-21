# TrilhaJusta – Mobile (React Native + Expo)

Aplicativo mobile do projeto **TrilhaJusta**, criado a partir do template utilizado no FleetZone, mas
integrado ao backend Java Spring Boot (`/api/v1`) do TrilhaJusta.

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
