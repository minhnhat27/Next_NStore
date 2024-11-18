import axios from 'axios'
import { NextRequest } from 'next/server'
import { NextError, NextSuccess } from '~/lib/next-response'

export const dynamic = 'force-static'
export const fetchCache = 'force-cache'
export const revalidate = false

const Token = process.env.GHN_TOKEN
const HOST = process.env.GHN_PROVINCE_HOST

export async function GET(request: NextRequest, { params }: { params: { province_id: string } }) {
  try {
    // const id = params.province_id
    const res = await axios.get(HOST + `/district`, { headers: { Token }, params: params })
    return NextSuccess(res.data?.data ?? [], res.status)
  } catch (error: any) {
    return NextError(error)
  }
}
