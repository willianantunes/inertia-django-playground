from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction
from faker.proxy import Faker

from inertia_django_playground.apps.core.models import Todo
from inertia_django_playground.support.django_helpers import chunker


class Command(BaseCommand):
    help = "Seed the database"

    def add_arguments(self, parser):
        parser.add_argument("--create-super-user", action="store_true")
        parser.add_argument("--erase-data", action="store_true")
        parser.add_argument("-e", "--email", type=str, default="admin@admin.com")
        parser.add_argument("-p", "--password", type=str, default="admin")
        parser.add_argument("--faker-seed", type=int, default=1)
        parser.add_argument("--entries-per-user", type=int, default=10_000)
        parser.add_argument("--bulk-batch-size", type=int, default=200)

    def handle(self, *args, **options):
        create_super_user = options["create_super_user"]
        admin_email = options["email"].strip()
        admin_password = options["password"].strip()
        faker_seed = options["faker_seed"]
        entries_per_user = options["entries_per_user"]
        bulk_batch_size = options["bulk_batch_size"]
        erase_data = options["erase_data"]
        User = get_user_model()

        if erase_data:
            Todo.objects.all().delete()
            User.objects.all().delete()
            self.stdout.write("Data erased.")
        if create_super_user:
            exists = User.objects.filter(email=admin_email).exists()
            if not exists:
                User.objects.create_superuser(email=admin_email, password=admin_password)
            else:
                self.stdout.write("Super user already exists")
        for user in User.objects.all():
            if not user.todos.exists():
                faker = Faker(faker_seed)
                entries_to_be_saved = []
                for _ in range(entries_per_user):
                    entries_to_be_saved.append(
                        Todo(
                            user=user,
                            title=faker.sentence(nb_words=6),
                            completed=faker.boolean(chance_of_getting_true=30),
                        )
                    )
                saved_data = 0
                for chunk in chunker(entries_to_be_saved, bulk_batch_size):
                    with transaction.atomic():
                        Todo.objects.bulk_create(chunk, bulk_batch_size)
                    saved_data += bulk_batch_size
                    if saved_data % (bulk_batch_size * 2) == 0:
                        self.stdout.write(f"Entries saved: {Todo.objects.count()}")
                self.stdout.write(f"Created {entries_per_user} todos for user {user.id}")
