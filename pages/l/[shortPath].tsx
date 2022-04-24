import { ref } from 'firebase/database';
import { useRouter } from 'next/router';
import { useObjectVal } from 'react-firebase-hooks/database'
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
      {shortPathVal && JSON.stringify(shortPathVal)}
    </>
  )
}
