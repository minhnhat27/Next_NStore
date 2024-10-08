import axios from 'axios'
import { NextRequest } from 'next/server'
import { authHeader } from '~/lib/auth-service'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.API_URL + '/api/orders'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json()
    const auth: AuthHeaderType = await authHeader()

    const res = await axios.post(API_URL + `/review/${params.id}`, data, { headers: auth })
    return NextSuccess(res.data, res.status)
  } catch (error: any) {
    return NextError(error)
  }
}
