import { createContext, useContext } from 'react'

export interface AuthContextValue {
  /** Signed-in user's email, or null when signed out. */
  email: string | null
  /** True until the initial session check completes on page load. */
  initialising: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return value
}
