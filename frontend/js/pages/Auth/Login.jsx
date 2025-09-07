import { Form, Link } from '@inertiajs/react'

export default function Login() {
  return (
    <div className='max-w-md w-full'>
      <h1 className='text-2xl font-semibold mb-6 text-center'>Sign in</h1>
      <Form action='/auth/login/' method='post' className='space-y-4'>
        {({ processing, errors }) => {
          console.log(`############`)
          console.log(errors)
          console.log(processing)
          return (
            <>
              <div>
                <label htmlFor='email' className='block text-sm font-medium'>
                  Email
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  required
                  className='mt-1 block w-full border rounded px-3 py-2'
                />
                {errors.email && <div className='text-red-600 text-sm mt-1'>{errors.email}</div>}
              </div>
              <div>
                <label htmlFor='password' className='block text-sm font-medium'>
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  required
                  className='mt-1 block w-full border rounded px-3 py-2'
                />
                {errors.password && <div className='text-red-600 text-sm mt-1'>{errors.password}</div>}
              </div>
              <div className='flex items-center justify-between'>
                <button
                  type='submit'
                  disabled={processing}
                  className='bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50'
                >
                  {processing ? 'Signing in...' : 'Sign in'}
                </button>
                <Link href='/' className='text-sm text-blue-600'>
                  Back to home
                </Link>
              </div>
            </>
          )
        }}
      </Form>
    </div>
  )
}
