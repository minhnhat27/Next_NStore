import axios from 'axios'
import { NextRequest } from 'next/server'
import { authHeader } from '~/lib/auth-service'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.API_URL + '/api/vouchers'

export async function POST(req: NextRequest) {
  try {
    const reqData = await req.json()
    const auth = await authHeader()
    const res = await axios.post(API_URL + '/add-voucher', reqData, { headers: auth })
    return NextSuccess(res.data, res.status)
  } catch (error: any) {
    return NextError(error)
  }
}