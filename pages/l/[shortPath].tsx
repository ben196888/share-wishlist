import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import AlertMessage from '../../components/AlertMessage';
import Layout from '../../components/Layout';
import Wishlist from '../../components/Wishlist';
import useLoadingFunction from '../../hooks/useLoadingFunction';
import useUid from '../../hooks/useUid';
import type { ShareWishlist } from '../../types';

type RequestData = ShareWishlist.Functions.GetWishlistByShortPath.RequestData
type ResponseData = ShareWishlist.Functions.GetWishlistByShortPath.ResponseData

export default function ShortPath() {
  const router = useRouter()
  const { shortPath } = router.query
  const { func, data, loading, error } = useLoadingFunction<RequestData, ResponseData>('getWishlistByShortPath')
  const uid = useUid()
  const isEditable = data?.wishlist?.roles[uid] === 'owner'

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
