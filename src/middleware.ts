import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '~/lib/auth-session'

export async function middleware(request: NextRequest) {
  const session = await getSession()
  const pathname = request.nextUrl.pathname

  if (
    session &&
    (pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/forget-password'))
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
