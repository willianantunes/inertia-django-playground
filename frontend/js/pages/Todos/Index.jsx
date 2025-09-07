import { Form, Link, usePage } from '@inertiajs/react'

export default function TodosIndex({ user, page_todos, errors }) {
  const results = page_todos?.results ?? []
  const numPages = page_todos?.num_pages ?? 1
  const current = page_todos?.number ?? 1
  const hasPrev = page_todos?.has_previous ?? false
  const hasNext = page_todos?.has_next ?? false

  // Build a compact window of up to 5 page numbers around the current page
  const windowSize = 5
  const half = Math.floor(windowSize / 2)
  let start = Math.max(1, current - half)
  let end = Math.min(numPages, start + windowSize - 1)
  // Adjust start if we don't have enough pages at the end
  start = Math.max(1, Math.min(start, end - windowSize + 1))
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <div className='w-full max-w-3xl'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-semibold'>Hi, {user?.name}</h1>
        <div className='flex items-center gap-4'>
          <Link href='/cards/' className='text-blue-600'>
            Credit cards
          </Link>
          <Link href='/auth/logout/' method='post' as='button' className='text-sm text-red-600'>
            Logout
          </Link>
        </div>
      </div>

      <div className='mb-6 space-y-4'>
        <Form action='/todos/create/' method='post' resetOnSuccess className='flex flex-col gap-2'>
          {({ processing }) => (
            <>
              <div className='flex gap-2 items-start'>
                <input
                  name='title'
                  placeholder='New todo title'
                  className={`flex-1 border rounded px-3 py-2 ${errors?.title ? 'border-red-500' : ''}`}
                  aria-invalid={errors?.title ? 'true' : undefined}
                />
                <button
                  type='submit'
                  disabled={processing}
                  className='bg-green-600 text-white rounded px-4 py-2 disabled:opacity-50'
                >
                  Add
                </button>
              </div>
              {errors?.title && (
                <div className='text-red-600 text-sm'>{String(errors.title)}</div>
              )}
            </>
          )}
        </Form>

        {errors?.__all__ && (
          <div className='text-red-600 text-sm'>
            {Array.isArray(errors.__all__) ? errors.__all__.map((e, i) => <div key={i}>{String(e)}</div>) : <div>{String(errors.__all__)}</div>}
          </div>
        )}

        <Form action='/todos/upload-csv/' method='post' resetOnSuccess className='flex items-center gap-2'>
          {({ processing }) => (
            <>
              <input type='file' name='file' accept='.csv,text/csv' className='flex-1 border rounded px-3 py-2' />
              <button
                type='submit'
                disabled={processing}
                className='bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50'
              >
                Upload CSV
              </button>
            </>
          )}
        </Form>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full border divide-y'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-2 text-left'>ID</th>
              <th className='px-4 py-2 text-left'>Title</th>
              <th className='px-4 py-2 text-left'>Completed</th>
              <th className='px-4 py-2 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y'>
            {results.length === 0 && (
              <tr>
                <td colSpan={4} className='px-4 py-4 text-center text-gray-500'>
                  No todos yet
                </td>
              </tr>
            )}
            {results.map((t) => (
              <tr key={t.id}>
                <td className='px-4 py-2'>{t.id}</td>
                <td className='px-4 py-2'>{t.title}</td>
                <td className='px-4 py-2'>{t.completed ? 'Yes' : 'No'}</td>
                <td className='px-4 py-2 space-x-3'>
                  <Link href={`/todos/${t.id}/edit/`} className='text-blue-600'>
                    edit
                  </Link>
                  <Link href={`/todos/${t.id}/delete/`} method='post' as='button' className='text-red-600'>
                    delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='mt-6 flex items-center justify-between'>
        <div className='text-sm text-gray-600'>
          Page {current} of {numPages}
        </div>
        <nav className='inline-flex items-center gap-1' aria-label='Pagination'>
          {/* First */}
          <Link
            href={`/todos/?page=1`}
            as='button'
            className={`px-3 py-1 rounded border ${current > 1 ? 'text-gray-700' : 'text-gray-400 cursor-not-allowed opacity-50'}`}
            disabled={current <= 1}
            preserveScroll
            aria-label='First page'
          >
            First
          </Link>
          {/* Prev */}
          <Link
            href={`/todos/?page=${current - 1}`}
            as='button'
            className={`px-3 py-1 rounded border ${hasPrev ? 'text-gray-700' : 'text-gray-400 cursor-not-allowed opacity-50'}`}
            disabled={!hasPrev}
            preserveScroll
            aria-label='Previous page'
          >
            Prev
          </Link>
          {/* Numbered window (max 5) */}
          {pages.map((p) => (
            <Link
              key={p}
              href={`/todos/?page=${p}`}
              className={`px-3 py-1 rounded border ${p === current ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700'}`}
              preserveScroll
              preserveState
              replace={p === current}
              aria-current={p === current ? 'page' : undefined}
            >
              {p}
            </Link>
          ))}
          {/* Next */}
          <Link
            href={`/todos/?page=${current + 1}`}
            as='button'
            className={`px-3 py-1 rounded border ${hasNext ? 'text-gray-700' : 'text-gray-400 cursor-not-allowed opacity-50'}`}
            disabled={!hasNext}
            preserveScroll
            aria-label='Next page'
          >
            Next
          </Link>
          {/* Last */}
          <Link
            href={`/todos/?page=${numPages}`}
            as='button'
            className={`px-3 py-1 rounded border ${current < numPages ? 'text-gray-700' : 'text-gray-400 cursor-not-allowed opacity-50'}`}
            disabled={current >= numPages}
            preserveScroll
            aria-label='Last page'
          >
            Last
          </Link>
        </nav>
      </div>
    </div>
  )
}
