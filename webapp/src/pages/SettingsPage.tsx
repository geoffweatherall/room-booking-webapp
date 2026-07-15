import { Paper, Stack, Typography } from '@mui/material'
import { useAuth } from '../auth/authContext'

export default function SettingsPage() {
  const { displayName, email } = useAuth()

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        Settings
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack>
            <Typography variant="body2" color="text.secondary">
              Name
            </Typography>
            <Typography variant="body1">{displayName}</Typography>
          </Stack>
          <Stack>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">{email}</Typography>
          </Stack>
        </Stack>
      </Paper>
      <Typography variant="body2" color="text.secondary">
        There are no other settings to configure yet.
      </Typography>
    </Stack>
  )
}
