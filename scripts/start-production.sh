#!/usr/bin/env bash

set -e

python manage.py collectstatic --no-input
python manage.py makemigrations --check --dry-run
python manage.py migrate

# Seed the database with initial data. Not intended for production use.
python manage.py seed --create-super-user --entries-per-user 15

gunicorn -cpython:gunicorn_config -b 0.0.0.0:${DJANGO_BIND_PORT:-$PORT} inertia_django_playground.wsgi