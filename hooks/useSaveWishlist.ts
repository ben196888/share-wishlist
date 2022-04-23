import { useToast } from '@chakra-ui/react'
import { ref, update } from 'firebase/database'
import { useCallback } from 'react'
import { database as db } from '../firebase/clientApp'
import type { ShareWishlist } from '../types'

export default function useSaveWishlist() {
  const toast = useToast()
  const saveWishlist = useCallback(async (wishlistId: string, items: ShareWishlist.Item[]) => {
    try {
      const updates = {}
      updates[`/wishlists/${wishlistId}`] = { items }
      await update(ref(db), updates)
      toast({
        title: 'Wishlist saved.',
        status: 'success',
        isClosable: true,
      })
    } catch (err) {
      console.log('save wishlist failed', err)
      toast({
        title: 'Wishlist saved failure',
        status: 'error',
        description: err.toString(),
        isClosable: true,
      })
    }
  }, [toast])

  return saveWishlist
}
