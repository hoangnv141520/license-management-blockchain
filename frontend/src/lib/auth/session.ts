import { ISessionPayload } from '@/types/auth'

const SESSION_KEY = 'session'

export async function createSession(payload: ISessionPayload) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(payload))
  }
}

export async function deleteSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
  }
}

export async function getSession(): Promise<ISessionPayload | null> {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem(SESSION_KEY)
    return session ? JSON.parse(session) : null
  }
  return null
}