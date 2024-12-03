import { NextRequest, NextResponse } from 'next/server'
import { NextError } from '~/lib/next-response'

const API_URL = process.env.API_URL

export const revalidate = false

export async function GET(req: NextRequest) {
  try {
    const imageUrl = req.nextUrl.searchParams.get('imageUrl')
    if (imageUrl) {
      const response = await fetch(imageUrl)
      const imageBuffer = await response.arrayBuffer()

      return new NextResponse(Buffer.from(imageBuffer), {
        headers: {
          'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        },
      })
    } else throw new Error('Image not found')
  } catch (error: any) {
    return NextError(error)
  }
}
