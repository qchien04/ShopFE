import dayjs from 'dayjs'

const JWT = 'jwtToken'


export function getStoredAuth(): string | null {
  const storedAuth = typeof window !== 'undefined' ? localStorage.getItem(JWT) : ''
  return storedAuth
}

export function checkAuth(): string {
  const now: number = dayjs().unix()
  const accessToken: string | null = getStoredAuth()
  if (!!accessToken) return accessToken
  return ''
}

export function setStoredAuth(auth: string): void {
  localStorage.setItem(JWT, JSON.stringify(auth))
}

export function clearStoredAuth(): void {
  localStorage.removeItem(JWT)
}

// Set localStorage common
export function getLocalStored(key: string): any {
  const stored = typeof window !== 'undefined' ? localStorage.getItem(key) : ''
  return stored ? JSON.parse(stored) : null
}

export function setLocalStored(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export function clearLocalStored(key: string): void {
  localStorage.removeItem(key)
}
