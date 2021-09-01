import { AppProps } from 'next/dist/next-server/lib/router/router'
import 'normalize.css'
import 'react-notion-x/src/styles.css'
import 'rc-dropdown/assets/index.css'
import React from 'react'
import '../styles/global.scss'

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default App
