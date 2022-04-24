import { ref } from 'firebase/database';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { useObjectVal } from 'react-firebase-hooks/database'
import Layout from '../../components/Layout';
import WishlistComponent from '../../components/WishlistComponent';
import { database as db } from '../../firebase/clientApp';
import type { ShareWishlist } from '../../types';

export default function ShortPath() {
  const router = useRouter()
  const { shortPath } = router.query
  const shortPathPath = `/shortPaths/${shortPath}`
  const [shortPathVal, loading, error] = useObjectVal<ShareWishlist.Path>(ref(db, shortPathPath))
  return (
    <>
      {error && `Error: ${error}`}
      {loading && 'Loading...'}
      {shortPathVal && <WishlistComponent wishlistId={shortPathVal.wishlistId} />}
    </>
  )
}

ShortPath.getLayout = function (page: ReactElement) {
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
