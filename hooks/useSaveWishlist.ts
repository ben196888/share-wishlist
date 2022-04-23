import { useToast } from '@chakra-ui/react'
import { ref, update } from 'firebase/database'
import { useCallback } from 'react'
import { database as db } from '../firebase/clientApp'
import type { ShareWishlist } from '../types'
import useWishlistId from './useWishlistId'

export default function useSaveWishlist() {
  const toast = useToast()
  const { updateWishlistId } = useWishlistId()

  const saveWishlist = useCallback(async (items: ShareWishlist.Item[]) => {
    try {
      const wishlistId = updateWishlistId()
      const wishlist: ShareWishlist.Wishlist = { id: wishlistId, items, roles: {} }
      const updates = {}
      updates[`/wishlists/${wishlistId}`] = wishlist
      await update(ref(db), updates)
      toast({
        title: 'Wishlist saved.',
        status: 'success',
        isClosable: true,
      })
      return wishlist
    } catch (err) {
      console.log('save wishlist failed', err)
      toast({
        title: 'Wishlist saved failure',
        status: 'error',
        description: err.toString(),
        isClosable: true,
      })
    }
  }, [toast, updateWishlistId])

  return saveWishlist
}
