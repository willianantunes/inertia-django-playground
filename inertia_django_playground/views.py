from inertia import render


def about(request):
    return render(request, "About")


def home(request):
    fake_users = [
        {"id": 1, "name": "John Doe", "age": 30},
        {"id": 2, "name": "Jane Smith", "age": 25},
        {"id": 3, "name": "Alice Johnson", "age": 28},
        {"id": 4, "name": "Bob Brown", "age": 35},
        {"id": 5, "name": "Charlie Davis", "age": 22},
    ]
    return render(request, "Index", {"users": fake_users})
