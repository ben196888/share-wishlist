import { ReactElement } from 'react'
import Layout from '../components/Layout'
import Wishlist from '../components/Wishlist'

export default function Home() {
  return (
    <Wishlist isEditable />
  )
}

Home.getLayout = function (page: ReactElement) {
  return (
    <Layout>
      <Layout.Header />
      <Layout.Main>
        {page}
      </Layout.Main>
      <Layout.Footer />
    </Layout>
  )
}
