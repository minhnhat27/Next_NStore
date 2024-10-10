import axios from 'axios'
import { NextRequest } from 'next/server'
import { authHeader } from '~/lib/auth-service'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.API_URL + '/api/auth'

export async function POST(req: NextRequest) {
  try {
    const data: { password: string } = await req.json()
    const auth: AuthHeaderType = await authHeader()
    const res = await axios.post(API_URL + '/check-password', data, { headers: auth })
    return NextSuccess(res.data, res.status)
  } catch (error) {
    return NextError(error)
  }
}
