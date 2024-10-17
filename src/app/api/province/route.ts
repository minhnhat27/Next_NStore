import axios from 'axios'
import { NextError, NextSuccess } from '~/lib/next-response'

export const dynamic = 'force-static'

const Token = process.env.GHN_TOKEN
const HOST = process.env.GHN_PROVINCE_HOST

export async function GET() {
  try {
    const res = await axios.get(HOST + '/province', { headers: { Token } })
    return NextSuccess(res.data?.data ?? [], res.status)
  } catch (error: any) {
    return NextError(error)
  }
}
