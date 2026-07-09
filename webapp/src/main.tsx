import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { BrowserRouter } from 'react-router-dom'
import { apolloClient } from './apolloClient.ts'
import { AuthProvider } from './auth/AuthProvider.tsx'
import { ThemeModeProvider } from './theme/ThemeModeProvider.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <ThemeModeProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AuthProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeModeProvider>
    </ApolloProvider>
  </StrictMode>,
)
