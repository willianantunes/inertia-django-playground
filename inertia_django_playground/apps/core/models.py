from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models


class StandardModelMixin(models.Model):
    id = models.BigAutoField(primary_key=True, editable=False, verbose_name="Id")
    created_at = models.DateTimeField(auto_now_add=True, editable=False, verbose_name="Created at")
    updated_at = models.DateTimeField(auto_now=True, editable=False, verbose_name="Updated at")

    class Meta:
        abstract = True


class UserManager(BaseUserManager):
    """
    https://docs.djangoproject.com/en/5.2/topics/auth/customizing/#writing-a-manager-for-a-custom-user-model
    """

    def create_user(self, email, password=None, **other_fields):
        if not email:
            raise ValueError("The Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **other_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        user = self.create_user(email, password, **extra_fields)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin, StandardModelMixin):
    """
    https://docs.djangoproject.com/en/5.2/topics/auth/customizing/#specifying-a-custom-user-model
    """

    email = models.EmailField(unique=True, null=False, blank=False)
    name = models.CharField(max_length=150, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class Todo(StandardModelMixin):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="todos")
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class CreditCard(StandardModelMixin):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="credit_cards")
    number = models.CharField(max_length=19)
    issuer = models.CharField(max_length=100)
    valid_from = models.DateField()
    valid_to = models.DateField()
    security_code = models.CharField(max_length=4)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        last4 = self.number[-4:] if self.number else "????"
        return f"{self.issuer} **** {last4} (valid {self.valid_from} to {self.valid_to})"
