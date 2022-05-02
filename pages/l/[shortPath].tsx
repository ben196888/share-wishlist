import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';
import AlertMessage from '../../components/AlertMessage';
import Layout from '../../components/Layout';
import Wishlist from '../../components/Wishlist';
import useFunction from '../../hooks/useFunction';
import type { ShareWishlist } from '../../types';

type RequestData = ShareWishlist.Functions.GetWishlistByShortPath.RequestData
type ResponseData = ShareWishlist.Functions.GetWishlistByShortPath.ResponseData

export default function ShortPath() {
  const router = useRouter()
  const { shortPath } = router.query
  const { func, data, loading, error } = useFunction<RequestData, ResponseData>('getWishlistByShortPath')
  const wishlistIdLocal = useReadLocalStorage<ShareWishlist.WishlistId>('wishlistId')
  const isEditable = wishlistIdLocal === data?.wishlist?.id

  useEffect(() => {
    if (shortPath) {
      const payload: RequestData = { shortPath } as RequestData
      func(payload)
    }
  }, [shortPath, func])

  return (
    <>
      {error && <AlertMessage message={error.message} />}
      {loading && 'Loading...'}
      {data && <Wishlist wishlist={data?.wishlist} isEditable={isEditable} />}
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
