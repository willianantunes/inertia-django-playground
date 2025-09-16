import { Form, Link } from '@inertiajs/react'
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'

interface User {
  name: string
}

interface Todo {
  id: number
  title: string
  completed: boolean
  created_at: string
  updated_at: string
}

interface PageTodos {
  has_previous: boolean
  has_next: boolean
  number: number
  num_pages: number
  results: Todo[]
}

interface PageTodosIndexProps {
  user: User
  page_todos: PageTodos
  errors?: Record<string, string | string[]>
}

export default function TodosIndex({ user, page_todos, errors }: PageTodosIndexProps) {
  const results = page_todos?.results ?? []
  const numPages = page_todos?.num_pages ?? 1
  const current = page_todos?.number ?? 1
  const hasPrev = page_todos?.has_previous ?? false
  const hasNext = page_todos?.has_next ?? false

  const windowSize = 5
  const half = Math.floor(windowSize / 2)
  let start = Math.max(1, current - half)
  const end = Math.min(numPages, start + windowSize - 1)
  start = Math.max(1, Math.min(start, end - windowSize + 1))
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <Box sx={{ width: '100%', maxWidth: 896, mx: 'auto' }}>
      <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ mb: 3 }}>
        <Typography variant='h5' fontWeight={600}>
          Hi, {user?.name}
        </Typography>
        <Stack direction='row' spacing={2}>
          <Button component={Link} href='/cards/'>
            Credit cards
          </Button>
          <Button component={Link} href='/auth/logout/' method='post' color='error' size='small'>
            Logout
          </Button>
        </Stack>
      </Stack>

      <Stack spacing={3} sx={{ mb: 3 }}>
        <Form action='/todos/create/' method='post' resetOnSuccess>
          {({ processing }) => (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'flex-start' }}>
              <TextField
                name='title'
                placeholder='New todo title'
                error={Boolean(errors?.title)}
                helperText={errors?.title ? String(errors.title) : ''}
                fullWidth
              />
              <Button type='submit' disabled={processing} variant='contained' color='success'>
                Add
              </Button>
            </Stack>
          )}
        </Form>

        {errors?.__all__ && (
          <Typography variant='body2' color='error'>
            {Array.isArray(errors.__all__) ? (
              errors.__all__.map((e, i) => <span key={i}>{String(e)} </span>)
            ) : (
              <span>{String(errors.__all__)}</span>
            )}
          </Typography>
        )}

        <Form action='/todos/upload-csv/' method='post' resetOnSuccess>
          {({ processing }) => (
            <>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                <input type='file' name='csv_file' accept='.csv,text/csv' />
                <Button type='submit' disabled={processing} variant='contained'>
                  Upload CSV
                </Button>
              </Stack>
              {errors?.csv_file && (
                <Typography variant='body2' color='error'>
                  {Array.isArray(errors.csv_file) ? (
                    errors.csv_file.map((e, i) => <span key={i}>{String(e)} </span>)
                  ) : (
                    <span>{String(errors.csv_file)}</span>
                  )}
                </Typography>
              )}
            </>
          )}
        </Form>
      </Stack>

      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align='center'>
                  No todos yet
                </TableCell>
              </TableRow>
            )}
            {results.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.id}</TableCell>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.completed ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Stack direction='row' spacing={2}>
                    <Button component={Link} href={`/todos/${t.id}/edit/`} size='small'>
                      edit
                    </Button>
                    <Button component={Link} href={`/todos/${t.id}/delete/`} method='post' color='error' size='small'>
                      delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ mt: 3 }}>
        <Typography variant='body2' color='text.secondary'>
          Page {current} of {numPages}
        </Typography>
        <Stack direction='row' spacing={1} component='nav' aria-label='Pagination'>
          <Button
            component={Link}
            href={`/todos/?page=1`}
            disabled={current <= 1}
            preserveScroll
            aria-label='First page'
          >
            First
          </Button>
          <Button
            component={Link}
            href={`/todos/?page=${current - 1}`}
            disabled={!hasPrev}
            preserveScroll
            aria-label='Previous page'
          >
            Prev
          </Button>
          {pages.map((p) => (
            <Button
              key={p}
              component={Link}
              href={`/todos/?page=${p}`}
              preserveScroll
              preserveState
              replace={p === current}
              aria-current={p === current ? 'page' : undefined}
              variant={p === current ? 'contained' : 'text'}
              size='small'
            >
              {p}
            </Button>
          ))}
          <Button
            component={Link}
            href={`/todos/?page=${current + 1}`}
            disabled={!hasNext}
            preserveScroll
            aria-label='Next page'
          >
            Next
          </Button>
          <Button
            component={Link}
            href={`/todos/?page=${numPages}`}
            disabled={current >= numPages}
            preserveScroll
            aria-label='Last page'
          >
            Last
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
