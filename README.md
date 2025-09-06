# Inertia Django Playground

## Steps to run the project

Execute the following commands in the terminal:

```shell
npm install
npm run dev
docker compose run --service-ports --rm remote-interpreter
```

Then you can access:

- http://localhost:8080/

## Creating the project from scratch from the template

You'll have to answer `copier` prompts. Check how I answered them looking at the file [`.copier-answers.yml`](./.copier-answers.yml). 

```shell
docker run -it --rm --volume $(pwd):/app --workdir /app python:3.12-slim bash
apt update && apt install -y git
pip install pipx
pipx run copier copy gh:sarthakjariwala/django-vite-inertia inertia-django-playground
```

## Recurring commands

Update dependencies:

```shell
docker compose run --rm remote-interpreter poetry update
```

Use bash in the container:

```shell
docker compose run --rm remote-interpreter bash
```

Erase all data and seed the database with 100,000 entries per user:

```shell
docker compose run --rm remote-interpreter python manage.py seed \
--erase-data --create-super-user \
--entries-per-user 100000 \
--bulk-batch-size 10000
```

Only erase all data:

```shell
docker compose run --rm remote-interpreter python manage.py seed --erase-data
```
