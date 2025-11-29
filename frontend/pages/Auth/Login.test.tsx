import { __setPageProps } from '@inertiajs/react'
import { render, screen } from '@testing-library/react'

import Login from './Login'

describe('Auth/Login page', () => {
  it('renders Sign in title and form fields', () => {
    __setPageProps({ messages: [{ message: 'Welcome', level_tag: 'info' }] })
    render(<Login />)

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /Email/i })).toBeInTheDocument()
    // password fields have role "textbox" with type password in ARIA mapping; using label also works in many cases
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument()
  })
})
