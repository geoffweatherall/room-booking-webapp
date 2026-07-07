import { Link as MuiLink, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/authContext'
import { ErrorBanner } from '../components/ErrorBanner'
import { SubmitButton } from '../components/SubmitButton'

export default function SignInPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Where RequireAuth sent us from, so sign-in returns the user there.
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signIn(email.trim(), password)
      navigate(from, { replace: true })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Sign in failed.')
      setLoading(false)
    }
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        Sign In
      </Typography>

      <ErrorBanner messages={error ? [error] : []} onDismiss={() => setError(null)} />

      <Paper sx={{ p: 3 }}>
        <Stack component="form" spacing={3} onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            autoFocus
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            fullWidth
          />
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <SubmitButton loading={loading}>Sign in</SubmitButton>
            <Typography variant="body2">
              No account yet?{' '}
              <MuiLink component={Link} to="/signup">
                Sign up
              </MuiLink>
              {' · '}
              <MuiLink component={Link} to="/forgot-password">
                Forgot password?
              </MuiLink>
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  )
}
