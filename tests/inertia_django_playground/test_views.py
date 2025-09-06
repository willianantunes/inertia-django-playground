from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse


class ViewTests(TestCase):
    def test_redirect_home(self):
        resp = self.client.get(reverse("home"))
        self.assertEqual(resp.status_code, 302)
        self.assertIn("/auth/login/", resp["Location"])

    def test_login_and_see_todos(self):
        User = get_user_model()
        user = User.objects.create_user(email="u@example.com", password="pass", name="User Z")
        # Login
        resp = self.client.post(reverse("auth:login"), {"email": "u@example.com", "password": "pass"})
        self.assertEqual(resp.status_code, 302)
        self.assertIn("/todos/", resp["Location"])
        # Access todos
        resp2 = self.client.get(reverse("todos:index"))
        self.assertEqual(resp2.status_code, 200)
        # Inertia middleware sets component header; template name is Todos/Index
        self.assertIn(b"Todos/Index", resp2.content)  # Best-effort check
