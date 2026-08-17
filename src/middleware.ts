import { NextRequest, NextResponse } from 'next/server'

// Edge-safe re-implementation of isValidSessionToken (no Node `crypto` module at the edge).
async function isValid(token: string | undefined): Promise<boolean> {
  if (!token) return false
  const secret = process.env.SITE_PASSWORD || 'change-me'
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ])
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode('authorised'))
  const sigHex = Array.from(new Uint8Array(sigBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  return token === `authorised.${sigHex}`
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isPublic =
    pathname === '/login' ||
    pathname === '/api/auth/login' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/icons') ||
    pathname === '/manifest.json' ||
    pathname === '/favicon.ico'

  if (isPublic) return NextResponse.next()

  // If SITE_PASSWORD isn't configured, don't lock the owner out during setup.
  if (!process.env.SITE_PASSWORD) return NextResponse.next()

  const token = req.cookies.get('myvinyl_session')?.value
  if (await isValid(token)) return NextResponse.next()

  if (pathname.startsWith('/api')) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }
  const loginUrl = new URL('/login', req.url)
  loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
