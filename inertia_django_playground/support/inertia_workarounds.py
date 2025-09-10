from django.contrib.messages import get_messages
from django.forms import BaseForm
from django.forms.utils import ErrorDict
from django.http import HttpRequest
from django.http import HttpResponsePermanentRedirect
from django.http import HttpResponseRedirect
from inertia import share

# Copied from https://github.com/inertiajs/inertia-django/pull/32
VALIDATION_ERRORS_SESSION_KEY = "_inertia_validation_errors"

InertiaRedirect = HttpResponseRedirect | HttpResponsePermanentRedirect


class InertiaValidationError(Exception):
    def __init__(self, errors: ErrorDict, redirect: InertiaRedirect):
        super().__init__()
        self.redirect = redirect
        self.errors = errors


def continue_or_redirect_with_errors(form: BaseForm, redirect: InertiaRedirect) -> dict:
    """Helper to validate a Django form and either return cleaned_data or redirect with the form errors.
    Only use this option if the request path your form was rendered on is not the same as the one you are posting to."""
    if not form.is_valid():
        raise InertiaValidationError(form.errors, redirect)

    return form.cleaned_data


def _share_the_messages_framework_to_inertia(request):
    """Middleware helper to transfer Django messages framework messages to Inertia shared props."""
    messages = []
    for message in get_messages(request):
        message = {
            "message": message.message,
            "level": message.level,
            "tags": message.tags,
            "extra_tags": message.extra_tags,
            "level_tag": message.level_tag,
        }
        messages.append(message)
    share(request, messages=messages)


def _share_validation_errors_to_inertia(request):
    validation_errors = request.session.get(VALIDATION_ERRORS_SESSION_KEY, None)
    is_inertia_get_request = request.method == "GET" and "X-Inertia" in request.headers

    if is_inertia_get_request and validation_errors is not None:
        request.session.pop(VALIDATION_ERRORS_SESSION_KEY)
        request.session.modified = True
        share(request, errors=validation_errors)


class DataShareMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest):
        self._before_calling_view(request)
        response = self.get_response(request)
        self._after_calling_view(request)
        return response

    def _before_calling_view(self, request):
        _share_the_messages_framework_to_inertia(request)
        _share_validation_errors_to_inertia(request)

    def _after_calling_view(self, request):
        pass

    def process_exception(self, request, exception):
        if isinstance(exception, InertiaValidationError):
            errors = {field: errors[0] for field, errors in exception.errors.items()}
            request.session[VALIDATION_ERRORS_SESSION_KEY] = errors
            request.session.modified = True
            return exception.redirect
        return None
