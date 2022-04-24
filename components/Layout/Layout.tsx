import Head from 'next/head'
import { ReactNode } from 'react'
import LayoutFooter from './LayoutFooter'
import LayoutHeader from './LayoutHeader'
import LayoutMain from './LayoutMain'

export type LayoutProps = {
  children?: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Share My Wishlist</title>
        <meta name="description" content="Share my wishlist" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </>
  )
}

Layout.displayName = 'Layout'
Layout.Header = LayoutHeader
Layout.Main = LayoutMain
Layout.Footer = LayoutFooter

export default Layout
