import { ref } from 'firebase/database';
import { useRouter } from 'next/router';
import { ReactElement, useMemo } from 'react';
import { useObjectVal } from 'react-firebase-hooks/database'
import { useReadLocalStorage } from 'usehooks-ts';
import AlertMessage from '../../components/AlertMessage';
import Layout from '../../components/Layout';
import Wishlist from '../../components/Wishlist';
import { database as db } from '../../firebase/clientApp';
import type { ShareWishlist } from '../../types';

const useShortPath = (shortPath: string) => {
  const shortPathPath = `/shortPaths/${shortPath}`
  const [shortPathVal, shortPathValLoading, shortPathValError] = useObjectVal<ShareWishlist.Path>(ref(db, shortPathPath), { keyField: 'id' })

  const wishlistId = (shortPathVal?.wishlistId) ?? ''
  const wishlistPath = `/wishlists/${wishlistId}`
  const [wishlist, wishlistLoading, wishlistError] = useObjectVal<ShareWishlist.Wishlist>(ref(db, wishlistPath), { keyField: 'id' })

  const wishlistIdLocal = useReadLocalStorage<ShareWishlist.WishlistId>('wishlistId')
  const isEditable = wishlistIdLocal === wishlistId && wishlistIdLocal !== ''

  const error: Error = useMemo(() => {
    if (shortPathValError) {
      return shortPathValError
    }
    if (shortPathVal === null) {
      return new Error('Invalid/Expired wishlist url.')
    }
    if (wishlistError) {
      return wishlistError
    }
    if (wishlist === null) {
      return new Error('Invalid wishlist.')
    }
  }, [shortPathValError, shortPathVal, wishlistError, wishlist])

  const loading: boolean = shortPathValLoading || wishlistLoading

  return { error, loading, wishlist, isEditable }
}

export default function ShortPath() {
  const router = useRouter()
  const { shortPath } = router.query
  const { error, loading, isEditable, wishlist } = useShortPath(shortPath as string)

  return (
    <>
      {error && <AlertMessage message={error.message} />}
      {loading && 'Loading...'}
      {wishlist && <Wishlist wishlist={wishlist} isEditable={isEditable} />}
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
