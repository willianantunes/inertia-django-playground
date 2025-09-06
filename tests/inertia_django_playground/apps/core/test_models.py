from django.contrib.auth import get_user_model
from django.test import TestCase

from inertia_django_playground.apps.core.models import Todo


class UserModelTests(TestCase):
    def test_create_user_with_email(self):
        User = get_user_model()
        user = User.objects.create_user(email="user@example.com", password="pass1234", name="User X")
        self.assertEqual(user.email, "user@example.com")
        self.assertTrue(user.check_password("pass1234"))
        self.assertFalse(user.is_staff)

    def test_create_superuser(self):
        User = get_user_model()
        admin = User.objects.create_superuser(email="admin@example.com", password="adminpass")
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_staff)


class TodoModelTests(TestCase):
    def test_create_todo(self):
        User = get_user_model()
        user = User.objects.create_user(email="todo@example.com", password="pass")
        todo = Todo.objects.create(user=user, title="Buy milk")
        self.assertEqual(todo.title, "Buy milk")
        self.assertFalse(todo.completed)
        self.assertEqual(todo.user, user)
