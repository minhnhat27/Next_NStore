import axios from 'axios'
import { NextRequest } from 'next/server'
import { authHeader } from '~/lib/auth-service'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.GHN_ORDER_HOST
const Token = process.env.GHN_TOKEN

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order_code = params.id
    const res = await axios.get(API_URL + '/detail', { headers: { Token }, params: { order_code } })
    return NextSuccess(res.data, res.status)
  } catch (error: any) {
    return NextError(error)
  }
}
