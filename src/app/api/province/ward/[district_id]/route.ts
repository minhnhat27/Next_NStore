import axios from 'axios'
import { NextRequest } from 'next/server'
import { NextError, NextSuccess } from '~/lib/next-response'

export const dynamic = 'force-static'

export async function GET(request: NextRequest, { params }: { params: { district_id: string } }) {
  try {
    const id = params.district_id
    const res = await axios.get(process.env.PROVINCE_HOST + `/province/ward/${id}`)
    return NextSuccess(res.data, res.status)
  } catch (error: any) {
    return NextError(error)
  }
}
