import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, FormEvent } from 'react'
import axios from 'axios'

export default function Login() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post('/api/auth/login', { password })
      const next = typeof router.query.next === 'string' ? router.query.next : '/'
      router.push(next)
    } catch {
      setError('Incorrect password.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-950 px-4">
      <Head>
        <title>My Vinyl</title>
      </Head>
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-stone-800 bg-stone-900/60 p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-gradient-to-br from-stone-800 to-stone-950 shadow-inner ring-2 ring-amber-700/40" />
          <h1 className="text-lg font-semibold text-stone-100">My Vinyl</h1>
          <p className="mt-1 text-xs text-stone-500">Private collection — enter your password</p>
        </div>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-lg border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:border-amber-600 focus:outline-none"
        />
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-amber-600 py-3 text-sm font-medium text-stone-950 transition hover:bg-amber-500 disabled:opacity-60"
        >
          {loading ? 'Checking…' : 'Enter'}
        </button>
      </form>
    </div>
  )
}
