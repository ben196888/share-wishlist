import { ref, runTransaction } from 'firebase/database'
import { useCallback } from 'react'
import { database as db } from '../firebase/clientApp'
import type { ShareWishlist } from '../types'
import useWishlistId from './useWishlistId'

export default function useSaveWishlist() {
  const { updateWishlistId } = useWishlistId()

  const saveWishlist = useCallback(async (items: ShareWishlist.Item[]) => {
    const wishlistId = updateWishlistId()
    const wishlistPath = `/wishlists/${wishlistId}`
    const result = await runTransaction(ref(db, wishlistPath), (wishlist: ShareWishlist.Wishlist) => {
      if (!wishlist.id) {
        wishlist.id = wishlistId
      }
      wishlist.roles = {}
      wishlist.items = items
      return wishlist
    })

    return result.snapshot.val() as ShareWishlist.Wishlist
  }, [updateWishlistId])

  return saveWishlist
}
