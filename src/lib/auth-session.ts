'use server'

import { cookies } from 'next/headers'

export const logout = async (): Promise<void> => {
  cookies().delete('NStore_TOKEN')
  cookies().delete('NStore_RTOKEN')
  cookies().delete('NStore_USER')
}

export const getSession = async (): Promise<any> => {
  const session = cookies().get('NStore_USER')?.value
  return session ? JSON.parse(session) : null
}
