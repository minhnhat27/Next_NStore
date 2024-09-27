import { NextResponse } from 'next/server'
import { showError } from '~/utils/common'

export const NextSuccess = (data: any, statusCode: number) => {
  try {
    const status = statusCode || 200
    return NextResponse.json(data, { status })
  } catch (error) {
    return NextResponse.json(data, { status: 200 })
  }
}

export const NextError = (error: any) => {
  const status = error.response?.status || 500
  const message = showError(error)

  try {
    return NextResponse.json({ message: message }, { status })
  } catch (error) {
    return NextResponse.json({ message: message }, { status: 500 })
  }
}
