import { NextRequest, NextResponse } from 'next/server'
import { NextError } from '~/lib/next-response'

const API_URL = process.env.API_URL

export const revalidate = 7200

export async function GET(req: NextRequest) {
  try {
    const imageUrl = req.nextUrl.searchParams.get('imageUrl')

    const response = await fetch(`${API_URL}/${imageUrl}`)
    const imageBuffer = await response.arrayBuffer()

    return new NextResponse(Buffer.from(imageBuffer), {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
      },
    })
  } catch (error: any) {
    return NextError(error)
  }
}
