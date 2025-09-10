from io import StringIO

from django.core.management import call_command
from django.test import TestCase

from inertia_django_playground.apps.core.models import CreditCard
from inertia_django_playground.apps.core.models import Todo
from inertia_django_playground.apps.core.models import User


class TestUserManagement(TestCase):
    def test_should_seed(self):
        out = StringIO()
        call_command(
            "seed",
            "--create-super-user",
            "--entries-per-user",
            "15",
            stdout=out,
        )

        assert out.getvalue()
        assert User.objects.count() == 1
        assert Todo.objects.count() == 15
        assert CreditCard.objects.count() == 15
