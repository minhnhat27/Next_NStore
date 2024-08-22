import { NextRequest, NextResponse } from 'next/server'
import { hasAuthSession } from './lib/auth-service'

//export const runtime = 'edge'

const authRoutes = ['/login', '/register', '/forget-password']
const protectedRoutes = ['/profile', '/cart']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  let session = await hasAuthSession()

  const isProtectedRoute = protectedRoutes.includes(pathname)
  const isAuthRoute = authRoutes.includes(pathname)

  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/login', request.nextUrl)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
