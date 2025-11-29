import { render, screen } from '@testing-library/react'
import TodosIndex from './Index'

describe('Todos/Index page', () => {
  it('renders greeting and empty state without crashing', () => {
    render(
      <TodosIndex
        user={{ name: 'Alice' }}
        page_todos={{
          has_previous: false,
          has_next: false,
          number: 1,
          num_pages: 1,
          results: [],
        }}
        errors={{}}
      />
    )

    expect(screen.getByText(/Hi, Alice/)).toBeInTheDocument()
    expect(screen.getByText('No todos yet')).toBeInTheDocument()
  })
})
