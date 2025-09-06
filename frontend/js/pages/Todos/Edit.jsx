import { Form, Link } from '@inertiajs/react'

export default function TodosEdit({ todo }) {
  return (
    <div className='w-full max-w-lg'>
      <div className='mb-4'>
        <Link href='/todos/' className='text-blue-600'>
          ← Back
        </Link>
      </div>
      <h1 className='text-2xl font-semibold mb-6'>Edit Todo #{todo.id}</h1>
      <Form action={`/todos/${todo.id}/edit/`} method='post' setDefaultsOnSuccess className='space-y-4'>
        {({ processing }) => (
          <>
            <div>
              <label htmlFor='title' className='block text-sm font-medium'>
                Title
              </label>
              <input
                id='title'
                name='title'
                defaultValue={todo.title}
                className='mt-1 block w-full border rounded px-3 py-2'
              />
            </div>
            <div className='flex items-center gap-2'>
              <input
                id='completed'
                name='completed'
                type='checkbox'
                defaultChecked={todo.completed}
                className='h-4 w-4'
              />
              <label htmlFor='completed'>Completed</label>
            </div>
            <div className='flex items-center gap-2'>
              <button
                type='submit'
                disabled={processing}
                className='bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50'
              >
                Save
              </button>
              <Link href={`/todos/${todo.id}/delete/`} method='post' as='button' className='text-red-600'>
                Delete
              </Link>
            </div>
          </>
        )}
      </Form>
    </div>
  )
}
