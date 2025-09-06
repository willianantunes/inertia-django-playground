# Development guidelines

Tech stack you should focus on when executing tasks:

- Backend: Django.
- Frontend: React, inertiajs, and tailwindcss.

## Usage of `'@inertiajs/react'`

Inertia allows you to develop modern single-page React applications using classic server-side routing and controllers. When working with React, you must use Inertia to navigate between pages and submit forms, utilizing Django views and its forms.

### Links

To create links to other pages within an Inertia app, you will typically use the Inertia `<a>`component. This component is a light wrapper around a standard anchor `<a>` link that intercepts click events and prevents full page reloads.

#### Creating links

To create an Inertia link, use the Inertia `<a>` component. Any attributes you provide to this component will be proxied to the underlying HTML tag.

```jsx
import { Link } from '@inertiajs/react'

<Link href="/">Home</Link>
```

By default, Inertia renders links as anchor `<a>` elements. However, you can change the tag using the `as` prop.

```jsx
import { Link } from '@inertiajs/react'

<Link href="/logout" method="post" as="button">Logout</Link>

// Renders as...
<button type="button">Logout</button>
```

Creating `POST`/`PUT`/`PATCH`/ `DELETE` anchor `<a>` links is discouraged as it causes "Open Link in New Tab / Window" accessibility issues. The component automatically renders a `<button>` element when using these methods.

#### Method

You can specify the HTTP request method for an Inertia link request using the `method` prop. The default method used by links is `GET`, but you can use the `method` prop to make `POST`, `PUT`, `PATCH`, and `DELETE` requests via links.

```jsx
import { Link } from '@inertiajs/react'

<Link href="/logout" method="post" as="button">Logout</Link>
```

#### Data

When making `POST` or `PUT` requests, you may wish to add additional data to the request. You can accomplish this using the `data` prop. The provided data can be an `object` or `FormData` instance.

```jsx
import { Link } from '@inertiajs/react'

<Link href="/endpoint" method="post" data={{ foo: bar }}>Save</Link>
```

#### Custom headers

The `headers` prop allows you to add custom headers to an Inertia link. However, the headers Inertia uses internally to communicate its state to the server take priority and therefore cannot be overwritten.

```jsx
import { Link } from '@inertiajs/react'

<Link href="/endpoint" headers={{ foo: bar }}>Save</Link>
```

#### Browser history

The `replace` prop allows you to specify the browser's history behavior. By default, page visits push (new) state (`window.history.pushState`) into the history; however, it's also possible to replace state (`window.history.replaceState`) by setting the `replace` prop to `true`. This will cause the visit to replace the current history state instead of adding a new history state to the stack.

```jsx
import { Link } from '@inertiajs/react'

<Link replace href="/">Home</Link>
```

#### State preservation

You can preserve a page component's local state using the `preserve-state` prop. This will prevent a page component from fully re-rendering. The `preserve-state` prop is especially helpful on pages that contain forms, since you can avoid manually repopulating input fields and can also maintain a focused input.

```jsx
import { Link } from '@inertiajs/react'

<input onChange={this.handleChange} value={query} type="text" />

<Link href="/search" data={query} preserveState>Search</Link>
```

#### Scroll preservation

You can use the `preserveScroll` prop to prevent Inertia from automatically resetting the scroll position when making a page visit.

```jsx
import { Link } from '@inertiajs/react'

<Link preserveScroll href="/">Home</Link>
```

#### Partial reloads

The `only` prop allows you to specify that only a subset of a page's props (data) should be retrieved from the server on subsequent visits to that page.

```jsx
import { Link } from '@inertiajs/react'

<Link href="/users?active=true" only={['users']}>Show active</Link>
```

#### Active states

It's common to set an active state for navigation links based on the current page. This can be accomplished when using Inertia by inspecting the `page` object and doing string comparisons against the `page.url` and `page.component` properties.

```jsx
import { usePage } from '@inertiajs/react'

const { url, component } = usePage()

// URL exact match...
<Link href="/users" className={url === '/users' ? 'active' : ''}>Users</Link>

// Component exact match...
<Link href="/users" className={component === 'Users/Index' ? 'active' : ''}>Users</Link>

// URL starts with (/users, /users/create, /users/1, etc.)...
<Link href="/users" className={url.startsWith('/users') ? 'active' : ''}>Users</Link>

// Component starts with (Users/Index, Users/Create, Users/Show, etc.)...
<Link href="/users" className={component.startsWith('Users') ? 'active' : ''}>Users</Link>
```

You can perform exact match comparisons (`===`), `startsWith()` comparisons (useful for matching a subset of pages), or even more complex comparisons using regular expressions.

Using this approach, you're not limited to just setting class names. You can use this technique to conditionally render any markup on active state, such as different link text or even an SVG icon that represents the link is active.

#### Data loading attribute

While a link is making an active request, a `data-loading` attribute is added to the link element. This allows you to style the link while it's in a loading state. The attribute is removed once the request is complete.

### Forms

Inertia provides two primary ways to build forms: the `<Form>` component and the `useForm` helper. Both integrate with your server-side framework's validation and handle form submissions without full page reloads.

#### Form component

Inertia provides a `<Form>` component that behaves much like a classic HTML form, but uses Inertia under the hood to avoid full page reloads. This is the simplest way to get started with forms in Inertia.

```jsx
import { Form } from '@inertiajs/react'
export default () => (
<Form action="/users" method="post">
<input type="text" name="name" />
<input type="email" name="email" />
<button type="submit">Create User</button>
</Form>
)
```

Just like a traditional HTML form, there is no need to attach an `onChange` handler to your input fields, just give each input a `name` attribute and a `defaultValue` (if applicable) and the `Form` component will handle the data submission for you.

The component also supports nested data structures, file uploads, and dotted key notation.

```jsx
<Form action="/reports" method="post">
<input type="text" name="name" />
<textarea name="report[description]"></textarea>
<input type="text" name="report[tags][]" />
<input type="file" name="documents" multiple />
<button type="submit">Create Report</button>
</Form>
```

You can pass a `transform` prop to modify the form data before submission. This is useful for injecting additional fields or transforming existing data, although hidden inputs work too.

```jsx
<Form
  action="/posts"
  method="post"
  transform={data => ({ ...data, user_id: 123 })}
>
  <input type="text" name="title" />
  <button type="submit">Create Post</button>
</Form>
```

##### Checkbox inputs

When working with checkboxes, you may want to add an explicit `value` attribute such as `value="1"`. Without a value attribute, checked checkboxes will submit as `"on"`, which some server-side validation rules may not recognize as a proper boolean value.

##### Slot props

The `<Form>` component exposes reactive state and helper methods through its default slot, giving you access to form processing state, errors, and utility functions.

```jsx
<Form action="/users" method="post">
  {({
    errors,
    hasErrors,
    processing,
    progress,
    wasSuccessful,
    recentlySuccessful,
    setError,
    clearErrors,
    resetAndClearErrors,
    defaults,
    isDirty,
    reset,
    submit,
  }) => (
    <>
      <input type="text" name="name" />

      {errors.name && <div>{errors.name}</div>}

      <button type="submit" disabled={processing}>
        {processing ? 'Creating...' : 'Create User'}
      </button>

      {wasSuccessful && <div>User created successfully!</div>}
    </>
  )}
</Form>
```

The `defaults` method allows you to update the form's default values to match the current field values. When called, subsequent `reset()` calls will restore fields to these new defaults, and the `isDirty` property will track changes from these updated defaults. Unlike `useForm`, this method accepts no arguments and always uses all current form values.

The `errors` object uses dotted notation for nested fields, allowing you to display validation messages for complex form structures.

```jsx
<Form action="/users" method="post">
  {({ errors }) => (
    <>
      <input type="text" name="user.name" />
      {errors['user.name'] && <div>{errors['user.name']}</div>}
    </>
  )}
</Form>
```

##### Props and options

In addition to `action` and `method`, the `<Form>` component accepts several props. Many of them are identical to the options available in Inertia's visit options.

```jsx
<Form
  action="/profile"
  method="put"
  errorBag="profile"
  queryStringArrayFormat="indices"
  headers={{ 'X-Custom-Header': 'value' }}
  showProgress={false}
  transform={data => ({ ...data, timestamp: Date.now() })}
  invalidateCacheTags={['users', 'dashboard']}
  disableWhileProcessing
  options={{
    preserveScroll: true,
    preserveState: true,
    preserveUrl: true,
    replace: true,
    only: ['users', 'flash'],
    except: ['secret'],
    reset: ['page'],
  }}
>
  <input type="text" name="name" />
  <button type="submit">Update</button>
</Form>
```

Some props are intentionally grouped under `options` instead of being top-level to avoid confusion. For example, `only`, `except`, and `reset` relate to *partial reloads*, not *partial submissions*. The general rule: top-level props are for the form submission itself, while `options` control how Inertia handles the subsequent visit.

When setting the `disableWhileProcessing` prop, the `Form` component will add the `inert` attribute to the HTML `form`tag while the form is processing to prevent user interaction.

To style the form while it's processing, you can target the inert form in the following ways.

Tailwind 4:

```jsx
<Form
    action="/profile"
    method="put"
    disableWhileProcessing
    className="inert:opacity-50 inert:pointer-events-none"
>
    {/* Your form fields here */}
</Form>
```

##### Events

The `<Form>` component emits all the standard visit events for form submissions.

```jsx
<Form
  action="/users"
  method="post"
  onCancelToken={handleCancelToken}
  onBefore={handleBefore}
  onStart={handleStart}
  onProgress={handleProgress}
  onCancel={handleCancel}
  onSuccess={handleSuccess}
  onError={handleError}
  onFinish={handleFinish}
>
  <input type="text" name="name" />
  <button type="submit">Create User</button>
</Form>
```

##### Resetting the Form

The `Form` component provides several attributes that allow you to reset the form after a submission.

`resetOnSuccess` may be used to reset the form after a successful submission.

```jsx
// Reset the entire form on success
<Form action="/users" method="post" resetOnSuccess>
<input type="text" name="name" />
<input type="email" name="email" />
<button type="submit">Submit</button>
</Form>
// Reset specific fields on success
<Form action="/users" method="post" resetOnSuccess={['name']}>
<input type="text" name="name" />
<input type="email" name="email" />
<button type="submit">Submit</button>
</Form>
```

`resetOnError` may be used to reset the form after errors.

```jsx
// Reset the entire form on success
<Form action="/users" method="post" resetOnError>
<input type="text" name="name" />
<input type="email" name="email" />
<button type="submit">Submit</button>
</Form>
// Reset specific fields on success
<Form action="/users" method="post" resetOnError={['name']}>
<input type="text" name="name" />
<input type="email" name="email" />
<button type="submit">Submit</button>
</Form>
```

##### Setting new default values

The `Form` component provides the `setDefaultsOnSuccess` attribute to set the current form values as the new defaults after a successful submission.

```jsx
<Form action="/users" method="post" setDefaultsOnSuccess>
<input type="text" name="name" />
<input type="email" name="email" />
<button type="submit">Submit</button>
</Form>
```

##### Dotted key notation

The `<Form>` component supports dotted key notation for creating nested objects from flat input names. This provides a convenient way to structure form data.

```jsx
<Form action="/users" method="post">
<input type="text" name="user.name" />
<input type="text" name="user.skills[]" />
<input type="text" name="address.street" />
<button type="submit">Submit</button>
</Form>
```

The example above would generate the following data structure.

JSON:

```json
{
"user": {
"name": "John Doe",
"skills": ["JavaScript"]
},
"address": {
"street": "123 Main St"
}
}
```

If you need literal dots in your field names (not as nested object separators), you can escape them using backslashes.

```jsx
<Form action="/config" method="post">
<input type="text" name="app\\.name" />
<input type="text" name="settings.theme\\.mode" />
<button type="submit">Save</button>
</Form>
```

The example above would generate the following data structure.

JSON:

```json
{
"app.name": "My Application",
"settings": {
"theme.mode": "dark"
}
}
```

##### Programmatic access

You can access the form's methods programmatically using refs. This provides an alternative to [slot props](#slot-props) when you need to trigger form actions from outside the form.

```jsx
import { useRef } from 'react'
import { Form } from '@inertiajs/react'

export default function CreateUser() {
  const formRef = useRef()

  const handleSubmit = () => {
    formRef.current.submit()
  }

  return (
    <>
      <Form ref={formRef} action="/users" method="post">
        <input type="text" name="name" />
        <button type="submit">Submit</button>
      </Form>

      <button onClick={handleSubmit}>Submit Programmatically</button>
    </>
  )
}
```

In React, refs provide access to all form methods and reactive state.

#### Form helper

In addition to the `<Form>` component, Inertia also provides a `useForm` helper for when you need programmatic control over your form's data and submission behavior.

```jsx
import { useForm } from '@inertiajs/react'
const { data, setData, post, processing, errors } = useForm({
email: '',
password: '',
remember: false,
})
function submit(e) {
e.preventDefault()
post('/login')
}
return (
<form onSubmit={submit}>
<input type="text" value={data.email} onChange={e => setData('email', e.target.value)} />
{errors.email && <div>{errors.email}</div>}
<input type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
{errors.password && <div>{errors.password}</div>}
<input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} /> Remember Me
<button type="submit" disabled={processing}>Login</button>
</form>
)
```

To submit the form, you may use the `get`, `post`, `put`, `patch`and `delete` methods.

```js
const { submit, get, post, put, patch, delete: destroy } = useForm({ ... })
submit(method, url, options)
get(url, options)
post(url, options)
put(url, options)
patch(url, options)
destroy(url, options)
```

The submit methods support all of the typical visit options, such as `preserveState`, `preserveScroll`, and event callbacks, which can be helpful for performing tasks on successful form submissions. For example, you might use the `onSuccess` callback to reset inputs to their original state.

```js
const { post, reset } = useForm({ ... })
post('/profile', {
preserveScroll: true,
onSuccess: () => reset('password'),
})
```

If you need to modify the form data before it's sent to the server, you can do so via the `transform()` method.

```js
const { transform } = useForm({ ... })
transform((data) => ({
...data,
remember: data.remember ? 'on' : '',
}))
```

You can use the `processing` property to track if a form is currently being submitted. This can be helpful for preventing double form submissions by disabling the submit button.

```jsx
const { processing } = useForm({ ... })

<button type="submit" disabled={processing}>Submit</button>
```

If your form is uploading files, the current progress event is available via the `progress` property, allowing you to easily display the upload progress.

```jsx
const { progress } = useForm({ ... })
{progress && (
<progress value={progress.percentage} max="100">
{progress.percentage}%
</progress>
)}
```

##### Form errors

If there are form validation errors, they are available via the `errors` property.

```jsx
const { errors } = useForm({ ... })
{errors.email && <div>{errors.email}</div>}
```

To determine if a form has any errors, you may use the `hasErrors` property. To clear form errors, use the `clearErrors()` method.

```js
const { clearErrors } = useForm({ ... })
// Clear all errors...
clearErrors()
// Clear errors for specific fields...
clearErrors('field', 'anotherfield')
```

If you're using client-side input validation libraries or do client-side validation manually, you can set your own errors on the form using the `setErrors()` method.

```js
const { setError } = useForm({ ... })
// Set a single error...
setError('field', 'Your error message.');
// Set multiple errors at once...
setError({
foo: 'Your error message for the foo field.',
bar: 'Some other error for the bar field.'
});
```

Unlike an actual form submission, the page's props remain unchanged when manually setting errors on a form instance.

When a form has been successfully submitted, the `wasSuccessful` property will be `true`. In addition to this, forms have a `recentlySuccessful` property, which will be set to `true` for two seconds after a successful form submission. This property can be utilized to show temporary success messages.

##### Resetting the Form

To reset the form's values back to their default values, you can use the `reset()` method.

```js
const { reset } = useForm({ ... })
// Reset the form...
reset()
// Reset specific fields...
reset('field', 'anotherfield')
```

Sometimes, you may want to restore your form fields to their default values and clear any validation errors at the same time. Instead of calling `reset()` and `clearErrors()` separately, you can use the `resetAndClearErrors()` method, which combines both actions into a single call.

```js
const { resetAndClearErrors } = useForm({ ... })
// Reset the form and clear all errors...
resetAndClearErrors()
// Reset specific fields and clear their errors...
resetAndClearErrors('field', 'anotherfield')
```

#### Server-side validation

Both the `<Form>` component and `useForm` helper automatically handle server-side validation errors. When your server returns validation errors, they're automatically available in the `errors` object without any additional configuration.

Unlike traditional XHR/fetch requests where you might check for a `422` status code, Inertia handles validation errors as part of its redirect-based flow, just like classic server-side form submissions, but without the full page reload.

## Working with Django

### Basic rules

- Only function-based views are allowed, given `inertia-django` does not support class-based views.
- Use Django's built-in authentication system for user management.

### Forms

When the frontend is built with React and Inertia, Django forms are still used for server-side validation. Take a look at the example below.

Usage:

- Define form fields as class attributes.
- Instantiate with data to bind data. Normally is `request.POST`, but [inertia sends data as JSON](https://github.com/inertiajs/inertia-django/issues/21#issue-1581888431), so use `json.loads(request.body)`.
- Use `is_valid()` to validate data.
- Access cleaned data via `cleaned_data` attribute.

#### Scenarios

If your inertiajs form has a contact form with `name` and `message` fields, you can create a Django form like this:

```python
from django import forms

class ContactForm(forms.Form):
    name = forms.CharField(max_length=100)
    message = forms.CharField(widget=forms.Textarea)
```

Then in your Django view, you can handle the form submission like this:

```python
@require_http_methods(["POST"])
def contact_view(request):
    form = ContactForm(json.loads(request.body))
    if form.is_valid():
        # Put the code to process the data in form.cleaned_data
        return HttpResponseRedirect('/success/')
    return render(request, 'page', {'form': form.errors})
```

## Testing information

DO NOT WRITE TESTS.