import type { PropsWithChildren } from 'react'
import { Link as InertiaLink } from '@inertiajs/react'
import { AppBar, Box, Button, Container, CssBaseline, Toolbar, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({})

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
        <AppBar position='static' color='default' elevation={0}>
          <Toolbar>
            <Container maxWidth='lg' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant='h6' component='div'>
                Django + Inertia
              </Typography>
              <Box>
                <Button component={InertiaLink} href='/' color='primary'>
                  Home
                </Button>
              </Box>
            </Container>
          </Toolbar>
        </AppBar>
        <Container maxWidth='lg' sx={{ py: 6 }}>
          {children}
        </Container>
      </Box>
    </ThemeProvider>
  )
}
