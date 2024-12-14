import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './lib/auth'

export async function middleware(request: NextRequest) {
  // const session = await getSession()

  // if (request.nextUrl.pathname.startsWith('/login') && session) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }

  // if (request.url.includes('/api') && !session) {
  //   return new NextResponse(
  //     JSON.stringify({ success: false, message: 'authentication failed' }),
  //     { status: 401, headers: { 'content-type': 'application/json' } }
  //   )
  // }

  // if (!session && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/signup')) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  // if (request.nextUrl.pathname === '/' && session) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

