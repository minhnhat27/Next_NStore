import axios from 'axios'
import { NextRequest } from 'next/server'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.API_URL + '/api/payments'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const res = await axios.get(API_URL + '/vnpay-callback', { params: searchParams })
    return NextSuccess(res.data, res.status)
  } catch (error) {
    return NextError(error)
  }
}
