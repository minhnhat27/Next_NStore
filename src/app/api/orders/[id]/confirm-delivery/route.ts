import axios from 'axios'
import { NextRequest } from 'next/server'
import { authHeader } from '~/lib/auth-service'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.API_URL + '/api/orders'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth: AuthHeaderType = await authHeader()
    const res = await axios.put(API_URL + `/confirm-delivery/${params.id}`, null, { headers: auth })
    return NextSuccess(res.data, res.status)
  } catch (error: any) {
    return NextError(error)
  }
}
