import { NextResponse } from 'next/server'
import { showError } from '~/utils/common'

export const NextSuccess = (data: any, statusCode: number) => {
  const status = statusCode || 200
  return NextResponse.json(data, { status: statusCode })
}

export const NextError = (error: any) => {
  const status = error.response?.status || 500
  const message = showError(error)
  return NextResponse.json({ message: message }, { status })
}
