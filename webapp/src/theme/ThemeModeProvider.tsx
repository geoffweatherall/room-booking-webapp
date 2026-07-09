import { CssBaseline, ThemeProvider } from '@mui/material'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeModeContext } from './themeModeContext'
import { buildTheme, type ThemeMode } from './theme'

const STORAGE_KEY = 'room-booking-theme-mode'

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function readStoredMode(): ThemeMode | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => readStoredMode() ?? (systemPrefersDark() ? 'dark' : 'light'))

  // Follow the OS preference live, but only while the user hasn't made an explicit choice.
  useEffect(() => {
    if (readStoredMode() !== null) return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => setMode(event.matches ? 'dark' : 'light')
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  const toggleMode = () => {
    setMode((previous) => {
      const next = previous === 'dark' ? 'light' : 'dark'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }

  const theme = useMemo(() => buildTheme(mode), [mode])
  const contextValue = useMemo(() => ({ mode, toggleMode }), [mode])

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}
