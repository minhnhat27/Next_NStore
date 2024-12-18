import { NextResponse } from 'next/server'
import { showError } from '~/utils/common'

// export const NextSuccess = (data: any, statusCode: number = 200) => {
//   try {
//     return NextResponse.json(data, { status: statusCode })
//   } catch (error) {
//     return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
//   }
// }

export const NextSuccess = (data: any, statusCode: number = 200) => {
  try {
    const status = statusCode || 200
    if (status > 200 && status < 400) return NextResponse.json(data, { status: 200 })
    return NextResponse.json(data, { status })
  } catch (error) {
    return NextResponse.json(data, { status: 200 })
  }
}

export const NextError = (error: any) => {
  try {
    const status = error.response?.status || 500
    const message = showError(error)
    return NextResponse.json({ message: message }, { status })
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
