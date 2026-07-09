import { createContext, useContext } from 'react'
import type { ThemeMode } from './theme'

export interface ThemeModeContextValue {
  mode: ThemeMode
  toggleMode: () => void
}

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

export function useThemeMode(): ThemeModeContextValue {
  const value = useContext(ThemeModeContext)
  if (!value) {
    throw new Error('useThemeMode must be used inside a ThemeModeProvider')
  }
  return value
}
