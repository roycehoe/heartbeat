<!-- <a href="https://www.build.gov.sg/bfg2024/heart-beat"><img src="https://isomer-user-content.by.gov.sg/43/e09ddd2c-f666-4887-9d98-5a62c52d80c0/BFG_Logo.png" title="Heart Beat" alt="https://isomer-user-content.by.gov.sg/43/e09ddd2c-f666-4887-9d98-5a62c52d80c0/BFG_Logo.png"></a> -->

# HeartBeat

A mood monitoring web application for caregivers and care recipients, built as part of BFG 2024.

## Background

### Problems targeted

This application aims to alleviate 3 problems:

1.  Physical wellbeing of care recipients
2.  Emotional wellbeing of care recipients
3.  Imbalance between the number of caregivers and care recipients

### How it works

Care recipients will be tagged to a caregiver. Each day, care recipients would indicate if they are feeling happy, ok, or sad.

- If care recipients do not check in, their caregiver will be informed via Whatsapp lest care recipients are in any physical danger. This tackles problem 1.
- If care recipients log more than a pre-configured number of sad moods in a row, the caregiver will be notified via Whatsapp. This tackles problem 2.
- Through this application, there is no upper limit to the number of care recipients that can be tagged to a caregiver. Caregivers, through an administrator's account, can view all their care receipient's moods in a single dashboard. This tackles problem 3.

# Technical documentation

## Getting started

### Prerequisites

- Python 3.10+ and [Poetry](https://python-poetry.org/docs/#installing-with-the-official-installer)
- Node.js and [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/) (for the local Postgres container, or for running the full stack)
- A [Clerk](https://clerk.com/) development application (caregiver/admin login uses Clerk)

### Local development setup
Follow the steps below to run the app for local development.
You can run the app in two modes:
1. Manual: Run backend and frontend separately with hot-reload 
2. Containerised: Run both backend and frontend in a container

#### Manual

##### Backend

Run everything from the `backend/` directory.

1. **Start Postgres.** `backend/_local/db/docker-compose.yml` runs a local Postgres on port 5432 (user `postgres`, password `password`):

   ```
   docker-compose -f _local/db/docker-compose.yml up -d
   ```

2. **Create your `.env`.** Copy the template and fill it in:

   ```
   cp .env.template .env
   ```

   Empty values are treated as unset, so optional variables fall back to their defaults. See [Environment variables](#environment-variables) below.

3. **Install dependencies and run migrations:**

   ```
   poetry install
   poetry run alembic upgrade head
   ```

4. **Start the dev server** (hot-reload) on `localhost:8000`:

   ```
   poetry run fastapi dev main.py
   ```

   Swagger UI is at `http://localhost:8000/docs`.

5. **(Optional) Run the tests:** `poetry run pytest`

##### Frontend

Run everything from the `frontend/` directory.

1. `pnpm install`
2. `cp .env.template .env` and set `VITE_CLERK_PUBLISHABLE_KEY` to your Clerk publishable key (the same key as the backend's `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`). The other variables can stay blank to use their defaults.
3. `pnpm run dev`, then visit `http://localhost:5173`

The frontend calls the backend directly at `http://localhost:8000/api` in dev; there is no Vite proxy. Set `VITE_BACKEND_BASE_URL` to point it elsewhere.

#### Containerised

Alternatively, run the whole application in containers. Install [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/install/) first, then:

1. **Start the database.** The root `docker-compose.yml` has no database service, so bring up the local Postgres first (see [Backend](#backend), step 1):

   ```
   cd backend && docker-compose -f _local/db/docker-compose.yml up -d
   ```

2. **Create `backend/.env`** (see [Environment variables](#environment-variables)). Set `SQLALCHEMY_DATABASE_URL_STAGING` to a URL the backend container can reach. Inside the container `localhost` is the container itself, so use `host.docker.internal` instead, which reaches the port the database publishes on your machine: `postgresql://postgres:password@host.docker.internal:5432/postgres`. (Running the backend directly on your machine, as in [Backend](#backend), still uses `localhost`.)
3. **Make sure the migrations have been applied** to that database (see [Backend](#backend), step 3). If your `.env` uses `host.docker.internal`, override the URL for that command to use `localhost` instead, as environment variables take priority over `.env`:

   ```
   cd backend && SQLALCHEMY_DATABASE_URL_STAGING=postgresql://postgres:password@localhost:5432/postgres poetry run alembic upgrade head
   ```

4. **Build and start the application** from the repository root:

   ```
   docker-compose build && docker-compose up
   ```

5. View the application on `localhost:80`. nginx serves the frontend and proxies `/api/` to the backend.

## Environment variables

To set up environment variables required, do the following:
- Copy `backend/.env.template` to `backend/.env`
- Copy `frontend/.env.template` to `frontend/.env`
Fill up the `.env` files accordingly.

Never commit `.env` files or real keys.

Backend settings are defined in `backend/settings.py`. Empty values in `.env` are treated as unset (`env_ignore_empty=True`): optional variables fall back to their default, and required variables left empty make the app fail to start with "field required".

### Backend — required

| Variable | Purpose |
|---|---|
| `DB_ENCRYPTION_SECRET` | Column-level encryption key |
| `SECRET_KEY` | HS256 signing key for the internal app JWT |
| `ADMIN_PASSWORD` | Admin password |
| `PHONE_NUMBER_ID` | WhatsApp Business API phone number ID |
| `WHATSAPP_API_ACCESS_TOKEN` | Meta Graph API token |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key for JWKS verification |
| `SUPERADMIN_CLERK_ID` | Clerk user ID of the superadmin |

`PHONE_NUMBER_ID` and `WHATSAPP_API_ACCESS_TOKEN` need non-empty values to start the app. Placeholders are enough unless you are testing WhatsApp alerts.

### Backend — optional

| Variable | Default | Purpose |
|---|---|---|
| `IS_PROD` | `False` | Production mode flag |
| `SQLALCHEMY_DATABASE_URL_STAGING` | `postgresql://postgres:password@localhost:5432/postgres` | Database connection URL. The default matches the local Postgres from `_local/db/docker-compose.yml`, so it can stay blank for local dev. |
| `ERRANT_USER_CONSECUTIVE_NON_CHECKIN_CRITERION` | `3` | Consecutive missed check-ins before a user is suspended |
| `FRONTEND_BASE_URL` | `https://heartbeat.carecompass.sg` | Base of care recipient magic-link login URLs (`{FRONTEND_BASE_URL}/login/{token}`); set to `http://localhost:5173` for local dev |

### Frontend

| Variable | Default | Purpose |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | none | Clerk publishable key (required for login) |
| `VITE_BACKEND_BASE_URL` | `http://localhost:8000/api` in dev, `/api` in production | API base URL |
| `VITE_CARECOMPASS_BASE_URL` | `https://my.carecompass.sg` | CareCompass link and onboarding redirect |


## Logging in locally

After the app has started:
- **Caregivers (admins)** log in at `/login` through Clerk. The `SUPERADMIN_CLERK_ID` backend variable is the Clerk user ID of the superadmin.
- **Care recipients** log in through a magic link. A caregiver copies it from the recipient's page in the admin dashboard. The link has the form `{FRONTEND_BASE_URL}/login/{token}`, so set `FRONTEND_BASE_URL=http://localhost:5173` in the backend `.env` for local dev.