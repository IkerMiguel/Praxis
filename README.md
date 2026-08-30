# PRAXIS

Monorepo: Next.js (`apps/web`) + NestJS (`apps/api`) + Postgres.

## Estructura

```text
apps/api      Backend NestJS + TypeORM
apps/web      Frontend Next.js
packages/     Codigo compartido (tipos, etc.)
docker/       Compose (Postgres) y Dockerfiles
```

## Requisitos

- Node 22+
- pnpm 11.24.0
- Docker

## Setup

1. `pnpm install`
2. Copia `apps/api/.env.example` → `apps/api/.env`
3. `docker compose -f docker/docker-compose.yml up -d`
4. `pnpm dev:api`
5. `pnpm dev:web`

- API: http://localhost:3001
- Web: http://localhost:3000

## Scripts

| Comando | Uso |
|---------|-----|
| `pnpm dev:api` | API Nest en desarrollo (watch) |
| `pnpm dev:web` | Frontend Next.js en desarrollo |
| `pnpm lint:api` | Lint del backend (oxlint) |
| `pnpm lint:web` | Lint del frontend (eslint) |
| `pnpm test:api` | Tests unitarios de la API |
| `pnpm test:web` | Tests del frontend (cuando existan) |
| `pnpm build:api` | Build de produccion de la API |
| `pnpm build:web` | Build de produccion del frontend |
| `pnpm ci:api` | Pipeline local backend: lint + test + build |
| `pnpm ci:web` | Pipeline local frontend: lint + test + build |

## Flujo por area

| Area | Carpetas | Responsabilidad |
|------|----------|-----------------|
| Backend | `apps/api`, `docker/` | API, DB, Docker |
| Frontend | `apps/web` | UI y consumo de la API |
| QA | PRs, tests, labels | Validar antes de merge a `main` |
| Compartido | `packages/` | Tipos/contratos entre api y web |

## Flujo en GitHub

1. Rama desde `main` (`feature/api-...`, `feature/web-...`, etc.)
2. Abrir PR hacia `main`
3. CI debe pasar (`ci:api` / `ci:web` segun el cambio)
4. Review del area afectada
5. QA valida (label `ready-for-qa` cuando aplique)
6. Merge a `main` (protegida; sin push directo)

Labels utiles: `area:api`, `area:web`, `area:qa`, `ready-for-qa`.
