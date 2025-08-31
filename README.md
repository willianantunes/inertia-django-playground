# Inertia Django Playground

## Steps to run the project

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