'use server'

import { cookies } from 'next/headers'

export async function logout() {
  cookies().delete('NStore_TOKEN')
  // cookies().delete('NStore_RTOKEN')
  cookies().delete('NStore_USER')
}

export async function getUserInfo(): Promise<UserInfoType | undefined> {
  const session = cookies().get('NStore_USER')?.value
  return session ? JSON.parse(session) : undefined
}

export async function hasAuthSession() {
  return cookies().has('NStore_USER')
}

export async function authHeader() {
  
  const token = cookies().get('NStore_TOKEN')?.value
  return token ? { Authorization: 'Bearer ' + token } : {}
}
