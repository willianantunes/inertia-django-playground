import { render, screen } from '@testing-library/react'

import Layout from './Layout'

describe('Layout', () => {
  it('renders title and children', () => {
    render(
      <Layout>
        <div>Child content</div>
      </Layout>
    )
    expect(screen.getByText('Django + Inertia')).toBeInTheDocument()
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })
})
