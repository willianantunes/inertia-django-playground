import { Link, usePage } from '@inertiajs/react'
import { Box, Button, Container, Grid, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material'

export default function Index({ authenticated }) {
  const { url } = usePage()
  return (
    <Box>
      <Container maxWidth='lg' sx={{ py: 8 }}>
        <Stack spacing={6}>
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Typography variant='h4' fontWeight={700}>
              Django + Inertia Todo
            </Typography>
            <Stack direction='row' spacing={2}>
              {authenticated === false && (
                <Button component={Link} href='/auth/login' color='primary'>
                  Login
                </Button>
              )}
              <Button component={Link} href='/todos/' variant='contained' color='primary'>
                Use it now
              </Button>
            </Stack>
          </Stack>

          <Grid container spacing={6} alignItems='center'>
            <Grid item xs={12} lg={6}>
              <Stack spacing={3}>
                <Typography variant='overline' color='success.main'>
                  Classic productivity
                </Typography>
                <Typography variant='h3' fontWeight={800}>
                  A classic Todo app built with Django, Inertia, and React
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  Capture tasks, mark them done, and keep your day organized. Server-side powered pages with a smooth
                  single-page experience.
                </Typography>
                <Stack direction='row' spacing={2}>
                  <Button component={Link} href='/todos' variant='contained'>
                    Use it now
                  </Button>
                  <Button component={Link} href='https://github.com' target='_blank' rel='noreferrer'>
                    Learn more
                  </Button>
                </Stack>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {[
                    { primary: 'Add and complete tasks', secondary: 'Stay focused with simple task management.' },
                    { primary: 'Fast & seamless', secondary: 'SPA-like navigation with server-side rendering.' },
                    { primary: 'Secure', secondary: 'Todos are protected behind login.' },
                    { primary: 'Modern stack', secondary: 'Django, Inertia.js, React, and MUI.' },
                  ].map((item, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Paper variant='outlined' sx={{ p: 2 }}>
                        <Typography variant='subtitle1' fontWeight={600}>
                          {item.primary}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {item.secondary}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                <Box>
                  <Typography variant='h6' gutterBottom>
                    MUI is installed
                  </Typography>
                  <Button variant='contained' color='primary' component={Link} href='/todos'>
                    Open Todos (MUI)
                  </Button>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Paper variant='outlined' sx={{ p: 3 }}>
                <Typography variant='subtitle1' fontWeight={600} gutterBottom>
                  Your Todos
                </Typography>
                <List>
                  <ListItem secondaryAction={<Typography color='success.main'>Done</Typography>}>
                    <ListItemText primary='Walk the dog' />
                  </ListItem>
                  <ListItem secondaryAction={<Typography color='text.secondary'>Open</Typography>}>
                    <ListItemText primary='Plan the week' />
                  </ListItem>
                  <ListItem secondaryAction={<Typography color='text.secondary'>Open</Typography>}>
                    <ListItemText primary='Buy groceries' />
                  </ListItem>
                </List>
                <Box sx={{ mt: 2 }}>
                  <Button component={Link} href='/todos' variant='contained' fullWidth>
                    Try the app
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Box>
            <Typography variant='body2' align='center' color='text.secondary'>
              Built with ❤️ using Django + Inertia + React + MUI
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
