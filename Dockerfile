FROM node:22-alpine as fe-builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY frontend ./frontend
COPY vite.config.ts jsconfig.json ./

RUN npm run build

FROM python:3.14-slim

WORKDIR /app

ARG VENV_PATH=./.venv

# Poetry should always be installed in a dedicated virtual environment to isolate it from the rest of your system.
RUN python -m venv $VENV_PATH && \
    $VENV_PATH/bin/pip install -U pip setuptools && \
    $VENV_PATH/bin/pip install poetry && \
    ln -s $(pwd)/$VENV_PATH/bin/poetry /usr/local/bin/poetry && \
    poetry self add poetry-plugin-export --no-cache

COPY poetry.lock pyproject.toml ./

RUN poetry export --only main -f requirements.txt -o requirements.txt --with-credentials && \
    rm -rf $VENV_PATH && rm /usr/local/bin/poetry && \
    pip install --require-hashes -r requirements.txt --no-cache-dir

COPY . ./

RUN rm -rf pyproject.toml poetry.lock requirements.txt package.json package-lock.json frontend *.config.js jsconfig.json

# This way when I run collectstatic command it will collect all the static files the application needs
COPY --from=fe-builder /app/frontend/dist/ ./frontend/dist/

CMD [ "./scripts/start-production.sh" ]
