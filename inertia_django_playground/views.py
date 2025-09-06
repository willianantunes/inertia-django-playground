import csv
import io
import json

from django.contrib import messages
from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from django.shortcuts import redirect
from django.views.decorators.http import require_GET
from django.views.decorators.http import require_http_methods
from inertia import render

from inertia_django_playground.apps.core.models import Todo
from inertia_django_playground.forms import EmailAuthenticationForm
from inertia_django_playground.forms import TodoForm


@require_GET
def home(request):
    # Public landing page rendered via Inertia. Authenticated users still see landing, can navigate to app.
    return render(
        request,
        "Index",
        {
            "authenticated": request.user.is_authenticated,
        },
    )


@require_http_methods(["GET", "POST"])
def login_view(request):
    if request.method == "GET":
        if request.user and request.user.is_authenticated and request.user.is_active:
            return redirect("todos:index")
        return render(request, "Auth/Login", {})
    form = EmailAuthenticationForm(json.loads(request.body))
    if form.is_valid():
        email = form.cleaned_data["email"]
        password = form.cleaned_data["password"]
        user = authenticate(email=email, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, "Welcome back!")
            return redirect("todos:index")
    return render(request, "Auth/Login", props={"errors": form.errors})


@require_http_methods(["POST"])
def logout_view(request):
    logout(request)
    return redirect("auth:login")


@login_required
@require_GET
def todos_index(request):
    todos = (
        Todo.objects.filter(user=request.user)
        .order_by("-created_at")
        .values("id", "title", "completed", "created_at", "updated_at")
    )
    paginator = Paginator(todos, 10)
    page_number = request.GET.get("page", 1)
    page_todos = paginator.get_page(page_number)
    page_todos_as_json = {
        "has_previous": page_todos.has_previous(),
        "has_next": page_todos.has_next(),
        "number": page_todos.number,
        "num_pages": page_todos.paginator.num_pages,
        "results": list(page_todos.object_list),
    }
    return render(
        request,
        "Todos/Index",
        {
            "user": {"name": request.user.email},
            "page_todos": page_todos_as_json,
        },
    )


@login_required
@require_http_methods(["POST"])
def todos_create(request):
    form = TodoForm(json.loads(request.body) | {"user": request.user.id})
    if not form.is_valid():
        messages.error(request, "Title is required")
        return redirect("todos:index")
    form.save()
    # Todo.objects.create(user=request.user, title=title)
    messages.success(request, "Todo created")
    return redirect("todos:index")


@login_required
@require_http_methods(["GET", "POST"])
def todos_edit(request, todo_id: int):
    todo = get_object_or_404(Todo, id=todo_id, user=request.user)
    if request.method == "GET":
        return render(
            request, "Todos/Edit", {"todo": {"id": todo.id, "title": todo.title, "completed": todo.completed}}
        )
    form = TodoForm(json.loads(request.body) | {"user": request.user.id}, instance=todo)
    if not form.is_valid():
        # completed = request.POST.get("completed") in ("1", "true", "on", True)
        messages.error(request, "Title is required")
        response = render(
            request,
            "Todos/Edit",
            {
                "todo": {
                    "id": todo.id,
                    "title": todo.title,
                    "completed": todo.completed,
                }
            },
        )
        return response

    form.save()
    messages.success(request, "Todo updated")
    return redirect("todos:index")


@login_required
@require_http_methods(["POST"])
def todos_delete(request, todo_id: int):
    todo = get_object_or_404(Todo, id=todo_id, user=request.user)
    todo.delete()
    messages.success(request, "Todo deleted")
    return redirect("todos:index")


@login_required
@require_http_methods(["POST"])
def todos_upload_csv(request):
    """
    Accepts a CSV file upload and creates todos for the logged-in user.
    Expected CSV format: header optional, one todo title per row in first column.
    """
    # Inertia Form sends multipart automatically when file input is present.
    uploaded = request.FILES.get("file")
    if not uploaded:
        messages.error(request, "Please select a CSV file to upload.")
        return redirect("todos:index")
    try:
        text = io.TextIOWrapper(uploaded.file, encoding="utf-8")
        content = text.read()
        uploaded.file.seek(0)
        reader = csv.reader(io.StringIO(content))
    except Exception:
        messages.error(request, "Could not read the uploaded file.")
        return redirect("todos:index")

    created = 0
    entries = []
    for i, row in enumerate(reader):
        if not row:
            continue
        title = row[0]
        completed = row[1]
        if i == 0 and title.lower() in ("title", "completed"):
            continue
        if not title:
            continue
        form = TodoForm({"user": request.user.id, "title": title, "completed": completed})
        if form.is_valid():
            entries.append(Todo(**form.cleaned_data))
            created += 1
    Todo.objects.bulk_create(entries)
    if created:
        messages.success(request, f"Imported {created} todos from CSV.")
    else:
        messages.info(request, "No todos were imported from the CSV file.")
    return redirect("todos:index")
