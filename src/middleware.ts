import { NextRequest, NextResponse } from 'next/server'
import { hasAuthSession } from './lib/auth-service'

//export const runtime = 'edge'

const authRoutes = ['/login', '/register', '/forget-password']
const protectedRoutes = ['/profile', '/cart']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  let session = await hasAuthSession()

  const isProtectedRoute = protectedRoutes.includes(pathname)
  const isAuthRoute = authRoutes.includes(pathname)

  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/login', req.nextUrl)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  const res = NextResponse.next()

  // if (res.status === 401) return NextResponse.redirect(new URL('/login', req.url))

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
