import axios from 'axios'
import { NextRequest } from 'next/server'
import { authHeader } from '~/lib/auth-service'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.API_URL + '/api/orders'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const auth: AuthHeaderType = await authHeader()
    const res = await axios.get(API_URL, { headers: auth, params: searchParams })
    return NextSuccess(res.data, res.status)
  } catch (error: any) {
    return NextError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const data: CreateOrderType = await req.json()
    const auth: AuthHeaderType = await authHeader()

    const userIP = req.headers.get('x-forwarded-for') || req.ip

    const res = await axios.post(API_URL, { ...data, userIP }, { headers: auth })
    return NextSuccess(res.data, res.status)
  } catch (error: any) {
    return NextError(error)
  }
}
