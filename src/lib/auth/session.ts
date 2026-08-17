import crypto from 'crypto'

export const SESSION_COOKIE = 'myvinyl_session'

function secret(): string {
  // Falls back to a fixed string only so the app doesn't crash if unset —
  // you should always set SITE_PASSWORD in production.
  return process.env.SITE_PASSWORD || 'change-me'
}

/** Deterministic signed token — no server-side session storage needed. */
export function makeSessionToken(): string {
  const payload = 'authorised'
  const sig = crypto.createHmac('sha256', secret()).update(payload).digest('hex')
  return `${payload}.${sig}`
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false
  return token === makeSessionToken()
}

export function checkPassword(candidate: string): boolean {
  const expected = process.env.SITE_PASSWORD || ''
  if (!expected) return false
  const a = Buffer.from(candidate)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}
