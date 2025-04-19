FROM python:3.9-slim

ENV POETRY_VERSION=1.8.3

RUN apt update -y && apt install -y \
    curl \
    python3-distutils \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    python3-dev \
    libpq-dev \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

RUN curl -sSL https://install.python-poetry.org | POETRY_VERSION=$POETRY_VERSION python3 -

ENV PATH="/root/.local/bin:$PATH"

WORKDIR /code
COPY . /code

RUN rm -rf /code/.venv

RUN poetry config virtualenvs.create false &&\
    poetry install --no-interaction --no-ansi

EXPOSE 8000

CMD fastapi run --port 80 main.py
