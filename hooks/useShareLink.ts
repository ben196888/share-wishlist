import { ref, update } from 'firebase/database'
import { useCallback } from 'react'
import { database as db } from '../firebase/clientApp'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const randomPath = (length = 8) => {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }

  return result
}

const buildShareLink = (shortPath: string) => {
  const path = `/l/${shortPath}`
  return `${window.location.origin}${path}`
}

export default function useShareLink() {
  const generateShareLink = useCallback(async (wishlist) => {
    const shortPath = randomPath()
    const path = { id: shortPath, wishlistId: wishlist.id }

    const updates = {}
    updates[`/shortPathMap/${shortPath}`] = path

    await update(ref(db), updates)

    return buildShareLink(shortPath)
  }, [])
  return { generateShareLink }
}
