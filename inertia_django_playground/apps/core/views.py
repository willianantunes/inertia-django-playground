import json

from django.contrib.auth import login
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from django.shortcuts import redirect
from django.views.decorators.http import require_GET
from django.views.decorators.http import require_http_methods
from inertia import render

from inertia_django_playground.apps.core.forms import CreditCardForm
from inertia_django_playground.apps.core.forms import EmailAuthenticationForm
from inertia_django_playground.apps.core.forms import TodoForm
from inertia_django_playground.apps.core.forms import TodoUploadCsvForm
from inertia_django_playground.apps.core.models import CreditCard
from inertia_django_playground.apps.core.models import Todo
from inertia_django_playground.support.inertia_workarounds import continue_or_redirect_with_errors


@require_GET
def home(request):
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
        return render(request, "Auth/Login")
    form = EmailAuthenticationForm(json.loads(request.body))
    if form.is_valid():
        login(request, form.user)
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
    continue_or_redirect_with_errors(form, redirect("todos:index"))
    form.save()
    return redirect("todos:index")


@login_required
@require_http_methods(["GET", "POST"])
def todos_edit(request, target_id: int):
    todo = get_object_or_404(Todo, id=target_id, user=request.user)
    if request.method == "GET":
        return render(
            request, "Todos/Edit", {"todo": {"id": todo.id, "title": todo.title, "completed": todo.completed}}
        )
    form = TodoForm(json.loads(request.body) | {"user": request.user.id}, instance=todo)
    if not form.is_valid():
        return render(
            request,
            "Todos/Edit",
            {
                "todo": {
                    "id": todo.id,
                    "title": todo.title,
                    "completed": todo.completed,
                },
                "errors": form.errors,
            },
        )
    form.save()
    return redirect("todos:index")


@login_required
@require_http_methods(["POST"])
def todos_delete(request, target_id: int):
    todo = get_object_or_404(Todo, id=target_id, user=request.user)
    todo.delete()
    return redirect("todos:index")


@login_required
@require_http_methods(["POST"])
def todos_upload_csv(request):
    form = TodoUploadCsvForm(request)
    continue_or_redirect_with_errors(form, redirect("todos:index"))
    Todo.objects.bulk_create(form.todos_entries)
    return redirect("todos:index")


@login_required
@require_GET
def credit_cards_index(request):
    cards = (
        CreditCard.objects.filter(user=request.user)
        .values(
            "id",
            "number",
            "issuer",
            "valid_from",
            "valid_to",
            "security_code",
            "created_at",
            "updated_at",
        )
        .order_by("-created_at")
    )
    paginator = Paginator(cards, 10)
    page_number = request.GET.get("page", 1)
    page_cards = paginator.get_page(page_number)
    page_cards_as_json = {
        "has_previous": page_cards.has_previous(),
        "has_next": page_cards.has_next(),
        "number": page_cards.number,
        "num_pages": page_cards.paginator.num_pages,
        "results": list(page_cards.object_list),
    }
    return render(
        request,
        "CreditCards/Index",
        {
            "user": {"name": request.user.email},
            "page_cards": page_cards_as_json,
        },
    )


@login_required
@require_http_methods(["POST"])
def credit_cards_create(request):
    data = json.loads(request.body)
    form = CreditCardForm(data | {"user": request.user.id})
    continue_or_redirect_with_errors(form, redirect("credit_cards:index"))
    form.save()
    return redirect("credit_cards:index")


@login_required
@require_http_methods(["POST"])
def credit_cards_delete(request, target_id: int):
    card = get_object_or_404(CreditCard, id=target_id, user=request.user)
    card.delete()
    return redirect("credit_cards:index")


@login_required
@require_http_methods(["POST"])
def credit_cards_update(request, target_id: int):
    card = get_object_or_404(CreditCard, id=target_id, user=request.user)
    form = CreditCardForm(json.loads(request.body) | {"user": request.user.id}, instance=card)
    continue_or_redirect_with_errors(form, redirect("credit_cards:index"))
    form.save()
    return redirect("credit_cards:index")
