# Inertia Django Playground

This project demonstrates how to effectively integrate Django, Vite, React, Whitenoise, and Inertia.js. It includes SSR also. It serves as a practical example for developers looking to build a full-stack application using these technologies.

Key features and examples include:

* **CRUD Operations:** Discover how to implement create, read, update, and delete (CRUD) operations for the [`Todo`](./inertia_django_playground/apps/core/models.py) and [`CreditCard`](./inertia_django_playground/apps/core/models.py) models.
* **Form Handling:** Learn how to handle Inertia.js forms using Django's powerful form validation and processing capabilities.

## Accessing and running the project

When the server is up, you can access it using the credentials `admin@admin.com:admin` at:

- http://localhost:8000/

Admin panel:

- http://localhost:8000/admin/

### Without SSR

Execute the following command in the terminal:

```shell
docker compose run --service-ports --rm app-production
```

### With SSR

Execute the following command in the terminal:

```shell
docker compose run --service-ports --rm app-production-ssr
```

### Without Docker

Execute the following commands in the terminal:

```shell
npm install
npm run dev
docker compose run --service-ports --rm remote-interpreter
```

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
