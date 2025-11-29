import { render, screen } from '@testing-library/react'

import TodosEdit from './Edit'

describe('Todos/Edit page', () => {
  it('renders form with todo info', () => {
    render(<TodosEdit todo={{ id: 42, title: 'Test Todo', completed: false }} errors={{}} />)

    expect(screen.getByText('Edit Todo #42')).toBeInTheDocument()
    expect(screen.getByLabelText('Title')).toHaveValue('Test Todo')
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument()
  })
})
