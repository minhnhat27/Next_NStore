import axios from 'axios'
import { NextRequest } from 'next/server'
import { authHeader } from '~/lib/auth-service'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.API_URL + '/api/account'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth: AuthHeaderType = await authHeader()
    const res = await axios.delete(API_URL + `/favorite/${params.id}`, { headers: auth })

    return NextSuccess(res.data, res.status)
  } catch (error) {
    return NextError(error)
  }
}
