import axios from 'axios'
import { authHeader } from '~/lib/auth-service'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.API_URL + '/api/auth'

export async function GET() {
  try {
    const auth = await authHeader()
    const res = await axios.get(API_URL + '/unlink/facebook', { headers: auth })
    return NextSuccess(res.data, res.status)
  } catch (error: any) {
    return NextError(error)
  }
}
