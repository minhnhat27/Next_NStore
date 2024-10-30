import axios from 'axios'
import { NextRequest } from 'next/server'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.API_URL + '/api/products'

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData()
    const res = await axios.post(API_URL + '/search/image', data)

    return NextSuccess(res.data, res.status)
  } catch (error: any) {
    return NextError(error)
  }
}
