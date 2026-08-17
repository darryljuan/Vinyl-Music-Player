import type { AppProps } from 'next/app'
import Head from 'next/head'
import { PlayerProvider } from '../hooks/PlayerContext'
import Layout from '../components/Layout'
import '../styles/globals.css'

const NO_LAYOUT_ROUTES = ['/login']

export default function MyApp({ Component, pageProps, router }: AppProps) {
  const bare = NO_LAYOUT_ROUTES.includes(router.pathname)

  return (
    <PlayerProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#100b09" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      {bare ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </PlayerProvider>
  )
}
