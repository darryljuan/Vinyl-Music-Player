import type { NextApiRequest, NextApiResponse } from 'next'
import { checkPassword, makeSessionToken, SESSION_COOKIE } from '../../../lib/auth/session'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed')
    return
  }

  const { password } = req.body || {}
  if (typeof password !== 'string' || !checkPassword(password)) {
    res.status(401).json({ error: 'Incorrect password.' })
    return
  }

  const token = makeSessionToken()
  const maxAge = 60 * 60 * 24 * 30 // 30 days
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax; ${
      process.env.NODE_ENV === 'production' ? 'Secure;' : ''
    }`
  )
  res.status(200).json({ ok: true })
}
