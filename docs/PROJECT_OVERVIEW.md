# TrilhaJusta — Visão Técnica (resumo)

Este documento resume a arquitetura e os fluxos principais do aplicativo móvel TrilhaJusta.

Resumo rápido
-------------
- Nome do projeto: TrilhaJusta (mobile)
- Stack: React Native + Expo (Expo Router), TypeScript, Context API, Axios.
- Backend: API Java Spring Boot (REST) em `/api/v1` (JWT, Spring Data JPA, Oracle).
- Papel do mobile: cliente front-end que consome a API Java para autenticação, listagem de trilhas/cursos, vagas e gestão de candidaturas e competências.

Variáveis de configuração importantes
-----------------------------------
- `EXPO_PUBLIC_API_URL` — URL base da API (ex: `http://localhost:8080/api/v1`).
- `EXPO_PUBLIC_DEFAULT_USER_ID` — ID de usuário usado para demonstração em endpoints que exigem `usuarioId`.

Scripts e como rodar (dev)
--------------------------
No diretório do projeto:

```powershell
npm install --legacy-peer-deps
npm start
```

O `start` executa `expo start` (Metro). No terminal do Expo você pode pressionar:
- `w` para abrir no navegador web;
- `a` para abrir em um emulador Android conectado;
- escanear o QR code com Expo Go (Android) ou a câmera do iOS.

Arquitetura de integração (serviços TS)
--------------------------------------
- `src/services/axiosApi.ts` — client Axios centralizado; função `setAuthToken(token)` para setar o header `Authorization: Bearer <token>`.
- `src/services/api.ts` — define `API_BASE_URL` usando `process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1'`.
- Serviços principais mapear endpoints do backend: `trilhasService`, `vagasService`, `candidaturasService`, `usuariosService`, `competenciasService`, `authService`.

Fluxos importantes
------------------
- Autenticação (signup/login):
  - `POST /api/v1/auth/signup` (signup) e `POST /api/v1/auth/login` (login) — `authService` faz login e chama `setAuthToken`.
- Proteção de rotas: `useProtectedScreen()` redireciona à `/auth/login` se não houver token no contexto.
- Trilhas: `GET /api/v1/trilhas` e `GET /api/v1/trilhas/{id}/cursos` — consumidos por `app/(tabs)/trilhas.tsx`.
- Vagas: `GET /api/v1/vagas` — listagem e ação de candidatura via `candidaturasService.create(vagaId, usuarioId?)`.
- Candidaturas: `GET /api/v1/candidaturas`, `POST /api/v1/candidaturas?usuarioId=&vagaId=`, `PATCH /api/v1/candidaturas/{id}/status`, `DELETE /api/v1/candidaturas/{id}`.
- Perfil/Competências: `GET /api/v1/usuarios/{id}`, `POST /api/v1/usuarios/{usuarioId}/competencias/{competenciaId}` e `DELETE` análogo.

Pontos de atenção / riscos
-------------------------
- Certifique-se que a API Java esteja rodando e acessível no `EXPO_PUBLIC_API_URL` configurado; CORS e porta correta são frequentes fontes de erro.
- Tokens JWT: confirmar formato retornado por `POST /auth/login` (espera-se `{ token: string }`).
- `DEFAULT_USER_ID` deve existir no banco para testes que usam ID fixo.
- Dependências do projeto foram instaladas com `--legacy-peer-deps` para contornar conflitos; considerar atualizar versões do Expo e dependências relacionadas.

Próximos passos recomendados
---------------------------
1. Validar as variáveis `.env` locais: `EXPO_PUBLIC_API_URL` e `EXPO_PUBLIC_DEFAULT_USER_ID`.
2. Rodar um teste rápido de autenticação (smoke test) contra o backend para confirmar login/signup retornam token.
3. Abrir o app no navegador (web) para uma inspeção inicial ou usar um emulador Android/iOS.
4. Atualizar/gerar um `README.md` com instruções para desenvolvedores e notas sobre versões esperadas do Expo.

Arquivo gerado automaticamente pela IA com base no texto do usuário.
