import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

const API_URL = 'https://www.google.com/recaptcha/api/siteverify'

const reCaptchaKey = process.env.RECAPTCHA_KEY

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const token = body.token
    const url = new URL(API_URL)
    if (!reCaptchaKey || !token)
      return NextResponse.json({ message: 'Có lỗi xảy ra. Không tìm thấy Token' }, { status: 400 })
    url.searchParams.append('secret', reCaptchaKey)
    url.searchParams.append('response', token)

    const res = await axios.post(url.href)

    const verification = res.data
    if (verification?.success && verification.score > 0.5)
      return NextResponse.json(null, { status: 200 })
    return NextResponse.json({ message: 'Phát hiện có thể là Robot' }, { status: 401 })
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
