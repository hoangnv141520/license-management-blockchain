import AuthService from '@/services/go/auth.service'
import { createSession, deleteSession } from './session'

export async function signOut() {
  await deleteSession()
  window.location.href = '/'
}

export async function signIn(payload: { email: string; password: string }) {
  try {
    const data = await AuthService.signIn(payload.email, payload.password)
    
    if (!data.token) {
      return false
    }

    await createSession({
      accessToken: data.token,
      role: data.role
    })

    return true
  } catch (error) {
    console.error('Error sign in', error)
    return false
  }
}