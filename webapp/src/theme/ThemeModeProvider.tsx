import { CssBaseline, ThemeProvider } from '@mui/material'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { buildTheme } from './theme'

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/** Follows the OS light/dark preference live. There's no in-app override - see the home page's
 * nav redesign, which dropped the manual light/dark toggle entirely. */
export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [prefersDark, setPrefersDark] = useState(systemPrefersDark)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => setPrefersDark(event.matches)
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  const theme = useMemo(() => buildTheme(prefersDark ? 'dark' : 'light'), [prefersDark])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
