import os
import re

from pathlib import Path

from inertia.settings import settings as inertia_settings

from inertia_django_playground.support.django_helpers import strtobool

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = strtobool(os.getenv("DJANGO_DEBUG", "False"))

DJANGO_ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS")
if DJANGO_ALLOWED_HOSTS:
    ALLOWED_HOSTS = DJANGO_ALLOWED_HOSTS.split(",")
else:
    ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_vite",
    "inertia",
    "inertia_django_playground.apps.core",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "inertia.middleware.InertiaMiddleware",
    "inertia_django_playground.support.inertia_workarounds.DataShareMiddleware",
]

ROOT_URLCONF = "inertia_django_playground.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "inertia_django_playground.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
# Django collects the static files into STATIC_ROOT (python manage.py collectstatic)
STATIC_ROOT = os.getenv("STATIC_ROOT", "staticfiles")
STATIC_ROOT = os.path.join(BASE_DIR, STATIC_ROOT)
# Your CDN FQDN for example or whatever is hosting your statics/assets
STATIC_HOST = os.environ.get("DJANGO_STATIC_HOST", "")
# The REQUEST PATH where your statics/assets are
STATIC_URL = os.getenv("STATIC_URL", "/static/")
STATIC_URL = STATIC_HOST + STATIC_URL
# If use HMR or not.
DJANGO_VITE = {
    "default": {
        "dev_mode": strtobool(os.getenv("DJANGO_VITE_DEBUG", "False")),
        "dev_server_host": os.getenv("DJANGO_VITE_DEV_SERVER_HOST", "localhost"),
        "dev_server_port": int(os.getenv("DJANGO_VITE_DEV_SERVER_PORT", 5173)),
        "manifest_path": BASE_DIR / "frontend" / "dist" / "manifest.json",
    }
}
# Where ViteJS assets are built.
DJANGO_VITE_ASSETS_PATH = BASE_DIR / "frontend" / "dist"
# Add DJANGO_VITE_ASSETS_PATH into STATICFILES_DIRS to be copied inside when run command python manage.py collectstatic
STATICFILES_DIRS = [DJANGO_VITE_ASSETS_PATH]

INERTIA_LAYOUT = "core/index.html"
INERTIA_SSR_URL = inertia_settings.INERTIA_SSR_URL
INERTIA_SSR_ENABLED = inertia_settings.INERTIA_SSR_ENABLED
INERTIA_JSON_ENCODER = inertia_settings.INERTIA_JSON_ENCODER

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "core.User"
LOGIN_URL = "/auth/login/"


# http://whitenoise.evans.io/en/stable/django.html#WHITENOISE_IMMUTABLE_FILE_TEST
def immutable_file_test(path, url):
    # Match vite (rollup)-generated hashes, à la, `some_file-CSliV9zW.js`
    return re.match(r"^.+[.-][0-9a-zA-Z_-]{8,12}\..+$", url)


WHITENOISE_IMMUTABLE_FILE_TEST = immutable_file_test
