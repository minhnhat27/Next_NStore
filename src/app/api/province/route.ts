import axios from 'axios'
import { NextError, NextSuccess } from '~/lib/next-response'

const HOST = 'https://vapi.vnappmob.com'

export async function GET() {
  try {
    const res = await axios.get(HOST + '/api/province')
    return NextSuccess(res.data, res.status)
  } catch (error: any) {
    return NextError(error)
  }
}
