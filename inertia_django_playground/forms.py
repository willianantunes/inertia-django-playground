from django import forms
from django.core.exceptions import ValidationError
from django.utils import timezone

from inertia_django_playground.apps.core.models import CreditCard
from inertia_django_playground.apps.core.models import Todo


class EmailAuthenticationForm(forms.Form):
    email = forms.EmailField(max_length=254, required=True)
    password = forms.CharField(max_length=128, required=True)


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
