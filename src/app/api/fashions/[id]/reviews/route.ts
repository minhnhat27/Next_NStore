import axios from 'axios'
import { NextRequest } from 'next/server'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.API_URL + '/api/products'

export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const res = await axios.get(API_URL + `/${id}/reviews`, { params: searchParams })
    return NextSuccess(res.data, res.status)
  } catch (error: any) {
    return NextError(error)
  }
}