import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'

function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            Room Booking
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Hello, world!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            The room-booking webapp is up and running.
          </Typography>
        </Box>
      </Container>
    </>
  )
}

export default App
