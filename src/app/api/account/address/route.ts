import axios from 'axios'
import { NextRequest } from 'next/server'
import { authHeader } from '~/lib/auth-service'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.API_URL + '/api/account'

export async function GET() {
  try {
    const auth: AuthHeaderType = await authHeader()
    const res = await axios.get(API_URL + '/address', { headers: auth })
    return NextSuccess(res.data, res.status)
  } catch (error) {
    return NextError(error)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()
    const auth: AuthHeaderType = await authHeader()
    const res = await axios.put(API_URL + '/address', data, { headers: auth })
    return NextSuccess(res.data, res.status)
  } catch (error) {
    return NextError(error)
  }
}
