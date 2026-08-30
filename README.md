# PRAXIS

Monorepo: Next.js (`apps/web`) + NestJS (`apps/api`) + Postgres.

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