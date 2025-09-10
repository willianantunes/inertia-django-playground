import csv
import io

from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from inertia_django_playground.apps.core.models import CreditCard
from inertia_django_playground.apps.core.models import Todo


class EmailAuthenticationForm(forms.Form):
    email = forms.EmailField(max_length=254, required=True)
    password = forms.CharField(max_length=36, required=True)

    def __init__(self, *args, **kwargs):
        self.user = None
        super().__init__(*args, **kwargs)

    def clean(self):
        username = self.cleaned_data.get("email")
        password = self.cleaned_data.get("password")

        if username and password:
            self.user = authenticate(username=username, password=password)
            if self.user is None:
                raise forms.ValidationError("Invalid email or password.", code="invalid_login")
            else:
                if not self.user.is_active:
                    raise forms.ValidationError("This account is inactive.", code="inactive")
        return self.cleaned_data


class TodoUploadCsvForm(forms.Form):
    csv_file = forms.FileField(required=True)

    def __init__(self, request, *args, **kwargs):
        self.request = request
        self.todos_entries: list[Todo] = []
        super().__init__(request.POST, request.FILES, *args, **kwargs)

    def clean_csv_file(self):
        file = self.cleaned_data.get("csv_file")
        if not file.name.endswith(".csv"):
            raise ValidationError("File must be a CSV.", code="invalid_extension")
        if file.size > 2 * 1024 * 1024:  # 2MB limit
            raise ValidationError("File size must be under 2MB.", code="file_too_large")
        try:
            text = io.TextIOWrapper(file, encoding="utf-8")
            content = text.read()
            file.seek(0)
            csv_reader = csv.reader(io.StringIO(content))
        except Exception:
            raise forms.ValidationError("Invalid CSV file.", code="invalid_csv")
        for index, row in enumerate(csv_reader):
            title = row[0]
            completed = row[1]
            if index == 0 and title.lower() in ("title", "completed"):
                continue
            if not title:
                continue
            form = TodoForm({"user": self.request.user.id, "title": title, "completed": completed})
            if form.is_valid():
                self.todos_entries.append(Todo(**form.cleaned_data))
        return file


class CustomAuthenticationForm(AuthenticationForm):
    email = forms.EmailField(label=_("E-mail address"), max_length=254)

    def authenticate(self):
        email = self.cleaned_data.get("email")
        password = self.cleaned_data.get("password")

        if email and password:
            self.user_cache = authenticate(email=email, password=password)
            if self.user_cache is None:
                raise forms.ValidationError(
                    _("Please enter a correct e-mail address and password. Note that both fields are case-sensitive.")
                )
            elif not self.user_cache.is_active:
                raise forms.ValidationError(_("This account is inactive."))
        return self.user_cache


class TodoForm(forms.ModelForm):
    class Meta:
        model = Todo
        fields = "__all__"


class CreditCardForm(forms.ModelForm):
    class Meta:
        model = CreditCard
        fields = "__all__"

    def clean(self):
        cleaned = super().clean()
        # Basic validation for dates
        valid_from = cleaned.get("valid_from")
        valid_to = cleaned.get("valid_to")
        if valid_from and valid_to and valid_from > valid_to:
            raise ValidationError("valid_from must be before valid_to.")
        # Security code 3-4 digits
        cvv = cleaned.get("security_code")
        if cvv and (not str(cvv).isdigit() or len(str(cvv)) not in (3, 4)):
            self.add_error("security_code", "Security code must be 3 or 4 digits.")
        # Number length up to 19 and digits/spaces allowed (strip spaces)
        number = cleaned.get("number")
        if number:
            num = str(number).replace(" ", "")
            if not num.isdigit() or len(num) < 12 or len(num) > 19:
                self.add_error("number", "Card number must be 12 to 19 digits.")
            else:
                cleaned["number"] = num
        return cleaned
