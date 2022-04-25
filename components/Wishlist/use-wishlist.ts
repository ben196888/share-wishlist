import { child, push, ref, runTransaction } from 'firebase/database'
import { useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { database as db } from '../../firebase/clientApp'
import type { ShareWishlist } from '../../types';
import { useWishlistContext, WishlistContextProps } from './WishlistContext';

// context provider value factorys
type UseItemsProps = {
  items?: ShareWishlist.Item[]
  isEditable?: boolean
}

export function useItems({ items = [], isEditable = false }: UseItemsProps = {}) {
  const useStateWithoutLocalStorage = useState<ShareWishlist.Item[]>(items)
  const useStateWithLocalStorage = useLocalStorage<ShareWishlist.Item[]>('items', items)
  if (isEditable) {
    return useStateWithLocalStorage
  }
  return useStateWithoutLocalStorage
}

export function useWishlistId() {
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

type UseWishlistProps = {
  wishlist?: ShareWishlist.Wishlist
  isEditable?: boolean
}

export function useWishlist({ wishlist, isEditable = false }: UseWishlistProps = {}): WishlistContextProps {
  const [items, setItems] = useItems({ items: wishlist?.items, isEditable })
  const { updateWishlistId } = useWishlistId()

  const saveWishlist = useCallback(async (items: ShareWishlist.Item[]) => {
    if (!isEditable) {
      throw Error('You cannot save this wishlist')
    }
    const wishlistId = updateWishlistId()
    const wishlistPath = `/wishlists/${wishlistId}`

    const result = await runTransaction(ref(db, wishlistPath), (wishlist: ShareWishlist.Wishlist | null) => {
      const nextWishlist: ShareWishlist.Wishlist = {
        ...wishlist,
        items,
        id: wishlistId,
        roles: {},
      }

      return nextWishlist
    })

    return result.snapshot.val() as ShareWishlist.Wishlist
  }, [isEditable, updateWishlistId])

  return { wishlist, isEditable, saveWishlist, items, setItems }
}


// component level context hooks
export function useWishlistItems() {
  const { isEditable, items, setItems } = useWishlistContext()

  const removeItemAt = useCallback((index: number) => {
    setItems(prevItems => {
      const nextItems = prevItems.slice()
      nextItems.splice(index, 1)
      return nextItems
    })
  }, [setItems])

  const updateItemAt = useCallback((index: number, updates: Partial<ShareWishlist.Item>) => {
    setItems(prevItems => {
      const nextItems = prevItems.slice()
      if (updates.name) {
        nextItems[index].name = updates.name
      }
      return nextItems
    })
  }, [setItems])

  return { isEditable, items, setItems, removeItemAt, updateItemAt }
}

export function useWishlistControlPanel() {
  const { saveWishlist, items } = useWishlistContext()
  return { saveWishlist, items }
}
