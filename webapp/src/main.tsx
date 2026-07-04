import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { BrowserRouter } from 'react-router-dom'
import { apolloClient } from './apolloClient.ts'
import App from './App.tsx'

const theme = createTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </ApolloProvider>
  </StrictMode>,
)
