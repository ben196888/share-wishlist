import { child, push, ref, runTransaction, update } from 'firebase/database'
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

  return { wishlist, isEditable, items, setItems, updateWishlistId }
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

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const randomPath = (length = 8) => {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }

  return result
}

const buildShareLink = (shortPath: ShareWishlist.ShortPath) => {
  const path = `/l/${shortPath}`
  return `${window.location.origin}${path}`
}

export function useWishlistControlPanel() {
  const { isEditable, items, updateWishlistId } = useWishlistContext()

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

  const generateShareLink = useCallback(async (wishlist: ShareWishlist.Wishlist) => {
    const shortPath = randomPath()
    const path = { id: shortPath, wishlistId: wishlist.id }

    const updates = {}
    updates[`/shortPaths/${shortPath}`] = path
    updates[`/wishlists/${wishlist.id}/shortPath`] = shortPath

    await update(ref(db), updates)

    return buildShareLink(shortPath)
  }, [])

  const getShareLink = useCallback(async (wishlist: ShareWishlist.Wishlist) => {
    if (wishlist.shortPath) {
      return buildShareLink(wishlist.shortPath)
    }

    return generateShareLink(wishlist)
  }, [generateShareLink])

  return { saveWishlist, items, generateShareLink, getShareLink }
}
