import { useCallback } from 'react'

export default function useShareLink() {
  const generateShareLink = useCallback((wishlist) => {
    const shareLink = 'rAnD0mP4Th'
    return shareLink
  }, [])
  return { generateShareLink }
}
