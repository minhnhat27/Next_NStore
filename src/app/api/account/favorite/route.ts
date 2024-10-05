import axios from 'axios'
import { NextRequest } from 'next/server'
import { authHeader } from '~/lib/auth-service'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.API_URL + '/api/account'

export async function GET() {
  try {
    const auth: AuthHeaderType = await authHeader()
    const res = await axios.get(API_URL + '/favorite', { headers: auth })
    return NextSuccess(res.data, res.status)
  } catch (error) {
    return NextError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const auth: AuthHeaderType = await authHeader()
    const res = await axios.post(API_URL + '/favorite', data, { headers: auth })
    return NextSuccess(res.data, res.status)
  } catch (error) {
    return NextError(error)
  }
}
