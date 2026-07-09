import { createTheme, type Theme } from '@mui/material'
import { darkTokens, lightTokens } from './tokens'

export type ThemeMode = 'light' | 'dark'

export function buildTheme(mode: ThemeMode): Theme {
  const tokens = mode === 'dark' ? darkTokens : lightTokens

  return createTheme({
    palette: {
      mode,
      primary: { main: tokens.primary },
      secondary: { main: tokens.secondary },
      warning: { main: tokens.accent },
      background: {
        default: tokens.bg,
        paper: tokens.surface,
      },
      text: {
        primary: tokens.ink,
        secondary: tokens.inkSoft,
      },
      divider: tokens.border,
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: tokens.primary,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  })
}
