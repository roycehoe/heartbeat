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

- If care recipients do not check in, their caregiver will be informed via Whatsapp lest care recipients are in danger. This tackles problem 1.
- If care recipients log more than a pre-configured number of sad moods in a row, the caregiver will be notified via Whatsapp. This tackles problem 2.
- Through this application, there is no upper limit to the number of care recipients that can be tagged to a caregiver. Caregivers, through an administrator's account, can view all their care receipient's moods in a single dashboard. This tackles problem 3.

# Technical documentation

## Getting started

### General

Run

```
sudo apt update -y && apt install python3-dev libpq-dev
```

to install dependencies required to run postgres

### Backend

- Install [poetry](https://python-poetry.org/docs/1.3#installing-with-the-official-installer) on your machine
- Go into the backend directory
- Create a ` .env` file and populate it with the variables defined in `Annex A`
- Create a ` docker-compose.yml` file and populate it with the markup defined in `Annex A`
- Install all project dependencies with `poetry install`
- Activate the project virtual environment by running the command `poetry shell`
- Run the command `fastapi run` to start the backend server on your machine. The server should be running on localhost:8000
- You may visit the Swagger UI page at localhost:8000/docs

### Frontend

- Install `pnpm` with `npm` on your machine
- Go into the frontend directory
- Install all project dependencies with `pnpm install`
- Run the command `pnpm run dev` to start a development server on your local machine
- Visit `http://localhost:5173` to view the application

### Containerization

Alternatively, you may containerize the entire application:

- Install [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Go to the root of this directory and run the command `docker-compose build && docker-compose up` to build and start all the project's containers
- View the application on `localhost:80`

### Annex A

#### Backend .env file sample

```env
TWILIO_ACCOUNT_SID = ""
TWILIO_AUTH_TOKEN = ""
TWILIO_NUMBER=""

DB_ENCRYPTION_SECRET=""

PHONE_NUMBER_ID = ""
WHATSAPP_API_ACCESS_TOKEN = ""

SQLALCHEMY_DATABASE_URL = ""
```

#### Backend docker-compose.yml file sample

```yml
# Use postgres/example user/password credentials
version: "3.9"

services:
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: password
    restart: always
    ports:
      - 5432:5432
```
