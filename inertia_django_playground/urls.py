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

urlpatterns = [
    path("", views.home, name="home"),
    path("auth/", include(auth_patterns, namespace="auth")),
    path("todos/", include(todos_patterns, namespace="todos")),
    path("admin/", admin.site.urls),
]
