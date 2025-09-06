from django import forms

from inertia_django_playground.apps.core.models import Todo


class EmailAuthenticationForm(forms.Form):
    email = forms.EmailField(max_length=254, required=True)
    password = forms.CharField(max_length=128, required=True)


class TodoForm(forms.ModelForm):
    class Meta:
        model = Todo
        fields = "__all__"
