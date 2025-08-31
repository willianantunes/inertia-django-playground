import { Link } from '@inertiajs/react'

const Layout = ({ children }) => (
  <>
    <div>
      <nav className='flex items-start justify-center'>
        <ul className='flex space-x-4'>
          <li>
            <Link href='/'>Home</Link>
            <Link href='/about'>About</Link>
          </li>
        </ul>
      </nav>
      <div className='flex items-center justify-center mt-32'>{children}</div>
    </div>
  </>
)

export default (page) => <Layout>{page}</Layout>
