import { useEffect, useState, type ReactNode } from 'react'
import { apolloClient } from '../apolloClient'
import { AuthContext } from './authContext'
import * as cognito from './cognito'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null)
  const [initialising, setInitialising] = useState(true)

  useEffect(() => {
    cognito.currentUserEmail().then((value) => {
      setEmail(value)
      setInitialising(false)
    })
  }, [])

  async function signIn(userEmail: string, password: string) {
    await cognito.signIn(userEmail, password)
    setEmail(await cognito.currentUserEmail())
  }

  function signOut() {
    cognito.signOut()
    setEmail(null)
    apolloClient.clearStore() // don't keep the signed-out user's data cached
  }

  return (
    <AuthContext.Provider value={{ email, initialising, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
