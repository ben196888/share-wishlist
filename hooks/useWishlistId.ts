import { child, push, ref } from 'firebase/database'
import { useCallback, useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { database as db } from '../firebase/clientApp'


export default function useWishlistId() {
  const initialWishlistId = ''
  const [wishlistId, setWishlistId] = useLocalStorage('wishlistId', initialWishlistId)

  const isValidWishlistId = useMemo(() => {
    return wishlistId !== initialWishlistId
  }, [wishlistId])

  const updateWishlistId = useCallback(() => {
    if (isValidWishlistId) {
      return wishlistId
    }
    const nextWishlistId = push(child(ref(db), 'wishlists')).key
    setWishlistId(nextWishlistId)
    return nextWishlistId
  }, [isValidWishlistId, wishlistId, setWishlistId])

  return { wishlistId, isValidWishlistId, updateWishlistId }
}
