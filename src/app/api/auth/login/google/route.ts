import axios from 'axios'
import dayjs from 'dayjs'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.API_URL + '/api/auth'

export async function POST(req: NextRequest) {
  try {
    const dataReq = await req.json()
    const res = await axios.post(API_URL + '/login/google', dataReq)

    const data: LoginResType = res.data
    const { accessToken, expires, ...userData } = data
    const t_expires = new Date(expires)
    cookies().set('NStore_TOKEN', accessToken, { httpOnly: true, expires: t_expires })
    cookies().set('NStore_USER', JSON.stringify(userData), { expires: t_expires })

    return NextSuccess(userData, res.status)
  } catch (error: any) {
    return NextError(error)
  }
}
