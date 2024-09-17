import axios from 'axios'
import { NextError, NextSuccess } from '~/lib/next-response'

export const dynamic = 'force-static'

export async function GET() {
  try {
    const res = await axios.get(process.env.PROVINCE_HOST + '/province')
    return NextSuccess(res.data, res.status)
  } catch (error: any) {
    return NextError(error)
  }
}
