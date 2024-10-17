import axios from 'axios'
import { NextRequest } from 'next/server'
import { NextError, NextSuccess } from '~/lib/next-response'

export const dynamic = 'force-static'

const Token = process.env.GHN_TOKEN
const HOST = process.env.GHN_PROVINCE_HOST

export async function GET(request: NextRequest, { params }: { params: { district_id: string } }) {
  try {
    // const id = params.district_id
    const res = await axios.get(HOST + `/ward`, { headers: { Token }, params: params })
    return NextSuccess(res.data?.data ?? [], res.status)
  } catch (error: any) {
    return NextError(error)
  }
}
