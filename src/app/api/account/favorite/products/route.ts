import axios from 'axios'
import { NextRequest } from 'next/server'
import { authHeader } from '~/lib/auth-service'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.API_URL + '/api/account'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const auth: AuthHeaderType = await authHeader()
    const res = await axios.get(API_URL + '/favorite/products', {
      headers: auth,
      params: searchParams,
    })
    return NextSuccess(res.data, res.status)
  } catch (error) {
    return NextError(error)
  }
}
