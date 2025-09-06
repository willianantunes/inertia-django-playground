import { Link, usePage } from '@inertiajs/react'

export default function Index({ authenticated }) {
  const { url } = usePage()
  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800'>
      <header className='mx-auto max-w-7xl px-6 py-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='h-10 w-10 rounded-xl bg-indigo-600/10 flex items-center justify-center'>
            <span className='text-xl font-extrabold text-indigo-600'>✓</span>
          </div>
          <span className='text-lg font-semibold'>Django + Inertia Todo</span>
        </div>
        <nav className='flex items-center gap-4'>
          {authenticated === false && (
            <Link href='/auth/login' className='text-sm text-slate-600 hover:text-slate-900'>
              Login
            </Link>
          )}
          <Link
            href='/todos/'
            className='inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400'
          >
            Use it now
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-4 w-4'>
              <path
                fillRule='evenodd'
                d='M4.5 12a.75.75 0 0 1 .75-.75h12.69l-3.22-3.22a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H5.25A.75.75 0 0 1 4.5 12Z'
                clipRule='evenodd'
              />
            </svg>
          </Link>
        </nav>
      </header>

      <main className='mx-auto max-w-7xl px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center'>
        <div className='space-y-6'>
          <div className='inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 text-xs font-medium ring-1 ring-emerald-200'>
            Classic productivity
          </div>
          <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900'>
            A classic Todo app built with Django, Inertia, and React
          </h1>
          <p className='text-lg leading-8 text-slate-600'>
            Capture tasks, mark them done, and keep your day organized. Server-side powered pages with a smooth
            single-page experience.
          </p>
          <div className='flex items-center gap-4'>
            <Link
              href='/todos'
              className='inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400'
            >
              Use it now
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-5 w-5'>
                <path
                  fillRule='evenodd'
                  d='M4.5 12a.75.75 0 0 1 .75-.75h12.69l-3.22-3.22a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H5.25A.75.75 0 0 1 4.5 12Z'
                  clipRule='evenodd'
                />
              </svg>
            </Link>
            <Link
              href='https://github.com'
              className='text-slate-600 hover:text-slate-900'
              target='_blank'
              rel='noreferrer'
            >
              Learn more
            </Link>
          </div>

          <ul className='mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <li className='flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200'>
              <div className='mt-1 text-emerald-600'>✓</div>
              <div>
                <div className='font-semibold text-slate-900'>Add and complete tasks</div>
                <div className='text-sm text-slate-600'>Stay focused with simple task management.</div>
              </div>
            </li>
            <li className='flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200'>
              <div className='mt-1 text-emerald-600'>✓</div>
              <div>
                <div className='font-semibold text-slate-900'>Fast & seamless</div>
                <div className='text-sm text-slate-600'>SPA-like navigation with server-side rendering.</div>
              </div>
            </li>
            <li className='flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200'>
              <div className='mt-1 text-emerald-600'>✓</div>
              <div>
                <div className='font-semibold text-slate-900'>Secure</div>
                <div className='text-sm text-slate-600'>Todos are protected behind login.</div>
              </div>
            </li>
            <li className='flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200'>
              <div className='mt-1 text-emerald-600'>✓</div>
              <div>
                <div className='font-semibold text-slate-900'>Modern stack</div>
                <div className='text-sm text-slate-600'>Django, Inertia.js, React, and Tailwind CSS.</div>
              </div>
            </li>
          </ul>
        </div>
        <div className='relative'>
          <div className='absolute -inset-4 rounded-3xl bg-indigo-100 blur-2xl opacity-60'></div>
          <div className='relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl'>
            <div className='flex items-center gap-3'>
              <div className='h-8 w-8 rounded-lg bg-indigo-600/10 flex items-center justify-center'>
                <span className='text-sm font-extrabold text-indigo-600'>✓</span>
              </div>
              <div className='font-semibold text-slate-900'>Your Todos</div>
            </div>
            <ul className='mt-4 space-y-3'>
              <li className='flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2'>
                <span className='text-slate-700'>Walk the dog</span>
                <span className='text-emerald-600'>Done</span>
              </li>
              <li className='flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2'>
                <span className='text-slate-700'>Plan the week</span>
                <span className='text-slate-400'>Open</span>
              </li>
              <li className='flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2'>
                <span className='text-slate-700'>Buy groceries</span>
                <span className='text-slate-400'>Open</span>
              </li>
            </ul>
            <div className='mt-6'>
              <Link
                href='/todos'
                className='w-full inline-flex justify-center items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800'
              >
                Try the app
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className='py-10 text-center text-sm text-slate-500'>
        Built with ❤️ using Django + Inertia + React + Tailwind
      </footer>
    </div>
  )
}
