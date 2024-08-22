import axios from 'axios'
import dayjs from 'dayjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.API_URL + '/api/auth'

export async function POST(req: NextRequest) {
  try {
    const data: LoginType = await req.json()
    const res = await axios.post(API_URL + '/login', data)

    const dataRes: LoginResType = res.data
    cookies().set('NStore_TOKEN', dataRes?.accessToken, {
      httpOnly: true,
      expires: dayjs().add(1, 'd').toDate(),
    })
    cookies().set('NStore_RTOKEN', dataRes.refreshToken, {
      httpOnly: true,
      expires: dayjs().add(1, 'd').toDate(),
    })

    const { accessToken, refreshToken, ...userData } = dataRes
    cookies().set('NStore_USER', JSON.stringify(userData), {
      expires: dayjs().add(1, 'd').toDate(),
    })
    return NextSuccess(userData, res.status)
  } catch (error: any) {
    return NextError(error)
  }
}
