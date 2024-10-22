import axios from 'axios'
import { NextRequest } from 'next/server'
import { authHeader } from '~/lib/auth-service'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.API_URL + '/api/vouchers'

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const auth = await authHeader()
    const res = await axios.get(API_URL + `/common/${params.code}`, { headers: auth })
    return NextSuccess(res.data, res.status)
  } catch (error: any) {
    return NextError(error)
  }
}
