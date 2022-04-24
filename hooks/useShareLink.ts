import { ref, update } from 'firebase/database'
import { useCallback } from 'react'
import { database as db } from '../firebase/clientApp'
import type { ShareWishlist } from '../types'

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

export default function useShareLink() {
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

  return { generateShareLink, getShareLink }
}
