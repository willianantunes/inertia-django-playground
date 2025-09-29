import { Form, Link } from '@inertiajs/react'
import {
  Box,
  Button,
  Grid,
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

interface CreditCard {
  id: number
  number: string
  issuer: string
  valid_from: string
  valid_to: string
  security_code: string
  created_at: string
  updated_at: string
}

interface PageCards {
  has_previous: boolean
  has_next: boolean
  number: number
  num_pages: number
  results: CreditCard[]
}

interface PageCreditCardsIndexProps {
  user: User
  page_cards: PageCards
  errors?: Record<string, string | string[]>
}

export default function CreditCardsIndex({ user, page_cards, errors }: PageCreditCardsIndexProps) {
  const results = page_cards?.results ?? []
  const numPages = page_cards?.num_pages ?? 1
  const current = page_cards?.number ?? 1
  const hasPrev = page_cards?.has_previous ?? false
  const hasNext = page_cards?.has_next ?? false

  const windowSize = 5
  const half = Math.floor(windowSize / 2)
  let start = Math.max(1, current - half)
  const end = Math.min(numPages, start + windowSize - 1)
  start = Math.max(1, Math.min(start, end - windowSize + 1))
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <Box sx={{ width: '100%', maxWidth: 1120, mx: 'auto' }}>
      <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ mb: 3 }}>
        <Typography variant='h5' fontWeight={600}>
          Credit cards - {user?.name}
        </Typography>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Button component={Link} href='/todos/'>
            Todos
          </Button>
          <Button component={Link} href='/auth/logout/' method='post' color='error' size='small'>
            Logout
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ mb: 3 }}>
        <Typography variant='h6' sx={{ mb: 1 }}>
          Add credit card
        </Typography>
        <Form action='/cards/create/' method='post' resetOnSuccess>
          {({ processing }) => (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  name='number'
                  placeholder='Card number'
                  label='Card number'
                  error={Boolean(errors?.number)}
                  helperText={errors?.number ? String(errors.number) : ''}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  name='issuer'
                  placeholder='Issuer (e.g., Visa, MasterCard, Bank)'
                  label='Issuer'
                  error={Boolean(errors?.issuer)}
                  helperText={errors?.issuer ? String(errors.issuer) : ''}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 4, md: 1 }}>
                <TextField
                  name='security_code'
                  placeholder='CVV'
                  label='CVV'
                  error={Boolean(errors?.security_code)}
                  helperText={errors?.security_code ? String(errors.security_code) : ''}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 4, md: 4 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    name='valid_from'
                    placeholder='(YYYY-MM-DD)'
                    label='Valid from'
                    error={Boolean(errors?.valid_from)}
                    helperText={errors?.valid_from ? String(errors.valid_from) : ''}
                    fullWidth
                  />
                  <TextField
                    name='valid_to'
                    placeholder='(YYYY-MM-DD)'
                    label='Valid to'
                    error={Boolean(errors?.valid_to)}
                    helperText={errors?.valid_to ? String(errors.valid_to) : ''}
                    fullWidth
                  />
                </Stack>
              </Grid>
              <Grid size={{ xs: 4, md: 2 }}>
                <Button type='submit' disabled={processing} variant='contained' color='success' fullWidth>
                  Add credit card
                </Button>
              </Grid>
              {errors?.__all__ && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' color='error'>
                    {Array.isArray(errors.__all__) ? (
                      errors.__all__.map((e, i) => <span key={i}>{String(e)} </span>)
                    ) : (
                      <span>{String(errors.__all__)}</span>
                    )}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </Form>
      </Box>

      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Issuer</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Valid Period</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align='center'>
                  No credit cards
                </TableCell>
              </TableRow>
            )}
            {results.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.issuer}</TableCell>
                <TableCell>**** {String(c.number).slice(-4)}</TableCell>
                <TableCell>
                  {c.valid_from} → {c.valid_to}
                </TableCell>
                <TableCell>
                  <details>
                    <summary>Edit</summary>
                    <Form action={`/cards/${c.id}/update/`} method='post' setDefaultsOnSuccess>
                      {({ processing, errors }) => (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid size={{ xs: 10, md: 3 }}>
                            <TextField
                              name='number'
                              defaultValue={c.number}
                              label='Card number'
                              error={Boolean(errors?.number)}
                              helperText={errors?.number ? String(errors.number) : ''}
                              fullWidth
                            />
                          </Grid>
                          <Grid size={{ xs: 10, md: 3 }}>
                            <TextField
                              name='issuer'
                              defaultValue={c.issuer}
                              label='Issuer'
                              error={Boolean(errors?.issuer)}
                              helperText={errors?.issuer ? String(errors.issuer) : ''}
                              fullWidth
                            />
                          </Grid>
                          <Grid size={{ xs: 10, md: 2 }}>
                            <TextField
                              name='security_code'
                              defaultValue={c.security_code}
                              label='CVV'
                              error={Boolean(errors?.security_code)}
                              helperText={errors?.security_code ? String(errors.security_code) : ''}
                              fullWidth
                            />
                          </Grid>
                          <Grid size={{ xs: 10, md: 4 }}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                              <TextField
                                name='valid_from'
                                defaultValue={c.valid_from}
                                label='Valid from'
                                error={Boolean(errors?.valid_from)}
                                helperText={errors?.valid_from ? String(errors.valid_from) : ''}
                                fullWidth
                              />
                              <TextField
                                name='valid_to'
                                defaultValue={c.valid_to}
                                label='Valid to'
                                error={Boolean(errors?.valid_to)}
                                helperText={errors?.valid_to ? String(errors.valid_to) : ''}
                                fullWidth
                              />
                            </Stack>
                          </Grid>
                          <Grid size={{ xs: 10, md: 2 }}>
                            <Stack direction='row' spacing={2}>
                              <Button type='submit' disabled={processing} variant='contained'>
                                Save
                              </Button>
                              <Button component={Link} href={`/cards/${c.id}/delete/`} method='post' color='error'>
                                Delete
                              </Button>
                            </Stack>
                          </Grid>
                          {errors?.__all__ && (
                            <Grid size={{ xs: 12 }}>
                              <Typography variant='body2' color='error'>
                                {Array.isArray(errors.__all__) ? (
                                  errors.__all__.map((e, i) => <span key={i}>{String(e)} </span>)
                                ) : (
                                  <span>{String(errors.__all__)}</span>
                                )}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      )}
                    </Form>
                  </details>
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
            href={`/cards/?page=1`}
            disabled={current <= 1}
            preserveScroll
            aria-label='First page'
          >
            First
          </Button>
          <Button
            component={Link}
            href={`/cards/?page=${current - 1}`}
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
              href={`/cards/?page=${p}`}
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
            href={`/cards/?page=${current + 1}`}
            disabled={!hasNext}
            preserveScroll
            aria-label='Next page'
          >
            Next
          </Button>
          <Button
            component={Link}
            href={`/cards/?page=${numPages}`}
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
