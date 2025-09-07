import { Form, Link } from '@inertiajs/react'

export default function CreditCardsIndex({ user, page_cards, errors }) {
  const results = page_cards?.results ?? []
  const numPages = page_cards?.num_pages ?? 1
  const current = page_cards?.number ?? 1
  const hasPrev = page_cards?.has_previous ?? false
  const hasNext = page_cards?.has_next ?? false

  const windowSize = 5
  const half = Math.floor(windowSize / 2)
  let start = Math.max(1, current - half)
  let end = Math.min(numPages, start + windowSize - 1)
  start = Math.max(1, Math.min(start, end - windowSize + 1))
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <div className="w-full max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Credit cards - {user?.name}</h1>
        <div className="flex gap-4 items-center">
          <Link href="/todos/" className="text-blue-600">Todos</Link>
          <Link href='/auth/logout/' method='post' as='button' className='text-sm text-red-600'>Logout</Link>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Add credit card</h2>
        <Form action="/cards/create/" method="post" resetOnSuccess className="grid grid-cols-1 md:grid-cols-6 gap-2">
          {({ processing }) => (
            <>
              <div className="md:col-span-2">
                <input name="number" placeholder="Card number" className={`border rounded px-3 py-2 w-full ${errors?.number ? 'border-red-500' : ''}`} />
                {errors?.number && <div className="mt-1 text-red-600 text-sm">{String(errors.number)}</div>}
              </div>
              <div className="md:col-span-2">
                <input name="issuer" placeholder="Issuer (e.g., Visa, MasterCard, Bank)" className={`border rounded px-3 py-2 w-full ${errors?.issuer ? 'border-red-500' : ''}`} />
                {errors?.issuer && <div className="mt-1 text-red-600 text-sm">{String(errors.issuer)}</div>}
              </div>
              <div className="md:col-span-1">
                <input name="security_code" placeholder="CVV" className={`border rounded px-3 py-2 w-full ${errors?.security_code ? 'border-red-500' : ''}`} />
                {errors?.security_code && <div className="mt-1 text-red-600 text-sm">{String(errors.security_code)}</div>}
              </div>
              <div className="md:col-span-1">
                <div className="flex gap-2">
                  <div className="w-full">
                    <input name="valid_from" placeholder="Valid from (YYYY-MM-DD)" className={`border rounded px-3 py-2 w-full ${errors?.valid_from ? 'border-red-500' : ''}`} />
                    {errors?.valid_from && <div className="mt-1 text-red-600 text-sm">{String(errors.valid_from)}</div>}
                  </div>
                  <div className="w-full">
                    <input name="valid_to" placeholder="Valid to (YYYY-MM-DD)" className={`border rounded px-3 py-2 w-full ${errors?.valid_to ? 'border-red-500' : ''}`} />
                    {errors?.valid_to && <div className="mt-1 text-red-600 text-sm">{String(errors.valid_to)}</div>}
                  </div>
                </div>
              </div>
              <div className="md:col-span-1">
                <button type="submit" disabled={processing} className="bg-green-600 text-white rounded px-4 py-2 w-full disabled:opacity-50">Add credit card</button>
              </div>
              {errors?.__all__ && (
                <div className="md:col-span-6 text-red-600 text-sm">
                  {Array.isArray(errors.__all__) ? errors.__all__.map((e, i) => <div key={i}>{String(e)}</div>) : <div>{String(errors.__all__)}</div>}
                </div>
              )}
            </>
          )}
        </Form>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Issuer</th>
              <th className="px-4 py-2 text-left">Number</th>
              <th className="px-4 py-2 text-left">Valid Period</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y'>
            {results.length === 0 && (
              <tr>
                <td colSpan={4} className='px-4 py-4 text-center text-gray-500'>No credit cards</td>
              </tr>
            )}
            {results.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-2">{c.issuer}</td>
                <td className="px-4 py-2">**** {String(c.number).slice(-4)}</td>
                <td className="px-4 py-2">{c.valid_from} → {c.valid_to}</td>
                <td className="px-4 py-2">
                  <details>
                    <summary className="cursor-pointer text-blue-600 inline-block mb-2">Edit</summary>
                    <Form action={`/cards/${c.id}/update/`} method="post" setDefaultsOnSuccess className="grid grid-cols-1 md:grid-cols-6 gap-2">
                      {({ processing, errors }) => (
                        <>
                          <div className="md:col-span-2">
                            <input name="number" defaultValue={c.number} className={`border rounded px-3 py-2 w-full ${errors?.number ? 'border-red-500' : ''}`} />
                            {errors?.number && <div className="mt-1 text-red-600 text-sm">{String(errors.number)}</div>}
                          </div>
                          <div className="md:col-span-2">
                            <input name="issuer" defaultValue={c.issuer} className={`border rounded px-3 py-2 w-full ${errors?.issuer ? 'border-red-500' : ''}`} />
                            {errors?.issuer && <div className="mt-1 text-red-600 text-sm">{String(errors.issuer)}</div>}
                          </div>
                          <div className="md:col-span-1">
                            <input name="security_code" defaultValue={c.security_code} className={`border rounded px-3 py-2 w-full ${errors?.security_code ? 'border-red-500' : ''}`} />
                            {errors?.security_code && <div className="mt-1 text-red-600 text-sm">{String(errors.security_code)}</div>}
                          </div>
                          <div className="md:col-span-1">
                            <div className="flex gap-2">
                              <div className="w-full">
                                <input name="valid_from" defaultValue={c.valid_from} className={`border rounded px-3 py-2 w-full ${errors?.valid_from ? 'border-red-500' : ''}`} />
                                {errors?.valid_from && <div className="mt-1 text-red-600 text-sm">{String(errors.valid_from)}</div>}
                              </div>
                              <div className="w-full">
                                <input name="valid_to" defaultValue={c.valid_to} className={`border rounded px-3 py-2 w-full ${errors?.valid_to ? 'border-red-500' : ''}`} />
                                {errors?.valid_to && <div className="mt-1 text-red-600 text-sm">{String(errors.valid_to)}</div>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 md:col-span-1">
                            <button type="submit" disabled={processing} className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50">Save</button>
                            <Link href={`/cards/${c.id}/delete/`} method="post" as="button" className="text-red-600">Delete</Link>
                          </div>
                          {errors?.__all__ && (
                            <div className="md:col-span-6 text-red-600 text-sm">
                              {Array.isArray(errors.__all__) ? errors.__all__.map((e, i) => <div key={i}>{String(e)}</div>) : <div>{String(errors.__all__)}</div>}
                            </div>
                          )}
                        </>
                      )}
                    </Form>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='mt-6 flex items-center justify-between'>
        <div className='text-sm text-gray-600'>
          Page {current} of {numPages}
        </div>
        <nav className='inline-flex items-center gap-1' aria-label='Pagination'>
          <Link href={`/cards/?page=1`} as='button' className={`px-3 py-1 rounded border ${current > 1 ? 'text-gray-700' : 'text-gray-400 cursor-not-allowed opacity-50'}`} disabled={current <= 1} preserveScroll aria-label='First page'>
            First
          </Link>
          <Link href={`/cards/?page=${current - 1}`} as='button' className={`px-3 py-1 rounded border ${hasPrev ? 'text-gray-700' : 'text-gray-400 cursor-not-allowed opacity-50'}`} disabled={!hasPrev} preserveScroll aria-label='Previous page'>
            Prev
          </Link>
          {pages.map((p) => (
            <Link key={p} href={`/cards/?page=${p}`} className={`px-3 py-1 rounded border ${p === current ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700'}`} preserveScroll preserveState replace={p === current} aria-current={p === current ? 'page' : undefined}>
              {p}
            </Link>
          ))}
          <Link href={`/cards/?page=${current + 1}`} as='button' className={`px-3 py-1 rounded border ${hasNext ? 'text-gray-700' : 'text-gray-400 cursor-not-allowed opacity-50'}`} disabled={!hasNext} preserveScroll aria-label='Next page'>
            Next
          </Link>
          <Link href={`/cards/?page=${numPages}`} as='button' className={`px-3 py-1 rounded border ${current < numPages ? 'text-gray-700' : 'text-gray-400 cursor-not-allowed opacity-50'}`} disabled={current >= numPages} preserveScroll aria-label='Last page'>
            Last
          </Link>
        </nav>
      </div>
    </div>
  )
}
