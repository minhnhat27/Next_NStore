import axios from 'axios'
import { NextError, NextSuccess } from '~/lib/next-response'

const API_URL = process.env.API_URL + '/api/payments'

export async function GET() {
  try {
    const res = await axios.get(API_URL)
    return NextSuccess(res.data, res.status)
  } catch (error) {
    return NextError(error)
  }
}
