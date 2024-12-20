import { NextRequest, NextResponse } from 'next/server'
import { hasAuthSession } from './lib/auth-service'

const authRoutes = ['/login', '/register', '/forget-password']
const protectedRoutes = ['/account', '/cart']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  let session = await hasAuthSession()

  const isProtectedRoute = protectedRoutes.some((url) => pathname.startsWith(url))
  const isAuthRoute = authRoutes.some((url) => pathname.startsWith(url))

  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/login', req.nextUrl)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && session) return NextResponse.redirect(new URL('/', req.nextUrl))

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
