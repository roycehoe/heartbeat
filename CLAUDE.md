# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HeartBeat is a mood-monitoring web app for elderly care in Singapore. Care recipients log their daily mood (happy/ok/sad); caregivers (admins) are alerted via WhatsApp when recipients miss check-ins or log consecutive sad moods. Built for BFG 2024 using OGP's design system.

## Monorepo Structure

```
backend/     FastAPI + PostgreSQL API (Python 3.11, poetry)
frontend/    React + Vite SPA (TypeScript, pnpm)
scripts/     Standalone reporting scripts (SQLAlchemy + SMTP)
docker-compose.yml   Runs frontend (nginx :80) → proxies /api/ → backend
```

The backend has its own `CLAUDE.md` with detailed architecture, commands, env vars, and domain rules — read it when working on the API.

## Backend Commands (run from `backend/`)

```bash
poetry install
fastapi dev main.py          # dev server with hot-reload on :8000
fastapi run --port 80 main.py
ruff check .
black .
alembic upgrade head
alembic revision --autogenerate -m "description"
```

There are no automated tests.

## Frontend Commands (run from `frontend/`)

```bash
pnpm install
pnpm run dev      # Vite dev server on :5173; proxied to backend at localhost:8000
pnpm run build    # tsc type-check + Vite build
pnpm run lint     # eslint
```

## Full Stack (Docker)

```bash
docker-compose build && docker-compose up
# App at localhost:80; nginx proxies /api/ to backend container
```

## Frontend Architecture

**Stack:** React 18, React Router v6, TanStack Query v5, Chakra UI v2, OGP Design System, Axios, TypeScript.

**Auth flow:** Clerk handles admin identity. The Clerk JWT is stored in `localStorage` as `clerk_token`, exchanged with the backend `/admin/login` for an internal app JWT stored as `token`. Care recipient tokens are derived from the admin token and stored separately.

**HTTP clients (`src/api/httpClient.ts`):**
- `httpClerkClient` — sends `clerk_token` header; used for the Clerk → app-token exchange
- `httpClient` — sends both `token` and `clerk_token` headers; used for all other API calls
- Dev: base URL is `http://localhost:8000`; prod: `/api` (nginx proxy)

**Pages:**
- `/` — `HomePage`: care recipient check-in (mood logging)
- `/login` — `LogIn`: Clerk-powered admin login
- `/admin` — `Admin`: caregiver dashboard listing all care recipients with mood snapshots
- `/admin/:userId` — `UserDetail`: mood history for a single recipient
- `/admin/:userId/settings` — `UserSettings`: edit a recipient
- `/admin/create-user` — `ModalCreateUser`: add a new care recipient
- `/admin/about` — `HowDoesItWork`
- `/admin/settings` — `Settings`

**State:** TanStack Query for all server state (no Redux). Mutations call `queryClient.invalidateQueries` to refresh.

## Routing / Proxy

In production (Docker), nginx serves the React build at `/` and proxies `location /api/` to the backend. The FastAPI app runs with `root_path="/api"` so Swagger is at `/api/docs`.

## Scripts (`scripts/reports/`)

Standalone Python scripts for generating and emailing periodic reports. Requires a separate `.env` in `scripts/` with `SQLALCHEMY_DATABASE_URL_STAGING`, `MAILTRAP_SMTP_HOST`, `MAILTRAP_SMTP_USERNAME`, `MAILTRAP_SMTP_PASSWORD`. Entry point: `python scripts/reports/main.py`.
