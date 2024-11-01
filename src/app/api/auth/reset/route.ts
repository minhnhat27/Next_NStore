import axios from 'axios'
import { NextRequest } from 'next/server'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.API_URL + '/api/auth'

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()
    const res = await axios.put(API_URL + '/reset', data)
    return NextSuccess(res.data, res.status)
  } catch (error: any) {
    return NextError(error)
  }
}
