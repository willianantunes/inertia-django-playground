from django.contrib import admin
from django.urls import include
from django.urls import path

from . import views

app_name = "root"

auth_patterns = (
    [
        path("login/", views.login_view, name="login"),
        path("logout/", views.logout_view, name="logout"),
    ],
    "auth",
)

todos_patterns = (
    [
        path("", views.todos_index, name="index"),
        path("create/", views.todos_create, name="create"),
        path("upload-csv/", views.todos_upload_csv, name="upload_csv"),
        path("<int:todo_id>/edit/", views.todos_edit, name="edit"),
        path("<int:todo_id>/delete/", views.todos_delete, name="delete"),
    ],
    "todos",
)

credit_cards_patterns = (
    [
        path("", views.credit_cards_index, name="index"),
        path("create/", views.credit_cards_create, name="create"),
        path("<int:card_id>/update/", views.credit_cards_update, name="update"),
        path("<int:card_id>/delete/", views.credit_cards_delete, name="delete"),
    ],
    "credit_cards",
)

urlpatterns = [
    path("", views.home, name="home"),
    path("auth/", include(auth_patterns, namespace="auth")),
    path("todos/", include(todos_patterns, namespace="todos")),
    path("cards/", include(credit_cards_patterns, namespace="credit_cards")),
    path("admin/", admin.site.urls),
]
